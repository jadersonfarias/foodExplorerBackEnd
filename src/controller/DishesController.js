const { request, response } = require("express");
const knex = require("../database/knex");
const { v4: uuidv4 } = require("uuid");

class DishesController {
  async create(request, response) {
    const { name, description, ingredients, category, price } = request.body;
    const { user_id } = request.params;
    console.log({ user_id });

    const [dish_id] = await knex("dishes").insert({
      // id: uuidv4(),
      name,
      description,
      category,
      price,
      user_id,
    });
    console.log({ dish_id });

    const ingredientsInsert = ingredients.map((name) => {
      return {
        dish_id,
        name,
        user_id,
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
      .orderBy("name"); //orderby organiza por ordem alfabetica
    console.log({ dishes });
    console.log({ ingredients });
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
    const { user_id, name, ingredients } = request.query;

    let dishes;

    if (ingredients) {
      const filterdishes = ingredients
        .split(",")
        .map((ingredients) => ingredients.trim());
      
  console.log(filterdishes)
      dishes = await knex("ingredients")
      .whereIn("name", filterdishes);
    } else {
      dishes = await knex("dishes")
        .where({ user_id })
        .orderBy("name")
        .whereLike("name", `%${name}%`); //se qualquer parte da pesquisa bater entra aki
    }

    return response.json(dishes);
  }
}

module.exports = DishesController;
