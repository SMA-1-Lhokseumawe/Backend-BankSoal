const Komentar = require("../models/KomentarModel.js");
const Users = require("../models/UserModel.js");
const Post = require("../models/PostModel.js");
const Notification = require("../models/NotificationModel.js");

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
  const namaProfile = req.body.namaProfile;
  const urlImageProfile = req.body.urlImageProfile;

  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID not found in the request" });
    }

    // Create the comment
    const newComment = await Komentar.create({
      content: content,
      postId: postId,
      namaProfile: namaProfile,
      urlImageProfile: urlImageProfile,
      userId: userId,
    });

    // Find the post to get the post owner's userId
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Only create notification if the commenter is not the post owner
    if (post.userId !== userId && Notification && typeof Notification.create === 'function') {
      try {
        // Get commenter's username for notification content
        const commenter = await Users.findByPk(userId, {
          attributes: ['username']
        });

        // Get post title for more descriptive notification
        const postTitle = post.judul || 'your post';

        // Create notification for the post owner
        await Notification.create({
          content: `${commenter.username} commented on "${postTitle}": "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
          type: 'comment',
          urlImageProfile: urlImageProfile,
          isRead: false,
          postId: postId,
          sourceUserId: userId, // Person who commented
          targetUserId: post.userId // Post owner
        });
        
        console.log('Notification created successfully');
      } catch (notifError) {
        // Just log the notification error but don't fail the comment creation
        console.error('Error creating notification:', notifError);
      }
    }

    res.json({ msg: "Komentar Created", comment: newComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const updateKomentar = async (req, res) => {
    try {
        await Komentar.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Komentar Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
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
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = {
    getAllKomentar,
    createKomentar,
    updateKomentar,
    deleteKomentar,
};