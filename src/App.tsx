import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import LazyLoad from './component/part/LazyLoad';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalNavBar from './component/page/GlobalNavBar';

const MainMenu = lazy(() => (import("./component/page/MainMenu")));
const Signup = lazy(() => (import("./component/page/signup")));
const Login = lazy(() => (import("./component/page/login")));
const AdView = lazy(() => (import("./component/page/AdView")));
const UserProfil = lazy(() => (import("./component/page/UserProfil")));
const NotFound = lazy(() => (import("./component/page/NotFound")));
const Catalog = lazy(() => (import("./component/page/Catalog")));
const FileUploader = lazy(() => (import("./component/page/FileUploader")));
const CustomerModification = lazy(() => (import("./component/page/CustomerModification")));
const AdModification = lazy(() => (import("./component/page/AdModification")));
const MyAds = lazy(() => (import("./component/page/MyAds")));

export default function App() {
	const [language, setLanguage] = useState(0);

	return (
		<BrowserRouter>
			<Suspense fallback={<LazyLoad />}>
				<GlobalNavBar/>
				<Routes>
					<Route path="/" element={<MainMenu />}></Route>
					<Route path="/signup" element={<Signup />}></Route>
					<Route path="/login" element={<Login />}></Route>
					<Route path="/catalog" element={<Catalog />}></Route>
					<Route path="/ad/:link" element={<AdView />}></Route>
					<Route path="/user/:link" element={<UserProfil />}></Route>
					<Route path="/file-uploader/" element={<FileUploader />}></Route>
					<Route path="/customer-modification/:link" element={<CustomerModification/>}></Route>
					<Route path="/ad-modification/:link" element={<AdModification />}></Route>
					<Route path="/my-ads/" element={<MyAds />}></Route>
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}