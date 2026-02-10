const { db } = require("../config/firebase");

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const snapshot = await db
      .collection("users")
      .where("email", "==", email.trim())
      .where("password", "==", password.trim())
      .where("role", "==", role.trim().toLowerCase())
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //
    res.status(200).json({
      message: "Login successful",
      role: role.trim().toLowerCase(),
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
