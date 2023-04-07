import express, {Express} from 'express';
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import authRoutes from "./src/router/auth.router";
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import adminRoutes from "./src/router/admin.router";
import userRoutes from "./src/router/user.router";
import * as process from "process";
dotenv.config();

// Connect Database
const port: number = 8000;
const app: Express = express();

app.set('view engine', 'ejs');
app.set('views','./src/views');
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser(process.env.USER_CODE_SECRET));
app.use(express.static('public'))
app.use(express.static('src/uploads'))
const db_url: string = 'mongodb://127.0.0.1:27017/dbtest';
mongoose.set('strictQuery', true)
mongoose.connect(db_url)
    .then(() => {
        console.log('db connected')
    }).catch( error => {
    console.log('db connection error: ', error.message)
});
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

