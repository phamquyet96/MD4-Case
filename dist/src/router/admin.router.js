"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_controller_1 = require("../controller/admin.controller");
const express_1 = require("express");
const adminRoutes = (0, express_1.Router)();
adminRoutes.get('/home', admin_controller_1.AdminController.showHomePage);
adminRoutes.get('/list-user', admin_controller_1.AdminController.showListUserPage);
adminRoutes.get('/delete-user/:id', admin_controller_1.AdminController.deleteUser);
adminRoutes.get('/lock/:id', admin_controller_1.AdminController.lockUser);
adminRoutes.get('/search-user', admin_controller_1.AdminController.searchUser);
adminRoutes.get('/list-blog', admin_controller_1.AdminController.showListBlog);
adminRoutes.get('/delete-blog/:id', admin_controller_1.AdminController.deleteBlog);
adminRoutes.get('/search-blog', admin_controller_1.AdminController.searchBlog);
adminRoutes.get('/add-admin', admin_controller_1.AdminController.addAdminPage);
adminRoutes.post('/add-admin', admin_controller_1.AdminController.addAdmin);
exports.default = adminRoutes;
//# sourceMappingURL=admin.router.js.map