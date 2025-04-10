const express = require("express");
const { getAllPost, getAllPostWithoutComment, getPost, createPost, deletePost, updatePost } = require("../controllers/PostController.js");
const router = express.Router();

const { verifyUser } = require("../middleware/AuthUser.js") 

router.get('/all-post', verifyUser, getAllPost);
router.get('/post-nocomment', verifyUser, getAllPostWithoutComment);
router.get('/post', verifyUser, getPost);
router.post('/post', verifyUser, createPost)
router.patch('/post/:id', verifyUser, updatePost)
router.delete('/post/:id', verifyUser, deletePost)

module.exports = router;