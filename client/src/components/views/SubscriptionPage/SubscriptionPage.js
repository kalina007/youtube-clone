import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";
import moment from "moment";
import styled from "styled-components";
import { Row, Col } from "antd";

// style [START]
const LandingWrapper = styled("div")`
	width: 85%;
	margin: 3rem auto;
`;
const Title = styled("h3")`
	margin-bottom: 16px;
	padding-bottom: 16px;
	border-bottom: 2px solid #ccc;

	color: #333;
	font-size: 24px;
	font-weight: 700;
`;
const ThumbnailWrapper = styled("div")`
	position: relative;
	margin-bottom: 1rem;
`;
const Thumbnail = styled("img")`
	width: 100%;
`;
const VideoUserInfo = styled("div")`
	display: flex;
`;
const UserInfo = styled("div")`
	display: flex;
	flex-direction: column;
`;

const Avatar = styled("div")`
	width: 30px;
	height: 30px;
	margin-right: 16px;
	border-radisu: 50%;
	overflow: hidden;

	& > img {
		display: block;
		width: 100%;
	}
`;
// style [END]

function SubscriptionPage() {
	// state[START]
	const [Videos, setVideos] = useState([]);
	// state[END]

	// axios [START]
	useEffect(() => {
		const subscriptionVariable = {
			userFrom: localStorage.getItem("userId")
		};

    Axios.post("/api/video/getSubscriptionVideos", subscriptionVariable)
    .then((response) => {
				if (response.data.success) {
          setVideos(response.data.videos);
				} else {
					alert("비디오 가져오기를 실패하였습니다.");
				}
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// axios [END]

	// renderCards [START]
	const renderCards = Videos.map((video, index) => {
		const minutes = Math.floor(video.duration / 60);
		const seconds = Math.floor(video.duration - minutes * 60);

		return (
			<Col key={index} lg={6} md={8} xs={24}>
				<a href={`/video/${video._id}`}>
					<ThumbnailWrapper>
						<Thumbnail
							src={`http://localhost:5000/${video.thumbnail}`}
							alt={video.title}
						/>
						{/* 동영상 재생시간*/}
						<div className="duration">
							<span>
								{minutes < 10 ? `0${minutes}` : minutes} :
								{seconds < 10 ? `0${seconds}` : seconds}
							</span>
						</div>
					</ThumbnailWrapper>
				</a>
				<VideoUserInfo>
					<Avatar>
						<img src={video.writer.image} alt={video.writer.name} />
					</Avatar>
					<UserInfo>
						<span>{video.writer.name}</span>
						<span>views: {video.views}</span>
						<span>{moment(video.createdAt).format("MM-DD-YYYY")}</span>
					</UserInfo>
				</VideoUserInfo>
			</Col>
		);
	});
	// renderCards [END]

	return (
		<LandingWrapper>
			<Title>Subscription</Title>
			<Row gutter={[32, 16]}>{renderCards}</Row>
		</LandingWrapper>
	);
}

export default SubscriptionPage;
