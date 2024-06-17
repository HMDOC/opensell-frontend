import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LazyLoad from './component/part/LazyLoad';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalNavBar from './component/page/GlobalNavBar';
import './App.css';
import getUserInfos from './services/GetUser';
import PrivateRoute from './component/page/PrivateRoute';
import { CustomerDto } from './entities/dto/CustomerDto';
import { ApplicationContext, Theme, ThemeOption } from './ApplicationContext';

const About = lazy(() => import("./component/page/About"));
const MainMenu = lazy(() => (import("./component/page/MainMenu")));
const Signup = lazy(() => (import("./component/page/signup")));
const Login = lazy(() => (import("./component/page/Login")));
const AdView = lazy(() => (import("./component/page/AdView")));
const UserProfil = lazy(() => (import("./component/page/UserProfil")));
const NotFound = lazy(() => (import("./component/page/NotFound")));
const Catalog = lazy(() => (import("./component/page/Catalog")));
const CustomerModification = lazy(() => (import("./component/page/CustomerModification")));
const AdModification = lazy(() => (import("./component/page/AdModification")));
const MyAds = lazy(() => (import("./component/page/MyAds")));

export default function App() {
	const [customerDto, setCustomerDto] = useState<CustomerDto>(undefined);
	const [refresh, setRefresh] = useState(false);
	const [theme, setTheme] = useState<ThemeOption>(Theme.getStorageTheme());

	async function getCustomerInfo() {
		const data = (await getUserInfos("token"))?.data;
		if(customerDto != data) setCustomerDto(data);
		console.log("CUSTOMER DTO : "+customerDto)
		return data;
	}

	useEffect(() => {
		getCustomerInfo();
	}, [refresh])

	function changeTheme(theme: ThemeOption) {
		setTheme(theme);
		Theme.setTheme(theme);
	}

	return (
		<>
		<ApplicationContext.Provider value={{ theme, changeTheme, customerDto, getCustomerInfo, isDarkMode: () => Theme.isDarkMode(theme) }}>
			<BrowserRouter>
				<Suspense fallback={<LazyLoad />}>
					<GlobalNavBar logout={() => setCustomerDto(undefined)} />
					<Routes>
						<Route path="/u" element={<PrivateRoute />}>
							<Route path='/u/my-ads' element={<MyAds idCustomer={customerDto?.customerId} />}/>
							<Route path="/u/ad-modification/:link" element={<AdModification />}></Route>
							<Route path="/u/customer-modification" element={<CustomerModification customerData={customerDto} refreshCallback={() => setRefresh(!refresh)}/>}></Route>
							<Route path="/u/my-profil" element={<UserProfil loggedUserLink={customerDto?.link} isMyProfil />}></Route>
						</Route>
						<Route path="/" element={<MainMenu />}></Route>
						<Route path='/about' element={<About />}></Route>
						<Route path="/signup" element={customerDto ? <Navigate to="/" /> : <Signup />}></Route>
						<Route path="/login" element={customerDto ? <Navigate to="/" /> : <Login />}></Route>
						<Route path="/catalog" element={<Catalog />}></Route>
						<Route path="/ad/:link" element={<AdView />}></Route>
						<Route path="/user/:link" element={<UserProfil />}></Route>
						<Route path="*" element={<NotFound />}></Route>
					</Routes>
				</Suspense>
			<title>Opensell</title>
			</BrowserRouter>
		</ApplicationContext.Provider>
		</>
	);
}