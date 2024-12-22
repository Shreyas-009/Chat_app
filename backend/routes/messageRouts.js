const express = require("express");
let router = express.Router();

const {
    sendMessage,
    allMessages,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authmiddleware");

router.post("/",protect, sendMessage);
router.get("/:chatId", protect, allMessages);

module.exports = router;
