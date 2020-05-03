const express = require("express");
const router = express.Router();

const { Video } = require("../models/Video");
const { Comment } = require("../models/Comment");

//=================================
//             comment
//=================================

router.post("/saveComment", (req, res) => {
	const comment = new Comment(req.body);
	comment.save((err, comment) => {
		if (err) return res.status(400).json({ success: false, err });

    // _id: comment id
		Comment.find({ _id: comment._id })
			.populate("writer")
			.exec((err, result) => {
				if (err) return res.status(400).json({ success: false, err });
				return res.status(200).json({ success: true, result });
			});
	});
});

module.exports = router;
