const Komentar = require("../models/KomentarModel.js");
const Users = require("../models/UserModel.js");

const getAllKomentar = async (req, res) => {
  try {
    const response = await Komentar.findAll({
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

const createKomentar = async (req, res) => {
  const content = req.body.content;
  const postId = req.body.postId;

  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID not found in the request" });
    }

    await Komentar.create({
      content: content,
      postId: postId,
      userId: req.userId,
    });

    res.json({ msg: "Komentar Created" });
  } catch (error) {
    console.log(error);
  }
};

const updateKomentar = async (req, res) => {
    try {
        await Komentar.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Komentar Updated" })
    } catch (error) {
        console.log(error.message);
    }
};

const deleteKomentar = async (req, res) => {
    try {
        await Komentar.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Komentar Deleted" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getAllKomentar,
    createKomentar,
    updateKomentar,
    deleteKomentar,
  };