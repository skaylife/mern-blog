import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    imageUrl: String,

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { 
    timestamps: true,
});

export default mongoose.model('Post', PostSchema);