import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './pages/home';
import Login from './pages/login';
import Upload from './pages/upload';
import Register from './pages/signup';
import NotFound from './components/404';
import VideoDetail from './pages/video_detail';
import { BrowserRouter, Routes, Route } from "react-router-dom";

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="video/upload" element={<Upload />} />
      <Route path="user/register" element={<Register />} />
      <Route path="user/login" element={<Login />} />
      <Route path="videos/:videoId" element={<VideoDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
