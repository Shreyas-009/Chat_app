const express = require("express");
const { protect } = require("../middleware/authmiddleware");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  changeGroupAdmin,
  deleteGroup,
} = require("../controllers/chatControllers");
const router = express.Router();
 
router.post('/',protect,accessChat)
router.get('/',protect,fetchChat)
router.post('/group',protect,createGroupChat)
router.put('/rename',protect,renameGroup)
router.put('/groupadd',protect,addToGroup)
router.put('/groupremove',protect,removeFromGroup)
router.put("/changeadmin", protect, changeGroupAdmin);
router.delete("/group/:chatId", protect, deleteGroup);

module.exports = router;