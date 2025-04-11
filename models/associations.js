// associations.js
const Users = require("./UserModel");
const Post = require("./PostModel");
const Komentar = require("./KomentarModel");

function setupAssociations() {
  // User Associations
  Users.hasMany(Post, { foreignKey: 'userId' });
  Post.belongsTo(Users, { foreignKey: 'userId' });

  Users.hasMany(Komentar, { foreignKey: 'userId' });
  Komentar.belongsTo(Users, { foreignKey: 'userId' });

  // Post Associations
  Post.hasMany(Komentar, { 
    foreignKey: 'postId', 
    onDelete: 'CASCADE',
    hooks: true
  });
  Komentar.belongsTo(Post, { 
    foreignKey: 'postId', 
    as: 'post',
    onDelete: 'CASCADE',
    hooks: true
  });
}

module.exports = setupAssociations;