import React, { useEffect, useState } from 'react';
import apiService from '../Services/Api';

const TeamPlayersModal = ({ isOpen, onClose, teamId }) => {
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState([]);

  useEffect(() => {
    if (isOpen && teamId !== null) {

    apiService.individual.get(teamId)
    .then(response => {
        setTeamName(response.data);
    })
    .catch(error => console.error('Error fetching team name:', error));

      apiService.equipeTitulaireOne.get(teamId)
        .then(response => setPlayers(response.data))
        .catch(error => console.error('Error fetching team players:', error));
    }
  }, [isOpen, teamId]);

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }} onClick={onClose}></div>
      <div style={{ backgroundColor: '#fff', padding: '20px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
        
        {teamName.map(nomEquipe => (<h2 key={nomEquipe[0]}>{nomEquipe[1]}</h2>))}
        
        <ul>
          {players.map(player => (
            <li key={player.titulaire_id}>{player.titulaire_nom} - {player.poste_nom}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TeamPlayersModal;
