import { ReturnBook } from "./ReturnBook";
import BookModel from "../../../models/BookModel";
import { useState, useEffect } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const Carousel = () => {

    const [books, setBooks] = useState<BookModel[]>([]);

    // below useState is for Loading, ie we want to display to our users a loading sign if the API is still time consuming.
    const [isLoading, setIsLoading] = useState(true);

    // below useState is used bcos if API call fails then set HTTP error
    const [httpError, setHttpError] = useState(null);

    // creating our first useEffect hook; Please note that useEffect hook can trigger off more than one time.
    // this useEffect which is called when this component is created or carousel when its created for the very first time, it causes ueesEffect.
    useEffect(()=>{

        // inside a useEffect we're creating a function which is the fetch API to handle the AJAX request
        // here below async means we need to wait for a promise to come back.
        const fetchBooks = async () => {

            const baseUrl: string = `${process.env.REACT_APP_API}/books`;

            const url: string = `${baseUrl}?page=0&size=9`;

            // below using the JavaScript functionality  that comes automatically with the current Javascript version
            const response = await fetch(url);  // here we're going to be fetching all the data from our springboot application.

            // if we're not getting the response properly then we throw an error
            if(!response.ok){
                throw new Error('Something went wrong');
            }

            // here we have our response, but we need as a JSON and we're using await bcos this is still a asynchronous function where we're grabbing our response and turning it into a JSON.
            const responseJson = await response.json();

            // here remember that repsonse.json() is going to be this object of embedded which is going to have the all of the books inside. So now we have all the list of books inside the responseData.
            // heree we're grabbing the data out of the responseJson within the embedded books.
            const responseData = responseJson._embedded.books;

            // here creating a variable loadedBooks with dataype BookModel[] and we push a whole bunch of books data in loadedBooks variable
            const loadedBooks: BookModel[] = [];

            for(const key in responseData){
                loadedBooks.push({
                    id : responseData[key].id,
                    title : responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,

                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);

        };

        fetchBooks().catch((error:any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })

    }, []);

    if(isLoading){

        return (
           <SpinnerLoading />
        )
    }

    if(httpError){

        return (
            <div className="container m-5">
                    <p>{httpError}</p>
            </div>
        )
    }

    return (

        <div className="container mt-5" style={{ height: 550 }}>

            <div className="homepage-carousel-title">
                <h3> Find your next "I stayed up too late reading" book.</h3>
            </div>


            {/* Below entire code inside the div tag is written for Destop view only */}
            <div className="carousel carousel-dark slide mt-5 d-none d-lg-block"
                id="carouselExampleControls" data-bs-interval='false'>

                {/* Below code is For Desktop version */}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center align-items-center">

                            {/* here using the array to loop through our books instead of setting the ReturnBook each time. we want only to display first 3 books here a time so using slice method. And using the map method that takes the callback function and to iterate over the books array  */}
                            {books.slice(0,3).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                            

                        </div>

                    </div>

                    {/* pasting above code 1 time by removing the active in the top div */}
                    <div className="carousel-item ">
                        <div className="row d-flex justify-content-center align-items-center">
                            
                            {/* here using the array to loop through our books instead of setting the ReturnBook each time. we want only to display 3 to 6 books here a time so using slice method. And using the map method that takes the callback function and to iterate over the books array  */}
                            {books.slice(3,6).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}

                        </div>

                    </div>

                    {/* pasting above code 2nd time by removing the active in the top div */}
                    <div className="carousel-item ">
                        <div className="row d-flex justify-content-center align-items-center">
                            
                           {/* here using the array to loop through our books instead of setting the ReturnBook each time. we want only to display  to 9 books here a time so using slice method. And using the map method that takes the callback function and to iterate over the books array  */}
                           {books.slice(6,9).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}

                        </div>

                    </div>

                </div>

                <button className="carousel-control-prev" type="button"
                    data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                    <span className="carousel-control-prev-icon" aria-hidden='true'></span>
                    <span className="visually-hidden">Previous</span>

                </button>

                <button className="carousel-control-next" type="button"
                    data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                    <span className="carousel-control-next-icon" aria-hidden='true'></span>
                    <span className="visually-hidden">Next</span>

                </button>

            </div>

            {/* below code is the Mobile version code */}
            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    
                    <ReturnBook book={books[7]} key={books[7].id} />

                </div>

            </div>


            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to="/search">View More</Link>
            </div>


        </div>


    );
}