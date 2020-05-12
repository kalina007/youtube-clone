import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Tooltip, Icon } from 'antd';

// styled [START]
const contentWrapper = styled('div')`
  display: flex;
`;
const contentItem = styled('div')`
  margin-right: 10px;
`;
const contentNum = styled('span')`
  padding-left: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: auto;
`;
// styled [END]

function LikeDislikes(props) {
  const [LikeNumber, setLikeNumber] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeNumber, setDislikeNumber] = useState(0);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variable = {};
  if (props.video) {
    variable = { postId: props.postId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  // useEffect [START]
  useEffect(() => {
    Axios.post('/api/like/getLikes', variable).then((response) => {
      if (response.data.success) {
        // 얼마나 많은 좋아요를 받았는지
        setLikeNumber(response.data.likes.length);

        // 내가 이미 그 좋아요를 눌렀는지
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction('liked');
          }
        });
      } else {
        alert('Likes의 정보를 가져오는데 실패하였습니다.');
      }
    });

    Axios.post('/api/like/getDislikes', variable).then((response) => {
      if (response.data.success) {
        // 얼마나 많은 좋아요를 받았는지
        setDislikeNumber(response.data.dislikes.length);

        // 내가 이미 그 좋아요를 눌렀는지
        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDislikeAction('disliked');
          }
        });
      } else {
        alert('Likes의 정보를 가져오는데 실패하였습니다.');
      }
    });
  }, []);
  // useEffect [END]

  // onLike [START]
  const onLike = () => {
    // 좋아요 버튼이 눌려있지 않을 때
    if (LikeAction === null) {
      Axios.post('/api/like/upLike', variable).then((response) => {
        if (response.data.success) {
          setLikeNumber(LikeNumber + 1);
          setLikeAction('liked');

          // 싫어요 버튼이 눌려져있으면 갯수를 한개 줄이고 싫어요 Action을 null로 바꾼다
          if (DislikeAction !== null) {
            setDislikeAction(null);
            setDislikeNumber(DislikeNumber - 1);
          }
        } else {
          alert('좋아요 올리기에 실패하였습니다.');
        }
      });
    }
    // 좋아요 버튼이 이미 눌려있을 시
    else {
      Axios.post('/api/like/unLike', variable).then((response) => {
        if (response.data.success) {
          setLikeNumber(LikeNumber - 1);
          setLikeAction(null);
        } else {
          alert('좋아요 취소하기에 실패하였습니다.');
        }
      });
    }
  };
  // onLike [END]

  // onDislike [START]
  const onDislike = () => {
    // 싫어요 버튼이 안눌려있을 시
    if (DislikeAction === null) {
      Axios.post('/api/like/upDislike', variable).then((response) => {
        if (response.data.success) {
          setDislikeNumber(DislikeNumber + 1);
          setDislikeAction('disliked');

          // 좋아요 버튼이 눌려져있으면 갯수를 한개 줄이고 싫어요 Action을 null로 바꾼다
          if (LikeAction !== null) {
            setLikeAction(null);
            setLikeNumber(LikeNumber - 1);
          }
        } else {
          alert('싫어요 올리기에 실패하였습니다');
        }
      });
    }
    // 싫어요 버튼이 이미 눌려있을 시
    else {
      Axios.post('/api/like/unDislike', variable).then((response) => {
        if (response.data.success) {
          setDislikeNumber(DislikeNumber - 1);
          setDislikeAction(null);
        } else {
          alert('싫어요 취소에 실패하였습니다');
        }
      });
    }
  };
  // onDislike [END]

  return (
    <contentWrapper>
      <contentItem key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
        <contentNum>{LikeNumber}</contentNum>
      </contentItem>

      <contentItem key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={onDislike}
          />
        </Tooltip>
        <contentNum>{DislikeNumber}</contentNum>
      </contentItem>
    </contentWrapper>
  );
}

export default LikeDislikes;
