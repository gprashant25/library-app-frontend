import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  // So the BrowserRouter is really the global element of react-router-dom saying that we can now use the Route inside the App component and tha App component is going to be kind of the main source of Route for our entire application is using Route
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

