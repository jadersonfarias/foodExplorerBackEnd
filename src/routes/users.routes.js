const { Router,  } = require("express");

const UsersController = require("../controller/UsersController");

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post("/", usersController.create); //cria usuário
usersRoutes.put("/:id", usersController.update); //atualiza usuário

module.exports = usersRoutes;
