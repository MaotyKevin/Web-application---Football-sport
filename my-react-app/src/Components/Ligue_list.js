import React, { useEffect, useState } from 'react';
import apiService from '../Services/Api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';

import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';


import '../Css/Ligue.css'


const LigueList = () => {
  const [ligues, setLigues] = useState([]);
  const [updateLigueId, setUpdateLigueId] = useState('');
  const [updatedLigueName, setUpdatedLigueName] = useState('');
  const [newLigue, setNewLigue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'


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

    if (!newLigue.trim()) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Error adding ligue. Please try again.');
      setSnackbarOpen(true);
      console.log('Ligue name cannot be empty.');
      return;
    }

    apiService.ligue.post(newLigue)
      .then(response => {
        console.log(response.data.message);
        fetchLigues();
        setNewLigue('');
        setIsAdding(false);
        setSnackbarSeverity('success');
        setSnackbarMessage('Ligue added successfully!');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error adding ligue:', error);
        // Set error Snackbar state
        setSnackbarSeverity('error');
        setSnackbarMessage('Error adding ligue. Please try again.');
        setSnackbarOpen(true);
      });
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

                <IconButton aria-label="modify" onClick={() => setUpdateLigueId(ligue[0])}>
                  <ManageAccountsIcon
                  className="custom-modify-icon"
                  
                  />

                </IconButton>

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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Adjust as needed
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          message={snackbarMessage}
          style={{ backgroundColor: snackbarSeverity === 'success' ? '#43a047' : '#d32f2f' }}
        />

      </Snackbar>

    </div>
  );
};

export default LigueList;