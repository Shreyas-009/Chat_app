const express = require("express");
let router = express.Router();

const {
  sendMessage,
  allMessages,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authmiddleware");

router.post("/",protect, sendMessage);
router.get("/:chatId", protect, allMessages);
router.delete("/:messageId", protect, deleteMessage);

module.exports = router;
