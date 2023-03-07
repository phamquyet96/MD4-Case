//
// import { AuthController } from "../controller/auth.controller";
// import { Router } from 'express';
// const authRoutes = Router();
//
//
// authRoutes.get("/login", AuthController.showFormLogin);
// authRoutes.post("/login", AuthController.login);
//
// authRoutes.get("/register", AuthController.showFormRegister);
// authRoutes.post("/register", AuthController.register);
//
// authRoutes.get('/change-password', AuthController.changePasswordPage);
// authRoutes.post('/change-password',AuthController.changePassword);
//
// authRoutes.get('/logout', AuthController.logout);
//
// export default authRoutes;

import {Router, Request, Response} from "express";
import multer from 'multer';
import * as bodyParser from "body-parser";
import passport from "../middleware/passport";
const fileUpload = require('express-fileupload');
import jwt from 'jsonwebtoken';
import {cleanCookie} from "../middleware/cleanCookie";
const mailer = require('../../utils/mailer');
import bcrypt from 'bcrypt';
import * as process from "process";
import {User} from "../schemas/user.model";

const authRoutes = Router();



authRoutes.use(bodyParser.json());
authRoutes.use(fileUpload({ createParentPath: true }));

authRoutes.get('/logout',cleanCookie,(req: Request, res: Response) => {
    res.redirect('/auth/login')
})

authRoutes.get('/login', (req: Request, res: Response) => {
    res.render('login/login')
})
authRoutes.post('/login', async (req: Request, res: Response, next) =>{
        try{
            console.log(req.body)
            const user = await User.findOne({name: req.body.name});

            if(user){
                let payload = {
                    user_id: user["id"],
                    name: user["name"],
                    password:user["password"],
                    role:user["role"]
                }
                const token = jwt.sign(payload, '123456789', {
                    expiresIn: 36000,
                });
                if(req.body.password !== payload.password){
                    return res.send("<script>alert(\"Wrong Email or Password\"); window.location.href = \"/auth/login\"; </script>");
                }else if (user.role == "admin"){
                    res.cookie("name", token )
                    res.redirect('/admin/home')
                }else if(user.role == "user"){
                    console.log(token)
                    res.cookie("name", token )
                    res.redirect('/user/home')
                }
            } else{
                return res.send("<script>alert(\"Please create new account\"); window.location.href = \"/auth/register\"; </script>");
            }
        }
        catch (error){
            return res.send("<script>alert(\"Error Server\"); window.location.href = \"/auth/login\"; </script>");
        }

    }
);
authRoutes.get('/register', (req: Request, res: Response) => {
    res.render('login/register')
})
authRoutes.post('/register', async (req: Request, res: Response) => {
    try{
        console.log(req.body)
        const user = await User.findOne({name: req.body.name});
        console.log(user)
        if (!user) {
            // const passwordHash = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                name: req.body.name,
                email:req.body.email,
                password: req.body.password,
                role: "user",
                avatar:req.body.avatar,
                address:req.body.address

            })
            await newUser.save((err,newUser) => {
                if(!err){
                    bcrypt.hash(newUser.name, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                        mailer.sendMail(newUser.name, "Welcome to Xtra Blog", `<h4>Please click this link</h4>><br><a href="${process.env.APP_URL}/auth/verify?email=${newUser.name}&token=${hashedEmail}"> Verify </a>`)
                    });
                } else {
                    return res.send("<script>alert(\"Incorrect password \"); window.location.href = \"/auth/login\"; </script>");
                }
                res.setHeader("Content-Type", "text/html");
                res.send("<script>alert(\"Register success!\"); window.location.href = \"/auth/login\"; </script>");
            });
        }
        else {res.send("<script>alert(\"This email already exists\"); window.location.href = \"/auth/register\"; </script>");}
    } catch (err){
        res.send("<script>alert(\" Incorrect email or password\"); window.location.href = \"/auth/register\"; </script>");
    }
})
authRoutes.get('/verify', async  (req:any, res) => {
    bcrypt.compare(req.query.email, req.query.token, (err, result) => {
        console.log(result)
        if (result){
            console.log(result)
        }
    })
    User.updateOne({name: req.query.email}, { $set: { status: "verify" }}, (err, result) => {
        res.send("<script>alert(\"Account verification success!\"); window.location.href = \"/auth/login\"; </script>");

    })
})


authRoutes.get('/password/reset', (req, res) => {
    res.render('login/forgotPassword')
})
authRoutes.post('/password/email', async (req, res ) => {
    if (!req.body.email) {
        res.redirect('/auth/password/reset')
    } else {
        const accResetPass = await User.findOne({name: req.body.email})
        if (accResetPass == null){
            res.send("<script>alert(\"Email no exist\"); window.location.href = \"/auth/password/reset\"; </script>");
        } else {
            bcrypt.hash(accResetPass.name, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                mailer.sendMail(accResetPass.name, "Change password", `<h4>Nhấn Vào Link Dưới Đây Để Chuyển Tiếp Tới Trang Đổi Mật Khẩu</h4>><br><a href="${process.env.APP_URL}/auth/password/reset/${accResetPass.name}?token=${hashedEmail}"> Reset Password </a>`)
                console.log(`${process.env.APP_URL}/password/reset/${accResetPass.name}?token=${hashedEmail}`);
            })
            res.send("<script>alert(\"Please check email to get password\"); window.location.href = \"/auth/login\"; </script>");
        }
    }
});
authRoutes.get('/password/reset/:email', (req, res ) => {
    if (!req.params.email || !req.query.token) {
        res.redirect('/password/reset')
    } else {
        res.render('login/newPasswordForm', { email: req.params.email, token: req.query.token})
    }
})
authRoutes.post('/password/reset', (req, res) => {
    const { email, token, password } = req.body;
    console.log(email, token, password);
    if (!email || !token || !password) {
        res.redirect('/password/reset');
    } else {
        bcrypt.compare(email, token, (err, result) => {
            console.log('compare', result);
            if (result == true) {
                User.updateOne({name: email}, { $set: { password: password }}, (err, result) => {
                    if (!err) {
                        res.send("<script>alert(\"Change password success!\"); window.location.href = \"/auth/login\"; </script>");
                    } else {
                        res.status(500);
                    }
                })
            } else {
                res.redirect('/password/reset');
            }
        })
    }
})


authRoutes.get('/login/google', passport.authenticate('google', {scope: ['profile','email']}));
authRoutes.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.send("<script>alert(\"Login success!\"); window.location.href = \"/auth/login\"; </script>");
})

export default authRoutes