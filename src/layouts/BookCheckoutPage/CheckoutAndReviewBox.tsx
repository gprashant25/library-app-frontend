import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";

// NOTE: here below book? means we are not using the props for this and directly using book?.author for each single book 

export const CheckoutAndReviewBox: React.FC<{ book: BookModel | undefined, mobile: boolean, currentLoansCount: number, 
    isAuthenticated: any, isCheckedOut: boolean, checkoutBook: any, 
    isReviewLeft: boolean, submitReview: any }> = (props) => {

    // below function is for Checkout button
    function buttonRender(){

        if(props.isAuthenticated){

            if(!props.isCheckedOut && props.currentLoansCount < 5){
                return (
                    <button className="btn btn-success btn-lg" onClick={() => props.checkoutBook()}>Checkout</button>
                );
            } else if(props.isCheckedOut){
                return (
                    <p>
                        <b>Book already checked out. Enjoy!</b>
                    </p>
                );
            } else if(!props.isCheckedOut){
                return(
                    <p className="text-danger">
                        Too many books checked out.
                    </p>
                );
            }

        }
        else{
            return(
                <Link className="btn btn-success btn-lg" to={"/login"}>Sigin in</Link>
            );
        }
    }

    // below function is to check for Review
    function reviewRender(){

        if(props.isAuthenticated && !props.isReviewLeft){
            return (
                <p>
                   <LeaveAReview submitReview={props.submitReview}/>
                </p>
            );
        } else if(props.isAuthenticated && props.isReviewLeft){
            return (
                <p>
                    <b>Thank you for your review!</b>
                </p>
            );
        }
        else {
            return(
                <div>
                    <hr/>
                    <p>Sign in to be able to leave a review.</p>
                </div>
            );
        }
    }

    return (

        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>

            <div className="card-body container">

                <div className="mt-3">
                    <p>
                        <b>{props.currentLoansCount}/5</b> books checked out
                    </p>

                    <hr />
                    {/* Below using the ternary operator */}
                    {props.book && props.book.copiesAvailable &&
                        props.book.copiesAvailable > 0 ?
                        <h4 className="text-success">Available</h4>
                        :
                        <h4 className="text-danger">Wait List</h4>
                    }

                    <div className="row">
                        {/* NOTE: here below book? means any one book from the list of all the books */}
                        <p className="col-6 lead">
                            <b>{props.book?.copies} </b>
                            copies
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesAvailable} </b>
                            available
                        </p>

                    </div>
                </div>
                
                {/* here below inside the brackets only we can call out function bcos we are calling the function in the return statement */}
                {buttonRender()}
                
                <hr/>

                <p>
                    This number can change until placing an order has been complete.
                </p>
                
                  {/* here below inside the brackets only we can call out function bcos we are calling the function in the return statement */}
                  {reviewRender()}

            </div>
        </div>

    );
}