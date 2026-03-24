const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
