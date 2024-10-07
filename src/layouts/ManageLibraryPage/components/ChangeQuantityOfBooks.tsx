import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";


export const ChangeQuantityOfBooks = () => {

    const [books, setBooks] = useState<BookModel[]>([]);

    // below useState is for Loading, ie we want to display to our users a loading sign if the API is still time consuming.
    const [isLoading, setIsLoading] = useState(true);

    // below useState is used bcos if API call fails then set HTTP error
    const [httpError, setHttpError] = useState(null);

    // for Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // useState for delete book state so that we can stick it in the array of useEffect state changes that will recall the useEffect
    const [bookDelete, setBookDelete] = useState(false);


    // below useEffect hook we've copied from the SearchBooksPage component and which is very much same
    useEffect(() => {

        // inside a useEffect we're creating a function which is the fetch API to handle the AJAX request
        // here below async means we need to wait for a promise to come back.
        const fetchBooks = async () => {

            const baseUrl: string = `${process.env.REACT_APP_API}/books?page=${currentPage - 1}&size=${booksPerPage}`;


            // below using the JavaScript functionality  that comes automatically with the current Javascript version
            const response = await fetch(baseUrl);  // here we're going to be fetching all the data from our springboot application.

            // if we're not getting the response properly then we throw an error
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            // here we have our response, but we need as a JSON and we're using await bcos this is still a asynchronous function where we're grabbing our response and turning it into a JSON.
            const responseJson = await response.json();

            // here remember that repsonse.json() is going to be this object of embedded which is going to have the all of the books inside. So now we have all the list of books inside the responseData.
            // heree we're grabbing the data out of the responseJson within the embedded books.
            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            // here creating a variable loadedBooks with dataype BookModel[] and we push a whole bunch of books data in loadedBooks variable
            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
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

        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })


        // when each time currentPage changes, we want to recall this useEffect hook. hence below code adding currentPage in useEffect dependency list. 
    
    }, [currentPage, bookDelete]);


    // to dynamically update the number of books search in a currentpage
    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? booksPerPage * currentPage : totalAmountOfBooks;
    
   

    // to set the currentPage its a function
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // created function for delete book
    const deleteBook = () => setBookDelete(!bookDelete);


    if(isLoading) {
        return (
            <SpinnerLoading/>
        );
    }


    if(httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }


    return(

        <div className='container mt-5'>

            {totalAmountOfBooks > 0 ?
                <>
                    <div className='mt-3'>
                        <h3>Number of results: ({totalAmountOfBooks})</h3>
                    </div>
                    <p>
                        {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                    </p>

                    {books.map(book => (
                        <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook}/>
                    ))}
                </>
                :
                <h5>Add a book before changing quantity</h5>
            }

            {/* For Pagination */}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}

        </div>

    );
    
}