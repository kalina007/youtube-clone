import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import styled from 'styled-components';

import LikeDislikes from './LikeDislikes';

// styled [START]
const Form = styled('form')`
  display: flex;
`;
const TextArea = styled('textarea')`
  width: 80%;

  border: 1px solid #ccc;
  border-radius: 0px;
  resize: none;

  &:focus,
  &:active {
    outline: none;
  }
`;
const Button = styled('button')`
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
const CommentWrapper = styled('div')`
  display: flex;
`;
const CommentAvatar = styled('div')`
  width: 30px;
  height: 30px;
  margin-right: 12px;

  & > img {
    display: block;
    width: 100%;
  }
`;
const CommentContent = styled('p')`
  width: 100%;
  margin-bottom: 5px;

  color: #333;
  font-size: 16px;
  font-weight: 400;
`;
const CommentName = styled('p')`
  margin-bottom: 5px;

  color: #333;
  font-size: 16px;
  font-weight: 500;
`;
const CommentDetail = styled('div')`
  display: flex;
  align-items: center;
`;
const ReplyButton = styled('span')`
  margin-right: 8px;
  color: #777;
  font-size: 14px;
  font-weight: 500;
`;
// styled [END]

function SingleComment(props) {
  // props, state [START]
  const user = useSelector((state) => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState('');
  const refreshFunc = props.refreshFunc;
  // props, state [END]

  // FUNCTION [START]
  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const variable = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.commentItem._id,
    };

    Axios.post('/api/comment/saveComment', variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue('');
        setOpenReply(false);
        refreshFunc(response.data.result);
      } else {
        alert('코멘트 저장에 실패하였습니다.');
      }
    });
  };
  // FUNCTION [END]

  return (
    <div>
      {/* comment wrapper [START] */}
      <CommentWrapper>
        <CommentAvatar>
          <img
            src={props.commentItem.writer.image}
            alt={props.commentItem.writer.name}
          />
        </CommentAvatar>
        <div>
          <CommentName>{props.commentItem.writer.name}</CommentName>
          <CommentContent>{props.commentItem.content}</CommentContent>
          <CommentDetail>
            <ReplyButton onClick={onClickReplyOpen}>Reply To</ReplyButton>
            <LikeDislikes
              commentId={props.commentItem._id}
              userId={localStorage.getItem('userId')}
            />
          </CommentDetail>
        </div>
      </CommentWrapper>
      {/* comment wrapper [END] */}

      {/*  Form [START] */}
      {OpenReply && (
        <Form onSubmit={handleSubmit}>
          <TextArea
            onChange={handleChange}
            value={CommentValue}
            placeholder="코멘트를 작성해주세요"
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </Form>
      )}
      {/*  Form [END] */}
    </div>
  );
}

export default SingleComment;
