import {Router} from 'express';
import auth from '../middleware/auth.js';
import { addToCartItemController, deleteCartItemController, getCartItemsController, updateCartItemsQtyController } from '../controllers/cart.controller.js';

const cartRouter = Router();

cartRouter.post('/create',auth,addToCartItemController)
cartRouter.get('/get',auth,getCartItemsController)
cartRouter.put('/update-quantity',auth,updateCartItemsQtyController)
cartRouter.delete('/delete',auth,deleteCartItemController)



export default cartRouter
