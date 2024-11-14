const Kelas = require("../models/KelasModel.js");
const Users = require("../models/UserModel.js")

const { Op } = require("sequelize");

const getKelas = async (req, res) => {
    try {
        if (req.role === "admin") {
            const kelas = await Kelas.findAll({
                include: [{
                    model: Users,
                    attributes: ['username', 'email', 'role']
                }],
            });
            res.status(200).json(kelas);
        } else {
            const kelas = await Kelas.findAll({
                where: {
                    userId: req.userId,
                },
                include: [{
                    model: Users,
                    attributes: ['username', 'email', 'role']
                }],
            });
            res.status(200).json(kelas);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getKelasById = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Kelas.findOne({
                attributes: ['id', 'kelas'],
                where: {
                    id: req.params.id
                },
                include: [{
                    model: Users,
                    attributes: ['username', 'email', 'role']
                }]
            })
        } else {
            response = await Kelas.findOne({
                attributes: ['id', 'kelas'],
                where: {
                    [Op.and]: [{ id: req.params.id }, { userId: req.userId }]
                },
                include: [{
                    model: Users,
                    attributes: ['username', 'email', 'role']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

const createKelas = async (req, res) => {
    const kelas = req.body.kelas;

    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID not found in the request" });
        }

        await Kelas.create({
            kelas: kelas,
            userId: req.userId
        });

        res.json({ msg: "Kelas Created" });
    } catch (error) {
        console.log(error);
    }
};

const updateKelas = async (req, res) => {
    try {
        await Kelas.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Kelas Updated" })
    } catch (error) {
        console.log(error.message);
    }
};

const deleteKelas = async (req, res) => {
    try {
        await Kelas.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Kelas Deleted" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getKelas,
    getKelasById,
    createKelas,
    updateKelas,
    deleteKelas
};