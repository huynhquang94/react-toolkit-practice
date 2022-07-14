import './@fake-db';
import React, { Fragment } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Login from './features/auth/pages/Login';

import axios from 'axios';
import Table from './features/home/page/Table';
import { Box } from '@mui/material';
import Header from './components/common/Header';
import { PrivateRoute } from './components/common/PrivateRoute';
import { AppLayout } from './components/common/AppLayout';
/**
 * Axios HTTP Request defaults
 */
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="" element={<AppLayout />} />
      </Route>
    </Routes>
  );
}

export default App;
