const express = require('express');
require("dotenv").config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;
const mongoose = require("./config/mongoos");
const { chats } = require('./data/data');

//cores used for giving access to frontend of ower databases
app.use(cors());

//the dqta came from fronted will be converted to json format
app.use(express.json());

app.get("/",(req,res) => {
    console.log(chats);
    res.send("Home Page");
})

app.get("/api/chat",(req,res) => {
    res.send(chats);
})

app.get("/api/chat/:id",(req,res) => {
    const chat = chats.find((data) => data._id === req.params.id);
    res.send(chat);
})

app.listen(port,console.log(`Server is running on port ${port}`));