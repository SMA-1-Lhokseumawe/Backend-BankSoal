const Soal = require("../models/SoalModel.js");
const Kelas = require("../models/KelasModel.js");
const Pelajaran = require("../models/PelajaranModel.js");
const Users = require("../models/UserModel.js");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

const getAllSoal = async (req, res) => {
  try {
    const response = await Soal.findAll({
      attributes: { exclude: ["kelaId"] },
      include: [
        {
          model: Users,
          attributes: ["username", "email", "role"],
        },
        {
          model: Kelas,
          attributes: ["id", "kelas"],
          as: "kelas",
        },
        {
          model: Pelajaran,
          attributes: ["id", "pelajaran"],
          as: "pelajaran",
        },
      ],
    });
    res.json(response);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const getSoal = async (req, res) => {
  try {
    if (req.role === "admin") {
      const response = await Soal.findAll({
        attributes: { exclude: ["kelaId"] },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
          {
            model: Kelas,
            attributes: ["id", "kelas"],
            as: "kelas",
          },
          {
            model: Pelajaran,
            attributes: ["id", "pelajaran"],
            as: "pelajaran",
          },
        ],
      });

      res.status(200).json(response);
    } else {
      const response = await Soal.findAll({
        attributes: { exclude: ["kelaId"] },
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
          {
            model: Kelas,
            attributes: ["id", "kelas"],
            as: "kelas",
          },
          {
            model: Pelajaran,
            attributes: ["id", "pelajaran"],
            as: "pelajaran",
          },
        ],
      });

      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getSoalById = async (req, res) => {
    try {
      let response;
      if (req.role === "admin" || req.role === "guru") {
        response = await Soal.findOne({
          attributes: { exclude: ["kelaId"] },
          where: {
            id: req.params.id,
          },
          include: [
            {
              model: Users,
              attributes: ["username", "email", "role"],
            },
            {
              model: Kelas,
              attributes: ["id", "kelas"],
              as: "kelas",
            },
            {
                model: Pelajaran,
                attributes: ["id", "pelajaran"],
                as: "pelajaran",
              },
          ],
        });
      } else {
        response = await Soal.findOne({
          attributes: { exclude: ["kelaId"] },
          where: {
            [Op.and]: [{ id: req.params.id }, { userId: req.userId }],
          },
          include: [
            {
              model: Users,
              attributes: ["username", "email", "role"],
            },
            {
              model: Kelas,
              attributes: ["id", "kelas"],
              as: "kelas",
            },
            {
                model: Pelajaran,
                attributes: ["id", "pelajaran"],
                as: "pelajaran",
              },
          ],
        });
      }
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const createSoal = async (req, res) => {
    const soal = req.body.soal;
    const optionA = req.body.optionA;
    const optionB = req.body.optionB;
    const optionC = req.body.optionC;
    const optionD = req.body.optionD;
    const optionE = req.body.optionE;
    const correctAnswer = req.body.correctAnswer;
    const kelasId = req.body.kelasId;
    const pelajaranId = req.body.pelajaranId;

    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID not found in the request" });
        }

        await Soal.create({
            soal: soal,
            optionA: optionA,
            optionB: optionB,
            optionC: optionC,
            optionD: optionD,
            optionE: optionE,
            correctAnswer: correctAnswer,
            kelasId: kelasId,
            pelajaranId: pelajaranId,
            userId: req.userId
        });

        res.json({ msg: "Soal Created" });
    } catch (error) {
        console.log(error);
    }
};

const updateSoal = async (req, res) => {
    try {
        await Soal.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Soal Updated" })
    } catch (error) {
        console.log(error.message);
    }
};

const deleteSoal = async (req, res) => {
    try {
        await Soal.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Soal Deleted" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
  getAllSoal,
  getSoal,
  getSoalById,
  createSoal,
  updateSoal,
  deleteSoal,
};
