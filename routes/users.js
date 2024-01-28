const mongoose = require('mongoose')
const plm = require("passport-local-mongoose")


mongoose.connect("mongodb://127.0.0.1:27017/Pinterest_Clone")

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  contact: {
    type: Number,
    required: true,
  },
  boards: {
    type: Array,
    default: [],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }
  ]
})

userSchema.plugin(plm)

module.exports = mongoose.model("User", userSchema)