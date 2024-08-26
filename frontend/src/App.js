import React from 'react';
import { RentalProvider } from './context/RentalContext';
import { ItemProvider } from './context/ItemContext';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <RentalProvider>
      <ItemProvider>
        <HomePage />
      </ItemProvider>
    </RentalProvider>
  );
};

export default App;
