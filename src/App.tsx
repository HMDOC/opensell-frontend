import { Component, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LazyLoad from './component/part/LazyLoad';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalNavBar from './component/page/GlobalNavBar';
import './App.css';
import { CustomerInfo } from './entities/dto/CustomerInfo';
import getUserInfos from './services/GetUser';
import PrivateRoute from './component/page/PrivateRoute';
import { CustomerDto } from './entities/dto/CustomerDto';

const MainMenu = lazy(() => (import("./component/page/MainMenu")));
const Signup = lazy(() => (import("./component/page/signup")));
const Login = lazy(() => (import("./component/page/Login")));
const AdView = lazy(() => (import("./component/page/AdView")));
const UserProfil = lazy(() => (import("./component/page/UserProfil")));
const NotFound = lazy(() => (import("./component/page/NotFound")));
const Catalog = lazy(() => (import("./component/page/Catalog")));
const FileUploader = lazy(() => (import("./component/page/FileUploader")));
const CustomerModification = lazy(() => (import("./component/page/CustomerModification")));
const AdModification = lazy(() => (import("./component/page/AdModification")));
const MyAds = lazy(() => (import("./component/page/MyAds")));
const AdCreation = lazy(() => (import("./component/page/AdCreation")));


export default function App() {
	const [language, setLanguage] = useState(0);
	const [customerDto, setCustomerDto] = useState<CustomerDto>(undefined);

	function getCustomerInfo() {
		getUserInfos("token")?.then((res) => {
			if(res?.data) {
				setCustomerDto(res?.data);
			}
		});
	}
	useEffect(() => {
		getCustomerInfo();
	}, [])

	return (
		<BrowserRouter>
			<Suspense fallback={<LazyLoad />}>
				<GlobalNavBar customerDto={customerDto} logout={() => setCustomerDto(undefined)} />
				<Routes>
					<Route path="/u" element={<PrivateRoute />}>
						<Route path='/u/my-ads' element={<MyAds idCustomer={customerDto?.customerId} />}/>
						<Route path="/u/ad-creation" element={<AdCreation idCustomer={customerDto?.customerId}/>}></Route>
						<Route path="/u/ad-modification/:link" element={<AdModification />}></Route>
						<Route path="/u/customer-modification" element={<CustomerModification link={customerDto?.link} />}></Route>
						<Route path="/u/:link" element={<UserProfil />}></Route>
					</Route>
					<Route path="/" element={<MainMenu />}></Route>
					<Route path="/signup" element={<Signup getCustomerInfo={getCustomerInfo}/>}></Route>
					<Route path="/login" element={<Login getCustomerInfo={getCustomerInfo}/>}></Route>
					<Route path="/catalog" element={<Catalog />}></Route>
					<Route path="/ad/:link" element={<AdView />}></Route>
					<Route path="/file-uploader/" element={<FileUploader />}></Route>
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}