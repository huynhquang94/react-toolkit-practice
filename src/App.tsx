import './@fake-db';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './features/auth/pages/Login';

import axios from 'axios';
import Table from './features/home/page/Table';
import { Box } from '@mui/material';
import Header from './components/common/Header';
/**
 * Axios HTTP Request defaults
 */
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

function App() {
  return (
    <div className="App">
      <Box>
        <Header />
      </Box>
      <Box>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Table />} />
        </Routes>
      </Box>
    </div>
  );
}

export default App;
