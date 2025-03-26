const Pelajaran = require("../models/PelajaranModel.js");
const Users = require("../models/UserModel.js");
const Kelas = require("../models/KelasModel.js");

const { Op } = require("sequelize");

const getPelajaran = async (req, res) => {
    try {
        if (req.role === "admin" || req.role === "guru") {
            const response = await Pelajaran.findAll({
                attributes: { exclude: ['kelaId'] },
                include: [
                    {
                        model: Kelas,
                        attributes: ['id', 'kelas'],
                        as: 'kelas'
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
                    }
                ],
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getPelajaranById = async (req, res) => {
    try {
        let response;
        if (req.role === "admin" || req.role === "guru") {
            response = await Pelajaran.findOne({
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
                    }
                ]
            })
        } else {
            response = await Pelajaran.findOne({
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
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

const createPelajaran = async (req, res) => {
    const pelajaran = req.body.pelajaran;
    const kelasId = req.body.kelasId;

    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID not found in the request" });
        }

        await Pelajaran.create({
            pelajaran: pelajaran,
            kelasId: kelasId,
            userId: req.userId
        });

        res.json({ msg: "Pelajaran Created" });
    } catch (error) {
        console.log(error);
    }
};

const updatePelajaran = async (req, res) => {
    try {
        await Pelajaran.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Pelajaran Updated" })
    } catch (error) {
        console.log(error.message);
    }
};

const deletePelajaran = async (req, res) => {
    try {
        await Pelajaran.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Pelajaran Deleted" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getPelajaran,
    getPelajaranById,
    createPelajaran,
    updatePelajaran,
    deletePelajaran
};