"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validatePassword_1 = __importDefault(require("../middleware/validatePassword"));
const express_1 = require("express");
const bodyParser = __importStar(require("body-parser"));
const passport_1 = __importDefault(require("../middleware/passport"));
const fileUpload = require('express-fileupload');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cleanCookie_1 = require("../middleware/cleanCookie");
const mailer = require('../../utils/mailer');
const bcrypt_1 = __importDefault(require("bcrypt"));
const process = __importStar(require("process"));
const user_model_1 = require("../schemas/user.model");
const authRoutes = (0, express_1.Router)();
authRoutes.use(bodyParser.json());
authRoutes.use(fileUpload({ createParentPath: true }));
authRoutes.get('/logout', cleanCookie_1.cleanCookie, (req, res) => {
    res.redirect('/auth/login');
});
authRoutes.get('/login', (req, res) => {
    res.render('login/login');
});
authRoutes.post('/login', async (req, res, next) => {
    try {
        console.log(req.body);
        const user = await user_model_1.User.findOne({ name: req.body.name });
        if (user) {
            let payload = {
                user_id: user["id"],
                name: user["name"],
                password: user["password"],
                role: user["role"]
            };
            const token = jsonwebtoken_1.default.sign(payload, '123456789', {
                expiresIn: 36000,
            });
            if (req.body.password !== payload.password) {
                return res.send("<script>alert(\"Wrong Email or Password\"); window.location.href = \"/auth/login\"; </script>");
            }
            else if (user.role == "admin") {
                res.cookie("name", token);
                res.redirect('/admin/home');
            }
            else if (user.role == "user") {
                console.log(token);
                res.cookie("name", token);
                res.redirect('/user/home');
            }
        }
        else {
            return res.send("<script>alert(\"Please create new account\"); window.location.href = \"/auth/register\"; </script>");
        }
    }
    catch (error) {
        return res.send("<script>alert(\"Error Server\"); window.location.href = \"/auth/login\"; </script>");
    }
});
authRoutes.get('/register', (req, res) => {
    res.render('login/register');
});
authRoutes.post('/register', async (req, res) => {
    try {
        const user = await user_model_1.User.findOne({ name: req.body.name });
        let validatePassword = validatePassword_1.default.check(req.body.password);
        console.log(validatePassword);
        if (validatePassword === "passwordValid") {
            console.log(user);
            if (!user) {
                const newUser = new user_model_1.User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: "user",
                    avatar: req.body.avatar,
                    address: req.body.address
                });
                await newUser.save((err, newUser) => {
                    if (!err) {
                        bcrypt_1.default.hash(newUser.name, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                            mailer.sendMail(newUser.name, "Welcome to Xtra Blog", `<h4>Please click this link</h4>><br><a href="${process.env.APP_URL}/auth/verify?email=${newUser.name}&token=${hashedEmail}"> Verify </a>`);
                        });
                    }
                    res.setHeader("Content-Type", "text/html");
                    res.send("<script>alert(\"Register success!\"); window.location.href = \"/auth/login\"; </script>");
                });
            }
            else {
                res.send("<script>alert(\"This email already exists\"); window.location.href = \"/auth/register\"; </script>");
            }
        }
        else {
            return res.send("<script>alert(\"Incorrect password format \"); window.location.href = \"/auth/register\"; </script>");
        }
    }
    catch (err) {
        res.send("<script>alert(\" Incorrect email or password\"); window.location.href = \"/auth/register\"; </script>");
    }
});
authRoutes.get('/verify', async (req, res) => {
    bcrypt_1.default.compare(req.query.email, req.query.token, (err, result) => {
        console.log(result);
        if (result) {
            console.log(result);
        }
    });
    user_model_1.User.updateOne({ name: req.query.email }, { $set: { status: "verify" } }, (err, result) => {
        res.send("<script>alert(\"Account verification success!\"); window.location.href = \"/auth/login\"; </script>");
    });
});
authRoutes.get('/password/reset', (req, res) => {
    res.render('login/forgotPassword');
});
authRoutes.post('/password/email', async (req, res) => {
    if (!req.body.email) {
        res.redirect('/auth/password/reset');
    }
    else {
        const accResetPass = await user_model_1.User.findOne({ name: req.body.email });
        if (accResetPass == null) {
            res.send("<script>alert(\"Email no exist\"); window.location.href = \"/auth/password/reset\"; </script>");
        }
        else {
            bcrypt_1.default.hash(accResetPass.name, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                mailer.sendMail(accResetPass.name, "Change password", `<h4>Nhấn Vào Link Dưới Đây Để Chuyển Tiếp Tới Trang Đổi Mật Khẩu</h4>><br><a href="${process.env.APP_URL}/auth/password/reset/${accResetPass.name}?token=${hashedEmail}"> Reset Password </a>`);
                console.log(`${process.env.APP_URL}/password/reset/${accResetPass.name}?token=${hashedEmail}`);
            });
            res.send("<script>alert(\"Please check email to get password\"); window.location.href = \"/auth/login\"; </script>");
        }
    }
});
authRoutes.get('/password/reset/:email', (req, res) => {
    if (!req.params.email || !req.query.token) {
        res.redirect('/password/reset');
    }
    else {
        res.render('login/newPasswordForm', { email: req.params.email, token: req.query.token });
    }
});
authRoutes.post('/password/reset', (req, res) => {
    const { email, token, password } = req.body;
    console.log(email, token, password);
    if (!email || !token || !password) {
        res.redirect('/password/reset');
    }
    else {
        bcrypt_1.default.compare(email, token, (err, result) => {
            console.log('compare', result);
            if (result == true) {
                user_model_1.User.updateOne({ name: email }, { $set: { password: password } }, (err, result) => {
                    if (!err) {
                        res.send("<script>alert(\"Change password success!\"); window.location.href = \"/auth/login\"; </script>");
                    }
                    else {
                        res.status(500);
                    }
                });
            }
            else {
                res.redirect('/password/reset');
            }
        });
    }
});
authRoutes.get('/login/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
authRoutes.get('/google/callback', passport_1.default.authenticate('google'), (req, res) => {
    res.send("<script>alert(\"Login success!\"); window.location.href = \"/auth/login\"; </script>");
});
exports.default = authRoutes;
//# sourceMappingURL=auth.router.js.map