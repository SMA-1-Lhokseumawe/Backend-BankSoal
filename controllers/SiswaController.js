const Siswa = require("../models/SiswaModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { updateUsers } = require("./UserController.js");

const getSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findAll({
      attributes: ["id", "username", "email", "nama", "kelas", "gender", "umur"],
    });
    res.json(siswa);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const getProfileSiswa = async (req, res) => {
  const id = req.userId;

  try {
    const siswa = await Siswa.findOne({
      where: { id }
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
  const { username, email, nama, kelas, gender, umur, alamat, password, confPassword } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password dan Confirm Password Tidak Cocok" });
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
      password: hashPassword
    });

    const accessToken = jwt.sign(
      { userId: newSiswa.id, username, email, nama, kelas, gender, umur, alamat },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: newSiswa.id, username, email, nama, kelas, gender, umur, alamat },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Siswa.update(
      { refresh_token: refreshToken },
      { where: { id: newSiswa.id } }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
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
        token: accessToken
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const customer = await Customers.findOne({
      where: { email: req.body.email },
    });

    if (!customer) return res.status(404).json({ msg: "Email tidak ditemukan" });

    const match = await bcrypt.compare(req.body.password, customer.password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });

    const accessToken = jwt.sign(
      { userId: customer.id, username: customer.username, email: customer.email, noHp: customer.noHp, alamat: customer.alamat },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: customer.id, username: customer.username, email: customer.email, noHp: customer.noHp, alamat: customer.alamat },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Customers.update({ refresh_token: refreshToken }, {
      where: { id: customer.id }
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: true,
      message: "Berhasil login",
      data: { user: customer, accessToken },
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
    const customer = await Customers.findOne({
      where: { id }
    });

    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { username, email } = req.body;

    customer.username = username || customer.username;
    customer.email = email || customer.email;
    // customer.alamat = alamat || customer.alamat;
    // customer.idKecamatan = idKecamatan || customer.idKecamatan;

    await customer.save();

    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan, silahkan coba lagi', error: error.message });
  }
};

const updateAddress = async (req, res) => {
  const id = req.userId;

  try {
    const customer = await Customers.findOne({
      where: { id }
    });

    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { noHp, alamat, idKecamatan} = req.body;

    // customer.username = username || customer.username;
    // customer.email = email || customer.email;
    customer.noHp = noHp || customer.noHp;
    customer.alamat = alamat || customer.alamat;
    customer.idKecamatan = idKecamatan || customer.idKecamatan;

    await customer.save();

    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan, silahkan coba lagi', error: error.message });
  }
};

const Logout = async (req, res) => {
  const id = req.userId

    Customers.update({ refresh_token: null }, {
      where: { id }
    })
      .then((_) => {
        res.status(200).json({
          status: true,
          message: "Berhasil logout",
          data: {},
        })
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({
          status: false,
          message: "Terjadi kesalahan, silahkan coba lagi",
          data: {},
        })
      })
  }


module.exports = {
  getSiswa,
  getProfileSiswa,
  updateProfile,
  updateAddress,
  Register,
  Login,
  Logout
};
