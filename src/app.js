import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mock.router.js';
import dotenv from 'dotenv';
//import configObject from "./config/config.js";
//const {MONGO_URL, PORT} = configObject; 
mongoose.set('strictQuery', true);


/*dotenv.config({
    path: mode === "desarrollo" ? "./.env.desarrollo" : "./.env.produccion"
});
console.log("MONGO_URL desde config.js:", process.env.MONGO_URL);

*/

//si no estoy trabajando con distintos entornos de desarrollo, solo debo poner el path de .env.desarrollo



// Configuración de Express y Mongoose
const app = express();
const PORT =  3030;

if (process.env.NODE_ENV !== 'test') {
// Solo en producción o desarrollo, no en pruebas
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

}
dotenv.config({
  mode : process.env.NODE_ENV,
  
  path: './.env.desarrollo'? "./.env.desarrollo" : "./.env.produccion"
  
});



mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Conectado a la base de datos');
  })
  .catch((error) => {
    console.error('Error de conexión:', error);
  });

console.log("MONGO_URL:", process.env.MONGO_URL);
console.log("PORT:", process.env.PORT);

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);



//SWAGGER: libreria que me permite documentar la app
//SWAGGERjsdoc: nos deja escribir la config de un archivo .yaml tambien json y genera un apidoc

//SWAGGER-ui-express: nos permite linkear una interfaz grafica pàra poder visualizar la documentacion

//1) importamos 
//2) creamos un objeto de configuracion: swaggeroption

const swaggerOption ={
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Platilla de documentación",
            description: "app para encontrar dueño alos perritos y gatitos",
            version: "1.0.0"

        }
    },
    apis: [ "./src/docs/**/*.yaml"]    
}

//3) conectamos swagger a nuestro sv de express

console.log("Swagger Options:", swaggerOption);

const specs = swaggerJSDoc(swaggerOption);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//TESTING DE INTEgracion

//supertest: es una libreria que me permite realizar puruebas de integracion con diferentes peticiones http

//instalamos supertest: npm i supertest -D


export default app