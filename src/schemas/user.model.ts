import {Schema, model} from "mongoose";


const userSchema = new Schema({


    title:{
        type:String
    },

    status: {
        type: String,
        default: 'active',
        enum: ['active', "locked"]
    },

    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },

    avatar: {
        type: String,
        default: "/image/tree.jpg"
    },

    blog: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],

})
const UserModel = model('User', userSchema);
export {UserModel}