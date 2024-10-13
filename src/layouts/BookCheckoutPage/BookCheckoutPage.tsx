import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";


export const BookCheckoutPage = () => {

    // for authentication
    const { authState } = useOktaAuth(); 

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReveiwLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);


    // Loans count state
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // state for Is Book checked out ? by user or not
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    // Payment state
    const [displayError, setDisplayError] = useState(false);


    //creating a variable that is going to be used to grab the path parameter out of the URL.
    // so this is going to create an array where each index is going to be split by the slash ie. like localhost:3000/ is at array index 0 checkout/ is at arrayindex 1and /bookid is at array index 2
    const bookId = (window.location.pathname).split('/')[2];


    // useEffect for our fetechBooks
    useEffect(() => {

        // inside a useEffect we're creating a function which is the fetch API to handle the AJAX request
        // here below async means we need to wait for a promise to come back.
        const fetchBook = async () => {

            const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;


            // below using the JavaScript functionality  that comes automatically with the current Javascript version
            const response = await fetch(baseUrl);  // here we're going to be fetching all the data from our springboot application.

            // if we're not getting the response properly then we throw an error
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            // here we have our response, but we need as a JSON and we're using await bcos this is still a asynchronous function where we're grabbing our response and turning it into a JSON.
            const responseJson = await response.json();


            // here creating a variable loadedBook with datatype BookModel which is the object and in this object is going to hold the information we get from a const responseData = await response.json();
            // Please note : Earlier in Carousel.tsx and SearchBookPage.tsx useEffect code we were grabbing all the list of Books available from our Backend server and wrapping them and passing it into state.
            // PLEASE NOTE: But in BookCheckoutPage.tsx useEffect code we are just grabbing one single book each time. ie. we just grabbed one book and we set it immediately to BookModel object and then we set our book state to the loadedBook variable.
            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,

            };



            setBook(loadedBook);
            setIsLoading(false);

        };

        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })

    }, [isCheckedOut]);



    // below useEffect hook is going to call our new reviews. useEffect for our BookReviews
    useEffect( () => {

        const fetchBookReviews = async () => {

            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if(!responseReviews.ok){
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            // here we want to make sure our reviews are weighted, so we're going to only review the last 20 books.
            let weightedStarReviews: number = 0;

            for(const key in responseData){
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    bookId: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                })

                // to add all the ratings of all the reviews we get that this API returns
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            // below is the logic to find what the total star average is
            if(loadedReviews) {

                const round = (Math.round((weightedStarReviews / loadedReviews.length)* 2) / 2).toFixed(1);
                setTotalStars(Number(round));

            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);


        }

        // here calling a fetchBookReviewa inside the useEffect to catch the error if we get it.
        fetchBookReviews().catch((error: any) => {

            setIsLoadingReview(false);
            setHttpError(error.message);

        })

    },[isReviewLeft]);


    // new useEffect to deal with just getting a single review for our user
    useEffect(() => {

        const fetchUserReviewBook = async () => {

            if(authState && authState.isAuthenticated){

                const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const userReview = await fetch(url, requestOptions);

                if(!userReview.ok){
                    throw new Error('Something went wrong');
                }

                const userReviewResponseJson = await userReview.json();

                setIsReveiwLeft(userReviewResponseJson);
               
            }

            setIsLoadingUserReview(false);

        }
        fetchUserReviewBook().catch((error: any) => {

            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })

    }, [authState]);


    // useEffect for the CurrentLoans count
    useEffect(() => {

        const fetchUserCurrentLoansCount = async () => {

            if(authState && authState.isAuthenticated){

                //below is the SpringBoot endpoint at is going to go ahead and tell us how many books this specific user is checkedout. 
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;

                // here below code is written bcos we're dealing with the Authentication: here below in headers: Authorization we're grabbing the access token from our authState , which is our JWT token.
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const currentLoansCountResponse = await fetch(url, requestOptions);

                if(!currentLoansCountResponse.ok){
                    throw new Error('Something went wrong!');
                }

                const currentLoansCountResponseJson = await currentLoansCountResponse.json();

                setCurrentLoansCount(currentLoansCountResponseJson);

            }
            setIsLoadingCurrentLoansCount(false);

        }

        fetchUserCurrentLoansCount().catch((error: any) => {

            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })

    }, [authState, isCheckedOut]);


    // useEffect for Is Book Checked out ?
    useEffect(() => {

        const fetchUserCheckedOutBook = async () => {

            if(authState && authState.isAuthenticated){

                const url =  `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const bookCheckedOut = await fetch(url, requestOptions);

                if(!bookCheckedOut.ok){
                    throw new Error('Something went wrong');
                }

                const bookCheckedOutResponseJson = await bookCheckedOut.json();

                setIsCheckedOut(bookCheckedOutResponseJson);
            }

            setIsLoadingBookCheckedOut(false);

        }
        fetchUserCheckedOutBook().catch((error:any) => {

            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);

        })

    }, [authState]);



    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {

        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {

        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    // below code is the checkOutBook function and please note its a http PUT request ie update the checkout user
    async function checkoutBook(){

        const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${bookId}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const checkoutResponse = await fetch(url, requestOptions);

        if(!checkoutResponse.ok){

            // if we get an exception from the backend server, we are setting our displayError to true and then throwing a new error
            setDisplayError(true);
            throw new Error("Something went wrong!");
        }

        setDisplayError(false);  // if there is no error from the backend server, we want to displayError to false
        setIsCheckedOut(true);

    }


    // below creating a new function submit review and please note its a http POST request ie create/add a review by user
    async function submitReview(starInput: number, reviewDescription: string){

        let bookId: number = 0;
        if(book?.id){
            bookId = book.id;
        }

        // below is the http POST request body: JSON.stringigy ie user giving input as leaving a review
        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);

        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };

        const returnResponse = await fetch(url, requestOptions);

        if(!returnResponse.ok){
            throw new Error('Something went wrong');
        }

        setIsReveiwLeft(true);
    }



    return (

        <div>

            {/* Below code is for the Desktop view */}
            <div className="container d-none d-lg-block">

                {/* to display error if the lates fees payment is not done by the user for late books */}
                { 
                    displayError && <div className='alert alert-danger mt-3' role='alert'>
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                }

                <div className="row mt-5">

                    <div className="col-sm-2 col-md-2">

                        {/* Below using the ternary operator to display the image NOTE: here below book? means any one book from the list of all the books */}
                        {/* NOTE: here below book? means we are not using the props for this and directly using book?.author for each single book  */}
                        {/* and book detail can be null or undefined thatswhy we use ? wildcard here */}
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt="Book" />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                                width='226' height='349' alt="Book" />
                        }

                    </div>

                    <div className=" container col-4 col-md-4" >
                        <div className="ml-2">

                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead"> {book?.description} </p>
                            <StarsReview rating={totalStars} size={32} />

                        </div>
                    </div>

                        {/* please note: do not add parenethesis in checkoutBook bcos we're just mapping the pointer to that function */}
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} 
                        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                        isReviewLeft = {isReviewLeft} submitReview={submitReview} />

                </div>

                {/* below <hr> tag is used to display a horizontal rule that is used to separate th contents of the web page */}
                <hr />

                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}></LatestReviews>

            </div>


            {/* Below code is for the Mobile view */}
            <div className="container d-lg-none mt-5" >

                {/* to display error if the lates fees payment is not done by the user for late books */}
                { 
                    displayError && <div className='alert alert-danger mt-3' role='alert'>
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                }

                <div className="d-flex justify-content-center align-items-center">

                    {/* Below using the ternary operator to display the image NOTE: here below book? means we are not using the props for this and directly using book?.author for each single book and book detail can be null or undefined thatswhy we use ? wildcard here*/}
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt="Book" />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                            width='226' height='349' alt="Book" />
                    }

                </div>

                <div className="mt-4">
                    <div className="ml-2">

                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />

                    </div>
                </div>

                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                    isReviewLeft = {isReviewLeft} submitReview={submitReview} />

                <hr/>

                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}></LatestReviews>

            </div>

        </div>

    );
}