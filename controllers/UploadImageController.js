const UploadImage = require("../models/UploadImageModel.js");
const Users = require("../models/UserModel.js");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

const getImage = async (req, res) => {
  try {
    const response = await UploadImage.findAll({
      include: [
        {
          model: Users,
          attributes: ["username", "email", "role"],
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

const getImageById = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "guru") {
      response = await UploadImage.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
        ],
      });
    } else {
      response = await UploadImage.findOne({
        where: {
          [Op.and]: [{ id: req.params.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createImage = async (req, res) => {
  try {
    // Default values if no image is uploaded
    if (req.files === null)
        return res.status(400).json({ msg: "No File Uploaded" });

    // Check if a file was uploaded
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const now = Date.now();
      fileName = now + file.md5 + ext;
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];

      // Validate file type
      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Image" });

      // Validate file size
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

      // Save the file
      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    // Create the student record
    const image = await UploadImage.create({
      image: fileName,
      url: url,
      userId: req.userId,
    });

    res.status(201).json({
      status: true,
      message: "Image berhasil ditambahkan",
      data: {
        url: image.url,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: false,
      message: "Gagal menambahkan image",
      error: error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  const image = await UploadImage.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!image) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${image.image}`;
    fs.unlinkSync(filepath);
    await UploadImage.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Image Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getImage,
  getImageById,
  createImage,
  deleteImage,
};
