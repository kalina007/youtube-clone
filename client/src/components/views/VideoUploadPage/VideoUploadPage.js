import React, { useState } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";
import DropZone from "react-dropzone";
import styled from "styled-components";
import { Icon, message } from "antd";

// styled [start]
const UploadWrapper = styled("div")`
	max-width: 700px;
	margin: 2rem auto;
`;

const UploadContainer = styled("div")`
	margin-bottom: 2rem;
`;
const Title = styled("h2")`
	font-size: 1.4rem;
	font-weight: 700;
	text-align: center;
`;

const FormImageAndVideo = styled("div")`
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
`;

const FormRow = styled("div")`
	margin-bottom: 1rem;
`;

const FormDrop = styled("div")`
	display: flex;
	align-items: center;
	justify-content: center;

	width: 300px;
	height: 200px;
	border: 1px solid lightgray;
`;

const FormTextarea = styled("textarea")`
	display: block;
	width: 100%;
	border: 1px solid #999;
	resize: none;
`;

const FormInput = styled("input")`
	display: block;
	width: 100%;
	border: 1px solid #999;
`;

const ButtonWrapper = styled("div")`
	display: flex;
	justify-content: center;
`;

const SubmitButton = styled("button")`
	padding: 0.3rem 0.5rem;

	border: 0;
	background-color: blue;

	color: #fff;
	font-size: 18px;
	font-weight: 500;
`;
// styled [end]

const PrivateList = [
	{ value: 0, label: "Private" },
	{ value: 1, label: "Public" },
];

const CategoryList = [
	{ value: 0, label: "Film & Animation" },
	{ value: 1, label: "Auto & Vehicles" },
	{ value: 2, label: "Animals" },
	{ value: 3, label: "Music" },
];

function VideoUploadPage(props) {
	const user = useSelector((state) => state.user);
	const [VideoTitle, setVideoTitle] = useState("");
	const [Description, setDescription] = useState("");
	const [Private, setPrivate] = useState(0);
	const [Category, setCategory] = useState("Film & Animation");
	const [FilePath, setFilePath] = useState("");
	const [Duration, setDuration] = useState("");
	const [ThumbnailPath, setThumbnailPath] = useState("");

	// on function [start]
	// onTitleChange[start]
	const onTitleChange = (e) => {
		setVideoTitle(e.currentTarget.value);
	};
	// onTitleChange[end]
	// onDescriptionChange[start]
	const onDescriptionChange = (e) => {
		setDescription(e.currentTarget.value);
	};
	// onDescriptionChange[end]
	// onPrivateChange[start]
	const onPrivateChange = (e) => {
		setPrivate(e.currentTarget.value);
	};
	// onPrivateChange[end]
	// onCategoryChange[start]
	const onCategoryChange = (e) => {
		setCategory(e.currentTarget.value);
	};
	// onCategoryChange[end]
	// onDropVideo [start]
	const onDropVideo = (files) => {
		let formData = new FormData();
		const config = {
			header: { "content-type": "multipart/form-data" },
		};

		formData.append("file", files[0]);

		Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
			if (response.data.success) {
				let variable = {
					url: response.data.url,
					fileName: response.data.fileName,
				};

				setFilePath(response.data.url);

				Axios.post("/api/video/thumbnail", variable).then((response) => {
					if (response.data.success) {
						setDuration(response.data.fileDuration);
						setThumbnailPath(response.data.url);
					} else {
						alert("썸네일 생성에 실패 했습니다.");
					}
				});
			} else {
				alert("비디오 업로드에 실패하였습니다");
			}
		});
	};
	// onDropVideo [end]
	// onSubmit [start]
	const onSubmit = (e) => {
		e.preventDefault();

		const variables = {
			writer: user.userData._id,
			title: VideoTitle,
			description: Description,
			privacy: Private,
			filePath: FilePath,
			category: Category,
			duration: Duration,
			thumbnail: ThumbnailPath,
		};

		Axios.post("/api/video/uploadVideo", variables).then((response) => {
			if (response.data.success) {
				message.success('성공적으로 업로드를 했습니다.')

				// 3초 뒤
				setTimeout(() => {
					// 메인 페이지로 이동
					props.history.push('/')	
				}, 3000);

			} else {
				alert("비디오 업로드에 실패하였습니다");
			}
		});
	};
	// onSubmit [end]
	// on function [end]

	return (
		<UploadWrapper>
			<UploadContainer>
				<Title>Upload Video</Title>

				<form onSubmit={onSubmit}>
					<FormImageAndVideo>
						{/* Drop Zone */}
						<DropZone
							onDrop={onDropVideo}
							multiple={false}
							maxSize={10000000000}
						>
							{({ getRootProps, getInputProps }) => (
								<FormDrop {...getRootProps()}>
									<input {...getInputProps()} />
									<Icon type="plus" style={{ fontSize: "2rem" }} />
								</FormDrop>
							)}
						</DropZone>

						{/* Thumbnail */}
						{ThumbnailPath && (
							<div>
								<img
									src={`http://localhost:5000/${ThumbnailPath}`}
									alt="thumbnail"
								/>
							</div>
						)}
					</FormImageAndVideo>

					<FormRow>
						<label>Title</label>
						<FormInput onChange={onTitleChange} value={VideoTitle} />
					</FormRow>
					<FormRow>
						<label>Description</label>
						<FormTextarea
							onChange={onDescriptionChange}
							value={Description}
						></FormTextarea>
					</FormRow>
					<FormRow>
						<label></label>
						<select onChange={onPrivateChange}>
							{PrivateList.map((item, index) => (
								<option key={index} value={item.value}>
									{item.label}
								</option>
							))}
						</select>
					</FormRow>
					<FormRow>
						<label></label>
						<select onChange={onCategoryChange}>
							{CategoryList.map((item, index) => (
								<option key={index} value={item.value}>
									{item.label}
								</option>
							))}
						</select>
					</FormRow>

					<ButtonWrapper>
						<SubmitButton onClick={onSubmit}>Submit</SubmitButton>
					</ButtonWrapper>
				</form>
			</UploadContainer>
		</UploadWrapper>
	);
}

export default VideoUploadPage;
