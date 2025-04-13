// associations.js
const Users = require("./UserModel");
const Guru = require("./GuruModel");
const Siswa = require("./SiswaModel");
const Modul = require("./ModulModel");
const SubModul = require("./SubModulModel");
const Post = require("./PostModel");
const Komentar = require("./KomentarModel");
const Soal = require("./SoalModel");
const Nilai = require("./NilaiModel");
const Pelajaran = require("./PelajaranModel");
const Kelas = require("./KelasModel");
const UploadImage = require("./UploadImageModel");

function setupAssociations() {
  // User Associations
  Users.hasMany(Guru);
  Guru.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(Siswa);
  Siswa.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(Kelas);
  Kelas.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(Pelajaran);
  Pelajaran.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(Modul);
  Modul.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(SubModul);
  SubModul.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(Post, { foreignKey: "userId" });
  Post.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(Komentar, { foreignKey: "userId" });
  Komentar.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(Soal, { foreignKey: "userId" });
  Soal.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(Nilai, { foreignKey: "userId" });
  Nilai.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(UploadImage, { foreignKey: "userId" });
  UploadImage.belongsTo(Users, { foreignKey: "userId" });

  // Kelas Associations
  Kelas.hasMany(Pelajaran, {
    foreignKey: "kelasId",
    onDelete: "CASCADE",
    hooks: true
  });
  Pelajaran.belongsTo(Kelas, { 
    foreignKey: "kelasId", 
    as: "kelas",
    onDelete: "CASCADE",
    hooks: true
  });

  Kelas.hasMany(Siswa, {
    foreignKey: "kelasId",
    onDelete: "CASCADE",
    hooks: true
  });
  Siswa.belongsTo(Kelas, { 
    foreignKey: "kelasId", 
    as: "kelas",
    onDelete: "CASCADE",
    hooks: true
  });

  // Post Associations
  Post.hasMany(Komentar, {
    foreignKey: "postId",
    onDelete: "CASCADE",
    hooks: true,
  });
  Komentar.belongsTo(Post, {
    foreignKey: "postId",
    as: "post",
    onDelete: "CASCADE",
    hooks: true,
  });

  // Soal Associations
  Kelas.hasMany(Soal, {
    foreignKey: "kelasId",
    onDelete: "CASCADE",
    hooks: true,
  });
  Soal.belongsTo(Kelas, {
    foreignKey: "kelasId",
    as: "kelas",
    onDelete: "CASCADE",
    hooks: true,
  });

  Pelajaran.hasMany(Soal, {
    foreignKey: "pelajaranId",
    onDelete: "CASCADE",
    hooks: true,
  });
  Soal.belongsTo(Pelajaran, {
    foreignKey: "pelajaranId",
    as: "pelajaran",
    onDelete: "CASCADE",
    hooks: true,
  });

  // Modul Associations
  Kelas.hasMany(Modul, {
    foreignKey: "kelasId",
    onDelete: "CASCADE",
    hooks: true,
  });
  Modul.belongsTo(Kelas, {
    foreignKey: "kelasId",
    as: "kelas",
    onDelete: "CASCADE",
    hooks: true,
  });

  Pelajaran.hasMany(Modul, {
    foreignKey: "pelajaranId",
    onDelete: "CASCADE",
    hooks: true,
  });
  Modul.belongsTo(Pelajaran, {
    foreignKey: "pelajaranId",
    as: "pelajaran",
    onDelete: "CASCADE",
    hooks: true,
  });

  // SubModul Associations
  Modul.hasMany(SubModul, {
    foreignKey: "modulId",
    onDelete: "CASCADE",
    hooks: true,
  });
  SubModul.belongsTo(Modul, {
    foreignKey: "modulId",
    as: "modul",
    onDelete: "CASCADE",
    hooks: true,
  });

  // Nilai Associations
  Pelajaran.hasMany(Nilai, {
    foreignKey: "pelajaranId",
    onDelete: "CASCADE",
    hooks: true,
  });
  Nilai.belongsTo(Pelajaran, {
    foreignKey: "pelajaranId",
    as: "pelajaran",
    onDelete: "CASCADE",
    hooks: true,
  });

  Kelas.hasMany(Nilai, {
    foreignKey: "kelasId",
    onDelete: "CASCADE",
    hooks: true,
  });
  Nilai.belongsTo(Kelas, {
    foreignKey: "kelasId",
    as: "kelas",
    onDelete: "CASCADE",
    hooks: true,
  });

  Siswa.hasMany(Nilai, {
    foreignKey: "siswaId",
    onDelete: "CASCADE",
    hooks: true,
  });
  Nilai.belongsTo(Siswa, {
    foreignKey: "siswaId",
    as: "siswa",
    onDelete: "CASCADE",
    hooks: true,
  });
}

module.exports = setupAssociations;
