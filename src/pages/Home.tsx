import { useState, useEffect } from "react";
import axios from "../config/setAxios";
const Home = () => {
	const [testWord, setTestWord] = useState<string | undefined>('');
	
	useEffect(() => {
		axios.get("/fastapi/test")
		.then(response => {
			setTestWord(response.data); // "test data" 값을 상태에 저장
		})
		.catch(error => {
			console.error("API 호출 실패:", error);
		});
	}, []);
	console.log("API BASE URL:", import.meta.env.VITE_CORS_ALLOWED_ORIGINS);
console.log("ENV data:", import.meta.env);


	return (
		<div>
			<p>하이</p>
			<p>응답 : {testWord}</p>
		</div>
	)
}

export default Home;