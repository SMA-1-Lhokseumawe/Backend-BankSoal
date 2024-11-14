const Guru = require("../models/GuruModel.js");
const Users = require("../models/UserModel.js")

const getGuru = async (req, res) => {
    try {
        if (req.role === "admin") {
            const guru = await Guru.findAll({
                include: [{
                    model: Users,
                    attributes: ['username', 'email', 'role']
                }],
            });
            res.status(200).json(guru);
        } else {
            const guru = await Guru.findAll({
                where: {
                    userId: req.userId,
                },
                include: [{
                    model: Users,
                    attributes: ['username', 'email', 'role']
                }],
            });
            res.status(200).json(guru);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getGuruById = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Guru.findOne({
                attributes: ['id', 'nip', 'nama', 'email', 'gender', 'ttl', 'alamat'],
                where: {
                    id: req.params.id
                },
                include: [{
                    model: Users,
                    attributes: ['username', 'email', 'role']
                }]
            })
        } else {
            response = await Guru.findOne({
                attributes: ['id', 'nip', 'nama', 'email', 'gender', 'ttl', 'alamat'],
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

const createGuru = async (req, res) => {
    const nip = req.body.nip;
    const nama = req.body.nama;
    const email = req.body.email;
    const gender = req.body.gender;
    const ttl = req.body.ttl;
    const alamat = req.body.alamat;

    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID not found in the request" });
        }

        await Guru.create({
            nip: nip,
            nama: nama,
            email: email,
            gender: gender,
            ttl: ttl,
            alamat: alamat,
            userId: req.userId
        });

        res.json({ msg: "Guru Created" });
    } catch (error) {
        console.log(error);
    }
};

const updateGuru = async (req, res) => {
    try {
        await Guru.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Guru Updated" })
    } catch (error) {
        console.log(error.message);
    }
};

const deleteGuru = async (req, res) => {
    try {
        await Guru.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Guru Deleted" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getGuru,
    getGuruById,
    createGuru,
    updateGuru,
    deleteGuru
};