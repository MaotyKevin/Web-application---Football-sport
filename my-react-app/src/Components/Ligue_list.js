import React, { useEffect, useState } from 'react';
import apiService from '../Services/Api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const LigueList = () => {
  const [ligues, setLigues] = useState([]);
  const [updateLigueId, setUpdateLigueId] = useState('');
  const [updatedLigueName, setUpdatedLigueName] = useState('');
  const [newLigue, setNewLigue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchLigues();
  }, []);

  const fetchLigues = () => {
    apiService.ligue.get()
      .then(response => {
        setLigues(response.data);
        console.log('Response data:', response.data);
      })
      .catch(error => console.error('Error fetching ligues:', error));
  };

  const handleAddLigue = () => {
    apiService.ligue.post(newLigue)
      .then(response => {
        console.log(response.data.message);
        fetchLigues();
        setLigues('');
        setIsAdding(false);
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

  const renderAddLiguePopup = () => {
    return (
      <div>
        <TextField
          type="text"
          label="New Ligue Name"
          value={newLigue}
          onChange={(e) => setNewLigue(e.target.value)}
        />
        <Button onClick={handleAddLigue}>Add Ligue</Button>
      </div>
    );
  };

  return (
    <div>
      <h1>Ligues</h1>
      {isAdding ? (
        renderAddLiguePopup()
      ) : (
        <Button onClick={() => setIsAdding(true)}>Add New Ligue</Button>
      )}
      <Grid container spacing={2}>
        {ligues.map(ligue => (
          <Grid item xs={12} sm={6} md={4} key={ligue[0]}>
            <Card>
              <CardContent>
                {ligue[1]}
                <Button onClick={() => setUpdateLigueId(ligue[0])}>Update</Button>
                <Button onClick={() => handleDeleteLigue(ligue[0])}>Delete</Button>

                {updateLigueId === ligue[0] && (
                  <div>
                    <TextField
                      type="text"
                      placeholder="Updated Ligue Name"
                      value={updatedLigueName}
                      onChange={(e) => setUpdatedLigueName(e.target.value)}
                    />
                    <Button onClick={() => handleUpdateLigue(ligue[0])}>Save</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LigueList;
