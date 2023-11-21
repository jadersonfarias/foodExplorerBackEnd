const knex = require("../database/knex");
const { v4: uuidv4 } = require("uuid");

class DishesController {
  async create(request, response) {
    const { name, description, ingredients, category, price } = request.body;
    const { user_id } = request.params;
    console.log({ user_id });

    const [dish_id] = await knex("dishes").insert({
      id: uuidv4(),
      name,
      description,
      category,
      price,
      user_id,
    }).returning("id");
    console.log({dish_id})

    const ingredientsInsert = ingredients.map((name) => {
      return {
        dish_id,
        name,
      };
    });

    console.log({ ingredientsInsert });

    await knex("ingredients").insert(ingredientsInsert);

    return response.json();
  }
}

module.exports = DishesController;
