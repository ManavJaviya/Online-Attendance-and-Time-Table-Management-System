const express = require("express");
const router = express.Router();
const { getDashboardStats, getRecentActivities, logFrontendActivity } = require("../controllers/dashboardController");

router.get("/stats", getDashboardStats);
router.get("/activities", getRecentActivities);
router.post("/log-activity", logFrontendActivity);


module.exports = router;
