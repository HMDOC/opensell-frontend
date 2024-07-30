import "@fontsource/inter";

import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import "./App.css";
import { LazyLoad } from './components/animations/loading';
import Navbar from './components/navbar';
import PrivateRoute from './components/PrivateRoute';
import { useAppContext } from './context/AppContext';

const About = lazy(() => import("@pages/about"));
const Home = lazy(() => import("@pages/home"));
const Login = lazy(() => import("@pages/auth/login"));
const Signup = lazy(() => import("@pages/auth/signup"));
const AdView = lazy(() => import("@pages/ad-view"));
const UserProfile = lazy(() => import("@pages/user-profile"));
const NotFound = lazy(() => import("@pages/not-found"));
const Catalog = lazy(() => import("@pages/catalog"));
const Setting = lazy(() => import("@pages/setting"));
const MyAds = lazy(() => import("@pages/my-ads"));

export default function App() {
	const [refresh, setRefresh] = useState(false);
	const { customerDto, getCustomerInfo } = useAppContext();

	useEffect(() => {
		getCustomerInfo();
	}, [refresh]);

	return (
		<BrowserRouter>
			<Suspense fallback={<LazyLoad />}>

				<Navbar />

				<Routes>
					<Route path="/u" element={<PrivateRoute />}>
						<Route path='/u/my-ads' element={<MyAds />} />
						<Route path="/u/setting" element={<Setting customerData={customerDto} refreshCallback={() => setRefresh(!refresh)} />}></Route>
					</Route>

					<Route path="/" element={<Home />} />
					<Route path='/about' element={<About />} />
					<Route path="/signup" element={customerDto ? <Navigate to="/" /> : <Signup />} />
					<Route path="/login" element={customerDto ? <Navigate to="/" /> : <Login />} />
					<Route path="/catalog" element={<Catalog />} />
					<Route path="/ad/:id" element={<AdView />} />
					<Route path="/user/:username" element={<UserProfile />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Suspense>
			<title>Opensell</title>
		</BrowserRouter >
	);
}