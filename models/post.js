import mongoose, { mongo } from "mongoose";

const post = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    index: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
    default: false,
  },
});

const Post = mongoose.model("post", post);

export default Post;
