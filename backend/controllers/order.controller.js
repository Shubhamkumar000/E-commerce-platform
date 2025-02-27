import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import CartProductModel from '../models/cartproduct.model.js';
import mongoose from "mongoose";
import Stripe from '../config/stripe.js';
import AddressModel from '../models/address.model.js';

export const CashOnDeliveryOrderController = async (req, res) => {
    try {
        const userId = req.userId 
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body 

        const addressExists = await AddressModel.findById(addressId);
        if (!addressExists) {
            return res.status(400).json({
                message: "Invalid Address ID",
                error: true,
                success: false
            });
        }
        
        const payload = list_items.map(el => {
            return({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : el.productId._id, 
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image
                } ,
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId ,
                subTotalAmt  : subTotalAmt,
                totalAmt  :  totalAmt,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        const removeCartItems = await CartProductModel.deleteMany({userId : userId})
        const updateInUser = await UserModel.updateOne({_id : userId},{ shopping_cart : []})


        return res.status(200).json({
            message : "Order Placed Successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export const paymentController = async (req, res) => {
    try {
        const userId = req.userId 
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`,
        }

        const session = await Stripe.checkout.sessions.create(params)

        return res.status(200).json(session)

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const webhookStripe = async (req, res) => {
    
    const event = req.body;
    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_KEY;

    switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
          const userId = session.metadata.userId
          const orderProduct = await getOrderProductItems(
            {
                lineItems : lineItems,
                userId : userId,
                addressId : session.metadata.addressId,
                paymentId  : session.payment_intent,
                payment_status : session.payment_status,
            })
        
          const order = await OrderModel.insertMany(orderProduct)
    
            console.log(order)
            if(Boolean(order[0])){
                const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                    shopping_cart : []
                })
                const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
            }
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    
      // Return a response to acknowledge receipt of the event
      res.json({received: true});
}

const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            const paylod = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : product.metadata.productId, 
                product_details : {
                    name : product.name,
                    image : product.images
                } ,
                paymentId : paymentId,
                payment_status : payment_status,
                delivery_address : addressId,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
            }

            productList.push(paylod)
        }
    }

    return productList
}

export const getOrderDetails = async (req, res) => {
    try {
        const userId = req.userId

        const orderList = await OrderModel.find({userId : userId}).sort({createdAt : -1}).populate('delivery_address')

        return res.status(200).json({
            message : "Order List",
            error : false,
            success : true,
            data : orderList
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
