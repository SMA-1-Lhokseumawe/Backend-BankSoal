const express = require("express");
const {
    getSubModul,
    getSubModulById,
    createSubModul,
    updateSubModul,
    deleteSubModul
} = require("../controllers/SubModulController.js") 
const { verifyUser } = require("../middleware/AuthUser.js") 

const router = express.Router()

router.get('/sub-modul', verifyUser, getSubModul)
router.get('/sub-modul/:id', verifyUser, getSubModulById)
router.post('/sub-modul', verifyUser, createSubModul)
router.patch('/sub-modul/:id', verifyUser, updateSubModul)
router.delete('/sub-modul/:id', verifyUser, deleteSubModul)

module.exports = router;