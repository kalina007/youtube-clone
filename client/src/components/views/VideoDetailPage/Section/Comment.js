import React, { useState, useEffect } from "react";
import { useSelector} from 'react-redux';
import Axios from "axios";
import styled from "styled-components";

// styled [START]
const RootCommentWrapper = styled("div")`
	padding: 0.5rem 4rem 0 4rem;
`;
const Form = styled("form")`
	display: flex;
`;
const TextArea = styled("textarea")`
	width: 80%;

	border: 1px solid #ccc;
	border-radius: 0px;
	resize: none;

	&:focus,
	&:active {
		outline: none;
	}
`;
const Button = styled("button")`
	width: 20%;
	height: 50px;

	border: 0;
	background-color: blue;
	color: white;

	&:focus,
	&:active {
		outline: none;
	}
`;
// styled [END]

function Comment(props) {
  // state [START]
  const user = useSelector(state => state.user);
	const [CommentValue, setCommentValue] = useState("");
	// state [END]

	// handleChange [START]
	const handleChange = (e) => {
		setCommentValue(e.currentTarget.value);
	};
  // handleChange [END]
  
  // handleSubmit [START]
  const handleSubmit = (e) => {
    e.preventDefault();

    const variable = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
    };

    Axios.post('/api/comment/saveComment', variable)
    .then(response => {
      if(response.data.success){
        console.log(response.data.result)
      } else {
        alert('코멘트 저장에 실패하였습니다.')
      }
    })
  }
  // handleSubmit [END]

	return (
		<RootCommentWrapper onSubmit>
			<p>Replies</p>

			{/* comment list [START]*/}

			{/* comment list [END]*/}

			{/* Root Comment Form [START] */}
			<Form onSubmit={handleSubmit}>
				<TextArea
					onChange={handleChange}
					value={CommentValue}
					placeholder="코멘트를 작성해주세요"
				/>
				<Button onClick={handleSubmit}>Submit</Button>
			</Form>
      {/* Root Comment Form [END] */}
		</RootCommentWrapper>
	);
}

export default Comment;
