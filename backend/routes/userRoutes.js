const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/student', userController.addStudent);
router.delete('/student/:id', userController.removeStudent);
router.post('/faculty', userController.addFaculty);
router.delete('/faculty/:id', userController.removeFaculty);

module.exports = router;
