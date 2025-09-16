const router = require('express').Router()
const ctrls = require ('../controllers/blog')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post ('/',[verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.get ('/', ctrls.getBlogs)
router.put ('/like/:bid',verifyAccessToken, ctrls.likeBlog)
router.put ('/dislike/bid',verifyAccessToken, ctrls.dislikeBlog)
router.get ('/one/:bid',verifyAccessToken, ctrls.getBlog)
router.put ('/:bid',[verifyAccessToken, isAdmin], ctrls.updateBlog)
router.put ('/image/:bid',[verifyAccessToken, isAdmin],uploader.single('image'), ctrls.uploadImagesBlog)
router.delete ('/:bid',[verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router 