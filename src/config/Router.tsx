
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import ExerciseChat from "../pages/ExerciseChat";
import Sleep from "../pages/Sleep";
import Mypage from "../pages/Mypage";
import CaloriesPredict from "../pages/CaloriesPredict";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SleepPredict from "../pages/SleepPredict";


const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home/>}/>
			    <Route path="exercise" element={<ExerciseChat/>}/>
              	<Route path="exercise" element={<ExerciseChat/>}/>
			    <Route path="exercise" element={<ExerciseChat/>}/>
				<Route path="/sleepChat" element={<Sleep />} />
				<Route path="/sleepPredict" element={<SleepPredict />} />
				<Route path="/mypage" element={<Mypage />} />
				<Route path="/caloriesPredict" element={<CaloriesPredict />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	)
}
export default Router;