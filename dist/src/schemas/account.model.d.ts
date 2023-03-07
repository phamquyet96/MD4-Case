import mongoose from "mongoose";
declare let Account: mongoose.Model<{
    status?: string;
    role?: string;
    username?: string;
    google_id?: string;
    password?: string;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    collection: string;
}>, {
    status?: string;
    role?: string;
    username?: string;
    google_id?: string;
    password?: string;
}>>;
export { Account };
