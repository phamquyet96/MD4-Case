// import express, {Router} from 'express';
// const productRoutes = Router();
// import {Item} from "../schemas/product.model";
// import multer from 'multer';
// const upload = multer();
// import {jwtauth} from "../middleware/jwtauth";
// import * as bodyParser from "body-parser";
// import {Author} from "../schemas/author.model";
// const fileupload = require('express-fileupload');
// import session from 'express-session';
// import cookieParser from 'cookie-parser';
// productRoutes.use(cookieParser("12345"));
// productRoutes.use(fileupload({ createParentPath: true }));
// // productRoutes.use(express.static('public'))
// productRoutes.use(bodyParser.json());
//
// // productRoutes.use('/', jwtauth)
// productRoutes.get('/create' ,(req: any,res)=> {
//     try{
//     const accountRole = req.decoded.role
//         if(accountRole !== "user"){
//             return  res.end("khong co quyen tao moi sp");
//
//         } else {
//             res.render('user/createProduct');
//         }
//     } catch(err) {
//         console.log(err + 'đây là lỗi khối catch')
//     }
// });
// productRoutes.post('/create',  async (req:any,res, next) =>{
//     try {
//         const accountUserName = req.decoded.username
//         // Xử lí file ảnh và nhạc
//         let {avatar, music} = req.files;
//         let avatarname = avatar.name;
//         let musicname = music.name;
//         avatar.mv('./public/' + avatarname)
//         music.mv('./public/' + musicname)
//          // Xử lí dữ liệu trong body
//         const itemNew = new Item({
//             name: req.body.name,
//             singer: req.body.singer,
//             category: req.body.category,
//             image: avatarname,
//             filename: musicname,
//             usernameCreate: accountUserName,
//         });
//         const item = await itemNew.save();
//         res.redirect('/products/list');
//     } catch (err){
//         res.render(err.message)
//     }
// });
// productRoutes.get('/list', async (req: any,res) =>{
//     try{
//         const accountUser = req.decoded.username
//         let limit = req.query.limit || 3;
//         let offset = req.query.offset || 0;
//         const item = await Item.find({usernameCreate: `${accountUser}`}).limit(limit).skip(limit*offset)
//         res.render('user/dashboard', {item: item, account: accountUser} )
//     } catch {
//         res.render('user/error');
//     }
// });
// productRoutes.get('/delete/:id', async (req, res) => {
//     console.log(req.params.id)
//     const idofItem = req.params.id;
//     const item = await Item.deleteOne({_id : idofItem})
//     res.redirect('/products/list')
// })
// productRoutes.get('/update/:id', async (req,res) => {
//     const idOfItemUpdate = req.params.id;
//     const itemUpdate = await Item.findById(idOfItemUpdate);
//     // @ts-ignore
//     res.render('update', {data: itemUpdate})
// })
// // productRoutes.post('/update/:id',upload.none(), async (req, res) =>{
// //     const idOfItemUpdate = req.params.id;
// //     // @ts-ignore
// //     const item = await Item.findOne({_id: req.params.id})
// //     item.name = req.body.name;
// //     item.price = req.body.price;
// //     item.category = req.body.producer;
// //     item.avatar = req.body.avatar;
// //     await item.save()
// //     res.redirect('/products/list');
// // })
// export default productRoutes