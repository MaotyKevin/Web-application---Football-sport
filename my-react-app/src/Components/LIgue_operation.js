import React, { useState } from 'react';
import apiService from '../Services/Api';

const LigueOperations = () => {
  const [newLigue, setNewLigue] = useState('');

  const handleAddLigue = () => {
    apiService.post(newLigue)
      .then(response => {
        console.log(response.data.message);
        
        
      })
      .catch(error => console.error('Error adding ligue:', error));
  };

  return (
    <div>
      
      <div>
        <h1>Add new ligue</h1>
        <input type="text" value={newLigue} onChange={(e) => setNewLigue(e.target.value)} />
        <button onClick={handleAddLigue}>Confirm adding</button>
      </div>
    </div>
  );
};

export default LigueOperations;
