import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";

export const Heros = () => {

    const {authState} = useOktaAuth();

    return (

        <div>

            {/* below entire code is for Desktop version */}
            <div className="d-none d-lg-block">

                {/* below code to create a single row and inside that 2 columns */}
                <div className="row g-0 mt-5">

                    {/* below is colunm 1 */}
                    <div className="col-sm-6 col-md-6">
                        <div className="col-image-left"></div>
                    </div>

                    {/* below is column 2 */}
                    <div className="col-4 col-md-4 container d-flex justify-content-center align-items-center">
                        <div className="ml-2">
                            <h1>What have you been reading?</h1>
                            <p className="lead">
                                The library team would love to know what you have been reading.
                                Whether it is to learn a new skill by reading books,
                                we will be able to provide the top content for you!
                            </p>

                            {authState?.isAuthenticated ?
                                <Link className="btn main-color btn-lg text-white" type="button" to="/search">Explore top books</Link>
                                :
                                <Link className="btn main-color btn-lg text-white" to="/login">Sign up</Link>
                            }
                            

                        </div>

                    </div>

                </div>


                {/* below code to create a single row and inside that 2 columns */}
                <div className="row g-0">

                    {/* below is column 1 */}
                    <div className="col-4 col-md-4 container d-flex justify-content-center align-items-center">
                        <div className="ml-2">
                            <h1>Our collection of books is always changing!</h1>
                            <p className="lead">
                                Try to check in daily as our collection is always changing!
                                We work nonstop to provide the most accurate book selection possible
                                for our Luv 2 Read students. We are diligent about our book selection
                                and our books are always going to be our
                                top priority.
                            </p>

                        </div>
                    </div>

                    {/* below is column 2 */}
                    <div className="col-sm-6 col-md-6">
                        <div className="col-image-right"></div>

                    </div>

                </div>

            </div>


            {/* Below code is for mobile version */}
            <div className="d-lg-none">

                <div className="container">

                    {/* Below is the 1st part of row */}
                    <div className="m-2">

                        {/* Below is column 1 */}
                        <div className="col-image-left"></div>

                        {/* Below is column 2 */}
                        <div className="mt-2">
                            <h1>What have you been reading?</h1>
                            <p className="lead">
                                The library team would love to know what you have been reading.
                                Whether it is to learn a new skill by reading books,
                                we will be able to provide the top content for you!
                            </p>

                            {authState?.isAuthenticated ?
                                <Link className="btn main-color btn-lg text-white" to="/search">Explore top books</Link>   
                                : 
                                <Link className="btn main-color btn-lg text-white" to="/login">Sign up</Link>
                            }
                            

                        </div>

                    </div>

                    {/* Below is the 2nd part of row for mobile version */}
                    <div className="m-2">

                        {/* below is column 1 for mobile version */}
                        <div className="col-image-right"></div>

                        {/* Below is the column 2 for mobile version */}
                        <div className="mt-2">
                            <h1>Our collection of books is always changing!</h1>
                            <p className="lead">
                                Try to check in daily as our collection is always changing!
                                We work nonstop to provide the most accurate book selection possible
                                for our Luv 2 Read students. We are diligent about our book selection
                                and our books are always going to be our
                                top priority.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>


    );
}