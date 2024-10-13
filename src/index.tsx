import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Q8PgoRrI9zcMaPstutxtF3jAfFz5E5FrCiNO130OVLEa4BezLBhXLtUYveDAfVjwS7clKaOgKw4TZ4R4wwi69ji00JmSEoMgF');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  // So the BrowserRouter is really the global element of react-router-dom saying that we can now use the Route inside the App component and tha App component is going to be kind of the main source of Route for our entire application is using Route
  // here using below stripe Elements tag allows our application to now use Stripe within our Components 
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>
);

