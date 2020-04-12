const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const multer = require("multer");

//=================================
//             Video
//=================================

// storage multer config
let storage = multer.diskStorage({
	// 파일을 저장할 장소
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	// 저장할 파일이름 형식
	filename: (req, file, cb) => {
		// ex) 1234242345_hello.mp4
		cb(null, `${Date.now()}_${file.originalname}`);
	},
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);

		// .mp4만 업로드 가능하다
		if (ext !== ".mp4") {
			return cb(res.status(400).send("only .mp4 is allowed"), false);
		}

		cb(null, true);
	},
});

// 파일은 하나만 업로드 할 수 있도록 해준다.
const upload = multer({ storage: storage }).single("file");

router.post("/uploadfiles", (req, res) => {
	// 비디오를 서버에 저장한다
	upload(req, res, (err) => {
		if (err) {
			return res.status(400).json({ success: false, err });
		}
		return res
			.status(200)
			.json({
				success: true,
				url: res.req.file.path,
				fileName: res.req.file.filename,
			});
	});
});

module.exports = router;
