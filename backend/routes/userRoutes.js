const express = require('express');
let router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require('../middleware/authmiddleware');

// router.post("/register", registerUser);
router.post('/',registerUser);
router.post('/login',authUser);
// get all users
router.get('/',protect,allUsers);
 

module.exports = router;