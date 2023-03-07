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
const express_1 = require("express");
const bodyParser = __importStar(require("body-parser"));
const passport_1 = __importDefault(require("../middleware/passport"));
const account_model_1 = require("../schemas/account.model");
const fileUpload = require('express-fileupload');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cleanCookie_1 = require("../middleware/cleanCookie");
const mailer = require('../../utils/mailer');
const bcrypt_1 = __importDefault(require("bcrypt"));
const process = __importStar(require("process"));
const loginRoutes = (0, express_1.Router)();
loginRoutes.use(bodyParser.json());
loginRoutes.use(fileUpload({ createParentPath: true }));
loginRoutes.get('/logout', cleanCookie_1.cleanCookie, (req, res) => {
    res.redirect('/auth/login');
});
loginRoutes.get('/login', (req, res) => {
    res.render('login/login');
});
loginRoutes.post('/login', async (req, res, next) => {
    try {
        console.log(req.body);
        const account = await account_model_1.Account.findOne({ username: req.body.username });
        if (account) {
            let payload = {
                user_id: account["id"],
                username: account["username"],
                password: account["password"],
                role: account["role"]
            };
            const token = jsonwebtoken_1.default.sign(payload, '123456789', {
                expiresIn: 36000,
            });
            if (req.body.password !== payload.password) {
                return res.send("<script>alert(\"Wrong Email or Password\"); window.location.href = \"/auth/login\"; </script>");
            }
            else if (account.role == "admin") {
                res.cookie("name", token);
                res.redirect('/admin/home');
            }
            else if (account.role == "user") {
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
loginRoutes.get('/register', (req, res) => {
    res.render('login/register');
});
loginRoutes.post('/register', async (req, res) => {
    try {
        const user = await account_model_1.Account.findOne({ username: req.body.username });
        if (!user) {
            const newAccount = new account_model_1.Account({
                username: req.body.username,
                password: req.body.password,
                role: "user",
                status: "unverify"
            });
            await newAccount.save((err, newAccount) => {
                if (!err) {
                    bcrypt_1.default.hash(newAccount.username, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                        mailer.sendMail(newAccount.username, "Welcome to Xtra Blog", `<h4>Please click this link</h4>><br><a href="${process.env.APP_URL}/auth/verify?email=${newAccount.username}&token=${hashedEmail}"> Verify </a>`);
                    });
                }
                else {
                    return res.send("<script>alert(\"Incorrect email or password \"); window.location.href = \"/auth/login\"; </script>");
                }
                res.setHeader("Content-Type", "text/html");
                res.send("<script>alert(\"Register success!\"); window.location.href = \"/auth/login\"; </script>");
            });
        }
        else {
            res.send("<script>alert(\"This email already exists\"); window.location.href = \"/auth/register\"; </script>");
        }
    }
    catch (err) {
        res.send("<script>alert(\" Incorrect email or password\"); window.location.href = \"/auth/register\"; </script>");
    }
});
loginRoutes.get('/verify', async (req, res) => {
    bcrypt_1.default.compare(req.query.email, req.query.token, (err, result) => {
        console.log(result);
        if (result) {
            console.log(result);
        }
    });
    account_model_1.Account.updateOne({ username: req.query.email }, { $set: { status: "verify" } }, (err, result) => {
        res.send("<script>alert(\"Account verification success!\"); window.location.href = \"/auth/login\"; </script>");
    });
});
loginRoutes.get('/password/reset', (req, res) => {
    res.render('login/forgotPassword');
});
loginRoutes.post('/password/email', async (req, res) => {
    if (!req.body.email) {
        res.redirect('/auth/password/reset');
    }
    else {
        const accResetPass = await account_model_1.Account.findOne({ username: req.body.email });
        if (accResetPass == null) {
            res.send("<script>alert(\"Email no exist\"); window.location.href = \"/auth/password/reset\"; </script>");
        }
        else {
            bcrypt_1.default.hash(accResetPass.username, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                mailer.sendMail(accResetPass.username, "Change password", `<h4>Nhấn Vào Link Dưới Đây Để Chuyển Tiếp Tới Trang Đổi Mật Khẩu</h4>><br><a href="${process.env.APP_URL}/auth/password/reset/${accResetPass.username}?token=${hashedEmail}"> Reset Password </a>`);
                console.log(`${process.env.APP_URL}/password/reset/${accResetPass.username}?token=${hashedEmail}`);
            });
            res.send("<script>alert(\"Please check email to get password\"); window.location.href = \"/auth/login\"; </script>");
        }
    }
});
loginRoutes.get('/password/reset/:email', (req, res) => {
    if (!req.params.email || !req.query.token) {
        res.redirect('/password/reset');
    }
    else {
        res.render('login/newPasswordForm', { email: req.params.email, token: req.query.token });
    }
});
loginRoutes.post('/password/reset', (req, res) => {
    const { email, token, password } = req.body;
    console.log(email, token, password);
    if (!email || !token || !password) {
        res.redirect('/password/reset');
    }
    else {
        bcrypt_1.default.compare(email, token, (err, result) => {
            console.log('compare', result);
            if (result == true) {
                account_model_1.Account.updateOne({ username: email }, { $set: { password: password } }, (err, result) => {
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
loginRoutes.get('/login/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
loginRoutes.get('/google/callback', passport_1.default.authenticate('google'), (req, res) => {
    res.send("<script>alert(\"Login success!\"); window.location.href = \"/auth/login\"; </script>");
});
exports.default = loginRoutes;
//# sourceMappingURL=auth.router.js.map