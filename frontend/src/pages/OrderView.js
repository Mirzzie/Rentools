import React from 'react';
import OrderView from '../components/OrderView';

const ViewOrder = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">View Orders</h1>
            <div className="row mt-4">
                <div className="col-md-14">
                    <OrderView />
                </div>
            </div>

        </div>
    );
};

export default ViewOrder;
