const Siswa = require("../models/SiswaModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { updateUsers } = require("./UserController.js");
const blacklistedTokens = new Set();

const getSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "nama",
        "kelas",
        "gender",
        "umur",
      ],
    });
    res.json(siswa);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const getProfileSiswa = async (req, res) => {
  const id = req.userId;

  try {
    const siswa = await Siswa.findOne({
      where: { id },
    });

    if (!siswa) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: {},
      });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil mengambil profil siswa",
      data: siswa,
    });
  } catch (err) {
    console.log("Error fetching profile:", err);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silahkan coba lagi",
      data: {},
    });
  }
};

const Register = async (req, res) => {
  const {
    username,
    email,
    nama,
    kelas,
    gender,
    umur,
    alamat,
    password,
    confPassword,
  } = req.body;

  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password Tidak Cocok" });
  }

  const existingEmail = await Siswa.findOne({ where: { email } });
  if (existingEmail) {
    return res.status(409).json({ msg: "Email sudah terdaftar" });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const newSiswa = await Siswa.create({
      username,
      email,
      nama,
      kelas,
      gender,
      umur,
      alamat,
      password: hashPassword,
    });

    res.status(200).json({
      msg: "Register Berhasil",
      data: {
        user: {
          id: newSiswa.id,
          username: newSiswa.username,
          email: newSiswa.email,
          nama: newSiswa.nama,
          kelas: newSiswa.kelas,
          gender: newSiswa.gender,
          umur: newSiswa.umur,
          alamat: newSiswa.alamat,
          idKecamatan: newSiswa.idKecamatan,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const siswa = await Siswa.findOne({
      where: { email: req.body.email },
    });

    if (!siswa) return res.status(404).json({ msg: "Email tidak ditemukan" });

    const match = await bcrypt.compare(req.body.password, siswa.password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });

    const accessToken = jwt.sign(
      {
        userId: siswa.id,
        username: siswa.username,
        email: siswa.email,
        nama: siswa.nama,
        kelas: siswa.kelas,
        gender: siswa.gender,
        umur: siswa.umur,
        alamat: siswa.alamat,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );

    const refreshToken = jwt.sign(
      {
        userId: siswa.id,
        username: siswa.username,
        email: siswa.email,
        nama: siswa.nama,
        kelas: siswa.kelas,
        gender: siswa.gender,
        umur: siswa.umur,
        alamat: siswa.alamat,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Siswa.update(
      { refresh_token: refreshToken },
      {
        where: { id: siswa.id },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: true,
      message: "Berhasil login",
      data: { user: siswa, accessToken },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silahkan coba lagi",
      data: {},
    });
  }
};

const updateProfile = async (req, res) => {
  const id = req.userId;

  try {
    const siswa = await Siswa.findOne({
      where: { id },
    });

    if (!siswa) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, email } = req.body;

    siswa.username = username || siswa.username;
    siswa.email = email || siswa.email;

    await siswa.save();

    res.status(200).json({ data: siswa });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan, silahkan coba lagi",
        error: error.message,
      });
  }
};

const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const siswa = await Siswa.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!siswa) return res.sendStatus(204);

    // Tambahkan accessToken ke blacklist
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    if (accessToken) {
      blacklistedTokens.add(accessToken);
      console.log("Token di-blacklist:", blacklistedTokens);
    }

    // Hapus refresh token dari database
    await Siswa.update({ refresh_token: null }, { where: { id: siswa.id } });

    // Hapus cookie refreshToken
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  } catch (error) {
    console.error("Logout Error:", error);
    return res.sendStatus(500);
  }
};






module.exports = {
  getSiswa,
  getProfileSiswa,
  updateProfile,
  Register,
  Login,
  Logout,
};
