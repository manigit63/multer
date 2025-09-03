const { urlencoded } = require("body-parser");
const express = require("express");
const app = express();

const path = require("path");
const multer = require("multer");
const { error } = require("console");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
// app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("upload");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

const filterfile = (req, file, cb) => {
  if (file.fieldname == "userprofile") {
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error(`only images are allowed!`), false);
    }
  } else if (file.fieldname == "userdocument") {
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error(`Only PDF are allowed for documents`, false));
    }
  } else {
    cb(new Error(`Unknown Field`, false));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: filterfile,
});

// app.post("/submitform", upload.array("document", 3), (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).send("No file uploaded");
//   }
//   // Send filenames of uploaded files
//   const filenames = req.files.map(file => file.filename);
//   res.send({ uploaded: filenames });
// });

app.post(
  "/submitform",
  upload.fields([
    { name: "userprofile", maxCount: 1 },
    { name: "userdocument", maxCount: 3 },
  ]),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No file uploaded");
    }
    // Collect filenames from all uploaded fields
    const filenames = [];
    Object.values(req.files).forEach((arr) => {
      arr.forEach((file) => filenames.push(file.filename));
    });
    res.send({ uploaded: filenames });
  }
);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code == "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send(`Error : too many file uploaded!`);
    }

    return res
      .status(400)
      .send(`multer Error: ${error.message}  :${error.code}`);
  } else if (error) {
    return res.status(500).send(`something went wrong:${error.message}`);
  }
  next();
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
