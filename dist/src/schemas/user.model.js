"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    title: {
        type: String
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
});
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map