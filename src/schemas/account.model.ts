import mongoose, {Schema, model} from "mongoose";

interface IAccountModel {
    username: String,
    password: String,
    role: "user",
    google_id: String,
    status: String
}


let Account = mongoose.model('account', new Schema({ username: String, password: String, role: String, google_id: String, status: String
}, { collection : 'account' }));

export {Account}



