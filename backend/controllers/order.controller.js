import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import CartProductModel from '../models/cartProduct.model.js';
import mongoose from "mongoose";
import Stripe from '../config/stripe.js';
import AddressModel from '../models/address.model.js';
import PDFDocument from 'pdfkit';

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

export const downloadReceipt = async (req, res) => {
    try {
        const userId = req.userId
        const { orderId } = req.params

        const order = await OrderModel.findOne({ _id: orderId, userId: userId })
            .populate('delivery_address')

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            })
        }

        const address = order.delivery_address || {}
        const addressLines = [
            address.address_line,
            address.city,
            address.state,
            address.country && address.pinCode ? `${address.country} - ${address.pinCode}` : address.country,
            address.mobile
        ].filter(Boolean)

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="receipt-${order.orderId}.pdf"`)

        const doc = new PDFDocument({ size: 'A4', margin: 40 })
        doc.pipe(res)

        const colorInk = '#0f172a'
        const colorMuted = '#64748b'
        const colorBorder = '#e2e8f0'
        const colorAccent = '#16a34a'
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

        const formatCurrency = (value) => `INR ${Number(value || 0).toFixed(2)}`
        const labelValueRow = (label, value, y) => {
            doc.fillColor(colorMuted).fontSize(10).text(label, doc.page.margins.left, y)
            doc.fillColor(colorInk).fontSize(10).text(value, doc.page.margins.left + 130, y)
        }

        doc.roundedRect(doc.page.margins.left, doc.page.margins.top, pageWidth, 120, 14)
            .fill('#f0fdf4')
        doc.fillColor(colorAccent)
            .fontSize(18)
            .text('Blinkit', doc.page.margins.left + 20, doc.page.margins.top + 18)
        doc.fillColor(colorInk)
            .fontSize(18)
            .text('Receipt', doc.page.margins.left + 90, doc.page.margins.top + 18)

        doc.fillColor(colorMuted)
            .fontSize(10)
            .text('Order confirmation', doc.page.margins.left + 20, doc.page.margins.top + 44)
            .text(`Order ID: ${order.orderId}`, doc.page.margins.left + 20, doc.page.margins.top + 62)
            .text(`Placed: ${new Date(order.createdAt).toLocaleString()}`, doc.page.margins.left + 20, doc.page.margins.top + 78)

        doc.fillColor('#ffffff')
            .roundedRect(doc.page.margins.left + pageWidth - 180, doc.page.margins.top + 30, 150, 30, 15)
            .fill()
        doc.fillColor(colorAccent)
            .fontSize(10)
            .text(order.payment_status || 'Pending', doc.page.margins.left + pageWidth - 170, doc.page.margins.top + 39, {
                width: 130,
                align: 'center'
            })

        const detailsTop = doc.page.margins.top + 150
        doc.roundedRect(doc.page.margins.left, detailsTop, pageWidth, 210, 14)
            .stroke(colorBorder)

        doc.fillColor(colorInk)
            .fontSize(12)
            .text('Order Summary', doc.page.margins.left + 20, detailsTop + 16)

        labelValueRow('Product', order.product_details?.name || 'Item', detailsTop + 44)
        labelValueRow('Subtotal', formatCurrency(order.subTotalAmt), detailsTop + 64)
        labelValueRow('Total', formatCurrency(order.totalAmt), detailsTop + 84)

        doc.moveTo(doc.page.margins.left + 20, detailsTop + 110)
            .lineTo(doc.page.margins.left + pageWidth - 20, detailsTop + 110)
            .stroke(colorBorder)

        doc.fillColor(colorInk)
            .fontSize(12)
            .text('Delivery Address', doc.page.margins.left + 20, detailsTop + 126)

        doc.fillColor(colorMuted)
            .fontSize(10)

        let addressY = detailsTop + 146
        addressLines.forEach((line) => {
            doc.text(line, doc.page.margins.left + 20, addressY)
            addressY += 14
        })

        const footerTop = detailsTop + 230
        doc.roundedRect(doc.page.margins.left, footerTop, pageWidth, 80, 14)
            .fill('#0f172a')
        doc.fillColor('#ffffff')
            .fontSize(11)
            .text('Thank you for shopping with Blinkit.', doc.page.margins.left + 20, footerTop + 18)
        doc.fillColor('#cbd5f5')
            .fontSize(9)
            .text('Need help? support@blinkit.example', doc.page.margins.left + 20, footerTop + 38)
            .text('This is a system generated receipt.', doc.page.margins.left + 20, footerTop + 54)

        doc.end()
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
