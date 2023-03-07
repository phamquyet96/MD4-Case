import mongoose, {Schema, model} from "mongoose";

let User = mongoose.model('User', new Schema({ name: String,email:String,google_id:String,address:String, password: String, role: String, avatar: String, status: String,
    description:String,
    blog: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
}));

export {User}
