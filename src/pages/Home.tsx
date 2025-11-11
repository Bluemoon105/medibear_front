// import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../redux/slice/counterSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();
	// const [testWord, setTestWord] = useState<string | undefined>('');
	const count = useSelector((state: RootState) => state.counter.value);
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div className="p-6">
			<p>하이</p>

			<h1 className="text-3xl font-bold underline mb-6">
				Tailwind CSS 테스트
			</h1>
			
			<div style={{ textAlign: 'center', marginTop: '50px' }}>
				<h1>Redux Persist Example</h1>
				<h2>{count}</h2>
				<button 
					onClick={() => dispatch(increment())}
					className="btn btn-primary mx-2"
				>
					+1
				</button>
				<button 
					onClick={() => dispatch(decrement())}
					className="btn btn-secondary mx-2"
				>
					-1
				</button>
			</div>

			<div className="bg-blue-300 text-white font-semibold mt-10 p-6 rounded-xl w-full max-w-[1200px] mx-auto">
				화면 너비를 벗어나지 않는 가로 박스
				<button className="btn btn-neutral" onClick={()=> navigate("login")}>로그인</button>
			</div>


		</div>
	);
};

export default Home;