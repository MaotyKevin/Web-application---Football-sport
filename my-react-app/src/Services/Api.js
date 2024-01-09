import axios from 'axios';

const API_BASE_URL = 'http://192.165.18.122:8080' ;  

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const apiEndpoints = {

  ligue: {
    getAll: '/ligue',
    getById: (ligue_id) => `/ligue/${ligue_id}`,
  },

  equipes: {
    getAll: '/equipes',
    create: '/equipes',
    getById: (equipe_id) => `/equipes/${equipe_id}`,
  },

  equipeLigue: (ligue_id) => `/equipesLigue/${ligue_id}`,

  poste: {
    getAll: '/poste',
    getById: (poste_id) => `/poste/${poste_id}`,
  },

  match: {
    getAll: '/match',
  },

  equipeMatchOne: (team_id) => `/equipesMatchOne/${team_id}`,

  equipeMatchTwo: (team_id) => `/equipesMatchTwo/${team_id}`,

  equipeTitulaireOne: (team_id) => `/equipesTitulaireOne/${team_id}`,

  equipeTitulaireTwo: (team_id) => `/equipesTitulaireTwo/${team_id}`,

};

const apiService = {

  ligue: {
    get: () => api.get(apiEndpoints.ligue.getAll),

    post: (newLigue) => api.post(apiEndpoints.ligue.getAll, { ligue_nom: newLigue }),

    delete: (ligue_id) => api.delete(apiEndpoints.ligue.getById(ligue_id)),

    put: (ligue_id, updatedLigueName) => api.put(apiEndpoints.ligue.getById(ligue_id), { ligue_nom: updatedLigueName }),
  },

  equipes: {
    get: () => api.get(apiEndpoints.equipes.getAll),
    delete: (equipe_id) => api.delete(apiEndpoints.equipes.getById(equipe_id)),
    post: (new_team_name , ligue_id) => api.post(apiEndpoints.equipes.create , {team_name: new_team_name , ligue_id : ligue_id}),
  },


  equipeLigue: {
    get : (ligue_id) => api.get(apiEndpoints.equipeLigue(ligue_id))},


  poste: {
    get: () => api.get(apiEndpoints.poste.getAll),

    delete: (poste_id) => api.delete(apiEndpoints.poste.getById(poste_id)),

    post : (poste_nom ) => api.post(apiEndpoints.poste.getAll , {poste_nom:poste_nom}),

    put : (poste_id , Newposte_nom) => api.put(apiEndpoints.poste.getById(poste_id), {poste_nom : Newposte_nom})
  },


  match: {
    get: () => api.get(apiEndpoints.match.getAll) , 

    post: (match_adversaire , match_date , match_lieu) => api.post(apiEndpoints.match.getAll , {match_adversaire: match_adversaire , match_date: match_date , match_lieu:match_lieu})
  },

  equipeMatchOne: {
    get : (team_id) => api.get(apiEndpoints.equipeMatchOne(team_id)) },

  equipeMatchTwo: {
    get : (team_id) => api.get(apiEndpoints.equipeMatchTwo(team_id))},

  equipeTitulaireOne: {
    get : (team_id) => api.get(apiEndpoints.equipeTitulaireOne(team_id))},

  equipeTitulaireTwo: {
    get : (team_id) => api.get(apiEndpoints.equipeTitulaireTwo(team_id)) },

};

export default apiService;
