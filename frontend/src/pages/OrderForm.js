import React from 'react';
import OrderForm from '../components/OrderForm';


const Order = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Order Form</h1>
            <div className="row mt-4">
                <div className="col-md-14">
                    <OrderForm />
                </div>
            </div>

        </div>
    );
};

export default Order;
