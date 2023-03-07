"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseerController = void 0;
const user_model_1 = require("../schemas/user.model");
const account_model_1 = require("src/schemas/account.model");
class UseerController {
    static async getHome(req, res) {
        let user = await user_model_1.UserModel.findById({ _id: req.decoded.user.id });
        let account = await account_model_1.Account.find({ status: "public" });
        res.render('user/home', { account: account, user: user });
    }
    static async addBlogPage(req, res) {
        let user = await user_model_1.UserModel.findById({ _id: req.decoded.user.id });
        res.render('user/blog', { user: user });
    }
    static async addBlog(req, res) {
        let user = await user_model_1.UserModel.findById({ _id: req.decoded.user.id });
        let account = new user_model_1.UserModel({
            title: req.body.title,
            content: req.body.content,
            image: req.file.originalname,
            status: req.body.status,
            date: new Date(),
            user: user._id
        });
        await account.save();
        res.redirect("/user/home");
    }
    static async getBlog(req, res) {
        let user = await user_model_1.UserModel.findById({ _id: req.decoded.user_id });
        let id = req.params.id;
        let account = await account_model_1.Account.findOne({ _id: id });
        res.render('user/blog', { account: account, user: user });
    }
    static async getInfo(req, res) {
        let user = await user_model_1.UserModel.findById({ _id: req.decoded.user_id });
        res.render('user/info', { user: user });
    }
    static async editUserPage(req, res) {
        let user = await user_model_1.UserModel.findById({ _id: req.decoded.user_id });
        res.render('user/editUser', { user: user });
    }
    static async editUser(req, res) {
        let id = req.params.id;
        await user_model_1.UserModel.findOneAndUpdate({ _id: id }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                avatar: req.file.originalname
            }
        });
        res.redirect('/user/info');
    }
    static async myBlog(req, res) {
        let user = await user_model_1.UserModel.findById({ _id: req.decoded.user_id });
        let account = await account_model_1.Account.find({ user: req.decoded.user_id });
        res.render('user/myBlog', { account: account, user: user });
    }
    static async searchBlog1(req, res) {
        let account = await account_model_1.Account.find({
            title: { $regex: req.query.keyword },
            user: req.decoded.user_id
        });
        res.status(200).json(account);
    }
    static async deleteBlog(req, res) {
        try {
            let id = req.params.id;
            await account_model_1.Account.findOneAndDelete({ _id: id });
            res.redirect('/user/my-blog');
        }
        catch (e) {
            console.log(e.message);
        }
    }
    static async updateBlogPage(req, res) {
        let id = req.params.id;
        let user = await user_model_1.UserModel.findById({ _id: req.decoded.user_id });
        let account = await account_model_1.Account.findOne({ _id: id });
        res.render('user/updateBlog', { account: account, user: user });
    }
    static async updateBlog(req, res) {
        try {
            let id = req.params.id;
            console.log(req.body.image);
            await account_model_1.Account.findOneAndUpdate({ _id: id }, {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    image: req.file.originalname,
                    status: req.body.status,
                }
            });
            res.redirect('/user/my-blog');
        }
        catch (e) {
            console.log(e.message);
        }
    }
}
exports.UseerController = UseerController;
//# sourceMappingURL=user.controller.js.map