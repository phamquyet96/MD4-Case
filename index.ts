
// Import package
// @ts-ignore
import express from 'express';
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import authRoutes from "./src/router/auth.router";
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import path from "path";
import adminRoutes from "./src/router/admin.router";
import userRoutes from "./src/router/user.router";
import * as process from "process";
import multer from "multer"
dotenv.config();
//AdminBro
const AdminBro = require('admin-bro')
import expressAdminBro from '@admin-bro/express';
import mongooseAdminBro from '@admin-bro/mongoose';

//Modelos
import { User } from "./src/schemas/user.model";
import { Blog } from "./src/schemas/blog.model"; 

AdminBro.registerAdapter(mongooseAdminBro)
const AdminBroOptions = { resources: [User, Blog ] }

const adminBro = new AdminBro(AdminBroOptions)
const router = expressAdminBro.buildRouter(adminBro)

// Connect Database
const port = 8000;
const app = express();

app.set('view engine', 'ejs');
app.set('views','./src/views');
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser(process.env.USER_CODE_SECRET));
app.use(express.static('public'))
app.use(express.static('src/uploads'))
const db_url = 'mongodb://127.0.0.1:27017/dbtest';
mongoose.set('strictQuery', true)
mongoose.connect(db_url)
    .then(() => {
        console.log('db connected')
    }).catch( error => {
    console.log('db connection error: ', error.message)
});
let connection = mongoose.connection;

// Set và use chức năng đã import
app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/admin',adminRoutes);
app.use('/user',userRoutes);
app.use(adminBro.options.rootPath, router)




// xử lí router
app.get('/', (req,res) => {
    res.render('home_Template')
})

app.get('/', (req, res) => {
    res.send('Dashboard Node')
})

app.listen(port, () => {
    console.log('app running on port '+ port)
})

