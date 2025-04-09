const express = require("express");
const { getAllKomentar, createKomentar, deleteKomentar, updateKomentar } = require("../controllers/KomentarController.js");
const router = express.Router();

const { verifyUser } = require("../middleware/AuthUser.js") 

router.get('/all-komentar', verifyUser, getAllKomentar);
router.post('/komentar', verifyUser, createKomentar)
router.patch('/komentar/:id', verifyUser, updateKomentar)
router.delete('/komentar/:id', verifyUser, deleteKomentar)

module.exports = router;