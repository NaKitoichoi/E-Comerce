const Order = require('../models/order')
const Coupon = require('../models/coupon')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    // const {coupon} = req.body
    const { products, total, address , status} = req.body
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] })
    }
    const data = { products, total, postedBy: _id }
    if(status) data.status = status
    const rs = await Order.create(data)
    return res.status(200).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong',
    })
})
const updateOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.json({
        success: response ? true : false,
        response: response ? response : 'Some thing went wrong'
    })
})
const getUserOrder = asyncHandler(async (req, res) => {
   const queries = { ...req.query }
       const { _id } = req.user
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    // let colorQueryObject = {}
    // if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    // if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' }
    // if (queries?.color) {
    //     delete formatedQueries.color
    //     const colorArray = queries.color?.split(',')
    //     const colorQuery = colorArray.map(el => ({ color: { $regex: el, $options: 'i' } }))
    //     colorQueryObject = { $or: colorQuery }
    // }
    // let querryObject = {}
    // if (queries?.q) {
    //     delete formatedQueries.q
    //     querryObject = {
    //         $or: [
    //             { title: { $regex: queries.q, $options: 'i' } },
    //             { color: { $regex: queries.q, $options: 'i' } },
    //             { category: { $regex: queries.q, $options: 'i' } },
    //             { brand: { $regex: queries.q, $options: 'i' } },
    //             // { description: { $regex: queries.q, $options: 'i' } },
    //         ]
    //     }
    // }

    const querry = {...formatedQueries, postedBy:_id }
    let queryCommand = Order.find(querry)

    //Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(` `)
        queryCommand = queryCommand.sort(sortBy)
    }
    //Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(` `)
        queryCommand = queryCommand.select(fields)
    }
    //Pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    queryCommand.exec()
        .then(async (response) => {
            const counts = await Order.find(querry).countDocuments();
            res.status(200).json({
                success: response ? true : false,
                counts,
                product: response || 'Cannot get products',
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
})
const getOrders = asyncHandler(async (req, res) => {
   const queries = { ...req.query }
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    // let colorQueryObject = {}
    // if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    // if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' }
    // if (queries?.color) {
    //     delete formatedQueries.color
    //     const colorArray = queries.color?.split(',')
    //     const colorQuery = colorArray.map(el => ({ color: { $regex: el, $options: 'i' } }))
    //     colorQueryObject = { $or: colorQuery }
    // }
    // let querryObject = {}
    // if (queries?.q) {
    //     delete formatedQueries.q
    //     querryObject = {
    //         $or: [
    //             { title: { $regex: queries.q, $options: 'i' } },
    //             { color: { $regex: queries.q, $options: 'i' } },
    //             { category: { $regex: queries.q, $options: 'i' } },
    //             { brand: { $regex: queries.q, $options: 'i' } },
    //             // { description: { $regex: queries.q, $options: 'i' } },
    //         ]
    //     }
    // }

    const querry = {...formatedQueries }
    let queryCommand = Order.find(querry)

    //Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(` `)
        queryCommand = queryCommand.sort(sortBy)
    }
    //Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(` `)
        queryCommand = queryCommand.select(fields)
    }
    //Pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    queryCommand.exec()
        .then(async (response) => {
            const counts = await Order.find(querry).countDocuments();
            res.status(200).json({
                success: response ? true : false,
                counts,
                product: response || 'Cannot get products',
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
})
module.exports = {
    createOrder,
    updateOrder,
    getUserOrder,
    getOrders
}