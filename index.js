const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const db = require("./config/Database.js");
const SequelizeStore = require("connect-session-sequelize");
const cookieParser = require("cookie-parser");
const FileUpload = require("express-fileupload");
const cors = require("cors");
const session = require("express-session");
const setupAssociations = require('./models/associations');

setupAssociations();
const AuthRoute = require("./routes/AuthRoute.js");
const UserRoute = require("./routes/UserRoute.js");
const SiswaRoute = require("./routes/SiswaRoute.js");
const GuruRoute = require("./routes/GuruRoute.js");
const KelasRoute = require("./routes/KelasRoute.js");
const PelajaranRoute = require("./routes/PelajaranRoute.js");
const ModulRoute = require("./routes/ModulRoute.js");
const SubModulRoute = require("./routes/SubModulRoute.js");
const PostRoute = require("./routes/PostRoute.js");
const KomentarRoute = require("./routes/KomentarRoute.js");
const SoalRoute = require("./routes/SoalRoute.js");
const NilaiRoute = require("./routes/NilaiRoute.js");
const UploadImageRoute = require("./routes/UploadImageRoute.js");

dotenv.config();
const app = express();

const sessionStore = SequelizeStore(session.Store)

const store = new sessionStore({
    db: db
})
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}));
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use("/images", express.static("./public/images"))

app.use(AuthRoute);
app.use(UserRoute);
app.use(SiswaRoute);
app.use(GuruRoute);
app.use(KelasRoute);
app.use(PelajaranRoute);
app.use(ModulRoute);
app.use(SubModulRoute);
app.use(PostRoute);
app.use(KomentarRoute);
app.use(SoalRoute);
app.use(NilaiRoute);
app.use(UploadImageRoute);

app.listen(process.env.APP_PORT, ()=> console.log("Server Sedang berjalan"));