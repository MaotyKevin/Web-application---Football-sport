import React, { useEffect, useState } from 'react';
import apiService from '../Services/Api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';


import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';



const TitulaireList = () => {
  const [titulaires, setTitulaire] = useState([]);
  const [PosteIds, setPosteIds] = useState([]);
  const [new_titulaire_name, setNewTitulaireName] = useState('');
  const [new_poste_id , setNewpostID] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [titulaire_id_modifys , set_titulaireID_modify] = useState('')
  const [titulaire_name_modifys , set_titulaire_name_modify] = useState('')
  const [poste_id_modifys , set_poste_id_modify] = useState(0)



  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    fetchTitulaire();
    fetchPosteIDS();
  }, []);

  const fetchTitulaire = () => {
    apiService.titulaire.get()
      .then(response => {
        setTitulaire(response.data);
        console.log('Response data:', response.data);
      })
      .catch(error => console.error('Error fetching titulaire:', error));
  };

  const filteredTitulaire =
    searchTerm === null || searchTerm === undefined
      ? titulaires
      : titulaires.filter((titulaire) =>
          titulaire.titulaire_nom.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const fetchPosteIDS = () => {
    apiService.poste.get()
      .then(response => {
        setPosteIds(response.data);
        console.log('Response data:', response.data);
      })
      .catch(error => console.error('Error fetching postes IDS:', error));
  };

  

  const handleModify = (titulaire_id) => {
    console.log('Modifying titulaire:', titulaire_id, titulaire_name_modifys, poste_id_modifys);
  
    apiService.titulaire.put(titulaire_id, titulaire_name_modifys, poste_id_modifys)
      .then(response => {
        console.log("Update titulaire success");
        fetchTitulaire();
      })
      .catch(error => console.error('Error updating titulaire', error));
  
    set_titulaireID_modify('');
    set_titulaire_name_modify('');
    set_poste_id_modify(0);
  };
  

  const handleAddTitulaire= () => {

    if (!new_titulaire_name.trim()){
      setSnackbarSeverity('error');
      setSnackbarMessage('Error adding titulaire. Please try again.');
      setSnackbarOpen(true);
      console.log('titulaire name cannot be empty.');
      return;
    }

    if (!new_poste_id) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Error adding titulaire. Please select a valid poste.');
      setSnackbarOpen(true);
      console.log('Please select a valid poste.');
      return;
    }

    apiService.titulaire.post(new_titulaire_name , new_poste_id)
      .then(response => {
        console.log(response.data.message);
        fetchTitulaire();
        setNewTitulaireName('');
        setNewpostID(0);
        setIsAdding(false);
        setSnackbarSeverity('success');
        setSnackbarMessage('Titulaire added successfully!');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error adding titulaire :', error);
        // Set error Snackbar state
        setSnackbarSeverity('error');
        setSnackbarMessage('Error adding titulaire. Please try again.');
        setSnackbarOpen(true);
      });
  };

  const handleDeleteTitulaire = (titulaire_id) => {
    apiService.titulaire.delete(titulaire_id)
      .then(response => {
        console.log(response.data.message);
        fetchTitulaire();
      })
      .catch(error => console.error('Error deleting titulaire:', error));
  };


  const renderAddTitulairePopup = () => {
    return (
      <div className="container-add-titulaire" >
        <div className="textfield-add-titulaire">
          <TextField
          type="text"
          label="New titulaire name"
          value={new_titulaire_name}
          onChange={(e) => setNewTitulaireName(e.target.value)}
        />
        </div>

        <div className="select-add-titulaire">
          <Select
        
          value={new_poste_id}
          onChange={(e) => setNewpostID(e.target.value)}
        >

          <MenuItem value="" disabled>
            Select poste ID
          </MenuItem>

          {PosteIds.map(id => (
            <MenuItem key={id[0]} value={id[0]}>
              {id[1]}
            </MenuItem>
          ))}
        </Select>
        </div>

        <div className="div-button-add-titulaire">
        <Button onClick={handleAddTitulaire}>Valider</Button>
        </div>

        
      </div>
    );
  };

  return (
    <div>

      {isAdding ? (
        renderAddTitulairePopup()
      ) : (
      <div className="add-search">
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setIsAdding(true)}>Nouveau</Button>
                {/* Autocomplete Search */}
          <div style={{ marginLeft: '16px' }}>

          <Autocomplete
            options={titulaires.map((titulaire) => titulaire.titulaire_nom)}
            value={searchTerm || ''}
            onChange={(event, newValue) => setSearchTerm(newValue)}
            renderInput={(params) => (
              <TextField 
                {...params}
                label="Search titulaire" 
                variant="outlined" 
                style={{ width: 200 }}
              />
            )}
          />


          </div>

      </div>
        
      )}
      <Grid container spacing={2}>
        {filteredTitulaire.map(titulaire => (
          <Grid item xs={12} sm={6} md={4} key={titulaire.titulaire_id}>
            <Card>
              <CardContent>
                {titulaire.titulaire_nom} - {titulaire.poste_nom}

                <div className="detail-delete" >

                <IconButton aria-label="modify" onClick={() => set_titulaireID_modify(titulaire.titulaire_id)}>
                  <ManageAccountsIcon className="custom-modify-button "/>
                </IconButton>

                
                <IconButton aria-label="delete" onClick={() => handleDeleteTitulaire(titulaire.titulaire_id)}>
                  <DeleteIcon className="custom-delete-icon"/>
                </IconButton>

                </div>

                {titulaire_id_modifys === titulaire.titulaire_id && (
                  <div>
                    <TextField
                      type="text"
                      label={`${titulaire.titulaire_nom}`}
                      value={titulaire_name_modifys}
                      onChange={(e) => set_titulaire_name_modify(e.target.value)}
                    />

        <div className="select-modify-titulaire_posteID">
          <Select
        
          value={poste_id_modifys}
          onChange={(e) => set_poste_id_modify(e.target.value)}
          >

            <MenuItem value="" disabled>
              Select poste ID
            </MenuItem>

            {PosteIds.map(id => (
              <MenuItem key={id[0]} value={id[0]}>
                {id[1]}
              </MenuItem>
            ))}
          </Select>
        </div>


                    <Button onClick={() => handleModify(titulaire.titulaire_id)}>Save</Button>
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

export default TitulaireList;
