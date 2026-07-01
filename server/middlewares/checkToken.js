import jwt from "jsonwebtoken";

export const checkToken = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(400).json({
        message: "No access",
      });
    }
  } else {
    return res.status(400).json({
      message: "No access",
    });
  }
};
