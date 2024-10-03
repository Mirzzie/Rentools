import React from 'react';
import ItemsPage from '../components/ItemModify';

const ItemsModify = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Modify Items</h1>
            <div className="row mt-4">
                <div className="col-md-14">
                    <ItemsPage />
                </div>
            </div>

        </div>
    );
};

export default ItemsModify;
