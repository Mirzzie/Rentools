import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrderForm from './pages/OrderForm';
import AddItems from './pages/AddItems';
import ItemsModify from './pages/ItemsModify';
import OrderView from './pages/OrderView'; // Correct the import to ensure it's accurate

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/additems" element={<AddItems />} />
        <Route path="/itemsmodify" element={<ItemsModify />} />
        <Route path="/orderview" element={<OrderView />} />
        <Route path="/orderform" element={<OrderForm />} />
      </Routes>
    </Router>
  );
};

export default App;
