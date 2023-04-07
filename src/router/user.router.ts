import { UserController } from "../controller/user.controller";
import { Router } from 'express';
import multer from "multer"
import {jwtauth} from "../middleware/jwtauth";
import jwt from "jsonwebtoken";

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

let upload = multer({ storage: storage });

const userRoutes = Router()
userRoutes.use(jwtauth)
userRoutes.get('/home', jwtauth,UserController.showHomeUser)
userRoutes.get('/add-blog', UserController.addBlogPage)
userRoutes.post('/add-blog',jwtauth,upload.single('avatar'), UserController.addBlog)
userRoutes.get('/blog/:id', UserController.getBlog)
userRoutes.get('/my-blog', jwtauth,UserController.myBlog)
userRoutes.get('/search-blog', UserController.searchBlog)
userRoutes.get('/delete-blog/:id', UserController.deleteBlog)
userRoutes.get('/update-blog/:id', UserController.updateBlogPage)
userRoutes.post('/update-blog/:id', upload.single('avatar'), UserController.updateBlog)

userRoutes.get('/info', UserController.getInfo)
userRoutes.get('/edit-user/:id', UserController.editUserPage)
userRoutes.post('/edit-user/:id', upload.single('avatar'), UserController.editUser)

export default userRoutes