import { User } from "../schemas/user.model";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from "../middleware/passport";


export class AuthController {
    static async showFormLogin(req, res) {
        let error = req.flash().error || [];
        res.render('login/login', {error: error});
    }

    static async showFormRegister(req, res) {
        res.render('login/register');
    }

    static async register(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            console.log(user)
            if (!user) {
                const passwordHash = await bcrypt.hash(req.body.password, 10);
                let userData = {
                    name: req.body.name,
                    email: req.body.email,
                    role: req.body.role,
                    password: passwordHash,
                }
                await User.create(userData);
                res.redirect("/auth/login");
            } else {
                req.flash("error", "User already exists");
                res.redirect("/auth/register");
            }
        } catch (err) {
            res.redirect("/auth/register");
        }
    }

    static async login(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});

            if (user) {
                const comparePass = await bcrypt.compare(req.body.password, user.password);
                console.log(comparePass)
                if (!comparePass) {
                    req.flash("error", "Wrong password!!!");
                    return res.redirect("/auth/login");
                }
                let payload = {
                    user_id: user["id"],
                    name: user["name"],
                    email: user["email"],
                    role: user["role"]
                }
                const token = jwt.sign(payload, '123456789', {
                    expiresIn: 30 * 60 * 1000,

                });

                let options = {
                    maxAge: 1000 * 60 * 30, // would expire after 30 minutes
                    httpOnly: true, // The cookie only accessible by the web server
                }
                res.cookie('token', token, options)

                if (user.status === 'locked') {
                    req.flash("error", "Your account has been locked")
                    return res.redirect("/auth/login");
                } else if (user.role === "admin") {
                    res.redirect("/admin/home");
                } else {
                    res.redirect("/user/home");
                }

            } else {
                req.flash("error", "Wrong account or password");
                res.redirect("/auth/login");
            }

        } catch (err) {
            console.log(err);
            res.redirect("/auth/login");
        }
    }

    static changePasswordPage(req, res) {
        res.render('changePassword')
    }

    static async changePassword(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            if (user) {
                const comparePass = await bcrypt.compare(req.body.password, user.password);
                if (!comparePass) {
                    req.flash("error", "Sai Mật khẩu!!!");
                    res.redirect("/auth/change-password");
                } else {
                    const passwordHash = await bcrypt.hash(req.body.passwordChange, 10);
                    await User.updateOne({_id: user._id}, {password: passwordHash});
                    res.redirect("/auth/logout");
                }
            } else {
                req.flash("error", "Không tìm thấy user");
                res.redirect("/auth/change-password");
            }
        } catch (e) {
            console.log(e.message);
            res.redirect("/auth/change-password");
        }
    }

    static async logout(req, res) {
        try {
            res.clearCookie('token');
            res.redirect('/auth/login')
        } catch (err) {
            console.log(err.message);
            res.redirect('/error/500')

        }
    }

    static async loginGG(req, res) {
        passport.authenticate('google', {scope: ['profile', 'email']})
    }

    static async loginGoogle(req, res) {
        passport.authenticate('google'), (req, res) => {
            res.send("<script>alert(\"Login success!\"); window.location.href = \"/auth/login\"; </script>");
        }

    }
}