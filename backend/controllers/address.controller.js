import AddressModel from '../models/address.model.js'
import UserModel from '../models/user.model.js'

export const addAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { address_line, city, state, pinCode, country, mobile } = req.body;
        
        const createAddress = new AddressModel({
            address_line,
            city,
            state,
            pinCode,
            country,
            mobile,
            userId : userId
        })

        const saveAddress = await createAddress.save();

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
            $push : {
                address_details : saveAddress._id
            }
        });

        return res.status(200).json({
            message : "Address added successfully",
            success : true,
            error : false,
            data : saveAddress
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId;

        const data = await AddressModel.find({ userId : userId }).sort({ createdAt : -1 });

        return res.status(200).json({
            message : "Address fetched successfully",
            success : true,
            error : false,
            data : data
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        
        const { _id, address_line, city, state, pinCode, country, mobile } = req.body;

        const updateAddress = await AddressModel.updateOne({ _id : _id, userId : userId},{
            address_line,
            city,
            state,
            pinCode,
            country,
            mobile,
        })

        return res.status(200).json({
            message : "Address updated successfully",
            success : true,
            error : false,
            data : updateAddress
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        const disableAddress = await AddressModel.updateOne({ _id : _id, userId : userId },{
            status : false
        });

        return res.status(200).json({
            message : "Address removed successfully",
            success : true,
            error : false,
            data : disableAddress
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}