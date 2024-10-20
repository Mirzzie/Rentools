import React from 'react';
import RecordView from '../components/RecordView';

const ViewRecord = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Record View</h1>
            <div className="row mt-4">
                <div className="col-md-14">
                    <RecordView />
                </div>
            </div>

        </div>
    );
};

export default ViewRecord;
