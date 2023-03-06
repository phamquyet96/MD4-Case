"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
var mongoose = require("mongoose");
const db_url = 'mongodb://127.0.0.1:27017/dbtest';
const mongoose_1 = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect(db_url)
    .then(() => {
    console.log('db_connected');
}).catch(error => {
    console.log('db cnnection error: ', error.message);
});
exports.Account = mongoose.model('account', new mongoose_1.Schema({ username: String, password: String }, { collection: 'account' }));
const newaccount = new exports.Account({ username: "Phuoccgmail1.com", password: "Phuocmai123" });
newaccount.save();
exports.Account.find({}, function (err, data) { console.log(err, data, data.length); });
//# sourceMappingURL=account.js.map