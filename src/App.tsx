import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LazyLoad from './component/shared/part/LazyLoad';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalNavBar from './component/page/GlobalNavBar';
import './App.css';
import getUserInfos from './services/GetUser';
import PrivateRoute from './component/page/PrivateRoute';
import { CustomerDto } from './entities/dto/CustomerDto';
import { AppContext } from './context/AppContext';
import { Theme, ThemeOption } from './context/Theme';

const About = lazy(() => import("./pages/about"));
const MainMenu = lazy(() => (import("./pages/main-menu")));
const Signup = lazy(() => (import("./pages/auth/Signup")));
const Login = lazy(() => (import("./pages/auth/Login")));
const AdView = lazy(() => (import("./pages/ad-view")));
const UserProfil = lazy(() => (import("./pages/user-profil")));
const NotFound = lazy(() => (import("./pages/not-found")));
const Catalog = lazy(() => (import("./pages/catalog")));
const CustomerModification = lazy(() => (import("./pages/customer-modification")));
const AdModification = lazy(() => (import("./pages/ad-modification")));
const MyAds = lazy(() => (import("./pages/my-ads")));

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

	console.log("ENV PORT : "+process.env.REACT_APP_JACK);

	return (
		<>
		<AppContext.Provider value={{ theme, changeTheme, customerDto, getCustomerInfo, isDarkMode: () => Theme.isDarkMode(theme) }}>
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
		</AppContext.Provider>
		</>
	);
}