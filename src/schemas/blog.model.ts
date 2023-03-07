
// import { Schema, model } from "mongoose";
//
// const blogSchema = new Schema({
//     title: String,
//
//     date: {
//         type: Date,
//         default: Date.now()
//     },
//
//     content: String,
//
//     status: {
//         type: String,
//         default: "public",
//         enum: ["public", "private"]
//     },
//
//     image: {
//         type: String,
//         default: null,
//     },
//
//
// });
//
// export const Blog = model("Blog", blogSchema);
//
//
import {Schema, model} from "mongoose"

interface IBlog {
    name:string;
    title:string;
    mode:string;
    avatar : string;
    content : string;
    date : string;

};
const blogSchema = new Schema<IBlog>({
    name:String,
    title: String,
    mode:String,
    avatar : String,
    date : String,
    content:String,
});

const Blog = model<IBlog>('blog', blogSchema);
export {Blog}
