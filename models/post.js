import mongoose, { mongo } from 'mongoose'

const post = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const Post = mongoose.model('post', post);

export default Post;