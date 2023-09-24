import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import carManager from "../managers/carManager.js";

const pManager = new ProductManager();
const cManager = new carManager();
const carRouter = Router();
const products = [];




carRouter.get('/:cid', async (req,res)=>{
    const idCar =+req.params.cid
    const car= await cManager.getProductByID(idCar);
    
    if (car instanceof Error){return res
        .status(400)
        .send({status :"error" , menssage : `${car.menssage}`});
    } else{
        return res
        .status(201)
        .send(car)
        
    }

});

carRouter.post('/products/:pid', async (req,res)=>{
    
    const idProd=+req.params.pid;
    const idCar =+req.params.cid

    const {id}= await pManager.getProductByID(idProd);
    
    const mProduct = await cManager.addCar(idCar,id);

    if (mProduct instanceof Error){return res
        .status(400)
        .send({status :"error" , menssage : `${mProduct.menssage}`});
    } else{
        return res
        .status(201)
        .send({status:"success", message: `Product added to car`});
    }
});

carRouter.post('/:cid/products/:pid', async (req,res)=>{
    
    const idProd=+req.params.pid;
    const idCar =+req.params.cid

    const {id}= await pManager.getProductByID(idProd);
    console.log(idProd)
    const mProduct = await cManager.updateProduct(idCar,id);

    if (mProduct instanceof Error){return res
        .status(400)
        .send({status :"error" , menssage : `${mProduct.menssage}`});
    } else{
        return res
        .status(201)
        .send(mProduct);
        
    }
});


carRouter.delete('/product/:pid', async (req,res)=>{
    const id= parseInt(req.params.pid);  
    await cManager.deleteProduct(id);
return res.status(200).send({status:'success', message:'Product DELETED'});
    }
    
);
export default carRouter;