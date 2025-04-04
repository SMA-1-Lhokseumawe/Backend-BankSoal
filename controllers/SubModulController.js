const SubModul = require("../models/SubModulModel.js");
const Modul = require("../models/ModulModel.js");
const Users = require("../models/UserModel.js");

const { Op } = require("sequelize");

const getSubModul = async (req, res) => {
    try {
        if (req.role === "admin" || req.role === "guru") {
            const response = await SubModul.findAll({
                include: [
                    {
                        model: Modul,
                        attributes: ['id', 'judul'],
                        as: 'modul'
                    },
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    }
                ],
            });
            res.status(200).json(response);
        } else {
            const response = await SubModul.findAll({
                where: {
                    userId: req.userId,
                },
                include: [
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    },
                    {
                        model: Modul,
                        attributes: ['id', 'judul'],
                        as: 'modul'
                    }
                ],
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getSubModulById = async (req, res) => {
    try {
        let response;
        if (req.role === "admin" || req.role === "guru") {
            response = await SubModul.findOne({
                where: {
                    id: req.params.id
                },
                include: [
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    },
                    {
                        model: Modul,
                        attributes: ['id', 'judul'],
                        as: 'modul'
                    },
                ]
            })
        } else {
            response = await SubModul.findOne({
                where: {
                    [Op.and]: [{ id: req.params.id }, { userId: req.userId }]
                },
                include: [
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    },
                    {
                        model: Modul,
                        attributes: ['id', 'judul'],
                        as: 'modul'
                    },
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

const createSubModul = async (req, res) => {
    const subJudul = req.body.subJudul;
    const subDeskripsi = req.body.subDeskripsi;
    const content = req.body.content;
    const modulId = req.body.modulId;

    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID not found in the request" });
        }

        await SubModul.create({
            subJudul: subJudul,
            subDeskripsi: subDeskripsi,
            content: content,
            modulId: modulId,
            userId: req.userId
        });

        res.json({ msg: "Sub Modul Created" });
    } catch (error) {
        console.log(error);
    }
};

const updateSubModul = async (req, res) => {
    try {
        await SubModul.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Sub Modul Updated" })
    } catch (error) {
        console.log(error.message);
    }
};

const deleteSubModul = async (req, res) => {
    try {
        await SubModul.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Sub Modul Deleted" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getSubModul,
    getSubModulById,
    createSubModul,
    updateSubModul,
    deleteSubModul
};