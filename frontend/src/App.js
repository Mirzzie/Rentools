import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddItems from './pages/AddItems';
import ItemsModify from './pages/ItemsModify';
import ViewRental from './pages/RentalView';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/additems" element={<AddItems />} />
        <Route path="/itemsmodify" element={<ItemsModify />} />
        <Route path="/viewrentals" element={<ViewRental />} />
      </Routes>
    </Router>
  );
};

export default App;
