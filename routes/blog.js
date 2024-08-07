const express = require('express');
const blogController = require('../controllers/blog');
const auth = require('../auth');

const { verify, verifyAdmin, verifyOwnership } = auth;

const router = express.Router();

router.post('/create', verify, blogController.createBlog);
router.get('/', blogController.getAllBlog);
router.get('/:blogId', blogController.getBlogById);
router.patch('/update/:blogId', verify, blogController.updateBlog);
router.delete('/delete/:blogId', verify, blogController.deleteBlog);

// Comment routes
router.post('/:blogId/addComment', verify, blogController.addComment);
router.get('/:blogId/comments', blogController.getCommentsByBlogId);
router.delete('/comments/:commentId', verify, blogController.deleteComment);

module.exports = router;
