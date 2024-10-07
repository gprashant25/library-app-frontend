import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';

export const Navbar = () => {

    const {oktaAuth, authState} = useOktaAuth();

    if(!authState){
        <SpinnerLoading/>
    }

    const handleLogout = async () => oktaAuth.signOut();

    // here we're printing the authState everytime in the console so that we can check the authState authentication current status
    console.log(authState);

    return (

        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>

            <div className='container-fluid'>

                <span className='navbar-brand mb-0 h1'>Luv 2 Read</span>

                {/* Below button created for the mobile view */}
                <button className='navbar-toggler' type='button'
                    data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown' aria-expanded='false'
                    aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>

                {/* Below code is to display the Desktop view */}
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>

                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/home'>Home</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/search'>Search Books</NavLink>
                        </li>

                        {authState?.isAuthenticated &&
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/shelf'>Shelf</NavLink>
                            </li>
                        }

                        {authState?.isAuthenticated && authState.accessToken?.claims?.userType === 'admin' &&
                            <li className='nav-item'>
                                <NavLink className='nav-link' to={'/admin'}>Admin</NavLink>
                            </li>
                        }
                    </ul>

                    <ul className='navbar-nav ms-auto'>
                        {!authState?.isAuthenticated ?
                            <li className='nav-item m-1'>
                            <Link className='btn btn-outline-light' type='button' to='/login' >Sign in</Link>
                            </li>
                            :
                            <li>
                                <button className='btn btn-outline-light' onClick={handleLogout}>Logout</button>
                            </li>
                        }
                    </ul>

                </div>

            </div>

        </nav>


    );
}