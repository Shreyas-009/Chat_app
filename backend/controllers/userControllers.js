const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//Registering a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;
  console.log("picture", picture);

  console.log(name, email, password, picture);
  
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please Enter details");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    picture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } 
  else {
    res.status(400);
    throw new Error("Failed to Creating the User");
  }
});



//login the user
const authUser = asyncHandler(async (req, res) => {
  const { email, password} = req.body;

  const user = await User.findOne({ email});

if (user && (await user.matchPassword(password))) {
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    token: generateToken(user._id),
  });
} else {
  res.status(401).json({ error: "Invalid email or password" });
}
});

const allUsers = asyncHandler(async (req,res)=>{
  const keyword = req.query.search ? {
    $or:[
      {name: {$regex: req.query.search, $options: 'i'}},
      {email: {$regex: req.query.search, $options: 'i'}},
    ]
  } : {};
  const users = await User.find(keyword).select('-password').find({_id:{$ne : req.user._id}});
  res.json(users);
})


module.exports = { registerUser, authUser ,allUsers};
 