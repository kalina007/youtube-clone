import React, { useState, useEffect } from "react";
import Axios from "axios";
import moment from "moment";
import styled from "styled-components";
import { Row, Col } from "antd";

import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";

// style[START]
const VideoWrapper = styled("div")`
	width: 100%;
	padding: 3rem 4rem;
`;

const VideoContent = styled("video")`
	width: 100%;
	margin-bottom: 1rem;
`;

const VideoDetailRow = styled("div")`
	display: flex;
	justify-content: space-between;
`;
const UserInfo = styled("div")`
	display: flex;
`;
const UserInfoText = styled("div")`
	display: flex;
	flex-direction: column;
`;
const Name = styled("p")`
	margin-bottom: 0.8rem;
	color: #333;
	font-size: 15px;
	font-weight: 500;
`;
const CreatedDate = styled("p")`
	color: #333;
	font-size: 15px;
	font-weight: 500;
`;
const VideoInfo = styled("div")``;
const Avatar = styled("div")`
	width: 25px;
	height: 25px;
	margin-right: 15px;

	& > img {
		display: block;
		width: 100%;
	}
`;

// style[END]

function VideoDetailPage(props) {
	// App.js (/video/:videoId) // url에 videoId를 가져옴
	const videoId = props.match.params.videoId;
	const variable = { videoId: videoId };
	const [VideoDetail, setVideoDetail] = useState({});

	// useEffect [START]
	useEffect(() => {
		Axios.post("/api/video/getVideoDetail", variable).then((response) => {
			if (response.data.success) {
				setVideoDetail(response.data.videoDetail);
			} else {
				alert("비디오 정보 가져오기에 실패하였습니다.");
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// useEffect [END]

	if (VideoDetail.writer) {
		// 비디오가 자신의 비디오일땐 구독 버튼 가리기
		const SubscribeButton = VideoDetail.writer._id !==
			localStorage.getItem("userId") && (
			<Subscribe
				userTo={VideoDetail.writer._id}
				userFrom={localStorage.getItem("userId")}
			/>
		);

		return (
			<Row>
				{/* video [START] */}
				<Col lg={18} xs={24}>
					<VideoWrapper>
						<VideoContent
							src={`http://localhost:5000/${VideoDetail.filePath}`}
							controls
						/>
						{/* videoDetail [START] */}
						<VideoDetailRow>
							<UserInfo>
								<Avatar>
									<img
										src={VideoDetail.writer.image}
										alt={VideoDetail.writer.name}
									/>
								</Avatar>
								{/* video detail info [START] */}
								<UserInfoText>
									<Name>{VideoDetail.writer.name}</Name>
									<CreatedDate>
										{moment(VideoDetail.createdAt).format("MM-DD-YYYY")}
									</CreatedDate>
								</UserInfoText>
								{/* video detail info [END] */}
							</UserInfo>

							{/* like,dislike, subscribe button [START] */}
							<VideoInfo>
								{SubscribeButton}
							</VideoInfo>
							{/* like,dislike, subscribe button [END] */}
						</VideoDetailRow>
						{/* videoDetail [END] */}
					</VideoWrapper>

					{/* comments [START] */}
					{/* comments [END] */}
				</Col>
				{/* video [END] */}

				{/* side video [START] */}
				<Col lg={6} xs={24}>
					<SideVideo />
				</Col>
				{/* side video [End] */}
			</Row>
		);
	} else {
		return <div>...loading</div>;
	}
}

export default VideoDetailPage;
