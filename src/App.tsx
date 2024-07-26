import "@fontsource/inter";

import { createTheme, ThemeProvider } from '@mui/material';
import getUserInfos from '@services/TokenService';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { LazyLoad } from './components/animations/loading';
import Navbar from './components/navbar';
import PrivateRoute from './components/PrivateRoute';
import { AppContext } from './context/AppContext';
import { Theme, ThemeOption } from './context/Theme';
import { CustomerDto } from './services/customer/auth/CustomerDto';

const About = lazy(() => import("./pages/about"));
const Home = lazy(() => (import("./pages/home")));
const Signup = lazy(() => (import("./pages/auth/Signup")));
const Login = lazy(() => (import("./pages/auth/Login")));
const AdViewDto = lazy(() => (import("./pages/ad-view")));
const UserProfil = lazy(() => (import("./pages/user-profil")));
const NotFound = lazy(() => (import("./pages/not-found")));
const Catalog = lazy(() => (import("./pages/catalog")));
const Setting = lazy(() => (import("./pages/setting")));
const MyAds = lazy(() => (import("./pages/my-ads")));

export default function App() {
	const [customerDto, setCustomerDto] = useState<CustomerDto | undefined>(undefined);
	const [refresh, setRefresh] = useState(false);
	const [theme, setTheme] = useState<ThemeOption>(Theme.getStorageTheme());

	async function getCustomerInfo(): Promise<any> {
		const data = (await getUserInfos("token"))?.data;
		if (customerDto !== data) setCustomerDto(data);
		return data;
	}

	function logout() {
		if (customerDto) setCustomerDto(undefined);
	}

	useEffect(() => {
		getCustomerInfo();
	}, [refresh])

	function changeTheme(theme: ThemeOption) {
		setTheme(theme);
		Theme.setTheme(theme);
	}

	const muiTheme = createTheme({
		palette : {

		},
		components : {
			MuiButton : {
				defaultProps : {
					variant : "contained"
				}
			},
			MuiTextField : {
				defaultProps : {
					variant : "outlined"
				}
			}
		}
	});

	return (
		<AppContext.Provider value={{ theme, changeTheme, customerDto, getCustomerInfo, isDarkMode: () => Theme.isDarkMode(theme), logout }}>
			<ThemeProvider theme={muiTheme}>

				<BrowserRouter>
					<Suspense fallback={<LazyLoad />}>
						<Navbar logout={() => setCustomerDto(undefined)} />
						<br />
						<br />

						<Routes>
							<Route path="/u" element={<PrivateRoute />}>
								<Route path='/u/my-ads' element={<MyAds />} />
								<Route path="/u/setting" element={<Setting customerData={customerDto} refreshCallback={() => setRefresh(!refresh)} />}></Route>
								<Route path="/u/my-profil" element={<UserProfil isMyProfil />}></Route>
							</Route>
							<Route path="/" element={<Home />}></Route>
							<Route path='/about' element={<About />}></Route>
							<Route path="/signup" element={customerDto ? <Navigate to="/" /> : <Signup />}></Route>
							<Route path="/login" element={customerDto ? <Navigate to="/" /> : <Login />}></Route>
							<Route path="/catalog" element={<Catalog />}></Route>
							<Route path="/ad/:id" element={<AdViewDto />}></Route>
							<Route path="/user/:username" element={<UserProfil />}></Route>
							<Route path="*" element={<NotFound />}></Route>
						</Routes>
					</Suspense>
					<title>Opensell</title>
				</BrowserRouter>
			</ThemeProvider>
		</AppContext.Provider>
	);
}