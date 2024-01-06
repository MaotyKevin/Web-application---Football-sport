// PosteComponent.js
import React, { useState, useEffect } from 'react';
import apiService from '../Services/Api';

const PosteComponent = () => {
  const [postes, setPostes] = useState([]);
  const [updatePosteId , setUpdatePOsteId] = useState('');
  const [updatePosteNames , setUpdatePosteNames] = useState('')
  const [newPostes, setNewPoste] = useState('');

  useEffect(() => {
    // Fetch postes when the component mounts
    fetchPostes();
  }, []);

  const fetchPostes = async () => {
    try {
      const response = await apiService.poste.get();
      setPostes(response.data);
    } catch (error) {
      console.error('Error fetching postes:', error);
    }
  };

  const handleAddPoste = async () => {
    try {
      await apiService.poste.post(newPostes);
      // After adding a new poste, fetch postes again to update the list
      fetchPostes();
      // Clear the input field
      setNewPoste('');
    } catch (error) {
      console.error('Error adding poste:', error);
    }
  };

  const handleDeletePoste = async (poste_id) => {
    try {
      await apiService.poste.delete(poste_id);
      // After deleting a poste, fetch postes again to update the list
      fetchPostes();
    } catch (error) {
      console.error('Error deleting poste:', error);
    }
  };

  const handleUpdatePoste = (poste_id) => {
    apiService.poste.put(poste_id, updatePosteNames)
      .then(response => {
        console.log(response.data.message);
        fetchPostes();
      })
      .catch(error => console.error('Error updating ligue:', error));
    
      setUpdatePOsteId('');
      setUpdatePosteNames('');
    };

  return (
    <div>
      <h2>Postes</h2>
      <ul>
        {postes.map((poste) => (
          <li key={poste[0]}>
            {poste[1]}
            <button onClick={() => handleDeletePoste(poste[0])}>Delete</button>

            <button onClick={() => setUpdatePOsteId(poste[0])}>Update</button>

            {updatePosteId === poste[0] && (
              <div>
                <input
                  type="text"
                  placeholder="Updated Poste Name"
                  value={updatePosteNames}
                  onChange={(e) => setUpdatePosteNames(e.target.value)}
                />
                <button onClick={() => handleUpdatePoste(poste[0])}>Save</button>
              </div>
            )}

          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newPostes}
          onChange={(e) => setNewPoste(e.target.value)}
          placeholder="Enter new poste"
        />
        <button onClick={handleAddPoste}>Add Poste</button>
      </div>
    </div>
  );

};


export default PosteComponent;
