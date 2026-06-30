import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getDuplicateField = (error) => {
  return Object.keys(error.keyPattern ?? error.keyValue ?? {})[0];
};

export const register = async (req, res) => {
  try {
    console.log("Register request received:", req.body);
    const { username: rawUsername, password: rawPassword } = req.body ?? {};
    const username = String(rawUsername ?? "").trim().toLowerCase();
    const password = String(rawPassword ?? "");

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const isUsed = await User.findOne({ username });
    if (isUsed) {
      return res.status(409).json({
        message: "This username is already taken",
      });
    }

    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hash,
    });
    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    return res.status(201).json({
      user: newUser,
      token,
      message: "Registration was successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      const duplicateField = getDuplicateField(error);

      if (duplicateField === "username") {
        return res.status(409).json({
          message: "This username is already taken",
        });
      }

      return res.status(409).json({
        message: duplicateField
          ? `This ${duplicateField} is already taken`
          : "Duplicate value already exists",
      });
    }

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username: rawUsername, password: rawPassword } = req.body ?? {};
    const username = String(rawUsername ?? "").trim().toLowerCase();
    const password = String(rawPassword ?? "");

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "That user does not exist",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "The password or login is incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );
    return res
      .status(201)
      .json({ user, token, message: "You have successfully logged in" });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({
        message: "That user does not exist",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );
    return res.json({
      user,
      token,
    });
  } catch (error) {
    return res.json({
      message: "No access",
    });
  }
};
