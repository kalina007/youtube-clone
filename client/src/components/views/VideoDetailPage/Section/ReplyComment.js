import React, { useEffect, Fragment, useState } from 'react';
import styled from 'styled-components';

import SingleComment from './SingleComment';

// styled [START]
const ViewButton = styled('p')`
  margin: 0 0 20px 40px;

  color: #777;
  font-size: 14px;
  font-weight: 400;
`;
const AnotherLevelCommentList = styled('div')`
  margin-left: 50px;
`;
const ReplyWrapper = styled('div')`
  margin-bottom: 20px;
`;
// styled [END]

function ReplyComment(props) {
  const commentList = props.commentList;
  const refreshFunc = props.refreshFunc;
  const parentCommentId = props.parentCommentId;
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  // useEffect [START]
  useEffect(() => {
    let commentNumber = 0;

    commentList.map((comment) => {
      if (comment.responseTo === parentCommentId) {
        commentNumber++;
      }
    });

    setChildCommentNumber(commentNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentList]);
  // useEffect [END]

  // FUNC[START]
  const handleOpen = () => {
    setOpenReplyComments(!OpenReplyComments);
    console.log(OpenReplyComments);
  };
  // FUNC[END]

  // replyComment map [START]
  const renderReplyComment = (parentCommentId) =>
    commentList.map((comment) => (
      <Fragment>
        {comment.responseTo === parentCommentId && (
          <Fragment>
            <SingleComment
              refreshFunc={refreshFunc}
              commentItem={comment}
              postId={props.postId}
            />
            <ReplyComment
              commentList={props.commentList}
              refreshFunc={refreshFunc}
              parentCommentId={comment._id}
              postId={props.postId}
            />
          </Fragment>
        )}
      </Fragment>
    ));
  // replyComment map [END]

  return (
    <ReplyWrapper>
      {ChildCommentNumber > 0 && (
        <ViewButton onClick={handleOpen}>
          view {ChildCommentNumber} more comment(s)
        </ViewButton>
      )}

      <AnotherLevelCommentList>
        {OpenReplyComments && renderReplyComment(parentCommentId)}
      </AnotherLevelCommentList>
    </ReplyWrapper>
  );
}

export default ReplyComment;
