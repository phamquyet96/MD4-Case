
// Import package
// @ts-ignore
import express from 'express';
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import loginRoutes from "./src/router/auth.router";
import productRouter from "./src/router/product.router";
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {jwtauth} from "./src/middleware/jwtauth";
import mailer from 'express-mailer';
import * as dotenv from 'dotenv';
import path from "path";
dotenv.config();


// Connect Database
const port = 8000;
const app = express();
app.set('view engine', 'ejs');
app.set('views','./src/views');
app.use(cookieParser("12345"));
app.use(express.static('public'))
const db_url = 'mongodb://127.0.0.1:27017/dbtest';
mongoose.set('strictQuery', true)
mongoose.connect(db_url)
    .then(() => {
        console.log('db_connected2')
    }).catch( error => {
    console.log('db connection error: ', error.message)
});
var connection = mongoose.connection;

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
app.use('/auth', loginRoutes);
app.use('/products', productRouter);
// app.use('/products', jwtauth);

// xử lí router
app.get('/home', (req,res) => {
    res.render('home_Template')
})

app.listen(port, () => {
    console.log('app running on port '+ port)
})


/* 
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

let users: any[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@gmail.com'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'janesmith@gmail.com'
    }
];

// Get all users
app.get('/users', (req: Request, res: Response) => {
    return res.status(200).json(users);
});

// Get user by id
app.get('/users/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({ error: `User with id ${id} not found` });
    }

    return res.status(200).json(user);
});

// Create new user
app.post('/users', (req: Request, res: Response) => {
    const user = req.body;
    user.id = Date.now();

    users.push(user);

    return res.status(201).json(user);
});

// Update user by id
app.put('/users/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index < 0) {
        return res.status(404).json({ error: `User with id ${id} not found` });
    }

    const updatedUser = Object.assign(users[index], req.body);

    users[index] = updatedUser;

    return res.status(200).json(updatedUser);
});

// Delete user by id
app.delete('/users/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);

    users = users.filter((user) => user.id !== id);

    return res.sendStatus(204);
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

*/