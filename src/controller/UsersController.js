const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { v4: uuidv4 } = require("uuid");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex("users").where({ email }); //database.get("SELECT * FROM users WHERE email = (?)", [email]) //seleciona toda a tabela depois pega a coluna email e coloca dentro de um vetor os email

    if (checkUserExists.length > 0) {
      throw new AppError("este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    if (email) {
      const userWithUpdatedEmail = await knex("users").where({ email }).first();
      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
        throw new AppError("este e-mail já está  em uso");
      }
    }

    user.email = email ?? user.email;
    user.name = name ?? user.name;

    if (password && !old_password) {
      throw new AppError(
        "você precisa informar a senha antiga para definir a nova senha"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await knex("users").where({ id }).update(user);

    return response.json();
  }
}

module.exports = UsersController;
