import { UserModel} from "../schemas/user.model";
import { Account } from "src/schemas/account.model";
import bcrypt from "bcrypt";

export class AdminController {
    static showListUserPage(arg0: string, showListUserPage: any) {
        throw new Error("Method not implemented.");
    }
    static showListBlog(arg0: string, showListBlog: any) {
        throw new Error("Method not implemented.");
    }
    static deleteBlog(arg0: string, deleteBlog: any) {
        throw new Error("Method not implemented.");
    }
    static searchBlog(arg0: string, searchBlog: any) {
        throw new Error("Method not implemented.");
    }
    static showHomePage (req,res) {
        res.render('admin/home')
    }
    static async showListUserModelPage (req,res) {
        let user = await UserModel.find()
        res.render('admin/listUser', {user: user})
    }

    static async deleteUser(req, res) {
        let id = req.params.id
        await UserModel.findOneAndDelete({ _id: id })
        res.redirect('/admin/list-user')
    }

    static async lockUser(req, res) {
        let id = req.params.id
        let user = await UserModel.findOne({ _id: id })
        console.log(user);
        
        if (user.status === 'active') {
            await UserModel.updateOne({ _id: id },
                {
                    $set:
                        { status: 'locked' }
                })
            res.redirect('/admin/list-user')
        } else {
            await UserModel.updateOne({ _id: id },
                {
                    $set:
                        { status: 'active' }
                })
            res.redirect('/admin/list-user')
        }
    }

    static async searchUser(req, res) {
        let user = await UserModel.find({
            name: { $regex: req.query.keyword }
        })
        res.status(200).json(user);
    }

    static async showListAccount(req, res) {
        let account = await Account.find().populate('user')
        res.render('admin/listAccount', { Account: Account })
    }

    static async deleteAccount(req, res) {
        let id = req.params.id
        await Account.findOneAndDelete({ _id: id })
        res.redirect('/admin/list-account')
    }

    static async searchAccount(req, res) {
        let account = await Account.find({
            title: { $regex: req.query.keyword }
        }).populate('user')
        res.status(200).json(Account);
    }

    static async addAdminPage(req, res) {
        let error = req.flash().error || [];
        res.render('admin/addAdmin', { error: error })
    }

    static async addAdmin(req, res) {
        try {
            console.log(UserModel);
            
            const user = await UserModel.findOne({ email: req.body.email });
            if (!user) {
                const passwordHash = await bcrypt.hash(req.body.password, 10);
                let userData = {
                    name: req.body.name,
                    email: req.body.email,
                    role: 'admin',
                    password: passwordHash,
                    phoneNumber: req.body.phone
                }
                await UserModel.create(userData);
                res.redirect("/auth/login");
            } else {
                if (user.password === req.body.password) {
                    await UserModel.updateOne({ _id: UserModel.id }, { $set: { role: 'admin' } })
                    res.redirect("/auth/login");
                } else {
                    req.flash('error', 'Wrong password')
                    res.redirect('/admin/add-admin')
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    }
}