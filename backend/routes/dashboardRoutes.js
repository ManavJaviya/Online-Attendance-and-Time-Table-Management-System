const express = require("express");
const router = express.Router();
const { getDashboardStats, getRecentActivities, logFrontendActivity, getLowAttendanceStudents } = require("../controllers/dashboardController");

router.get("/stats", getDashboardStats);
router.get("/activities", getRecentActivities);
router.post("/log-activity", logFrontendActivity);
router.get("/students-attendance", getLowAttendanceStudents);


module.exports = router;
