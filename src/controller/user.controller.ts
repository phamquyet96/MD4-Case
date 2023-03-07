import { UserModel } from "../schemas/user.model";
import { Account } from "../schemas/account.model";
import {Blog} from "../schemas/blog.model";
import loginRoutes from "../router/auth.router";

import * as bodyParser from "body-parser";
import userRoutes from "../router/user.router";






export class UserController {
    static async showHomeUser(req,res){
        res.render("user/userhome")
    }
    // static async getHome(req,res) {
    //     let user = await Account.findById({_id: req.decoded.user.id});
    //     let account = await Account.find({status: "public"});
    //     res.render('user/userhome', {account: account, user: user});
    // }

    static async addBlogPage(req, res) {
        res.render('user/addblog');
    }

    static async addBlog(req, res) {

        try {
            console.log(req.body)

            let blog = new Blog({
                title: req.body.title,
                content: req.body.content,
                status: req.body.status,
                image:req.file.originalname,
                date: req.body.date
            });
             await blog.save();
            res.redirect('/user/home');
        }catch (e) {
            console.log(e)
        }
    }

    static async getBlog(req, res) {
        let user = await UserModel.findById({ _id: req.decoded.user_id })
        let id = req.params.id
        let account = await Account.findOne({ _id: id })
        res.render('user/blog', { account: account, user: user });
    }

    static async getInfo(req, res) {
        let user = await UserModel.findById({ _id: req.decoded.user_id })
        res.render('user/info', { user: user });
    }

    static async editUserPage(req, res) {
        let user = await UserModel.findById({ _id: req.decoded.user_id })
        res.render('user/editUser', { user: user });
    }

    static async editUser(req, res) {
        let id = req.params.id
        await UserModel.findOneAndUpdate({ _id: id }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                avatar: req.file.originalname
            }
        })
        res.redirect('/user/info')
    }

    static async myBlog(req, res) {
        let user = await UserModel.findById({ _id: req.decoded.user_id })
        let account = await Account.find({ user: req.decoded.user_id })
        res.render('user/myBlog', { account: account, user: user });
    }

    static async searchBlog1(req, res) {
        let account = await Account.find({
            title: { $regex: req.query.keyword },
            user: req.decoded.user_id
        })
        res.status(200).json(account);
    }

    static async deleteBlog(req, res) {
        try {
            let id = req.params.id
            await Account.findOneAndDelete({ _id: id })
            res.redirect('/user/my-blog')
        } catch (e) {
            console.log(e.message)
        }
    }

    static async updateBlogPage(req, res) {
        let id = req.params.id
        let user = await UserModel.findById({ _id: req.decoded.user_id })
        let account = await Account.findOne({ _id: id })
        res.render('user/updateBlog', { account: account, user: user });
    }

    static async updateBlog(req, res) {
        try {
            let id = req.params.id
            console.log(req.body.image)
            await Account.findOneAndUpdate({ _id: id }, {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    image: req.file.originalname,
                    status: req.body.status,
                }
            })

            res.redirect('/user/my-blog')
        } catch (e) {
            console.log(e.message)
        }

    }
}

