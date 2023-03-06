import {Schema, model} from "mongoose";

interface IUser {
    username: string;
    password: string;
    status:string;
    id:number;
    google: {
        id: {
            type: string,
        },
    }
}
const userSchema = new Schema<IUser>({
    username: String,
    password: String,
    status:String,
    id:Number,
    google: {
        id: {
            type: String,
        },

    }
})
const UserModel = model<IUser>('User', userSchema);
export {UserModel}