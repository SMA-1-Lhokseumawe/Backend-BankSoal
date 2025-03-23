const express = require("express");
const {
    getPelajaran,
    getPelajaranById,
    createPelajaran,
    updatePelajaran,
    deletePelajaran
} = require("../controllers/PelajaranController.js") 
const { verifyUser } = require("../middleware/AuthUser.js") 

const router = express.Router()

router.get('/pelajaran', verifyUser, getPelajaran)
router.get('/pelajaran/:id', verifyUser, getPelajaranById)
router.post('/pelajaran', verifyUser, createPelajaran)
router.patch('/pelajaran/:id', verifyUser, updatePelajaran)
router.delete('/pelajaran/:id', verifyUser, deletePelajaran)

module.exports = router;