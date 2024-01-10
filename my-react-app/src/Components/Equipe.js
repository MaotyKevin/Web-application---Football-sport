import React, { useEffect, useState } from 'react';
import apiService from '../Services/Api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import TeamPlayersModal from './TeamPlayersModal';

const EquipeList = () => {
  const [team, setEquipe] = useState([]);

  const [new_team_name, setNewEquipeName] = useState('');
  const [ligue_id , setNewLigueID] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false); // State for controlling the modal
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  useEffect(() => {
    fetchEquipe();
  }, []);

  const fetchEquipe = () => {
    apiService.equipes.get()
      .then(response => {
        setEquipe(response.data);
        console.log('Response data:', response.data);
      })
      .catch(error => console.error('Error fetching equipe:', error));
  };

  const handleAddEquipe= () => {
    apiService.equipes.post(new_team_name , ligue_id)
      .then(response => {
        console.log(response.data.message);
        fetchEquipe();
        setNewEquipeName('');
        setNewLigueID(0);
        setIsAdding(false);
      })
      .catch(error => console.error('Error adding equipe:', error));
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
      <div>
        <TextField
          type="text"
          label="New equipe Name"
          value={new_team_name}
          onChange={(e) => setNewEquipeName(e.target.value)}
        />
        <TextField
          type="text"
          label="LIgue ID"
          value={ligue_id}
          onChange={(e) => setNewLigueID(e.target.value)}
        />

        <Button onClick={handleAddEquipe}>Add equipe</Button>
      </div>
    );
  };

  return (
    <div>
      <h1>Equipes</h1>
      {isAdding ? (
        renderAddEquipePopup()
      ) : (
        <Button onClick={() => setIsAdding(true)}>Add New equipe</Button>
      )}
      <Grid container spacing={2}>
        {team.map(equipe => (
          <Grid item xs={12} sm={6} md={4} key={equipe.team_id}>
            <Card>
              <CardContent>
                {equipe.team_name}

                <Button onClick={() => handleDetailsClick(equipe.team_id)}>Details</Button>
                
                <Button onClick={() => handleDeleteEquipe(equipe.team_id)}>Delete</Button>

                
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


    </div>
  );
};

export default EquipeList;