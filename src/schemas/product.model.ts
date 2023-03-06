import {Schema, model} from "mongoose";

interface IItem {
    name: string,
    singer: string,
    category: string,
    image: string,

    filename: string,
    usernameCreate: string,
    // keywords: object[]
}

// const keywordsSchema = new Schema({
//     keyword: String
// })

const itemSchema = new Schema<IItem>({
    name: String,
    singer: String,
    category: String,
    image: String,
    filename: String,
    usernameCreate: String
// @ts-ignore
//     author: { type:Schema.Types.ObjectId, ref: "Author" },
    // keywords: [keywordsSchema],
})
const Item = model<IItem>('Item', itemSchema);
export {Item}