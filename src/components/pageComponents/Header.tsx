import type { ReactNode } from "react";
import { Dumbbell, LogIn, User, Flame, Moon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface HeaderProps {
	children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
	const navigate = useNavigate();

	return (
		
		<div className="drawer drawer-open ">
			<input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content mt-15 ml-10">
				
				{children}
			</div>
			<div className="drawer-side is-drawer-close:overflow-visible">
				<label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
				<div className="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-200 flex flex-col items-start min-h-full">
					{/* Sidebar content here */}
					<ul className="menu w-full grow">
					{/* list item */}
						{/* 운동 챗봇 */}
						<li>
							<button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="운동챗" onClick={()=> navigate("/exercise")}>
								<Dumbbell className="inline-block size-4 my-1.5" strokeWidth={2} />
								<span className="is-drawer-close:hidden">운동</span>
							</button>
						</li>
						{/* 수면 챗봇 */}
						<li>
							<button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="수면챗" onClick={()=> navigate("/sleep")}> 
								<Moon className="inline-block size-4 my-1.5" strokeWidth={2} />
								<span className="is-drawer-close:hidden">수면</span>
							</button>
						</li>

						<li>
							<button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="칼로리 소모" onClick={()=> navigate("/calorie")}>
							<Flame className="inline-block size-4 my-1.5" strokeWidth={2} />
								<span className="is-drawer-close:hidden">칼로리</span>
							</button>
						</li>

				</ul>

				<ul className="menu w-full mt-auto px-2 pb-4">
					<li>
						<button type="button" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="마이페이지" onClick={() => navigate("/mypage")}>
							<User className="inline-block size-4 my-1.5" strokeWidth={2} />
							<span className="is-drawer-close:hidden">마이페이지</span>
						</button>
					</li>
					<li>
						<button type="button" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="로그인" onClick={() => navigate("/login")}>
							<LogIn className="inline-block size-4 my-1.5" strokeWidth={2} />
							<span className="is-drawer-close:hidden">로그인</span>
						</button>
					</li>
				</ul>

				<div className="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open">
						<label htmlFor="my-drawer-4" className="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="inline-block size-4 my-1.5"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
						</label>
					</div>
			
				</div>
			</div>
		</div>
	)
}
export default Header;
