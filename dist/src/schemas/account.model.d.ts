import mongoose from "mongoose";
declare let Account: mongoose.Model<{
    username?: string;
    password?: string;
    status?: string;
    role?: string;
    google_id?: string;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    collection: string;
}>, {
    username?: string;
    password?: string;
    status?: string;
    role?: string;
    google_id?: string;
}>>;
export { Account };
