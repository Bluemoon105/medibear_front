
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Test from "../pages/Test";
import ExerciseChat from "../pages/ExerciseChat";


const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home/>}/>
				<Route path="test" element={<Test/>}/>
			        <Route path="exercise" element={<ExerciseChat/>}/>
              <Route path="exercise" element={<ExerciseChat/>}/>
			        <Route path="exercise" element={<ExerciseChat/>}/>
			</Routes>
		</BrowserRouter>
	)
}
export default Router;