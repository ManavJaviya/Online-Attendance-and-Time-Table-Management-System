const express = require("express");
const router = express.Router();

const {
  getStudentsByClass,
  markAttendance,
} = require("../controllers/attendanceController");

router.get("/students/:className", getStudentsByClass);
router.post("/mark-attendance", markAttendance);

module.exports = router;
