import './@fake-db';
import React from 'react';
import './App.css';
import Login from './features/auth/pages/Login';

import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
