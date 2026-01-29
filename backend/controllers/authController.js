const { db } = require("../config/firebase");

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .where("password", "==", password)
      .where("role", "==", role)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
