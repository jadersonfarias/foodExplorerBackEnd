const { Router } = require("express"); //reuni todas as notas

const usersRoutes = require("./users.routes");
const usersController = require("./dishes.routes")

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/dishes", usersController);

module.exports = routes;
