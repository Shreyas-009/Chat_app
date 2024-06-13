const { model } = require("mongoose");

const mongoose = crequire("mongoose");

const userSchema = mongoose.Schema(
  {
    namr: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    tymestamps : true,
  }
);

const User = mongoose.model("User",userSchema);
model.exports = User;
