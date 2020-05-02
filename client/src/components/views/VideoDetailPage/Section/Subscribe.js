import React, { useEffect, useState } from "react";
import Axios from "axios";
import styled from "styled-components";

// style [START]
const SubscribeButton = styled("button")`
	display: inline-block;
	padding: 10px 16px;

	border-radius: 3px;
	border: 1px solid transparent;
	background-color: #cc0000;
	color: white;
	font-weight: 500;
	font-size: 1rem;
	text-transform: uppercase;
`;
// style [END]

function Subscribe(props) {
	const [SubscribeNumber, setSubscribeNumber] = useState(0);
	const [Subscribed, setSubscribed] = useState(false);

	useEffect(() => {
		// 구독자 수 가져오기 [START]
		let variable = { userTo: props.userTo };

		Axios.post("/api/subscribe/getSubscribeNumber", variable).then(
			(response) => {
				if (response.data.success) {
					setSubscribeNumber(response.data.subscribeNumber);
				} else {
					alert("구독자 수를 받아오지 못했습니다.");
				}
			}
		);
		// 구독자 수 가져오기 [END]

		// 자신이 현재 페이지 비디오의 업로드한 사람을 구독했는가 [START]
		let subscribedVariable = {
			userTo: props.userTo,
			userFrom: props.userFrom,
		};

		Axios.post("/api/subscribe/subscribed", subscribedVariable).then(
			(response) => {
				if (response.data.success) {
					setSubscribed(response.data.result);
				} else {
					alert("구독 정보를 받아오지 못했습니다.");
				}
			}
		);
		// 자신이 현재 페이지 비디오의 업로드한 사람을 구독했는가 [END]
	}, [props.userFrom, props.userTo]);

	// onSubscribe [START]
	const onSubscribe = () => {
		let subscribeVarialbe = {
			userTo: props.userTo,
			userFrom: props.userFrom,
		};

		// 이미 구독중이라면
		if (Subscribed) {
			Axios.post("/api/subscribe/unSubscribe", subscribeVarialbe).then(
				(response) => {
					if (response.data.success) {
						setSubscribeNumber(SubscribeNumber - 1);
						setSubscribed(!Subscribed);
					} else {
						alert("구독을 취소하는데 실패하였습니다.");
					}
				}
			);
		}
		// 아직 구독중이 아니라면
		else {
			Axios.post("/api/subscribe/doSubscribe", subscribeVarialbe).then(
				(response) => {
					if (response.data.success) {
						setSubscribeNumber(SubscribeNumber + 1);
						setSubscribed(!Subscribed);
					} else {
						alert("구독 하는데 실패하였습니다.");
					}
				}
			);
		}
	};
	// onSubscribe [END]

	return (
		<SubscribeButton
			onClick={onSubscribe}
			style={{ backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}` }}
		>
			{SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
		</SubscribeButton>
	);
}

export default Subscribe;
