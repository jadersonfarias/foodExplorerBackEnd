const  DiskStorage  = require("../providers/DiskStorage");
const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class UserImageController {
    async update(request, response){
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const dish = await knex("dishes")
        .where({ id:user_id }).first()

        if(!dish) {
            throw new AppError("somente usuários autenticados podem mudar a image do prato")
        }

        if(dish.image){
            await diskStorage.deleteFile(dish.image)
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        dish.image = filename;

        await knex("dishes").update(dish).where({ id: user_id})

        return response.json(dish)
    }
    
}

module.exports = UserImageController