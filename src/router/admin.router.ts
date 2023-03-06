import { AdminController } from "src/controller/admin.controller";
import { Router } from 'express';

const adminRoutes = Router();

adminRoutes.get('/home', AdminController.showHomePage)

adminRoutes.get('/list-user', AdminController.showListUserPage)
adminRoutes.get('/delete-user/:id', AdminController.deleteUser)
adminRoutes.get('/lock/:id', AdminController.lockUser)
adminRoutes.get('/search-user', AdminController.searchUser)

adminRoutes.get('/list-blog', AdminController.showListBlog)
adminRoutes.get('/delete-blog/:id', AdminController.deleteBlog)
adminRoutes.get('/search-blog', AdminController.searchBlog)

adminRoutes.get('/add-admin', AdminController.addAdminPage)
adminRoutes.post('/add-admin', AdminController.addAdmin)

export default adminRoutes;