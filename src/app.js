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

//importamos el nuevo router de mocks
//import mocksRouter from './routes/mocks.router.js';
const app = express();
const PORT = process.env.PORT||3000;
const connection = mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))

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
            description: "app para encontrar dueño alos perritos y gatitos"

        }
    },
    apis: [ "./src/docs/**/*.yaml"]    
}

//3) conectamos swagger a nuestro sv de express

const specs = swaggerJSDoc(swaggerOption);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//TESTING DE INTEnacion

//supertest: es una libreria que me permite realizar puruebas de integracion con diferentes peticiones http

//instalamos supertest: npm i supertest -D

