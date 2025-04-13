const Nilai = require("../models/NilaiModel.js");
const Users = require("../models/UserModel.js");
const Kelas = require("../models/KelasModel.js");
const Pelajaran = require("../models/PelajaranModel.js");
const Siswa = require("../models/SiswaModel.js");

const { Op } = require("sequelize");

const getNilai = async (req, res) => {
    try {
        if (req.role === "admin" || req.role === "guru") {
            const response = await Nilai.findAll({
                attributes: { exclude: ['kelasId'] },
                include: [
                    {
                        model: Kelas,
                        attributes: ['id', 'kelas'],
                        as: 'kelas'
                    },
                    {
                        model: Pelajaran,
                        attributes: ['id', 'pelajaran'],
                        as: 'pelajaran'
                    },
                    {
                        model: Siswa,
                        attributes: ['id', 'nis', 'nama', 'email', 'gender', 'umur', 'alamat', 'url'],
                        as: 'siswa'
                    },
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    }
                ],
            });
            res.status(200).json(response);
        } else {
            const response = await Nilai.findAll({
                where: {
                    userId: req.userId,
                },
                attributes: { exclude: ['kelasId'] },
                include: [
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    },
                    {
                        model: Kelas,
                        attributes: ['id', 'kelas'],
                        as: 'kelas'
                    },
                    {
                        model: Pelajaran,
                        attributes: ['id', 'pelajaran'],
                        as: 'pelajaran'
                    },
                    {
                        model: Siswa,
                        attributes: ['id', 'nis', 'nama', 'email', 'gender', 'umur', 'alamat', 'url'],
                        as: 'siswa'
                    },
                ],
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getNilaiById = async (req, res) => {
    try {
        let response;
        if (req.role === "admin" || req.role === "guru") {
            response = await Nilai.findOne({
                attributes: { exclude: ['kelasId'] },
                where: {
                    id: req.params.id
                },
                include: [
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    },
                    {
                        model: Kelas,
                        attributes: ['id', 'kelas'],
                        as: 'kelas'
                    },
                    {
                        model: Pelajaran,
                        attributes: ['id', 'pelajaran'],
                        as: 'pelajaran'
                    },
                    {
                        model: Siswa,
                        attributes: ['id', 'nis', 'nama', 'email', 'gender', 'umur', 'alamat', 'url'],
                        as: 'siswa'
                    },
                ]
            });
        } else {
            response = await Nilai.findOne({
                attributes: { exclude: ['kelasId'] },
                where: {
                    [Op.and]: [{ id: req.params.id }, { userId: req.userId }]
                },
                include: [
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    },
                    {
                        model: Kelas,
                        attributes: ['id', 'kelas'],
                        as: 'kelas'
                    },
                    {
                        model: Pelajaran,
                        attributes: ['id', 'pelajaran'],
                        as: 'pelajaran'
                    },
                    {
                        model: Siswa,
                        attributes: ['id', 'nis', 'nama', 'email', 'gender', 'umur', 'alamat', 'url'],
                        as: 'siswa'
                    },
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

const createNilai = async (req, res) => {
    const { skor, level, jumlahSoal, jumlahJawabanBenar, pelajaranId, kelasId, siswaId } = req.body;

    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID not found in the request" });
        }

        const newNilai = await Nilai.create({
            skor,
            level,
            jumlahSoal,
            jumlahJawabanBenar,
            pelajaranId,
            kelasId,
            siswaId,
            userId
        });

        res.status(201).json({ msg: "Nilai Created", nilaiId: newNilai.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const updateNilai = async (req, res) => {
    try {
        const [updated] = await Nilai.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        
        if (updated) {
            res.status(200).json({ msg: "Nilai Updated" });
        } else {
            res.status(404).json({ msg: "Nilai not found" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

const deleteNilai = async (req, res) => {
    try {
        const deleted = await Nilai.destroy({
            where: {
                id: req.params.id,
            },
        });
        
        if (deleted) {
            res.status(200).json({ msg: "Nilai Deleted" });
        } else {
            res.status(404).json({ msg: "Nilai not found" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

module.exports = {
    getNilai,
    getNilaiById,
    createNilai,
    updateNilai,
    deleteNilai
};