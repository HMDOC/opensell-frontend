import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import LazyLoad from './component/part/LazyLoad';
import AdModification from './component/page/AdModification';

const MainMenu = lazy(() => (import("./component/page/MainMenu")));
const Signup = lazy(() => (import("./component/page/signup")));
const Login = lazy(() => (import("./component/page/login")));
const AdView = lazy(() => (import("./component/page/AdView")));
const UserProfil = lazy(() => (import("./component/page/UserProfil")));
const NotFound = lazy(() => (import("./component/page/NotFound")));
const Catalog = lazy(() => (import("./component/page/Catalog")));

export default function App() {
	const [language, setLanguage] = useState(0);

	return (
		<BrowserRouter>
			<Suspense fallback={<LazyLoad />}>
				<Routes>
					<Route path="/" element={<MainMenu />}></Route>
					<Route path="/signup" element={<Signup />}></Route>
					<Route path="/login" element={<Login />}></Route>
					<Route path="/catalog" element={<Catalog />}></Route>
					<Route path="/ad/:link" element={<AdView />}></Route>
					<Route path="/user/:link" element={<UserProfil />}></Route>
					<Route path="/ad-modification/" element={<AdModification />}></Route>
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}