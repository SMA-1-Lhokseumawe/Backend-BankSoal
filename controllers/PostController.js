const Post = require("../models/PostModel.js");
const Komentar = require("../models/KomentarModel.js");
const Users = require("../models/UserModel.js");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

const getAllPost = async (req, res) => {
  try {
    const post = await Post.findAll({
      include: [
        {
          model: Users,
          attributes: ["username", "email", "role"],
        },
      ],
    });

    const parsedPost = post.map((item) => {
      let kategori = item.kategori;
      let images = item.images;
      let url = item.url;

      if (typeof kategori === "string") {
        try {
          kategori = JSON.parse(kategori); // Parse string JSON menjadi array
        } catch (error) {
          console.error(
            `Failed to parse kategori for Post ID ${item.id}:`,
            error.message
          );
        }
      }

      if (typeof images === "string") {
        try {
          images = JSON.parse(images); // Parse string JSON menjadi array
        } catch (error) {
          console.error(
            `Failed to parse images for Post ID ${item.id}:`,
            error.message
          );
        }
      }

      if (typeof url === "string") {
        try {
          url = JSON.parse(url); // Parse string JSON menjadi array
        } catch (error) {
          console.error(
            `Failed to parse url for Post ID ${item.id}:`,
            error.message
          );
        }
      }

      return {
        ...item.toJSON(),
        kategori: kategori,
        images: images, // Pastikan ini adalah array
        url: url, // Pastikan ini adalah array
      };
    });
    res.status(200).json(parsedPost);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const getAllPostWithoutComment = async (req, res) => {
  try {
    const post = await Post.findAll({
      include: [
        {
          model: Users,
          attributes: ["username", "email", "role"],
        },
        {
          model: Komentar,
          required: false,
        },
      ],
    });

    const parsedPost = post.map((item) => {
      let kategori = item.kategori;
      let images = item.images;
      let url = item.url;

      if (typeof kategori === "string") {
        try {
          kategori = JSON.parse(kategori); // Parse string JSON menjadi array
        } catch (error) {
          console.error(
            `Failed to parse kategori for Post ID ${item.id}:`,
            error.message
          );
        }
      }

      if (typeof images === "string") {
        try {
          images = JSON.parse(images); // Parse string JSON menjadi array
        } catch (error) {
          console.error(
            `Failed to parse images for Post ID ${item.id}:`,
            error.message
          );
        }
      }

      if (typeof url === "string") {
        try {
          url = JSON.parse(url); // Parse string JSON menjadi array
        } catch (error) {
          console.error(
            `Failed to parse url for Post ID ${item.id}:`,
            error.message
          );
        }
      }

      return {
        ...item.toJSON(),
        kategori: kategori,
        images: images, // Pastikan ini adalah array
        url: url, // Pastikan ini adalah array
      };
    });

    const filteredPost = parsedPost.filter((item) => item.komentars.length === 0);

    res.status(200).json(filteredPost);
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
            attributes: ["username", "email", "role"],
          },
        ],
      });

      const parsedPost = response.map((item) => {
        let kategori = item.kategori;
        let images = item.images;
        let url = item.url;

        if (typeof kategori === "string") {
          try {
            kategori = JSON.parse(kategori); // Parse string JSON menjadi array
          } catch (error) {
            console.error(
              `Failed to parse kategori for Post ID ${item.id}:`,
              error.message
            );
          }
        }

        if (typeof images === "string") {
          try {
            images = JSON.parse(images); // Parse string JSON menjadi array
          } catch (error) {
            console.error(
              `Failed to parse images for Post ID ${item.id}:`,
              error.message
            );
          }
        }

        if (typeof url === "string") {
          try {
            url = JSON.parse(url); // Parse string JSON menjadi array
          } catch (error) {
            console.error(
              `Failed to parse url for Post ID ${item.id}:`,
              error.message
            );
          }
        }

        return {
          ...item.toJSON(),
          kategori: kategori,
          images: images, // Pastikan ini adalah array
          url: url, // Pastikan ini adalah array
        };
      });
      res.status(200).json(parsedPost);
    } else {
      const response = await Post.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
        ],
      });

      const parsedPost = response.map((item) => {
        let kategori = item.kategori;
        let images = item.images;
        let url = item.url;

        if (typeof kategori === "string") {
          try {
            kategori = JSON.parse(kategori); // Parse string JSON menjadi array
          } catch (error) {
            console.error(
              `Failed to parse kategori for Post ID ${item.id}:`,
              error.message
            );
          }
        }

        if (typeof images === "string") {
          try {
            images = JSON.parse(images); // Parse string JSON menjadi array
          } catch (error) {
            console.error(
              `Failed to parse images for Post ID ${item.id}:`,
              error.message
            );
          }
        }

        if (typeof url === "string") {
          try {
            url = JSON.parse(url); // Parse string JSON menjadi array
          } catch (error) {
            console.error(
              `Failed to parse url for Post ID ${item.id}:`,
              error.message
            );
          }
        }

        return {
          ...item.toJSON(),
          kategori: kategori,
          images: images, // Pastikan ini adalah array
          url: url, // Pastikan ini adalah array
        };
      });
      res.status(200).json(parsedPost);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createPost = async (req, res) => {
  console.log("Body data: ", req.body); // Debug body input
  console.log("File data: ", req.files); // Debug file input

  const { judul, content, kategori, namaProfile, urlImageProfile } = req.body;
  let imagePaths = [];
  let urls = [];

  // Check if files were uploaded
  if (req.files && req.files.files) {
    // Pastikan files adalah array, jika hanya ada satu gambar maka ubah jadi array
    const files = Array.isArray(req.files.files)
      ? req.files.files
      : [req.files.files];
    const allowedType = [".png", ".jpg", ".jpeg"];

    // Proses semua file yang diunggah
    for (const file of files) {
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const now = Date.now();
      const fileName = `${now}${file.md5}${ext}`;
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      // Validasi ekstensi file
      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: `Invalid Image: ${file.name}` });

      // Validasi ukuran file
      if (fileSize > 5000000)
        return res
          .status(422)
          .json({ msg: `Image ${file.name} must be less than 5 MB` });

      // Pindahkan file ke folder images
      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });

      // Menambahkan nama file dan URL ke array
      imagePaths.push(fileName);
      urls.push(url);
    }
  }

  try {
    // Process kategori whether it's a string or already an array
    const processedKategori = typeof kategori === "string" 
      ? kategori.split(",").map((f) => f.trim()) 
      : kategori || [];

    const post = await Post.create({
      judul,
      content,
      kategori: processedKategori,
      namaProfile,
      urlImageProfile,
      images: imagePaths,
      url: urls,
      userId: req.userId,
    });
    
    res.status(201).json({ id: post.id, msg: "Post berhasil di tambahkan" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updatePost = async (req, res) => {
  // Ambil gambar yang dihapus dari request
  const removedImages = JSON.parse(req.body.removedImages || "[]");

  const post = await Post.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!post) return res.status(404).json({ msg: "No Data Found" });

  let imagePaths = Array.isArray(post.images)
    ? post.images
    : JSON.parse(post.images || "[]");
  let urls = [];
  const allowedType = [".png", ".jpg", ".jpeg"];

  // Proses gambar lama dan tambahkan ke array jika diperlukan
  imagePaths.forEach((image) => {
    const url = `${req.protocol}://${req.get("host")}/images/${image}`;
    urls.push(url);
  });

  // Proses file baru
  if (req.files && req.files.files) {
    const files = Array.isArray(req.files.files)
      ? req.files.files
      : [req.files.files];

    for (const file of files) {
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const now = Date.now();
      const fileName = now + file.md5 + ext;

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: `Invalid Image: ${file.name}` });
      if (fileSize > 5000000)
        return res
          .status(422)
          .json({ msg: `Image ${file.name} must be less than 5 MB` });

      const filepath = `./public/images/${fileName}`;

      file.mv(filepath, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });

      // Tambahkan file dan URL baru ke array
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
      imagePaths.push(fileName);
      urls.push(url);
    }
  }

  // Hapus gambar yang sudah tidak digunakan
  removedImages.forEach((image) => {
    const imagePath = `./public/images/${image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Menghapus gambar dari server
    }
    imagePaths = imagePaths.filter((img) => img !== image); // Filter gambar yang dihapus
    urls = urls.filter((url) => !url.includes(image)); // Filter URL gambar yang dihapus
  });

  // Update data Post
  const { judul, content, kategori, namaProfile, urlImageProfile } = req.body;

  let kategoriArray = kategori;
  if (typeof kategori === "string") {
    kategoriArray = kategori.split(",").map((f) => f.trim());
  }

  try {
    await Post.update(
      {
        judul,
        content,
        kategori: kategoriArray,
        namaProfile,
        urlImageProfile,
        images: imagePaths,
        url: urls,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Post Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
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
    // Cek apakah post.images adalah array atau string JSON
    let images = post.images;

    // Jika post.images adalah string, parsing menjadi array
    if (typeof images === "string") {
      try {
        images = JSON.parse(images); // Parsing string JSON menjadi array
      } catch (error) {
        console.error(
          `Gagal parsing images untuk Post ID ${post.id}:`,
          error.message
        );
        return res
          .status(500)
          .json({ msg: "Gagal menghapus gambar, format data gambar salah." });
      }
    }

    // Menyimpan status keberhasilan penghapusan gambar
    let imageDeletionSuccess = true;

    // Menghapus gambar
    for (const image of images) {
      // Membuat path absolut ke file gambar
      const filepath = path.join(__dirname, "..", "public", "images", image);

      try {
        // Menghapus file menggunakan fs.promises.unlink
        await fs.promises.unlink(filepath);
      } catch (err) {
        imageDeletionSuccess = false;
        console.error(`Gagal menghapus file: ${filepath}`, err);
      }
    }

    // Jika ada gambar yang gagal dihapus, batalkan penghapusan data post
    if (!imageDeletionSuccess) {
      return res.status(500).json({
        msg: "Gagal menghapus gambar. Data post tidak dapat dihapus.",
      });
    }

    // Hapus data post dari database
    await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Post Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  getAllPost,
  getAllPostWithoutComment,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
