import { Router } from 'express';
import auth from "../middleware/auth.js";
import { createProductController, deleteProductController, getProductByCategory, getProductByCategoryAndSubCategory, getProductDetails, getProductsController, searchProductController, updateProductController } from '../controllers/product.controller.js';
import { admin } from '../middleware/Admin.js';

const productRouter = Router();

productRouter.post('/create',auth,admin,createProductController)
productRouter.post('/get',auth,getProductsController)
productRouter.post('/get-product-by-category',getProductByCategory)
productRouter.post('/get-product-by-category-and-subcategory',getProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)
productRouter.put('/update-product-details',auth,admin,updateProductController)
productRouter.delete('/delete-product',auth,admin,deleteProductController)
productRouter.post('/search-product',searchProductController)


export default productRouter;