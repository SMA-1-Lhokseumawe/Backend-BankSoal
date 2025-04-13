const express = require("express");
const { getImage, createImage, deleteImage, getImageById } = require("../controllers/UploadImageController.js");
const router = express.Router();

const { verifyUser } = require("../middleware/AuthUser.js") 

router.get('/image', getImage);
router.get('/image/:id', verifyUser, getImageById);
router.post('/image', verifyUser, createImage)
router.delete('/image/:id', verifyUser, deleteImage)

module.exports = router;