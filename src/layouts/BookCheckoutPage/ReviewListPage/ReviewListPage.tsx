import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Adding the Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Adding useState for our Book to lookup the reviews
    const bookId = (window.location.pathname).split('/')[2];


     // below useEffect hook is going to call our new reviews. useEffect for our BookReviews
     useEffect( () => {

        const fetchBookReviews = async () => {

            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

            const responseReviews = await fetch(reviewUrl);

            if(!responseReviews.ok){
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for(const key in responseData){
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    bookId: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                })

            }

         

            setReviews(loadedReviews);
            setIsLoading(false);


        }

        // here calling a fetchBookReviewa inside the useEffect to catch the error if we get it.
        fetchBookReviews().catch((error: any) => {

            setIsLoading(false);
            setHttpError(error.message);

        })

    },[currentPage]);


    if(isLoading){

        return(
            <SpinnerLoading/>
        );
    }

    if(httpError){

        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    // below adding all of our pagination functions and variables
    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem = currentPage * reviewsPerPage <= totalAmountOfReviews ? currentPage * reviewsPerPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (

        <div className="container m-5">

            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>

            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>

            <div className="row">
                {
                    reviews.map(review => (
                        <Review review={review} key={review.id} />
                    ))
                }
            </div>

            {
                totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            }

        </div>

    );
}