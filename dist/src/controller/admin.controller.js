"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_model_1 = require("../schemas/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AdminController {
    static showListUserPage(arg0, showListUserPage) {
        throw new Error("Method not implemented.");
    }
    static showListBlog(arg0, showListBlog) {
        throw new Error("Method not implemented.");
    }
    static deleteBlog(arg0, deleteBlog) {
        throw new Error("Method not implemented.");
    }
    static searchBlog(arg0, searchBlog) {
        throw new Error("Method not implemented.");
    }
    static showHomePage(req, res) {
        res.render('admin/adminhome');
    }
    static async showListUserModelPage(req, res) {
        let user = await user_model_1.UserModel.find();
        res.render('admin/listUser', { user: user });
    }
    static async deleteUser(req, res) {
        let id = req.params.id;
        await user_model_1.UserModel.findOneAndDelete({ _id: id });
        res.redirect('/admin/list-user');
    }
    static async lockUser(req, res) {
        let id = req.params.id;
        let user = await user_model_1.UserModel.findOne({ _id: id });
        console.log(user);
        if (user.status === 'active') {
            await user_model_1.UserModel.updateOne({ _id: id }, {
                $set: { status: 'locked' }
            });
            res.redirect('/admin/list-user');
        }
        else {
            await user_model_1.UserModel.updateOne({ _id: id }, {
                $set: { status: 'active' }
            });
            res.redirect('/admin/list-user');
        }
    }
    static async searchUser(req, res) {
        let user = await user_model_1.UserModel.find({
            name: { $regex: req.query.keyword }
        });
        res.status(200).json(user);
    }
    static async showListAccount(req, res) {
        let user = await user_model_1.UserModel.find().populate('user');
        res.render('admin/listAccount', { UserModel: user_model_1.UserModel });
    }
    static async deleteAccount(req, res) {
        let id = req.params.id;
        await user_model_1.UserModel.findOneAndDelete({ _id: id });
        res.redirect('/admin/list-account');
    }
    static async searchAccount(req, res) {
        let user = await user_model_1.UserModel.find({
            title: { $regex: req.query.keyword }
        }).populate('user');
        res.status(200).json(user_model_1.UserModel);
    }
    static async addAdminPage(req, res) {
        let error = req.flash().error || [];
        res.render('admin/addAdmin', { error: error });
    }
    static async addAdmin(req, res) {
        try {
            const user = await user_model_1.UserModel.findOne({ email: req.body.email });
            if (!user) {
                const passwordHash = await bcrypt_1.default.hash(req.body.password, 10);
                let userData = {
                    name: req.body.name,
                    email: req.body.email,
                    role: 'admin',
                    password: passwordHash,
                };
                await user_model_1.UserModel.create(userData);
                res.redirect("/auth/login");
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map