
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import { Counter } from "../pages/Counter";
import Mypage from "../pages/Mypage";
import Calorie from "../pages/Calorie";
import Login from "../pages/member/Login";
import Register from "../pages/member/Register";
import ExerciseChat from "../pages/ExerciseChat";
import Sleep from "../pages/Sleep";
import CaloriesPredict from "../pages/CaloriesPredict";
import SleepPredict from "../pages/SleepPredict";


const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout/>}>
					<Route path="/" element={<Home/>}/>
					<Route path="calorie" element={<Calorie/>}/>
					<Route path="counter" element={<Counter/>}/>
					<Route path="mypage" element={<Mypage/>}/>
				</Route>
				<Route>
				<Route path="/login" element={<Login/>}/>
				<Route path="/register" element={<Register/>}/>
				</Route>

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