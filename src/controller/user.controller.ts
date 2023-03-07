import { User } from "../schemas/user.model";
// import { Account } from "../schemas/account.model";
import {Blog} from "../schemas/blog.model";
import {jwtauth} from "../middleware/jwtauth";
import authRoutes from "../router/auth.router";

import * as bodyParser from "body-parser";
import userRoutes from "../router/user.router";

export class UserController{
    static async showHomeUser(req,res){
        const accountUser = req.decoded.name;
        const blog=await Blog.find();
        res.render("user/home",{blog:blog, accountUser: accountUser})
    }

    static async addBlogPage(req,res){
        res.render('user/addBlog')
    }

    static async addBlog(req,res){

        let blog = new Blog({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
            avatar:req.file.originalname,
            date: req.body.date
        });
        console.log(blog)
        await blog.save();
        res.redirect("/user/home")
    }

    static async getBlog(req,res){
        let user = await User.findById({_id :req.decoded.user_id})
        let id = req.params.id
        let blog = await Blog.findOne({_id: id})
        res.render('user/blog', {blog: blog, user: user});
    }

    static async getInfo(req,res){
        let user = await User.findOne({_id :req.decoded.user_id})
        res.render('user/info', {user: user});
    }

    static async  editUserPage (req,res){
        let user = await User.findById({_id :req.decoded.user_id})
        res.render('user/editUser', {user: user});
    }

    static async editUser (req, res) {
        let id = req.params.id
        await User.findOneAndUpdate({_id :id},{
            $set : {
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                avatar: req.file.originalname
            }
        })
        res.redirect('/user/info')
    }

    static async myBlog(req,res){
        console.log(req.decoded.user_id)

        let user = await User.findById({_id :req.decoded.user_id})
        console.log(user)
        let blog = await Blog.find({user: req.decoded.user_id})
        console.log(blog)
        res.render('user/myBlog', {user: user, blog: blog});
    }

    static async searchBlog1(req,res){
        let blog = await Blog.find({
            title: {$regex: req.query.keyword},
            user: req.decoded.user_id
        })
        res.status(200).json(blog);
    }

    static async deleteBlog (req,res) {
        try {
            let id = req.params.id
            await Blog.findOneAndDelete({_id: id})
            res.redirect('/user/my-blog')
        }catch (e) {
            console.log(e.message)
        }
    }

    static async updateBlogPage (req, res) {
        let id = req.params.id
        let user = await User.findById({_id :req.decoded.user_id})
        let blog = await Blog.findOne({_id: id})
        res.render('user/updateBlog', {user: user, blog: blog});
    }

    static async updateBlog (req, res) {
        try {
            let id = req.params.id
            console.log(req.body.image)
            await Blog.findOneAndUpdate({_id: id},{
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    image: req.file.originalname,
                    status: req.body.status,
                }
            })

            res.redirect('/user/my-blog')
        }catch (e) {
            console.log(e.message)
        }

    }
}

