const AppError = require("../utils/AppError")

//roletoverify = admin ou customer

//['admin', 'customer', 'sale'].includes('sale')

function verifyUserAuthorization(roleToVerify){
    return (request, response, next) => {
        const { role } = request.user

        if (!roleToVerify.includes(role)){   //role !== roleToVerify quando for só uma pode ser assim
            throw new AppError("Unauthorized", 401);
        }

        return next();

    }
}

module.exports = verifyUserAuthorization;