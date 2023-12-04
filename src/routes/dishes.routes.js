const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")


const DishesController = require("../controller/DishesController")
const UserImageController = require("../controller/UserImageController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const  dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const userImageController = new UserImageController();
const dishesController = new DishesController();

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post('/', dishesController.create)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.delete('/:id', dishesController.delete)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.patch("/image", upload.single('image'), userImageController.update)

module.exports = dishesRoutes;
