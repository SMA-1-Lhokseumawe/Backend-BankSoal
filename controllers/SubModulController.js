const SubModul = require("../models/SubModulModel.js");
const Modul = require("../models/ModulModel.js");
const Users = require("../models/UserModel.js");

const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

const getSubModul = async (req, res) => {
  try {
    if (req.role === "admin" || req.role === "guru") {
      const response = await SubModul.findAll({
        include: [
          {
            model: Modul,
            attributes: ["id", "judul"],
            as: "modul",
          },
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
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
            attributes: ["username", "email", "role"],
          },
          {
            model: Modul,
            attributes: ["id", "judul"],
            as: "modul",
          },
        ],
      });
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getSubModulById = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "guru" || req.role === "siswa") {
      response = await SubModul.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
          {
            model: Modul,
            attributes: ["id", "judul"],
            as: "modul",
          },
        ],
      });
    } else {
      response = await SubModul.findOne({
        where: {
          [Op.and]: [{ id: req.params.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
          {
            model: Modul,
            attributes: ["id", "judul"],
            as: "modul",
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const getSubModulByModulId = async (req, res) => {
  try {
    const modulId = req.params.modulId;

    if (!modulId) {
      return res.status(400).json({ msg: "ModulId is required" });
    }

    let response;
    if (req.role === "admin" || req.role === "guru" || req.role === "siswa") {
      // Admin and teachers can access all subModuls for a specific modul
      response = await SubModul.findAll({
        where: {
          modulId: modulId,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
          {
            model: Modul,
            attributes: ["id", "judul"],
            as: "modul",
          },
        ],
        order: [["createdAt", "ASC"]], // Order by creation date
      });
    } else {
      // Regular users can only see subModuls they created or have access to
      response = await SubModul.findAll({
        where: {
          [Op.and]: [{ modulId: modulId }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
          {
            model: Modul,
            attributes: ["id", "judul"],
            as: "modul",
          },
        ],
        order: [["createdAt", "ASC"]], // Order by creation date
      });
    }

    if (response.length === 0) {
      return res
        .status(404)
        .json({ msg: "No sub modules found for this modul" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createSubModul = async (req, res) => {
  const subJudul = req.body.subJudul;
  const subDeskripsi = req.body.subDeskripsi;
  const content = req.body.content;
  const modulId = req.body.modulId;

  try {
    const userId = req.userId;

    let fileNameAudio = null;
    let fileNameVideo = null;
    let urlAudio = null;
    let urlVideo = null;

    // Check if files were uploaded
    if (req.files) {
      // Handle audio file
      if (req.files.audioFile) {
        const audioFile = req.files.audioFile;
        const audioSize = audioFile.data.length;
        const audioExt = path.extname(audioFile.name);
        const now = Date.now();
        fileNameAudio = now + audioFile.md5 + audioExt;
        urlAudio = `${req.protocol}://${req.get(
          "host"
        )}/audios/${fileNameAudio}`;
        const allowedAudioTypes = [".mp3", ".wav"];

        // Validate audio file type
        if (!allowedAudioTypes.includes(audioExt.toLowerCase()))
          return res.status(422).json({ msg: "Invalid Audio File Type" });

        // Validate audio file size
        if (audioSize > 10000000)
          return res.status(422).json({ msg: "Audio must be less than 10 MB" });

        // Save audio file
        audioFile.mv(`./public/audios/${fileNameAudio}`, (err) => {
          if (err) return res.status(500).json({ msg: err.message });
        });
      }

      // Handle video file
      if (req.files.videoFile) {
        const videoFile = req.files.videoFile;
        const videoSize = videoFile.data.length;
        const videoExt = path.extname(videoFile.name);
        const now = Date.now();
        fileNameVideo = now + videoFile.md5 + videoExt;
        urlVideo = `${req.protocol}://${req.get(
          "host"
        )}/videos/${fileNameVideo}`;
        const allowedVideoTypes = [".mp4", ".avi", ".mov"];

        // Validate video file type
        if (!allowedVideoTypes.includes(videoExt.toLowerCase()))
          return res.status(422).json({ msg: "Invalid Video File Type" });

        // Validate video file size
        if (videoSize > 50000000)
          return res.status(422).json({ msg: "Video must be less than 50 MB" });

        // Save video file
        videoFile.mv(`./public/videos/${fileNameVideo}`, (err) => {
          if (err) return res.status(500).json({ msg: err.message });
        });
      }
    }

    console.log(req.files);

    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID not found in the request" });
    }

    await SubModul.create({
      subJudul: subJudul,
      subDeskripsi: subDeskripsi,
      content: content,
      modulId: modulId,
      audio: fileNameAudio,
      video: fileNameVideo,
      urlAudio: urlAudio,
      urlVideo: urlVideo,
      userId: req.userId,
    });

    res.json({ msg: "Sub Modul Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error occurred while creating sub modul" });
  }
};

const updateSubModul = async (req, res) => {
    try {
      const subModul = await SubModul.findOne({
        where: {
          id: req.params.id,
        },
      });
  
      if (!subModul) {
        return res.status(404).json({ msg: "Sub Modul not found" });
      }
  
      // Default to existing values
      let fileNameAudio = subModul.audio;
      let fileNameVideo = subModul.video;
      let urlAudio = subModul.urlAudio;
      let urlVideo = subModul.urlVideo;
  
      // Handle audio deletion
      if (req.body.deleteAudio === "true") {
        // Delete the audio file
        const audioPath = `./public/audios/${subModul.audio}`;
        if (fs.existsSync(audioPath) && subModul.audio) {
          fs.unlinkSync(audioPath);
        }
        // Set audio to null
        fileNameAudio = null;
        urlAudio = null;
      }
      // Handle video deletion
      else if (req.body.deleteVideo === "true") {
        // Delete the video file
        const videoPath = `./public/videos/${subModul.video}`;
        if (fs.existsSync(videoPath) && subModul.video) {
          fs.unlinkSync(videoPath);
        }
        // Set video to null
        fileNameVideo = null;
        urlVideo = null;
      }
  
      // Handle audio file update
      if (req.files && req.files.audioFile) {
        const audioFile = req.files.audioFile;
        const audioSize = audioFile.data.length;
        const audioExt = path.extname(audioFile.name);
        const now = Date.now();
        fileNameAudio = now + audioFile.md5 + audioExt;
        urlAudio = `${req.protocol}://${req.get("host")}/audios/${fileNameAudio}`;
        const allowedAudioTypes = [".mp3", ".wav"];
  
        if (!allowedAudioTypes.includes(audioExt.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Audio File Type" });
        }
        if (audioSize > 10000000) {
          return res.status(422).json({ msg: "Audio must be less than 10 MB" });
        }
  
        // Delete the old audio file if it exists
        const oldAudioPath = `./public/audios/${subModul.audio}`;
        if (fs.existsSync(oldAudioPath) && subModul.audio) {
          fs.unlinkSync(oldAudioPath); // Delete old audio file
        }
  
        // Save the new audio file
        audioFile.mv(`./public/audios/${fileNameAudio}`, (err) => {
          if (err) return res.status(500).json({ msg: err.message });
        });
      }
  
      // Handle video file update
      if (req.files && req.files.videoFile) {
        const videoFile = req.files.videoFile;
        const videoSize = videoFile.data.length;
        const videoExt = path.extname(videoFile.name);
        const now = Date.now();
        fileNameVideo = now + videoFile.md5 + videoExt;
        urlVideo = `${req.protocol}://${req.get("host")}/videos/${fileNameVideo}`;
        const allowedVideoTypes = [".mp4", ".avi", ".mov"];
  
        if (!allowedVideoTypes.includes(videoExt.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Video File Type" });
        }
        if (videoSize > 50000000) {
          return res.status(422).json({ msg: "Video must be less than 50 MB" });
        }
  
        // Delete the old video file if it exists
        const oldVideoPath = `./public/videos/${subModul.video}`;
        if (fs.existsSync(oldVideoPath) && subModul.video) {
          fs.unlinkSync(oldVideoPath); // Delete old video file
        }
  
        // Save the new video file
        videoFile.mv(`./public/videos/${fileNameVideo}`, (err) => {
          if (err) return res.status(500).json({ msg: err.message });
        });
      }
  
      // Update the SubModul record
      const { subJudul, subDeskripsi, content, modulId } = req.body;
      await SubModul.update(
        {
          subJudul: subJudul,
          subDeskripsi: subDeskripsi,
          content: content,
          modulId: modulId,
          audio: fileNameAudio,
          video: fileNameVideo,
          urlAudio: urlAudio,
          urlVideo: urlVideo,
          userId: req.userId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
  
      res.status(200).json({ msg: "Sub Modul Updated Successfully" });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ msg: "Failed to update Sub Modul", error: error.message });
    }
  };

const deleteSubModul = async (req, res) => {
  try {
    const subModul = await SubModul.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!subModul) {
      return res.status(404).json({ msg: "Sub Modul not found" });
    }

    // Delete the audio file
    if (subModul.audio) {
      const audioPath = `./public/audios/${subModul.audio}`;
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath); // Delete audio file
      }
    }

    // Delete the video file
    if (subModul.video) {
      const videoPath = `./public/videos/${subModul.video}`;
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath); // Delete video file
      }
    }

    // Delete the SubModul record
    await SubModul.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Sub Modul Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ msg: "Failed to delete Sub Modul", error: error.message });
  }
};

module.exports = {
  getSubModul,
  getSubModulById,
  getSubModulByModulId,
  createSubModul,
  updateSubModul,
  deleteSubModul,
};
