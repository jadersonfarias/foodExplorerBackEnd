const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")


const DishesController = require("../controller/DishesController")
const UserImageController = require("../controller/UserImageController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const userImageController = new UserImageController();
const dishesController = new DishesController();
//dishesRoutes.use(verifyUserAuthorization("admin")) todas as rotas daqui

dishesRoutes.use(ensureAuthenticated)


dishesRoutes.post('/', verifyUserAuthorization(["admin"]), upload.single('image'), dishesController.create)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.delete('/:id',verifyUserAuthorization(["admin"]), dishesController.delete)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.patch("/image",verifyUserAuthorization(["admin"]), upload.single('image'), userImageController.update)

dishesRoutes.put(
    '/:id',
    upload.single('image'),
    dishesController.update,
  )

module.exports = dishesRoutes;
