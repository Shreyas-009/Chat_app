const express = require('express');
const router = express.Router();
const { registerUser , authUser } = require('../controllers/authControllers');

// router.post("/register", registerUser);
router.post('/register',registerUser);
router.post('/login',authUser);
// router.get('/login',authUser);


module.exports = router;