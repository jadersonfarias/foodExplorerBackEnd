class AppError {
  message;
  statusCode;

  constructor(message, statusCode = 400) {
    //o construtor é utilizado assim que a classe for usada e vai receber message e statuscode e caso não for imformado 400
    this.message = message; // repassa para o contexto global da class
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
