const express = require("express");
const { getSiswa, getProfileSiswa, updateProfile } = require("../controllers/SiswaController.js");
const router = express.Router();

router.get("/profile/:id", getProfileSiswa );
router.get('/siswa', getSiswa);
router.put('/update-profile', updateProfile);

module.exports = router;