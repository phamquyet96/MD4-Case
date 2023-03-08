import mongoose from "mongoose";
declare let User: mongoose.Model<{
    blog: mongoose.Types.ObjectId[];
    description?: string;
    name?: string;
    email?: string;
    google_id?: string;
    address?: string;
    password?: string;
    role?: string;
    avatar?: string;
    status?: string;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    blog: mongoose.Types.ObjectId[];
    description?: string;
    name?: string;
    email?: string;
    google_id?: string;
    address?: string;
    password?: string;
    role?: string;
    avatar?: string;
    status?: string;
}>>;
export { User };
