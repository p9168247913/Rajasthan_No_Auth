const UserModel = require("../modules/user/user.model");
const bcrypt = require("bcrypt");

const authMiddleware = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid username or password" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    console.error("Authentication error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
