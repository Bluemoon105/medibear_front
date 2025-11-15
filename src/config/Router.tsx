
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Calorie from "../pages/calorie/Calorie";
import Mypage from "../pages/member/Mypage";
import Login from "../pages/member/Login";
import Register from "../pages/member/Register";
import ExerciseChat from "../pages/exercise/ExerciseChat";
import Sleep from "../pages/sleep/Sleep"
import SleepPredict from "../pages/sleep/SleepPredict"
import StressReportPage from "../pages/stress/StressReportPage";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout/>}>
					<Route path="exercise" element={<ExerciseChat/>}/>
					
					<Route path="/sleep" element={<Sleep/>} />
					<Route path="/sleepPredict" element={<SleepPredict />} />

					<Route path="calorie" element={<Calorie/>}/>

					<Route path="/stress" element={<StressReportPage />} />

					<Route path="mypage" element={<Mypage/>}/>
				</Route>
				<Route>
					<Route path="/" element={<Home/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<Register/>}/>
				</Route>
				
			</Routes>
		</BrowserRouter>
	)
}
export default Router;