const express = require("express");
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscribe
//=================================

// 구독자 수 가져오기 [START]
router.post("/getSubscribeNumber", (req, res) => {
	Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribes) => {
		if (err) return res.status(400).json({ success: false, err });
		else
			return res
				.status(200)
				.json({ success: true, subscribeNumber: subscribes.length });
	});
});
// 구독자 수 가져오기 [END]

// 해당 비디오 업로드자에 대한 구독 정보 가져오기 [START]
router.post("/subscribed", (req, res) => {
	Subscriber.find({
		userTo: req.body.userTo,
		userFrom: req.body.userFrom,
	}).exec((err, subscribe) => {
		if (err) return res.status(400).json({ success: false, err });

		let result = false;
		if (subscribe.length !== 0) {
			result = true;
		}
		return res.status(200).json({ success: true, result });
	});
});
// 해당 비디오 업로드자에 대한 구독 정보 가져오기 [END]

// 구독취소 [START]
router.post("/unSubscribe", (req, res) => {
	Subscriber.findOneAndDelete({
		userTo: req.body.userTo,
		userFrom: req.body.userFrom,
	}).exec((err, doc) => {
		if (err) return res.status(400).json({ success: false, err });
		return res.status(200).json({ success: true, doc });
	});
});
// 구독취소 [END]

// 구독하기 [START]
router.post("/doSubscribe", (req, res) => {
  const subscribe = new Subscriber(req.body)

  subscribe.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  })
});
// 구독하기 [END]

module.exports = router;
