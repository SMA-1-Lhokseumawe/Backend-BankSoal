const express = require("express");
const { getSiswa, Register, Login, Logout, getProfileSiswa, updateProfile } = require("../controllers/SiswaController.js");
const verifyToken = require("../middleware/VerifyToken.js");
const refreshToken = require("../controllers/RefreshToken.js");
const router = express.Router();

router.get("/profile/:id", getProfileSiswa );
router.get('/siswa', getSiswa);
router.put('/update-profile', verifyToken, updateProfile);
router.post('/register', Register);
router.post('/login-siswa', Login);
router.get('/token', refreshToken);
router.delete('/logout-siswa', Logout);

module.exports = router;