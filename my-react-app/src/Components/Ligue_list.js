import React, { useEffect, useState } from 'react';
import apiService from '../Services/Api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';

import '../Css/Ligue.css'


const LigueList = () => {
  const [ligues, setLigues] = useState([]);
  const [updateLigueId, setUpdateLigueId] = useState('');
  const [updatedLigueName, setUpdatedLigueName] = useState('');
  const [newLigue, setNewLigue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredLigue =
    searchTerm === null || searchTerm === undefined
      ? ligues
      : ligues.filter((ligue) =>
          ligue[1].toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleAddLigue = () => {
    apiService.ligue.post(newLigue)
      .then(response => {
        console.log(response.data.message);
        fetchLigues();
        setNewLigue('');
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
      <div className="container-add-ligue">
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
   
      {isAdding ? (
        renderAddLiguePopup()
      ) : (
      <div className="add-search">

        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setIsAdding(true)}>Nouveau</Button>
        {/* Autocomplete Search */}
        <div style={{ marginLeft: '16px' }}>

          <Autocomplete
            options={ligues.map((ligue) => ligue[1])}
            value={searchTerm || ''}
            onChange={(event, newValue) => setSearchTerm(newValue)}
            renderInput={(params) => (
              <TextField 
                {...params}
                label="Search league" 
                variant="outlined" 
                style={{ width: 200 }}
              />
            )}
          />


        </div>
        
      </div>
    
      )}
      <Grid container spacing={2}>
        {filteredLigue.map(ligue => (
          <Grid item xs={12} sm={6} md={4} key={ligue[0]}>
            <Card>
              <CardContent>
                {ligue[1]}

                <div className="update-delete">

                <Button onClick={() => setUpdateLigueId(ligue[0])}>Update</Button>

                <IconButton aria-label="delete" onClick={() => handleDeleteLigue(ligue[0])}>
                  <DeleteIcon className="custom-delete-icon"/>
                </IconButton>


                </div>



                {updateLigueId === ligue[0] && (
                  <div>
                    <TextField
                      type="text"
                      label={`${ligue[1]}`}
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