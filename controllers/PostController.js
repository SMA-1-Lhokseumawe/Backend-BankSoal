const Post = require("../models/PostModel.js");
const Users = require("../models/UserModel.js");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

const getAllPost = async (req, res) => {
  try {
    const response = await Post.findAll({
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

const getPost = async (req, res) => {
    try {
        if (req.role === "admin") {
            const response = await Post.findAll({
                include: [
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    }
                ],
            });
            res.status(200).json(response);
        } else {
            const response = await Post.findAll({
                where: {
                    userId: req.userId,
                },
                include: [
                    {
                        model: Users,
                        attributes: ['username', 'email', 'role']
                    },
                ],
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const createPost = async (req, res) => {
    try {
      const judul = req.body.judul;
      const content = req.body.content;
      const kategori = req.body.kategori;
  
      // Default values if no image is uploaded
      let fileName = null;
      let url = null;
  
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
  
      // Create the post record
      await Post.create({
        judul: judul,
        content: content,
        kategori: kategori,
        image: fileName,
        url: url,
        userId: req.userId,
      });
  
      res.status(201).json({
        status: true,
        message: "Post berhasil ditambahkan",
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        status: false,
        message: "Gagal menambahkan Post",
        error: error.message,
      });
    }
  };

  const updatePost = async (req, res) => {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!post) return res.status(404).json({ msg: "No Data Found" });
  
    let fileName = post.image;
  
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const now = Date.now();
      fileName = now + file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];
  
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Image Format" });
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }
  
      // Delete the old image file
      const filepath = `./public/images/${post.image}`;
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath); // Delete the old image
      }
  
      // Move the new file
      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    const judul = req.body.judul;
    const content = req.body.content;
    const kategori = req.body.kategori;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  
    try {
      await Post.update(
        {
          judul: judul,
          content: content,
          kategori: kategori,
          image: fileName,
          url: url,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ msg: "Post Updated Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deletePost = async (req, res) => {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!post) return res.status(404).json({ msg: "No Data Found" });
  
    try {
      const filepath = `./public/images/${post.image}`;
      fs.unlinkSync(filepath);
      await Post.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ msg: "Post Deleted Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports = {
    getAllPost,
    getPost,
    createPost,
    updatePost,
    deletePost,
  };