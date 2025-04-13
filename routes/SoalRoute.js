const express = require("express");
const {
    getAllSoal,
    getSoal,
    getSoalById,
    createSoal,
    updateSoal,
    deleteSoal
} = require("../controllers/SoalController.js") 
const { verifyUser } = require("../middleware/AuthUser.js") 

const router = express.Router()

router.get('/all-soal', verifyUser, getAllSoal)
router.get('/soal', verifyUser, getSoal)
router.get('/soal/:id', verifyUser, getSoalById)
router.post('/soal', verifyUser, createSoal)
router.patch('/soal/:id', verifyUser, updateSoal)
router.delete('/soal/:id', verifyUser, deleteSoal)

module.exports = router;