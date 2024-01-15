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
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

import TeamPlayersModal from './TeamPlayersModal';
import '../Css/Equipe.css'

const EquipeList = () => {
  const [team, setEquipe] = useState([]);
  const [ligueIds, setLigueIds] = useState([]);
  const [new_team_name, setNewEquipeName] = useState('');
  const [ligue_id , setNewLigueID] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [team_id_modifys , set_teamID_modify] = useState('')
  const [team_name_modifys , set_team_name_modify] = useState('')
  const [ligue_id_modifys , set_ligue_id_modify] = useState(0)

  const [isModalOpen, setModalOpen] = useState(false); // State for controlling the modal
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    fetchEquipe();
    fetchLigueIDS();
  }, []);

  const fetchEquipe = () => {
    apiService.equipes.get()
      .then(response => {
        setEquipe(response.data);
        console.log('Response data:', response.data);
      })
      .catch(error => console.error('Error fetching equipe:', error));
  };

  const filteredTeams =
    searchTerm === null || searchTerm === undefined
      ? team
      : team.filter((equipe) =>
          equipe.team_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const fetchLigueIDS = () => {
    apiService.ligue.get()
      .then(response => {
        setLigueIds(response.data);
        console.log('Response data:', response.data);
      })
      .catch(error => console.error('Error fetching ligues IDS:', error));
  };

  const handleModify = (team_id) => {
    console.log('Modifying team:', team_id, team_name_modifys, ligue_id_modifys);
  
    apiService.equipes.put(team_id, team_name_modifys, ligue_id_modifys)
      .then(response => {
        console.log("Update club success");
        fetchEquipe();
      })
      .catch(error => console.error('Error updating club', error));
  
    set_teamID_modify('');
    set_team_name_modify('');
    set_ligue_id_modify(0);
  };
  

  const handleAddEquipe= () => {

    if (!new_team_name.trim()){
      setSnackbarSeverity('error');
      setSnackbarMessage('Error adding club. Please try again.');
      setSnackbarOpen(true);
      console.log('Club name cannot be empty.');
      return;
    }

    if (!ligue_id) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Error adding Club. Please select a valid league.');
      setSnackbarOpen(true);
      console.log('Please select a valid league.');
      return;
    }

    apiService.equipes.post(new_team_name , ligue_id)
      .then(response => {
        console.log(response.data.message);
        fetchEquipe();
        setNewEquipeName('');
        setNewLigueID(0);
        setIsAdding(false);
        setSnackbarSeverity('success');
        setSnackbarMessage('Club added successfully!');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error adding club :', error);
        // Set error Snackbar state
        setSnackbarSeverity('error');
        setSnackbarMessage('Error adding club. Please try again.');
        setSnackbarOpen(true);
      });
  };

  const handleDeleteEquipe = (equipe_id) => {
    apiService.equipes.delete(equipe_id)
      .then(response => {
        console.log(response.data.message);
        fetchEquipe();
      })
      .catch(error => console.error('Error deleting equipe:', error));
  };

  const handleDetailsClick = (equipe_id) => {
    setModalOpen(true);
    setSelectedTeamId(equipe_id);
  };


  const renderAddEquipePopup = () => {
    return (
      <div className="container-add-team" >
        <div className="textfield-add-team">
          <TextField
          type="text"
          label="New club name"
          value={new_team_name}
          onChange={(e) => setNewEquipeName(e.target.value)}
        />
        </div>

        <div className="select-add-team">
          <Select
        
          value={ligue_id}
          onChange={(e) => setNewLigueID(e.target.value)}
        >

          <MenuItem value="" disabled>
            Select Ligue ID
          </MenuItem>

          {ligueIds.map(id => (
            <MenuItem key={id[0]} value={id[0]}>
              {id[1]}
            </MenuItem>
          ))}
        </Select>
        </div>

        <div className="div-button-add-team">
        <Button onClick={handleAddEquipe}>Valider</Button>
        </div>

        
      </div>
    );
  };

  return (
    <div>

      {isAdding ? (
        renderAddEquipePopup()
      ) : (
      <div className="add-search">
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setIsAdding(true)}>Nouveau</Button>
                {/* Autocomplete Search */}
          <div style={{ marginLeft: '16px' }}>

          <Autocomplete
            options={team.map((equipe) => equipe.team_name)}
            value={searchTerm || ''}
            onChange={(event, newValue) => setSearchTerm(newValue)}
            renderInput={(params) => (
              <TextField 
                {...params}
                label="Search club" 
                variant="outlined" 
                style={{ width: 200 }}
              />
            )}
          />


          </div>

      </div>
        
      )}
      <Grid container spacing={2}>
        {filteredTeams.map(equipe => (
          <Grid item xs={12} sm={6} md={4} key={equipe.team_id}>
            <Card>
              <CardContent>
                {equipe.team_name}

                <div className="detail-delete" >

                <IconButton aria-label="modify" onClick={() => set_teamID_modify(equipe.team_id)}>
                  <ManageAccountsIcon className="custom-modify-button "/>
                </IconButton>

                <IconButton aria-label="details" onClick={() => handleDetailsClick(equipe.team_id)}>
                  <InfoIcon className="custom-icon-button "/>
                </IconButton>

                
                <IconButton aria-label="delete" onClick={() => handleDeleteEquipe(equipe.team_id)}>
                  <DeleteIcon className="custom-delete-icon"/>
                </IconButton>

                </div>

                {team_id_modifys === equipe.team_id && (
                  <div>
                    <TextField
                      type="text"
                      label={`${equipe.team_name}`}
                      value={team_name_modifys}
                      onChange={(e) => set_team_name_modify(e.target.value)}
                    />

        <div className="select-modify-team_ligueID">
          <Select
        
          value={ligue_id_modifys}
          onChange={(e) => set_ligue_id_modify(e.target.value)}
          >

            <MenuItem value="" disabled>
              Select Ligue ID
            </MenuItem>

            {ligueIds.map(id => (
              <MenuItem key={id[0]} value={id[0]}>
                {id[1]}
              </MenuItem>
            ))}
          </Select>
        </div>


                    <Button onClick={() => handleModify(equipe.team_id)}>Save</Button>
                  </div>
                )}
  
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Render the TeamPlayersModal */}
      <TeamPlayersModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        teamId={selectedTeamId}
      />

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

export default EquipeList;
