const knex  = require("../database/knex")
const AppError = require("../utils/AppError")
const { compare } = require("bcryptjs")
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")

class SessionsController {
    async create(request, response){
        const { email, password } = request.body;

        const user = await knex("users").where({email}).first();

        if(!user){
            throw new AppError("E-mail e/ou senha incorreta", 401)
        }

        const passwordMatched = await compare(password, user.password);

        if(!passwordMatched) {
            throw new AppError("E-mail e/ou senha incorreta", 401)
        }

        const { secret, expiresIn } = authConfig.jwt //pega os parametros do auth

        const token = sign({role: user.role}, secret, { //criando o token
            subject: String(user.id), //transformando o id em texto
            expiresIn
        })

        return response.json({user, token})
    }
}

module.exports = SessionsController;