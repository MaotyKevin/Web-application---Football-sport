// src/App.js
import React from 'react';
import LigueList from './Components/Ligue_list';
import LigueOperations from './Components/LIgue_operation';

function App() {
  return (
    <div className="App">
      <LigueList />
      <LigueOperations />
    </div>
  );
}

export default App;
