const Modul = require("../models/ModulModel.js");
const Users = require("../models/UserModel.js");
const Kelas = require("../models/KelasModel.js");
const Pelajaran = require("../models/PelajaranModel.js");

const { Op } = require("sequelize");

const getModul = async (req, res) => {
    try {
        if (req.role === "admin" || req.role === "guru") {
            const response = await Modul.findAll({
                attributes: { exclude: ['kelaId'] },
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
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    }
                ],
            });
            res.status(200).json(response);
        } else {
            const response = await Pelajaran.findAll({
                where: {
                    userId: req.userId,
                },
                attributes: { exclude: ['kelaId'] },
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
                    }
                ],
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getModulById = async (req, res) => {
    try {
        let response;
        if (req.role === "admin" || req.role === "guru") {
            response = await Modul.findOne({
                attributes: { exclude: ['kelaId'] },
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
                    }
                ]
            })
        } else {
            response = await Modul.findOne({
                attributes: { exclude: ['kelaId'] },
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
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

const createModul = async (req, res) => {
    const judul = req.body.judul;
    const deskripsi = req.body.deskripsi;
    const durasi = req.body.durasi;
    const kelasId = req.body.kelasId;
    const pelajaranId = req.body.pelajaranId;
    const type = req.body.type;

    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID not found in the request" });
        }

        const newModul = await Modul.create({
            judul: judul,
            deskripsi: deskripsi,
            durasi: durasi,
            kelasId: kelasId,
            pelajaranId: pelajaranId,
            type: type,
            userId: req.userId
        });

        res.status(201).json({ 
            msg: "Modul Created", 
            id: newModul.id
        });
    } catch (error) {
        console.log(error);
    }
};

const updateModul = async (req, res) => {
    try {
        await Modul.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Modul Updated" })
    } catch (error) {
        console.log(error.message);
    }
};

const deleteModul = async (req, res) => {
    try {
        await Modul.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Modul Deleted" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getModul,
    getModulById,
    createModul,
    updateModul,
    deleteModul
};