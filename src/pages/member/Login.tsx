import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// TODO: 로그인 API 연동
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm space-y-6 rounded-xl bg-base-100 p-8 shadow-lg"
			>
				<h1 className="text-2xl font-semibold text-center">로그인</h1>
				<div className="space-y-2">
					<label htmlFor="email" className="text-sm font-medium">
						이메일
					</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="example@domain.com"
						required
						className="input input-bordered w-full"
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="password" className="text-sm font-medium">
						비밀번호
					</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="비밀번호를 입력하세요"
						required
						className="input input-bordered w-full"
					/>
				</div>
				<div className="flex flex-col">
					<button type="submit" className="btn btn-primary w-full" onClick={()=> navigate("/calorie")}>
						로그인
					</button>

					<div className="divider">OR</div>

					{/* Kakao */}
					<button className="btn bg-[#FEE502] text-[#181600] border-[#f1d800] mb-2" >
						<svg aria-label="Kakao logo" width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#181600" d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"></path></svg>
						카카오 로그인
					</button>
					{/* Google */}
					<button className="btn bg-white text-black border-[#e5e5e5] mb-2">
						<svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
						Google 로그인
					</button>
					
					{/* Facebook */}
					<button className="btn bg-[#1A77F2] text-white border-[#005fd8]">
						<svg aria-label="Facebook logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="white" d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"></path></svg>
						Facebook 로그인
					</button>

				</div>
				<p className="text-center text-sm text-base-content/70">
					계정이 없으신가요? <a href="/register" className="link">회원가입</a>
				</p>
			</form>
		</div>
	);
};

export default Login;