import { Schema, model } from "mongoose";

const blogSchema = new Schema({
    user_id:String,

    title: String,

    date: {
        type: Date,
        default: Date.now()
    },

    content: String,

    status: {
        type: String,
    },

    avatar: {
        type: String,
        default: null,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

export const Blog = model("Blog", blogSchema);