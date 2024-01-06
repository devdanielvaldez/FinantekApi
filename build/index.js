"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const MySQLConnector = __importStar(require("./api/utils/mysql.connector"));
const compression_1 = __importDefault(require("compression"));
const index_routers_1 = __importDefault(require("./routers/index.routers"));
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT || 8300;
const app = (0, express_1.default)();
MySQLConnector.init();
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.static("public"));
app.use('/api', index_routers_1.default);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, {
    swaggerOptions: {
        url: "/swagger.json",
    },
}));
// setInterval(() => {
//     pidusage(process.pid, (err, stats) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log('Uso de CPU:', stats.cpu);
//         console.log('Uso de memoria:', stats.memory);
//     })
// }, 1000);
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
app.get("/ping", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        message: "hello",
    });
}));
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
