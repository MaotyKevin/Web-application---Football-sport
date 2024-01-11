// PosteComponent.js
import React, { useState, useEffect } from 'react';
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

import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

import '../Css/Poste.css'

const PosteComponent = () => {
  const [postes, setPostes] = useState([]);
  const [updatePosteId , setUpdatePOsteId] = useState('');
  const [updatePosteNames , setUpdatePosteNames] = useState('')
  const [newPostes, setNewPoste] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  useEffect(() => {
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

  const filteredPoste =
    searchTerm === null || searchTerm === undefined
      ? postes
      : postes.filter((poste) =>
          poste[1].toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleAddPoste = async () => {
    try {

      if (!newPostes.trim()) {
        console.log('Poste name cannot be empty.');
        setSnackbarSeverity('error');
        setSnackbarMessage('Error adding poste. Please try again.');
        setSnackbarOpen(true);
        return;
      }

      await apiService.poste.post(newPostes);
      fetchPostes();
      setNewPoste('');
      setIsAdding(false);
      setSnackbarSeverity('success');
      setSnackbarMessage('Poste added successfully!');
      setSnackbarOpen(true);

    } catch (error) {
      console.error('Error adding poste:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error adding poste. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleDeletePoste = async (poste_id) => {
    try {
      await apiService.poste.delete(poste_id);
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

  const renderAddPostePopup = () => {
    return (
      <div className="container-add-poste">
        <TextField
          type="text"
          label="New Poste Name"
          value={newPostes}
          onChange={(e) => setNewPoste(e.target.value)}
        />
        <Button onClick={handleAddPoste}>Add Poste</Button>
      </div>
    );
  };

  return (
    <div>
     
      {isAdding ? (
        renderAddPostePopup()
      ) : (
        <div className="add-search">

          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setIsAdding(true)}>Nouveau</Button>
                {/* Autocomplete Search */}
          <div style={{ marginLeft: '16px' }}>

            <Autocomplete
              options={postes.map((poste) => poste[1])}
              value={searchTerm || ''}
              onChange={(event, newValue) => setSearchTerm(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params}
                  label="Search poste" 
                  variant="outlined" 
                  style={{ width: 200 }}
                />
              )}
            />


          </div>

        </div>
      )}
      <Grid container spacing={2}>
        {filteredPoste.map(poste => (
          <Grid item xs={12} sm={6} md={4} key={poste[0]}>
            <Card>
              <CardContent>
                {poste[1]}

                <div className="update-delete">

                  <Button onClick={() => setUpdatePOsteId(poste[0])}>Update</Button>

                  <IconButton aria-label="delete" onClick={() => handleDeletePoste(poste[0])}>
                    <DeleteIcon className="custom-delete-icon"/>
                  </IconButton>

                </div>


                {updatePosteId === poste[0] && (
                  <div>
                    <TextField
                      type="text"
                      placeholder="Updated Poste Name"
                      value={updatePosteNames}
                      onChange={(e) => setUpdatePosteNames(e.target.value)}
                    />
                    <Button onClick={() => handleUpdatePoste(poste[0])}>Save</Button>
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


export default PosteComponent;
