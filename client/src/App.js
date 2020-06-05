import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import SideBar from './shared/SideBar';

const App = () => {
  return (
    <Router>
      <SideBar />
    </Router>
  );
};

export default App;
