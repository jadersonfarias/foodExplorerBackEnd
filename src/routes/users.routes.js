const { Router,  } = require("express");

const UsersController = require("../controller/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post("/", usersController.create); //cria usuário
usersRoutes.put("/",ensureAuthenticated, usersController.update); //atualiza usuário

module.exports = usersRoutes;
