const { Router } = require("express"); //reuni todas as notas

const usersRoutes = require("./users.routes");

const routes = Router();

routes.use("/users", usersRoutes);

module.exports = routes;
