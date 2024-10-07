import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import {OktaAuth, toRelativeUrl} from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

  

  const customAuthHandler = () => {
    history.push('/login');
  }

  // here we're creating the custom AuthHandler
  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };


  return (

    <div className='d-flex flex-column min-vh-100'>

      {/* here we've created a Security component which is the root component of all other component */}
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>

      <Navbar />

      <div className='flex-grow-1'>
        <Switch>

          {/* Now adding exact in below Route means that this will only render this HomePage when its noting at the end of our URL and its exactly nothing so now it'll not render /search Route path */}
          {/* so when the user enters http://localhost:3000/ then we're going to redirect our URL to http://localhost:3000/home and this /home will rendor our HomePage component */}
          <Route path='/' exact>
            <Redirect to='/home' />
          </Route>

          <Route path='/home'> <HomePage /></Route>

          <Route path='/search'> <SearchBooksPage /> </Route>

          <Route path='/reviewlist/:bookId'> <ReviewListPage /> </Route>

          <Route path='/checkout/:bookId'> <BookCheckoutPage /> </Route>

          <Route path='/login' render={() => <LoginWidget config={oktaConfig} />} ></Route>

          <Route path='/login/callback' component={LoginCallback}></Route>

          {/* Router DOM security feature bcos we do not want the user to go to this page unless they're completely authorized */}
          <SecureRoute path='/shelf'> <ShelfPage/> </SecureRoute>

          <SecureRoute path='/messages'> <MessagesPage/> </SecureRoute>

          <SecureRoute path='/admin'> <ManageLibraryPage/> </SecureRoute>

        </Switch>
      </div>

      <Footer />

      </Security>

    </div>

  );

}


