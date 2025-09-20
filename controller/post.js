import Post from "../models/post.js";

const addPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (title && description) {
      const postData = new Post({ title, description });
      const savedPost = await postData.save();
      if (savedPost) {
        res
          .status(200)
          .send({ status: true, message: "Post Added Successfully" });
      } else {
        res
          .status(500)
          .send({ status: false, message: "Something Went Wrong" });
      }
    } else {
      res
        .status(400)
        .send({ status: false, message: "All fields are required" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const removePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const removedPost = await Post.findByIdAndDelete(postId);
    if (removedPost) {
      res.send({
        status: true,
        message: "Post removed successfully",
        removedPost,
      });
    } else {
      res.send({ status: false, message: "Post not found" });
    }
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description } = req.body;

    // Basic validation
    if (!title && !description) {
      return res
        .status(400)
        .json({
          status: false,
          message:
            "At least one field (title or description) is required to update.",
        });
    }

    // Build update object dynamically
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    // Find and update post
    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
    });

    if (!updatedPost) {
      return res
        .status(404)
        .json({ status: false, message: "Post not found." });
    }

    res.status(200).json({
      status: true,
      message: "Post updated successfully.",
      updatedPost,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: false,
        message: "Failed to update post.",
        error: error.message,
      });
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({});
    res
      .status(200)
      .send({ status: true, message: "Post Fetched Successfully", posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export { addPost, removePost, editPost, getAllPost };
