const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const { verifyOwnership } = require('../auth'); // Import the verifyOwnership middleware

// Create a new blog
module.exports.createBlog = (req, res) => {
    const { title, content } = req.body;
    const author = req.user.id; // Use the authenticated user's ID

    if (!title || !content) {
        return res.status(400).send({ error: 'Title and content are required' });
    }

    const newBlog = new Blog({
        title,
        content,
        author
    });

    return newBlog.save()
        .then(savedPost => res.status(201).send(savedPost))
        .catch(err => {
            console.error('Error saving blog: ', err);
            return res.status(500).send({ error: 'Failed to save the blog' });
        });
};

// Get all blogs
module.exports.getAllBlog = (req, res) => {
    return Blog.find({})
        .then(blogs => res.status(200).send({ blogs }))
        .catch(err => {
            console.error('Error finding blog: ', err);
            return res.status(500).send({ error: 'Error finding blog' });
        });
};

// Get a single blog by ID
module.exports.getBlogById = (req, res) => {
    return Blog.findById(req.params.blogId)
        .then(post => {
            if (!post) {
                return res.status(404).send({ error: 'Blog not found' });
            }
            return res.status(200).send(post);
        })
        .catch(err => {
            console.error('Error finding blog: ', err);
            return res.status(500).send({ error: 'Error finding blog' });
        });
};

// Update a blog by ID
module.exports.updateBlog = (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id; // Use the authenticated user's ID

    const updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;

    return Blog.findById(req.params.blogId)
        .then(blog => {
            if (!blog) {
                return res.status(404).send({ error: 'Blog not found' });
            }
            if (blog.author.toString() !== userId.toString() && !req.user.isAdmin) {
                return res.status(403).send({ error: 'You are not authorized to update this blog' });
            }
            return Blog.findByIdAndUpdate(req.params.blogId, updateFields, { new: true })
                .then(updatedBlog => res.status(200).send({ message: 'Blog updated successfully', updatedBlog }))
                .catch(err => {
                    console.error('Error updating blog: ', err);
                    return res.status(500).send({ error: 'Error updating blog' });
                });
        })
        .catch(err => {
            console.error('Error finding blog: ', err);
            return res.status(500).send({ error: 'Error finding blog' });
        });
};

// Delete a blog by ID
module.exports.deleteBlog = (req, res) => {
    const userId = req.user.id; // Use the authenticated user's ID
    
    return Blog.findById(req.params.blogId)
        .then(blog => {
            if (!blog) {
                return res.status(404).send({ error: 'Blog not found' });
            }
            if (blog.author.toString() !== userId.toString() && !req.user.isAdmin) {
                return res.status(403).send({ error: 'You are not authorized to delete this blog' });
            }
            return Blog.findByIdAndDelete(req.params.blogId)
                .then(() => res.status(200).send({ message: 'Blog deleted successfully' }))
                .catch(err => {
                    console.error('Error deleting blog: ', err);
                    return res.status(500).send({ error: 'Error deleting blog' });
                });
        })
        .catch(err => {
            console.error('Error finding blog: ', err);
            return res.status(500).send({ error: 'Error finding blog' });
        });
};

// Add a comment to a blog post
module.exports.addComment = (req, res) => {
    const { content } = req.body;
    const { blogId } = req.params;
    const userId = req.user.id;

    if (!content) {
        return res.status(400).send({ error: 'Content is required' });
    }

    const newComment = new Comment({
        blog: blogId,
        user: userId,
        content
    });

    return newComment.save()
        .then(comment => Comment.findById(comment._id).populate('user', 'userName').exec())
        .then(comment => res.status(201).send(comment))
        .catch(err => {
            console.error('Error adding comment: ', err);
            return res.status(500).send({ error: 'Failed to add comment' });
        });
};

// Get all comments for a blog post
module.exports.getCommentsByBlogId = (req, res) => {
    const { blogId } = req.params;

    return Comment.find({ blog: blogId }).populate('user', 'userName')
        .then(comments => res.status(200).send({ comments }))
        .catch(err => {
            console.error('Error finding comments: ', err);
            return res.status(500).send({ error: 'Error finding comments' });
        });
};

// Delete a comment
module.exports.deleteComment = (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    return Comment.findById(commentId)
        .then(comment => {
            if (!comment) {
                return res.status(404).send({ error: 'Comment not found' });
            }
            if (comment.user.toString() !== userId.toString() && !req.user.isAdmin) {
                return res.status(403).send({ error: 'You are not authorized to delete this comment' });
            }
            return Comment.findByIdAndDelete(commentId)
                .then(() => res.status(200).send({ message: 'Comment deleted successfully' }))
                .catch(err => {
                    console.error('Error deleting comment: ', err);
                    return res.status(500).send({ error: 'Error deleting comment' });
                });
        })
        .catch(err => {
            console.error('Error finding comment: ', err);
            return res.status(500).send({ error: 'Error finding comment' });
        });
};
