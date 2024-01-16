
const knex = require("../database/knex");
const DiskStorage = require('../providers/DiskStorage')


class DishesController {
  async create(request, response) {
    const { name, description, ingredients, category, price } = request.body;
    //const { user_id } = request.params;
    const user_id = request.user.id;

    //const avatarFilename = request.file.filename;
    const { filename: avatarFilename } = request.file

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(avatarFilename)

    const [dish_id] = await knex("dishes").insert({
      // id: uuidv4(),
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

  //}else {
  //  console.error('Ingredients não é um array:', ingredients);
 // }

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
    let { search } = request.query // add ingredients
    if (search === undefined) {
      search = ''
    }

    const dishes = await knex
      .select('dishes.*')
      .from('dishes')
      .innerJoin('ingredients', 'dishes.id', '=', 'ingredients.dish_id')
      .whereLike('dishes.name', `%${search}%`)
      .orWhereLike('ingredients.title', `%${search}%`)
      .groupBy('dishes.name')

    return response.json(dishes)
  }

  async update(req, res) {
    const { name, category, price, description, ingredients, image } = req.body
    const { id } = req.params

    const dish = await knex('dishes').where({ id }).first()

    let filename = ''

    if (req.file && req.file.filename) {
      const imageFilename = req.file.filename
      const diskStorage = new DiskStorage()

      if (dish && dish.image) {
        await diskStorage.deleteFile(dish.image)
      }

      filename = await diskStorage.saveFile(imageFilename)
    }

    dish.image = filename ?? dish.image
    dish.name = name ?? dish.name
    dish.category = category ?? dish.category
    dish.price = price ?? dish.price
    dish.description = description ?? dish.description
    dish.image = image ?? dish.image

    await knex('dishes').where({ id }).update(dish)
    await knex('dishes').where({ id }).update('updated_at', knex.fn.now())

    const hasOnlyOneIngredient = typeof ingredients === 'string'

    let ingredientsUpdated

    if (hasOnlyOneIngredient) {
      ingredientsUpdated = {
        dishId: dish.id,
        title: ingredients,
      }
    } else if (ingredients.length >= 1) {
      ingredientsUpdated = ingredients.map((ingredient) => {
        return {
          dish_id: dish.id,
          title: ingredient,
        }
      })

      await knex('ingredients').where({ dish_id: id }).delete()
      await knex('ingredients').where({ dish_id: id }).insert(ingredientsUpdated)
    }

    return res.json()
  }
}

module.exports = DishesController;


// async index(request, response) {
//   const { name, ingredients } = request.query;

//   const user_id = request.user.id;
//   console.log(user_id)

//   let dishes;

//   if (ingredients) {
//     const filterIngredients = ingredients
//       .split(",")
//       .map((ingredient) => ingredient.trim());

//     dishes = await knex("ingredients")
//       .select("*")
//       .whereIn("title", filterIngredients)
//       .orderBy("ingredients.title")
//       .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
//       .select(["dishes.id","dishes.description", "dishes.price", "dishes.name", "dishes.user_id"])
//       .where("dishes.user_id", user_id) 
//       .whereLike("dishes.name", `%${name}%`)
//       .groupBy("dishes.id"); 
      
//   }else if(name){
//     dishes = await knex("dishes")
//     .where({user_id})
//     .andWhere({name})
//     .orderBy("name")
//   } else {
//     dishes = await knex("dishes")
//       .where({user_id})
//       .orderBy("name")
//       //.whereLike("name", `%${name}%`); //se qualquer parte da pesquisa bater entra aki
//       console.log("Entrou")
//     }
// console.log(dishes)
//   const userIngredients = await knex("ingredients").select("*");

//   const dishesWithIngredients = dishes.map((dish) => {
//     const dishesIngredients = userIngredients.filter(
//       (ingredient) => ingredient.dish_id === dish.id
//     );

//     return {
//       ...dish,
//       ingredients: dishesIngredients,
//     };
//   });

//   return response.json(dishesWithIngredients);
// }
// }