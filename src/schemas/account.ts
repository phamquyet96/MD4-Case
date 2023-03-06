var mongoose = require("mongoose");
const db_url = 'mongodb://127.0.0.1:27017/dbtest';
import {Schema, model} from "mongoose";
mongoose.set('strictQuery', true)
mongoose.connect(db_url)
    .then(() => {
        console.log('db_connected')
    }).catch( error => {
    console.log('db connection error: ', error.message)
});

interface IAccount {
    username: String,
    password: String
}


<<<<<<< HEAD
export var Account = mongoose.model('account', new Schema({ username: String, password: String}, { collection : 'account' }));   // collection name;
=======
let Account = mongoose.model('account', new Schema({ username: String, password: String}, { collection : 'account' }));   // collection name;
>>>>>>> master


const newAccount = new Account({ username: "minh@gmail.com",password: "123"});
newAccount.save();
Account.find({}, function(err, data) { console.log(err, data, data.length);});