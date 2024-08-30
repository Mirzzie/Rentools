import React from 'react';
import ItemForm from '../components/ItemForm';

const AddItems = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Add Items</h1>
            <div className="row mt-4">
                <div className="col-md-6">
                    <ItemForm />
                </div>
            </div>

        </div>
    );
};

export default AddItems;
