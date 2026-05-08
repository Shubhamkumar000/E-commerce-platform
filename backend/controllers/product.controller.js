import ProductModel from "../models/product.model.js";

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });
    const saveProdcut = await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      data: saveProdcut,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//product will be sent to Product Admin page
export const getProductsController = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query),
    ]);
    return res.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Category id is required",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.find({ category: { $in: id } }).limit(
      15
    );

    return res.json({
      message: "Category product list",
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategoryAndSubCategory = async (req, res) => {

  try {
    const { categoryId, subCategoryId, page, limit } = req.body;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Category id and SubCategory id are required",
        error: true,
        success: false,
      });
    }

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const query = {
      category: { $in: categoryId },
      subCategory : { $in: subCategoryId }
    };
    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product list",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const product = await ProductModel.findById(productId);

    return res.json({
      message: "Product details",
      data: product,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    });
  }
}

export const updateProductController = async (req, res) => {
  try {
    const {_id} = req.body

    if(!_id){
      return res.status(400).json({
        message : "Product id is required",
        error : true,
        success : false
      })
    }

    const updateProduct = await ProductModel.updateOne({_id : _id },{
      ...req.body
    })

    return res.json({
      message : "Product updated successfully",
      data : updateProduct,
      error : false,
      success : true
    })

  } catch (error) {
    return res.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}

export const deleteProductController = async (req, res) => {
  try {
    const { _id } = req.body;

    if(!_id){
      return res.status(400).json({
        message : "Product id is required",
        error : true,
        success : false
      })
    }

    const deleteProduct = await ProductModel.findByIdAndDelete(_id);

    if (!deleteProduct) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false
      });
    }

    return res.json({
      message: "Product deleted successfully",
      data: deleteProduct,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}

export const searchProductController = async (req, res) => {
  try {
    let { search, page, limit } = req.body;

    if(page){
      page = 1
    }

    if(!limit){
      limit = 10
    }

    const query = search ? {
      $text : {
        $search : search
      }
    } : {}

    const skip = (page - 1) * limit

    const [data,dataCount] = await Promise.all([
      ProductModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query)
    ])

    return res.status(200).json({
      message : "Product search result",
      data : data,
      totalCount : dataCount,
      totalPage : Math.ceil(dataCount / limit),
      page : page,
      limit : limit,
      error : false,
      success : true
    })

  } catch (error) {
    return res.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}