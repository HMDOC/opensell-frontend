import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Signup from './component/page/signup';
import { AdView } from './component/page/AdView';
import NotFound from './component/page/NotFound';
import { useState } from 'react';
import UserProfil from './component/page/UserProfil';

export default function App() {
  const [language, setLanguage] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/ad/:link" element={<AdView />}></Route>
        <Route path="/user/:link" element={<UserProfil />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}