// ------------------- Authentication -----------

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("./models/user.model.js");

// db connect

mongoose
  .connect("mongodb://127.0.0.1/user-crud")
  .then(() => console.log("DB Connected"));

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");



// setting session
app.use(
  session({
    secret: "sessionkey",
    resave: false,
    saveUninitialized: false,
  })
);


let checkLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else res.redirect("login");
};

app.get("/", checkLogin, (req, res) => {
  res.send(`<h1>Home Page</h1> <p>hello ${req.session.user} </p>
    <a href='/logout'>logout</a>
    `);
});
app.get("/profile", checkLogin, (req, res) => {
  res.send(
    `<h1>Profile Page</h1> <p>hello ${req.session.user} </p> <a href='/logout'>logout</a>`
  );
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("login", { error: null });
  }
});
app.get("/register", (req, res) => {
  res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
  const { userName, userPassword, age } = req.body;
  const hashPass = await bcrypt.hash(userPassword, 10);
  // res.send({ userName, userPassword: hashPass });

  await User.create({ userName, userPassword: hashPass, age });
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { userName, userpassword } = req.body;

  const user = await User.findOne({ userName });
  if (!user) return res.render("login", { error: "User not found" });

  const isMatch = await bcrypt.compare(userpassword, user.userPassword);

  if (!isMatch) return res.render("login", { error: "invalid password" });

  req.session.user = userName; // session using username
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(3000, () => {
  console.log("server is running on 3000");
});

// ---------------------------- session -------

// const { urlencoded } = require("body-// parser");
// const express = require("express
// const MongoStore = require("connect-mongo");");//
// const app = express();//

// const path - session =//  require("// path");
// cons// t multer = require("multer");
// // const { error } = re// quire("console");
// app.use(ex
// //     store: MongoStore.create({
// //       mongoUrl: `mongodb://127.0.0.1:27017/sessiondb`,
// //       collectionName: "mysessions",
// //       // ttl: 1000 * 60 * 60,   ttl workas cookie
// //     }),pr// ess.urlencoded({ extended: false }));
// ap.use(e// xpress// .json(// app.get("/", (req, res) => {
//   res.send(`<h1>heading 1</h1> ${req.session.username}`);
// });

// app.get("/set-username", (req, res) => {
//   req.session.username = "YahuBaba"; //creating seesion called username
//   res.send(`<h1>username has been set in session</h1>`);
// });

// ));ggetsetget-username("view engine", "ejs//   if (req.session.username) {
//     res.send(
//       `<h1>username has been get in session: ${req.session.username}</h1>`
//     );
//   } else {
//     res.send(`<h1>no username found in session</h1>`);
//   }e // + "

// app.get("/destroy", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       res.status(500).send("Failed to destroy session");
//     }
//     res.send(`<h1>Session destroy successfully</h1>`);
//   });
// });/vie// app.listen(3000, () => {
//   console.log("server is running");
// });;

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//   filename: (req, file, cb) => {
//     const newFileName = Date.now() + path.extname(file.originalname);
//     cb(null, newFileName);
//   },
// });

// const filterfile = (req, file, cb) => {
//   if (file.fieldname == "userprofile") {
//     if (
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg" ||
//       file.mimetype == "image/png"
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error(`only images are allowed!`), false);
//     }
//   } else if (file.fieldname == "userdocument") {
//     if (file.mimetype == "application/pdf") {
//       cb(null, true);
//     } else {
//       cb(new Error(`Only PDF are allowed for documents`, false));
//     }
//   } else {
//     cb(new Error(`Unknown Field`, false));
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: filterfile,
// });

// app.post("/submitform", upload.array("document", 3), (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).send("No file uploaded");
//   }
//   // Send filenames of uploaded files
//   const filenames = req.files.map(file => file.filename);
//   res.send({ uploaded: filenames });
// });

// app.post(
//   "/submitform",
//   upload.fields([
//     { name: "userprofile", maxCount: 1 },
//     { name: "userdocument", maxCount: 3 },
//   ]),
//   (req, res) => {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).send("No file uploaded");
//     }
//     // Collect filenames from all uploaded fields
//     const filenames = [];
//     Object.values(req.files).forEach((arr) => {
//       arr.forEach((file) => filenames.push(file.filename));
//     });
//     res.send({ uploaded: filenames });
//   }
// );

// app.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code == "LIMIT_UNEXPECTED_FILE") {
//       return res.status(400).send(`Error : too many file uploaded!`);
//     }

//     return res
//       .status(400)
//       .send(`multer Error: ${error.message}  :${error.code}`);
//   } else if (error) {
//     return res.status(500).send(`something went wrong:${error.message}`);
//   }
//   next();
// });

// const port = process.env.PORT || 5000;

// app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
