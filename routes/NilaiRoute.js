const express = require("express");
const {
    getNilai,
    getNilaiById,
    createNilai,
    updateNilai,
    deleteNilai
} = require("../controllers/NilaiController.js") 
const { verifyUser } = require("../middleware/AuthUser.js") 

const router = express.Router()

router.get('/nilai', verifyUser, getNilai)
router.get('/nilai/:id', verifyUser, getNilaiById)
router.post('/nilai', verifyUser, createNilai)
router.patch('/nilai/:id', verifyUser, updateNilai)
router.delete('/nilai/:id', verifyUser, deleteNilai)

module.exports = router;