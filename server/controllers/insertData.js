const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const data = require('../../data/products_formatted_100.json')
const dataCate = require('../../data/data2.js')
const slugify = require('slugify')
const ProductCategory = require('../models/productCategory.js')

const fn = async (product) => {
    await Product.create({
        category: product?.category + '-' + Math.round(Math.random() * 1000),
        title: product?.name,
        slug: slugify(product?.name) + '-' + Math.round(Math.random() * 1000),
        description: product?.description,
        brand: product?.brand,
        price: product?.price,
        quantity: product?.quantity,
        sold: product?.sold,
        reviews: product?.reviews,
        images: product?.images,
        thumb: product?.thumb,
        variants: product?.variants,
        sku: product?.sku,
        informations: product?.informations,
        totalRatings: 0,
    })
}
const insertProduct = asyncHandler(async (req, res) => {
    const promises = []
    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.json('Done')
})
const fn2 = async (cate) => {
    await ProductCategory.create({
        title: cate?.cate,
        brand: cate?.brand,
        image: cate?.image,
    })
}
const insertCategory = asyncHandler(async (req, res) => {
    const promises = []
    for (let cate of dataCate) promises.push(fn2(cate))
    await Promise.all(promises)
    return res.json('Xong')
})


module.exports = {
    insertProduct,
    insertCategory,
}