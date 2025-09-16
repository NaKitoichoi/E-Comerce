const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async(req,res) => {
    const { title, description, category } = req.body
    if(!title || !description || !category) throw new Error('Missing inputs')
    const blog = await Blog.create(req.body)
    return res.json({
        success : blog ? true : false,
        createdBlog : blog ? blog : 'Cannot create new blog '
    })
})
const updateBlog = asyncHandler(async(req,res) => {
    const { bid } = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const blog = await Blog.findByIdAndUpdate(bid, req.body, {new:true})
    return res.json({
        success : blog ? true : false,
        updatedBlog : blog ? blog : 'Cannot update blog '
    })
})
const getBlogs = asyncHandler(async(req,res) => {
    const blog = await Blog.find()
    return res.json({
        success : blog ? true : false,
        blos : blog ? blog : 'Cannot get blog '
    })
})
const likeBlog = asyncHandler(async(req,res) => {
    const { _id } = req.user
    const { bid } = req.body
    const blog = await Blog.findById(bid)
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id}}, {new:true})
        return res.json({
            success : blog ? true : false,
            rs : blog 
        })
    }
    const isLiked = blog?.likes?.find(el => el.toString() === _id)
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}}, {new:true})
        return res.json({
            success : blog ? true : false,
            rs : blog 
        })
    } else {
        const blog = await Blog.findByIdAndUpdate(bid, {$push: {likes: _id}}, {new:true})
        return res.json({
            success : blog ? true : false,
            rs : blog 
        })
    }
})
const dislikeBlog = asyncHandler(async(req,res) => {
    const { _id } = req.user
    const { bid } = req.body
    if(!bid) throw new Error('Missing inputs')
    const blog = await Blog.findById(bid)
    const alreadyLiked = blog?.likes?.find(el => el.toString() === _id)
    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}}, {new:true})
        return res.json({
            success : blog ? true : false,
            rs : blog 
        })
    }
    const isDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if(isDisliked){
        const blog = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id}}, {new:true})
        return res.json({
            success : blog ? true : false,
            rs : blog 
        })
    } else {
        const blog = await Blog.findByIdAndUpdate(bid, {$push: {dislikes: _id}}, {new:true})
        return res.json({
            success : blog ? true : false,
            rs : blog 
        })
    }
})
const getBlog = asyncHandler(async(req,res) => {
    const {bid} = req.params
    const blog = await Blog.findByIdAndUpdate(bid, {$inc: {numberViews: 1}}, {new:true})
    .populate('likes', 'firstname lastname')
    .populate('dislikes', 'firstname lastname')
    return res.json({
        success : blog ? true : false,
        rs : blog 
    })
})
const deleteBlog = asyncHandler(async(req,res) => {
    const {bid} = req.params
    const blog = await Blog.findByIdAndDelete(bid)
    return res.json({
        success : blog ? true : false,
        deletedBlog : blog || 'Something went wrong!!!'
    })
})
const uploadImagesBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    if(!req.file) throw new Error('Missing inputs')
    const response = await Blog.findByIdAndUpdate(bid, {image : req.file.path}, {new:true})
    return res.status(200).json({
        success: response ? true : false,
        uploadedBlog: response ? response : 'Cannot upload image'
    })
})
module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog,
    uploadImagesBlog
}