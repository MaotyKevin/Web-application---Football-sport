import React, { useEffect, useState } from 'react';
import apiService from '../Services/Api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const EquipeList = () => {
  const [equipes, setEquipe] = useState([]);
  const [team_name, setNewEquipeName] = useState('');
  const [ligue_id , setNewLigueID] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

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
    apiService.equipes.post(team_name , ligue_id)
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



  const renderAddEquipePopup = () => {
    return (
      <div>
        <TextField
          type="text"
          label="New equipe Name"
          value={team_name}
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
        {equipes.map(equipe => (
          <Grid item xs={12} sm={6} md={4} key={equipe.team_id}>
            <Card>
              <CardContent>
                {equipe.team_name}
                
                <Button onClick={() => handleDeleteEquipe(equipe.team_id)}>Delete</Button>

                
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EquipeList;
