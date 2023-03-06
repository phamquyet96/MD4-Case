export declare class AdminController {
    static showListUserPage(arg0: string, showListUserPage: any): void;
    static showListBlog(arg0: string, showListBlog: any): void;
    static deleteBlog(arg0: string, deleteBlog: any): void;
    static searchBlog(arg0: string, searchBlog: any): void;
    static showHomePage(req: any, res: any): void;
    static showListUserModelPage(req: any, res: any): Promise<void>;
    static deleteUser(req: any, res: any): Promise<void>;
    static lockUser(req: any, res: any): Promise<void>;
    static searchUser(req: any, res: any): Promise<void>;
    static showListAccount(req: any, res: any): Promise<void>;
    static deleteAccount(req: any, res: any): Promise<void>;
    static searchAccount(req: any, res: any): Promise<void>;
    static addAdminPage(req: any, res: any): Promise<void>;
    static addAdmin(req: any, res: any): Promise<void>;
}
