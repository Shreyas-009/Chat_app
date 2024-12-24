const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  console.log(content, chatId);

  if (!content || !chatId) {
    console.log("Invalid content");
    res.status(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name picture email")
      .populate("chat");
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//delete messages
const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId).populate(
      "chat"
    ); // Add this to get chat info for socket

    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Check if the user trying to delete is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only delete your own messages");
    }

    const chatId = message.chat._id; // Store chatId before deletion
    await Message.findByIdAndDelete(req.params.messageId);

    // Send both messageId and chatId in response
    res.json({
      message: "Message deleted successfully",
      messageId: req.params.messageId,
      chatId: chatId,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages, deleteMessage };
