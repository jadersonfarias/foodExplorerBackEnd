const { request, response } = require("express");
const knex = require("../database/knex");
const { v4: uuidv4 } = require("uuid");


class DishesController {
  async create(request, response) {
    const { name, title, description, ingredients, category, price } = request.body;
    const { user_id } = request.params;

    const [dish_id] = await knex("dishes").insert({
      // id: uuidv4(),
      name,
      description,
      category,
      price,
      user_id,
    });


    const ingredientsInsert = ingredients.map((title) => {
      return {
        dish_id,
        title,
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
    const { name, user_id, ingredients } = request.query;

    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients
        .split(",")
        .map((ingredient) => ingredient.trim());

      dishes = await knex("ingredients")
        .select(["dishes.id", "dishes.name", "dishes.user_id"])
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        .where("dishes.user_id", user_id) //tags que seja do id do user
        .whereLike("dishes.name", `%${name}%`)
        .whereIn("title", filterIngredients)
        .orderBy("ingredients.title")
        .groupBy("dishes.id");
    } else {
      dishes = await knex("dishes")
        .where({ user_id })
        .orderBy("name")
        .whereLike("name", `%${name}%`); //se qualquer parte da pesquisa bater entra aki
    }

    const userIngredients = await knex("ingredients").where({ user_id });

    const dishesWithIngredients = dishes.map((dish) => {
      const dishesIngredients = userIngredients.filter(
        (ingredient) => ingredient.dish_id === dish.id
      );

      return {
        ...dish,
        ingredients: dishesIngredients,
      };
    });

    return response.json(dishesWithIngredients);
  }
}

module.exports = DishesController;
