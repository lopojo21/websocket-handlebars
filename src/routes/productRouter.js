// en consola npm init -y
//NPM install -g nodemon
//npm install express
import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import {server} from "../app.js";

const pManager = new ProductManager();
const productRouter = Router();
const products = [];

productRouter.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('realTimeProducts');
})

productRouter.get('/realTimeProducts',async(req,res)=>{
    const productos = await pManager.getProducts()
        
    res.setHeader('Content-Type','application/json');
    return res.status(201).json(productos);
});

productRouter.post('/products', async (req,res)=>{
    const producto= req.body;
    let productos = await pManager.addProducts(producto);
    //user.push(req.body) 
    server.emit('newProduct',producto,productos);
    return res.status(200).send({status:'success', message:'Product created'});
});
// productRouter.post('/products', async (req,res)=>{
//     const producto= req.body;
//     const productos = await pManager.getProducts();
    
//     socket.emit('newProduct',producto,productos); 
//     return res.status(201).render('realTimeProducts');
// });



productRouter.get('/products', async(req,res) => {
        const productos = await pManager.getProducts()
        const limit = req.query.limit;
        const limite = productos.length;
    
    //http://localhost:8080/?limit=10
    //http://localhost:8080/?limit=3
        
        if(limit < limite && limit != 0  ){
            return res.status(200).send(productos.slice(0,limit));   
        }
        else{       
            // console.log("ELSE") testing
            return res.status(200).send(productos);   
        };
    });
productRouter.get('/products:pid', async (req,res) => {
        
        const productoID = await pManager.getProductByID(parseInt(req.params.pid));
        
    return res.status(200).send(productoID);  
    });

productRouter.put('/products:pid', async (req,res)=>{
    const producto= req.body;
    const id= parseInt(req.params.pid);
    
    const mProduct = await pManager.updateProduct(id,producto);

    if (mProduct instanceof Error){return res
        .status(400)
        .send({status :"error" , menssage : `${mProduct.menssage}`});
    } else{
        return res
        .status(201)
        .send({status:"success", message: "Product update"});
    }
});
    


productRouter.delete('/products:pid', async (req,res)=>{
    const id= parseInt(req.params.pid);  
    await pManager.deleteProduct(id);
return res.status(200).send({status:'success', message:'Product DELETED'});
    }
    
);


export default productRouter;