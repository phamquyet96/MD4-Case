
import authRoutes from "./auth.router";
import userRoutes from "./product.router";
import { jwtauth } from "../middleware/jwtauth";
// import { passport } from "../middleware/passport";

import adminRoutes from "./admin.router";

function route(app) {

    app.use("/auth", authRoutes);

    app.use(jwtauth);

    app.use("/user", userRoutes);

    // app.use(passport);

    app.use('/admin', adminRoutes);



}

export default route;