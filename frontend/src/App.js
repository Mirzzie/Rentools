import React from 'react';
import { RentalProvider } from './context/RentalContext';
import { ItemProvider } from './context/ItemContext';
import { BillProvider } from './context/BillContext';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <RentalProvider>
      <ItemProvider>
        <BillProvider>
          <HomePage />
        </BillProvider>
      </ItemProvider>
    </RentalProvider>
  );
};

export default App;
