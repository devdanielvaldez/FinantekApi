import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import * as MySQLConnector from './api/utils/mysql.connector';
import compression from "compression";
import router from './routers/index.routers';
import cors from 'cors';
import pidusage from 'pidusage';
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

setInterval(() => {
    pidusage(process.pid, (err, stats) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Uso de CPU:', stats.cpu);
        console.log('Uso de memoria:', stats.memory);
    })
}, 1000);


// cron.schedule('*/30 * * * *', async () => {
//   console.log('Verificando pre-cierres...');

//   try {
//       // Obtener la fecha actual
//       const today = new Date();
//       const todayString = today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
//       const currentHour = today.getHours();

//       // Consulta para verificar si existe un pre-cierre con estado 'AC' en la fecha actual
//       const checkQuery = `
//           SELECT * FROM pre_cierres 
//           WHERE DATE(fecha) = ? AND estado = 'AC'
//       `;
//       const preCierres = await MySQLConnector.execute(checkQuery, [todayString]);

//       // Verificar si es hora de ejecutar el cierre y si hay pre-cierres en estado 'AC'
//       if (currentHour === 19 && preCierres.length > 0) {
//           console.log('Ejecutando Cierre');
//           cierreExecute();

//           // Actualizar el estado del pre-cierre a 'C'
//           const updateQuery = `
//               UPDATE pre_cierres
//               SET estado = 'C'
//               WHERE DATE(fecha) = ? AND estado = 'AC'
//           `;
//           await MySQLConnector.execute(updateQuery, [todayString]);
//       } else {
//           console.log('No se encontraron pre-cierres a cerrar o aún no es hora de ejecutar el cierre.');
//       }
//   } catch (err) {
//       console.error('Error al ejecutar el cron job:', err);
//   }
// });

app.get("/ping", async (_req, res) => {
  res.send({
    message: "hello",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});