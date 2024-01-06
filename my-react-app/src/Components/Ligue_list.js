import React, { useEffect, useState } from 'react';
import apiService from '../Services/Api';


const LigueList = () => {
  const [ligues, setLigues] = useState([]);
  const [updateLigueId, setUpdateLigueId] = useState('');
  const [updatedLigueName, setUpdatedLigueName] = useState('');
  const [newLigue, setNewLigue] = useState('');

  useEffect(() => {
  
    fetchLigues();
    
  }, []);
  

  const fetchLigues = () => {
    apiService.ligue.get()
      .then(
        response => {setLigues(response.data) ;
        console.log('Response data:', response.data);})

      .catch(error => console.error('Error fetching ligues:', error));
  };

  const handleAddLigue = () => {
    apiService.ligue.post(newLigue)
      .then(response => {
        console.log(response.data.message);
        
        
      })
      .catch(error => console.error('Error adding ligue:', error));
  };

  const handleDeleteLigue = (ligue_id) => {
    apiService.ligue.delete(ligue_id)
      .then(response => {
        console.log(response.data.message);
        fetchLigues();
      })
      .catch(error => console.error('Error deleting ligue:', error));
  };

  const handleUpdateLigue = (ligue_id) => {
    apiService.ligue.put(ligue_id, updatedLigueName)
      .then(response => {
        console.log(response.data.message);
        fetchLigues();
      })
      .catch(error => console.error('Error updating ligue:', error));

   
    setUpdateLigueId('');
    setUpdatedLigueName('');
  };

  return (

    
    <div>
      <h1>Ligues</h1>
      <ul>
        {ligues.map(ligue => (
          <li key={ligue[0]}>
            {ligue[1]}
            <button onClick={() => setUpdateLigueId(ligue[0])}>Update</button>
            <button  onClick={() => handleDeleteLigue(ligue[0])}>Delete</button>

            {updateLigueId === ligue[0] && (
              <div>
                <input
                  type="text"
                  placeholder="Updated Ligue Name"
                  value={updatedLigueName}
                  onChange={(e) => setUpdatedLigueName(e.target.value)}
                />
                <button onClick={() => handleUpdateLigue(ligue[0])}>Save</button>
              </div>
            )}
          </li>
        ))}
      </ul>

    
      
      <div>
        <h1>Add new ligue</h1>
        <input type="text" value={newLigue} onChange={(e) => setNewLigue(e.target.value)} />
        <button onClick={handleAddLigue}>Confirm adding</button>
      </div>
    </div>

   
  );
};

export default LigueList;
