const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError")

class DishesController {
  async create(request, response) {
    const { name, description, ingredients, category, price } = request.body;
    //const { user_id } = request.params;
    const user_id = request.user.id;
    
    if(isNaN(price)){
      throw new AppError("Não é um número ", 400)
  }

    //const avatarFilename = request.file.filename;
    const { filename: avatarFilename } = request.file;

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(avatarFilename);
  
    const [dish_id] = await knex("dishes").insert({
      image: filename,
      name,
      description,
      category,
      price,
      user_id,
    });
    //if (ingredients && Array.isArray(ingredients)) {
    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        dish_id,
        title: ingredient,
      };
    });



    await knex("ingredients").insert(ingredientsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const dishes = await knex("dishes").where({ id }).first(); //pega o prato pelo id e sempre um
    const ingredients = await knex("ingredients")
      .where({ dish_id: id })
      .orderBy("title"); //orderby organiza por ordem alfabetica

    return response.json({
      ...dishes,
      ingredients,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    let { search } = request.query; // add ingredients
    if (search === undefined) {
      search = "";
    }

    const dishes = await knex
      .select("dishes.*")
      .from("dishes")
      .innerJoin("ingredients", "dishes.id", "=", "ingredients.dish_id")
      .whereLike("dishes.name", `%${search}%`)
      .orWhereLike("ingredients.title", `%${search}%`)
      .groupBy("dishes.name");

    return response.json(dishes);
  }

  async update(request, response) {
    const { name, category, price, description, ingredients, image } = request.body;
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();

    // Lógica para atualizar a imagem do prato, se fornecida
    let filename = "";

    if (request.file && request.file.filename) {
      const imageFilename = request.file.filename;
      const diskStorage = new DiskStorage();

      if (dish && dish.image) {
        await diskStorage.deleteFile(dish.image);
      }

      filename = await diskStorage.saveFile(imageFilename);
    }

    dish.image = filename ?? dish.image;
    dish.name = name ?? dish.name;
    dish.category = category ?? dish.category;
    dish.price = price ?? dish.price;
    dish.description = description ?? dish.description;
    dish.image = image ?? dish.image;

    // Atualizando o prato no banco de dados
    await knex("dishes").where({ id }).update(dish);
    await knex("dishes").where({ id }).update("updated_at", knex.fn.now());

    const hasOnlyOneIngredient = typeof ingredients === "string";

    // Lógica para criar um objeto com o ingrediente, se for o caso
    let ingredientsUpdated;

    if (hasOnlyOneIngredient) {
      ingredientsUpdated = {
        dishId: dish.id,
        title: ingredients,
      };
    } else if (ingredients.length >= 1) { // Lógica para atualizar a lista de ingredientes no banco de dados
      ingredientsUpdated = ingredients.map((ingredient) => {
        return {
          dish_id: dish.id,
          title: ingredient,
        };
      });

      await knex("ingredients").where({ dish_id: id }).delete();
      await knex("ingredients")
        .where({ dish_d: id })
        .insert(ingredientsUpdated);
    }

    return response.json();
  }
}

module.exports = DishesController;

