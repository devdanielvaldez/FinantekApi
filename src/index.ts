import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import * as MySQLConnector from './api/utils/mysql.connector';
import compression from "compression";
import router from './routers/index.routers';
import cors from 'cors';
const PORT = process.env.PORT || 8300;

const app: Application = express();

MySQLConnector.init();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use('/api', router);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.get("/ping", async (_req, res) => {
  res.send({
    message: "hello",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});