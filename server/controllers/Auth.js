import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getDuplicateField = (error) => {
  return Object.keys(error.keyPattern ?? error.keyValue ?? {})[0];
};

const getMissingCredentialsMessage = (username, password) => {
  if (!username && !password) {
    return "Enter your name and password to continue";
  }

  if (!username) {
    return "Enter your name to continue";
  }

  return "Enter your password to continue";
};

const toPublicUser = (user) => {
  const publicUser = user.toObject();
  delete publicUser.password;

  return publicUser;
};

const ensureJwtSecret = (res) => {
  if (process.env.JWT_SECRET) {
    return true;
  }

  res.status(500).json({
    message: "Authentication is temporarily unavailable. Please try again later",
  });

  return false;
};

export const register = async (req, res) => {
  try {
    console.log("Register request received:", req.body);
    const { username: rawUsername, password: rawPassword } = req.body ?? {};
    const username = String(rawUsername ?? "").trim().toLowerCase();
    const password = String(rawPassword ?? "");

    if (!username || !password) {
      return res.status(400).json({
        message: getMissingCredentialsMessage(username, password),
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (!ensureJwtSecret(res)) {
      return;
    }

    const isUsed = await User.findOne({ username });
    if (isUsed) {
      return res.status(409).json({
        message: "This name is already in use. Try another one",
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
      user: toPublicUser(newUser),
      token,
      message: "Registration was successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      const duplicateField = getDuplicateField(error);

      if (duplicateField === "username") {
        return res.status(409).json({
          message: "This name is already in use. Try another one",
        });
      }

      return res.status(409).json({
        message: duplicateField
          ? `This ${duplicateField} is already in use. Try another one`
          : "This value is already in use. Try another one",
      });
    }

    return res.status(500).json({
      message: "We couldn't create your account right now. Please try again later",
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
        message: getMissingCredentialsMessage(username, password),
      });
    }

    if (!ensureJwtSecret(res)) {
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "We couldn't find an account with this name",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password. Please try again",
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
      .json({
        user: toPublicUser(user),
        token,
        message: "You have successfully logged in",
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "We couldn't sign you in right now. Please try again later",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!ensureJwtSecret(res)) {
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Your account was not found. Please sign in again",
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
      user: toPublicUser(user),
      token,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(401).json({
      message: "Your session could not be verified. Please sign in again",
    });
  }
};
