const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const sendMail = require('../ultils/sendMail')
const makeToken = require('uniqid')


const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !firstname || !lastname || !mobile)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    const user = await User.findOne({ email })
    if (user) throw new Error('User has existed!')
    else {
        const token = makeToken()
        const emailedited = btoa(email) + '@' + token
        const newUser = await User.create({
            email: emailedited, password, firstname, lastname, mobile
        })
        if (newUser) {
            const html = `<h2>The code: </h2><blockquote>${token}</blockquote>`
            await sendMail({ email, html, subject: 'Comfirm to finish' })
        }
        setTimeout(async () => {
            await User.deleteOne({ email: emailedited })
        }, [300000])
        return res.json({
            success: newUser ? true : false,
            mes: newUser ? 'Please check your email' : 'Something went wrong',
        })
    }
})
const finalRegister = asyncHandler(async (req, res) => {
    const { token } = req.params
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })
    if (notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
        notActivedEmail.save()
    }
    return res.json({
        success: notActivedEmail ? true : false,
        mes: notActivedEmail ? 'Register success. Please Login' : 'Something went wrong',
    })
})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing '
        })
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, refreshToken, ...userData } = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        const newRefreshToken = generateRefreshToken(response._id)
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalidls credentia!')
    }
})
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password')
    .populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price'
        }
    })
    .populate('wishlist','title thumb price color')
    return res.status(200).json({
        success: true,
        rs: user ? user : 'user not found'
    })
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? generateAccessToken(response._id, response.role) : 'Refresh Token not Matched'
    })
})
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    res.clearCookie('refreshToken', { httpOnly: true, secure: true })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email !')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()
    const html = `bam vao link de thay doi mat khau , lick se het han sau 15p, ke tu bay gio. 
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}> Click here </a>`
    const data = {
        email,
        html,
        subject: 'Forgot Password',
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'hãy kiểm tra email của bạn !!' : 'gửi email thất bại'
    })
})
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangeAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})
const getUsers = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' }
    if (req.query.q) {
        delete formatedQueries.q
        formatedQueries['$or'] = [
            { firstname: { $regex: req.query.q, $options: 'i' } },
            { lastname: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } },
        ]
    }

    let queryCommand = User.find(formatedQueries)

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
            const counts = await User.find(formatedQueries).countDocuments();
            res.status(200).json({
                success: response ? true : false,
                counts,
                users: response || 'Cannot get users',
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
})
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (!uid) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `user with email ' ${response.email} ' deleted` : 'no user deleted'
    })
})
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { firstname, lastname, email, mobile, address } = req.body
    const data = { firstname, lastname, email, mobile, address }
    if (req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Something went wrong'
    })
})
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (!uid || Object.keys(req.body).length === 0) throw new Error('Missing inputs').select('-refreshToken -password -role')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select(' -password -role')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Something went wrong'
    })
})
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing inputs').select('-refreshToken -password -role')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select(' -password -role')
    return res.status(200).json({
        success: response ? true : false,
        updatedAddress: response ? response : 'something went wrong'
    })
})
const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity = 1, color, price, thumbnail, title } = req.body

    if (!pid || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
    if (alreadyProduct) {
        const response = await User.updateOne({
            cart: { $elemMatch: alreadyProduct }
        },
            {
                $set: {
                    "cart.$.quantity": quantity,
                    "cart.$.price": price,
                    "cart.$.thumbnail": thumbnail,
                    "cart.$.title": title
                }
            },
            { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated' : 'Something went wrong'
        })
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color, price, thumbnail, title } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Added to Cart' : 'Something went wrong'
        })
    }
})
const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, color } = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
    // if (!alreadyProduct) return res.status(200).json({
    //     success: true ,
    //     mes: 'Deleted Product'
    // })
    const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid, color } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Deleted' : 'Something went wrong'
    })
})
const createUsers = asyncHandler(async (req, res) => {
    const response = await User.create(users)
    return res.status(200).json({
        success: response ? true : false,
        user: response ? response : 'Some thing went wrong',
    })
})
const updateWishList = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const { _id } = req.user
    const user = await User.findById(_id)
    const alreadyDisliked = user?.wishlist?.find(el => el.toString() === pid)
    if (alreadyDisliked) {
        const response = await User.findByIdAndUpdate(_id, { $pull: { wishlist: pid } }, { new: true })
        return res.json({
            success: response ? true : false,
            mes : response ? 'UnLove this Product' : 'Failed to Update WishList'
        })
    }else{
        const response = await User.findByIdAndUpdate(_id, { $push: { wishlist: pid } }, { new: true })
        return res.json({
            success: response ? true : false,
            mes : response ? 'Love this Product' : 'Failed to Update WishList'
        })
    }
})
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister,
    createUsers,
    removeProductInCart,
    updateWishList
}