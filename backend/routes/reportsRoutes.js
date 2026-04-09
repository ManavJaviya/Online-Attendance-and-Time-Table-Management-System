const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/attendance', reportsController.getAttendanceReports);
router.get('/timetable', reportsController.getTimetableReports);
router.get('/analytics', reportsController.getAnalyticsReports);
router.get('/faculty/:facultyId', reportsController.getFacultyReports);

module.exports = router;
