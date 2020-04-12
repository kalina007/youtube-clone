import React, { useState } from "react";
import Axios from "axios";
import DropZone from "react-dropzone";
import styled from "styled-components";
import {Icon} from 'antd';

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

function VideoUploadPage() {
	const [VideoTitle, setVideoTitle] = useState("");
	const [Description, setDescription] = useState("");
	const [Private, setPrivate] = useState(0);
	const [Category, setCategory] = useState("Film & Animation");

	// on function [start]
	const onTitleChange = (e) => {
		setVideoTitle(e.currentTarget.value);
	};
	const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };
  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value)
  };
  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value)
  };
  const onDropVideo = (files) => {
    let formData = new FormData();
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }

    formData.append('file',files[0]);

    Axios.post('/api/video/uploadfiles', formData, config)
    .then(response => {
      if(response.data.success){ 
        console.log(response.data);
      } else {
        alert('비디오 업로드에 실패하였습니다')
      }
    })
  }
	// on function [end]

	return (
		<UploadWrapper>
			<UploadContainer>
				<Title>Upload Video</Title>

				<form onSubmit>
					<FormImageAndVideo>
						{/* Drop Zone */}
						<DropZone onDrop={onDropVideo} multiple={false} maxSize={10000000000}>
							{({ getRootProps, getInputProps }) => (
								<FormDrop {...getRootProps()}>
									<input {...getInputProps()} />
                  <Icon type="plus" style={{fontSize : '2rem'}}/>
								</FormDrop>
							)}
						</DropZone>

						{/* Thumbnail */}
						<div>
							<img src alt />
						</div>
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
						<SubmitButton>Submit</SubmitButton>
					</ButtonWrapper>
				</form>
			</UploadContainer>
		</UploadWrapper>
	);
}

export default VideoUploadPage;
