const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const mongoose = require("mongoose");

//multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const fname = `${req.isLoggedInUser.name} - ${file.originalname}`
        cb(null, fname)
    },
});
const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render('addblog', {
        user: req.isLoggedInUser
    })
})

router.post('/', upload.single('coverimg'), async (req, res) => {
    const { coverimg, title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImgURL: `/uploads/${req.file.filename}`,
        createdBy: req.isLoggedInUser._id
    })
    res.redirect(`/blog/${blog._id}`)
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const comment = await Comment.find({ blogId: req.params.id }).populate('createdBy')
    // console.log(blog);
    // console.log(comment);
    return res.render('blog', {
        user: req.isLoggedInUser,
        blog: blog,
        comments: comment,
    })
})

router.post('/comment/:id', async (req, res) => {
    const comment = await Comment.create({
        content: req.body.comment,
        blogId: req.params.id,
        createdBy: req.isLoggedInUser._id,

    })
    return res.redirect(`/blog/${req.params.id}`)
})


module.exports = router;