const Siswa = require("../models/SiswaModel.js");

const getSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findAll({
      attributes: [
        "id",
        "nis",
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

module.exports = {
  getSiswa,
  getProfileSiswa,
  updateProfile,
};
