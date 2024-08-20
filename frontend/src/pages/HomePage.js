import React from 'react';
import RentalForm from '../components/RentalForm';
import ItemForm from '../components/ItemForm';
import BillForm from '../components/BillForm';
// import CustomerList from '../components/CustomerList';
// import RentalList from '../components/RentalList';
// import ItemList from '../components/ItemList';
// import BillList from '../components/BillList';

const HomePage = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Rental Tool Shop</h1>
            <div className="row">
                {/* <div className="col-md-6">
                    <CustomerList />
                </div> */}
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <RentalForm />
                </div>
                {/* <div className="col-md-6">
                    <RentalList />
                </div> */}
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <ItemForm />
                </div>
                {/* <div className="col-md-6">
                    <ItemList />
                </div> */}
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <BillForm />
                </div>
                {/* <div className="col-md-6">
                    <BillList />
                </div> */}
            </div>
        </div>
    );
};

export default HomePage;
