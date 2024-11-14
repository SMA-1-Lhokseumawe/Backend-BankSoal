const express = require("express");
const {
    getGuru,
    getGuruById,
    createGuru,
    updateGuru,
    deleteGuru
} = require("../controllers/GuruController.js") 
const { verifyUser, adminOnly } = require("../middleware/AuthUser.js") 

const router = express.Router()

router.get('/guru', verifyUser, getGuru)
router.get('/guru/:id', verifyUser, getGuruById)
router.post('/guru', verifyUser, adminOnly, createGuru)
router.patch('/guru/:id', verifyUser,adminOnly, updateGuru)
router.delete('/guru/:id', verifyUser, adminOnly, deleteGuru)

module.exports = router;