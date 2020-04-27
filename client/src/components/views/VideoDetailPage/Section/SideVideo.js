import React, { useState, useEffect } from "react";
import Axios from "axios";
import styled from "styled-components";

// style [START]
const SideWrapper = styled("div")`
	margin-top: 3rem;
`;
const SideItem = styled("div")`
	display: flex;
	margin-bottom: 1rem;
`;
const VideoWrapper = styled("div")`
	width: 40%;
	margin-right: 0.7rem;
`;
const Thumbnail = styled("img")`
	display: block;
	width: 100%;
`;
const VideoInfo = styled("div")``;
const SideVideoText = styled("p")`
	margin-bottom: 0.2rem;
	color: #777;
	font-size: 14px;
	font-weight: 400;
	line-height: 1.4;
`;
// style [END]

function SideVideo() {
	const [Videos, setVideos] = useState([]);

	useEffect(() => {
		Axios.get("/api/video/getVideos").then((response) => {
			if (response.data.success) {
				console.log(response.data);
				setVideos(response.data.videos);
			} else {
				alert("비디오 가져오기를 실패하였습니다.");
			}
		});
	}, []);

	const renderSideVideo = Videos.map((video, index) => {
		const minutes = Math.floor(video.duration / 60);
		const seconds = Math.floor(video.duration - minutes * 60);

		return (
			<SideItem key={index}>
				{/* video wrapper[START] */}
				<VideoWrapper>
					<a href={`/video/${video._id}`}>
						<Thumbnail
							src={`http://localhost:5000/${video.thumbnail}`}
							alt={video.title}
						/>
					</a>
				</VideoWrapper>
				{/* video wrapper[END] */}

				{/* video info[START] */}
				<VideoInfo>
					<a href={`/video/${video._id}`}>
						<SideVideoText>{video.title}</SideVideoText>
						<SideVideoText>{video.views} views</SideVideoText>
						<SideVideoText>{video.writer.name}</SideVideoText>
						<SideVideoText>
							{minutes < 10 ? `0${minutes}` : minutes} :
							{seconds < 10 ? `0${seconds}` : seconds}
						</SideVideoText>
					</a>
				</VideoInfo>
				{/* video info[END] */}
			</SideItem>
		);
	});

	return <SideWrapper>{renderSideVideo}</SideWrapper>;
}

export default SideVideo;
