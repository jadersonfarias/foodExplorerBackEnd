require("express-async-errors"); //sempre no começo
require("dotenv/config");

const express = require("express");

const uploadConfig = require("./configs/upload");
const AppError = require("./utils/AppError");
const routes = require("./routes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
  //serve para habilitar o tratamento de errors
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      // lado do cliente
      status: "error",
      message: error.message,
    });
  }

  console.error(error); //caso for preciso fazer debug

  return response.status(500).json({
    //lado do servidor
    status: "error",
    message: "internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
