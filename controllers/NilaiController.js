const Nilai = require("../models/NilaiModel.js");
const Soal = require("../models/SoalModel.js");
const Users = require("../models/UserModel.js");
const Kelas = require("../models/KelasModel.js");
const Pelajaran = require("../models/PelajaranModel.js");
const Siswa = require("../models/SiswaModel.js");
const NilaiSoal = require("../models/NilaiSoalModel.js");

const { Op } = require("sequelize");
const db = require("../config/Database.js");

// Reusable function for common query options
const getNilaiQueryOptions = () => ({
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
            model: Soal,
            as: 'soals',
            through: {
                attributes: [] // Exclude junction table attributes if not needed
            },
            attributes: ['id', 'soal', 'optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'correctAnswer']
        },
        {
            model: Users,
            attributes: ['username', 'email', 'role']
        }
    ],
    order: [['createdAt', 'DESC']]
});

// Get all Nilai
const getNilai = async (req, res) => {
    try {
        const queryOptions = getNilaiQueryOptions();
        
        // Different query based on user role
        if (req.role === "admin" || req.role === "guru") {
            queryOptions.where = {};
        } else {
            queryOptions.where = { userId: req.userId };
        }

        const response = await Nilai.findAll(queryOptions);
        
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getNilai:', error);
        res.status(500).json({ 
            msg: "Terjadi kesalahan saat mengambil data nilai", 
            error: error.message 
        });
    }
};

// Get Nilai by ID
const getNilaiById = async (req, res) => {
    try {
        const queryOptions = getNilaiQueryOptions();
        
        // Different where condition based on user role
        if (req.role === "admin" || req.role === "guru") {
            queryOptions.where = { id: req.params.id };
        } else {
            queryOptions.where = {
                [Op.and]: [
                    { id: req.params.id },
                    { userId: req.userId }
                ]
            };
        }

        const response = await Nilai.findOne(queryOptions);

        if (!response) {
            return res.status(404).json({ msg: "Nilai tidak ditemukan" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getNilaiById:', error);
        res.status(500).json({ 
            msg: "Terjadi kesalahan saat mengambil detail nilai", 
            error: error.message 
        });
    }
};

// Create Nilai with associated Soals
const createNilai = async (req, res) => {
    const transaction = await db.transaction();

    try {
        const { 
            skor, 
            level, 
            jumlahSoal, 
            jumlahJawabanBenar, 
            pelajaranId, 
            kelasId, 
            siswaId,
            soalIds
        } = req.body;

        // Validate required fields
        if (!pelajaranId || !kelasId || !siswaId) {
            return res.status(400).json({ 
                msg: "Pelajaran, Kelas, dan Siswa harus diisi" 
            });
        }

        // Validate soalIds if provided
        if (soalIds && (!Array.isArray(soalIds) || !soalIds.every(id => Number.isInteger(id)))) {
            return res.status(400).json({ 
                msg: "soalIds harus berupa array dari integer" 
            });
        }

        // Create Nilai
        const newNilai = await Nilai.create({
            skor,
            level,
            jumlahSoal,
            jumlahJawabanBenar,
            pelajaranId,
            kelasId,
            siswaId,
            soalIds: soalIds || [],
            userId: req.userId
        }, { transaction });

        // If soalIds are provided, create NilaiSoal entries
        if (soalIds && soalIds.length > 0) {
            const nilaiSoalEntries = soalIds.map(soalId => ({
                nilaiId: newNilai.id,
                soalId: soalId
            }));

            await NilaiSoal.bulkCreate(nilaiSoalEntries, { transaction });
        }

        // Commit transaction
        await transaction.commit();

        res.status(201).json({ 
            msg: "Nilai Created", 
            nilaiId: newNilai.id,
            soalIds: newNilai.soalIds
        });
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();

        console.error('Error in createNilai:', error);
        res.status(500).json({ 
            msg: "Terjadi kesalahan saat membuat nilai", 
            error: error.message 
        });
    }
};

// Update Nilai
const updateNilai = async (req, res) => {
    const transaction = await db.transaction();

    try {
        const { 
            skor, 
            level, 
            jumlahSoal, 
            jumlahJawabanBenar, 
            pelajaranId, 
            kelasId, 
            siswaId,
            soalIds 
        } = req.body;

        // Validate soalIds if provided
        if (soalIds && (!Array.isArray(soalIds) || !soalIds.every(id => Number.isInteger(id)))) {
            return res.status(400).json({ 
                msg: "soalIds harus berupa array dari integer" 
            });
        }

        // Find existing Nilai
        const existingNilai = await Nilai.findByPk(req.params.id);

        if (!existingNilai) {
            return res.status(404).json({ msg: "Nilai tidak ditemukan" });
        }

        // Update Nilai
        await existingNilai.update({
            skor,
            level,
            jumlahSoal,
            jumlahJawabanBenar,
            pelajaranId,
            kelasId,
            siswaId,
            soalIds: soalIds || existingNilai.soalIds
        }, { transaction });

        // If soalIds are provided, update NilaiSoal entries
        if (soalIds) {
            // Remove existing NilaiSoal entries
            await NilaiSoal.destroy({
                where: { nilaiId: existingNilai.id },
                transaction
            });

            // Create new NilaiSoal entries
            if (soalIds.length > 0) {
                const nilaiSoalEntries = soalIds.map(soalId => ({
                    nilaiId: existingNilai.id,
                    soalId: soalId
                }));

                await NilaiSoal.bulkCreate(nilaiSoalEntries, { transaction });
            }
        }

        // Commit transaction
        await transaction.commit();

        res.status(200).json({ 
            msg: "Nilai Updated", 
            nilaiId: existingNilai.id,
            soalIds: existingNilai.soalIds
        });
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();

        console.error('Error in updateNilai:', error);
        res.status(500).json({ 
            msg: "Terjadi kesalahan saat memperbarui nilai", 
            error: error.message 
        });
    }
};

// Delete Nilai
const deleteNilai = async (req, res) => {
    const transaction = await db.transaction();

    try {
        const existingNilai = await Nilai.findByPk(req.params.id);

        if (!existingNilai) {
            return res.status(404).json({ msg: "Nilai tidak ditemukan" });
        }

        // Remove associated NilaiSoal entries
        await NilaiSoal.destroy({
            where: { nilaiId: existingNilai.id },
            transaction
        });

        // Delete Nilai
        await existingNilai.destroy({ transaction });

        // Commit transaction
        await transaction.commit();

        res.status(200).json({ msg: "Nilai Deleted" });
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();

        console.error('Error in deleteNilai:', error);
        res.status(500).json({ 
            msg: "Terjadi kesalahan saat menghapus nilai", 
            error: error.message 
        });
    }
};

module.exports = {
    getNilai,
    getNilaiById,
    createNilai,
    updateNilai,
    deleteNilai
};