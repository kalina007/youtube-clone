const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

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

// uploadfiles[start]
router.post("/uploadfiles", (req, res) => {
	// 비디오를 서버에 저장한다
	upload(req, res, (err) => {
		if (err) {
			return res.status(400).json({ success: false, err });
		}
		return res.status(200).json({
			success: true,
			url: res.req.file.path,
			fileName: res.req.file.filename,
		});
	});
});
// uploadfiles[end]

// uploadVideo[start]
router.post("/uploadVideo", (req, res) => {
	// 비디오를 서버에 저장한다
	const video = new Video(req.body);

	video.save((err, doc) => {
		if (err) return res.json({ success: false, err });

		return res.status(200).json({ success: true });
	});
});
// uploadVideo[end]

// thumbnail[start]
router.post("/thumbnail", (req, res) => {
	// 썸네일 생성하고, 비디오 러닝타임 가져오기

	let filePath = "";
	let fileDuration = "";

	// 비디오 정보 가져오기
	ffmpeg.ffprobe(req.body.url, function (err, metadata) {
		console.log(metadata);
		console.log(metadata.format.duration);
		fileDuration = metadata.format.duration;
	});

	// 썸네일 생성
	ffmpeg(req.body.url)
		// filenames 생성
		.on("filenames", function (filenames) {
			console.log(`Will generate ` + filenames.join(","));
			console.log(filenames);

			filePath = `uploads/thumbnails/${filenames[0]}`;
		})
		// filenames 생성 후 할것
		.on("end", function () {
			console.log("Screenshots taken");
			return res.json({
				success: true,
				url: filePath,
				fileDuration: fileDuration,
			});
		})
		.on("error", function (err) {
			console.err("Cannot process video: " + err.message);

			return res.json({ success: false, err });
		})
		// setting screenshots options
		.screenshots({
			// Will take screenshots at 20%, 40%, 60% and 80% of the video
			count: 3,
			folder: "uploads/thumbnails",
			size: "320x240",
			// '%b': input basement(filename w/o extension)
			filename: "thumbnail-%b.png",
		});
});
// thumbnail[end]

// getVideos[start]
router.get("/getVideos", (req, res) => {
	// 비디오를 DB에서 가져와서 클라이언트에 보낸다.
	Video.find()
		.populate("writer")
		.exec((err, videos) => {
			if (err) return res.status(400).send(err);
			return res.status(200).json({ success: true, videos });
		});
});
// getVideos[end]

// getVideo[start] : videoDetailPage
router.post("/getVideoDetail", (req, res) => {
	Video.findOne({ _id: req.body.videoId })
		.populate("writer")
		.exec((err, videoDetail) => {
			if (err) return res.status(400).send(err);
			return res.status(200).json({ success: true, videoDetail });
		});
});
// getVideo[end]

module.exports = router;
