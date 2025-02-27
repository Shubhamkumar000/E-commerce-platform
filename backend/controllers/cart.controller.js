import CartProductModel from '../models/cartProduct.model.js';
import UserModel from '../models/user.model.js';

export const addToCartItemController = async (req, res) => {
    try {
        const userId = req.userId;
        const {productId} = req.body;

        if(!productId) {
            return res.status(400).json({
                message : "Product id is required",
                error : true,
                success : false
            })
        }

        const checkItemCart = await CartProductModel.findOne({userId : userId, productId : productId});

        if(checkItemCart) {
            return res.status(400).json({
                message : "Product already in cart",
                error : true,
                success : false
            })
        }


        const cartItem = new CartProductModel({
            quantity : 1,
            userId : userId,
            productId : productId
        })

        const save = await cartItem.save();

        const updateCartUser = await UserModel.updateOne({_id : userId}, {
            $push : {
                shopping_cart : productId
            }
        })

        return res.status(201).json({
            message : "Product added to cart",
            data : cartItem,
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
    }
}

export const getCartItemsController = async (req, res) => {
    try {
        const userId = req.userId;

        const cartItem = await CartProductModel.find({userId : userId}).populate('productId');

        return res.status(200).json({
            message : "Cart items",
            data : cartItem,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateCartItemsQtyController = async (req, res) => {
    try {
        const userId = req.userId;
        const {_id, quantity} = req.body;

        if(!_id || !quantity) {
            return res.status(400).json({
                message : "Product id and quantity is required",
                error : true,
                success : false
            })
        }

        const updateQty = await CartProductModel.updateOne({_id : _id, userId : userId}, {
            quantity : quantity
        })

        return res.status(200).json({
            message : "Cart item updated",
            error : false,
            success : true,
            data : updateQty
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCartItemController = async (req, res) => {
    try {
        const {_id} = req.body;
        const userId = req.userId;

        if(!_id) {
            return res.status(400).json({
                message : "Product id is required",
                error : true,
                success : false
            })
        }

        const deleteItem = await CartProductModel.deleteOne({_id : _id, userId : userId});

        return res.status(200).json({
            message : "Cart item deleted",
            error : false,
            success : true,
            data : deleteItem
        })

        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
        
    }
}