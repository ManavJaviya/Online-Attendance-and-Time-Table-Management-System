const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

router.get('/:classId', timetableController.getTimetable);
router.put('/:classId', timetableController.updateTimetable);

module.exports = router;
