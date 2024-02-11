import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Signup from './component/page/signup';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' Component={Signup}></Route>
      </Routes>
    </BrowserRouter>
  );
}