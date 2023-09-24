import path from 'path';
import express from "express";
import __dirname from "./utils.js";
import productRouter from "./routes/productRouter.js";
import carRouter from "./routes/carRouter.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";

const PORT = 8080;

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'./views'));


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));

app.use('/',productRouter);
app.use('/api/carts/',carRouter);

const serverExpress=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const serverSocket= new Server(serverExpress);




serverSocket.on('connection',socket=>{
    socket.emit('bienvenida',{message:'Bienvenido al server...!!!'});
    // socket.emit('realTimeProducts', {message:'estos son nuestros productos'})
    
    socket.on('identificacion', nombre=>{
        socket.emit('idCorrecto',{message:`Hola ${nombre}, Bienvenido!!!`})

        socket.broadcast.emit('nuevoUsuario', nombre)
    })


})
export const server= serverSocket
