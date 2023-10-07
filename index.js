const express = require("express");
const socket = require("socket.io");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage });

app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;

  return res.json({ image: req.file.originalname });
});
const server = app.listen(3000, () => {});
const io = socket(server, {
  cors: {
    origin: "*",
  },
});
let dataa;
io.on("connection", (socket) => {
  socket.on("newuserjoined", (data) => {
    dataa = data.data;

    socket.broadcast.emit("usermessagedekho", dataa);

    socket.broadcast.emit("usermessagedekhos", dataa);
  });

  socket.on("messages", (data) => {
    socket.broadcast.emit("message", data);
  });
  socket.on("snewuserjoined", (data) => {
    dataa = data.data;

    socket.broadcast.emit("susermessagedekho", dataa);

    socket.broadcast.emit("susermessagedekhos", dataa);
  });

  socket.on("smessages", (data) => {
    socket.broadcast.emit("smessage", data);
  });
  socket.on("maindata", (maindatas) => {
    socket.broadcast.emit("maindatas", maindatas);
  });
  socket.on("videodata", (videodatas) => {
    console.log(videodatas);
    socket.broadcast.emit("videodatas", videodatas);
  });
  socket.on("audiodata", (audiodatas) => {
    console.log(audiodatas);
    socket.broadcast.emit("audiodatas", audiodatas);
  });
  socket.on("docdata", (docdatas) => {
    console.log(docdatas);
    socket.broadcast.emit("docdatas", docdatas);
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("disusermessagedekho", dataa);
    socket.broadcast.emit("sdisusermessagedekho", dataa);
  });
});
