const { Router } = require("express"); //reuni todas as notas

const usersRoutes = require("./users.routes");
const dishesRoutes = require("./dishes.routes")
const ingredientsRoutes = require("./ingredients.routes")

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/dishes", dishesRoutes);
routes.use("/ingredients", ingredientsRoutes);

module.exports = routes;
