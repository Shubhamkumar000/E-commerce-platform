import {Router} from 'express'
import { CashOnDeliveryOrderController, downloadReceipt, getOrderDetails, paymentController, webhookStripe } from '../controllers/order.controller.js'
import auth from "../middleware/auth.js";

const orderRouter = Router()

orderRouter.post('/cash-on-delivery',auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get('/order-list',auth,getOrderDetails)
orderRouter.get('/receipt/:orderId',auth,downloadReceipt)


export default orderRouter