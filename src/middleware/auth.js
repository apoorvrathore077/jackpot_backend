import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
export const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type === "Bearer" && token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded; // This will now include { id: user._id, username: user.username }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }
};
export default auth;
