import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";



// Our SearchBooksPage is going to have a search bar, some category dropdowns and its going to display all of our books from our database.

export const SearchBooksPage = () => {

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

    //for searchByTitle
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');

    // for search By Category
    const [categorySelection, setCategorySelection] = useState('Book category')

    // below useEffect hook we've copied from the Carousel component which is same
    useEffect(() => {

        // inside a useEffect we're creating a function which is the fetch API to handle the AJAX request
        // here below async means we need to wait for a promise to come back.
        const fetchBooks = async () => {

            const baseUrl: string = `${process.env.REACT_APP_API}/books`;

            // Note: if we write const then we cannot change the url value so writing it with let
            let url: string = '';

            // writing below condition to check the searchUrl content
            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                //so here we are swapping out the generic <pageNumber> with `${currentPage-1}` and then setting the URL to it. to fix the bug of search bar and category search.
                let searchWithPage = searchUrl.replace('<pageNumber>',`${currentPage-1}`);
                url = baseUrl + searchWithPage;
            }

            // below using the JavaScript functionality  that comes automatically with the current Javascript version
            const response = await fetch(url);  // here we're going to be fetching all the data from our springboot application.

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

        window.scrollTo(0, 0); // ths code means each time this useEffect hook gets triggred or executed , we're going to scroll the top of the page. we're doing some kind of pagination bcos the useEffect is changing on its currentPage change, which will kick of our pagination.

        // when each time currentPage changes, we want to recall this useEffect hook. hence below code adding currentPage in useEffect dependency list. 
        // here below we're adding the searchUrl in useEffect bcos everytime we might have additional query parameter.
    
    }, [currentPage, searchUrl]);



    if (isLoading) {

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

    // PLEASE NOTE: There was a BUG in a code within our searchHandlingChange nd our categoryField. And the BUG was when we use our pagination, it always re-changes the page to zero and not sets to currentPage. So, if there is more then one page for a search or a category search, then it will show the same books of page 0 evrytime time.
    // SOLUTION:   mention page=<pageNumber> inside setSearchUrl so that this <pageNumber> with currentPage later on. And then Add below code inside useEffect. so here we are swapping out the generic <pageNumber> with `${currentPage-1}` and then setting the URL to it.
    // let searchWithPage = searchUrl.replace('<pageNumber>',`${currentPage-1}`);
    // url = baseUrl + searchWithPage;

    // below creating a funtion which will handle all of our search handling changes 
    // REMEMBER: that setSearchUrl is going to trigger the useEffect everytime to recall an API.
    const searchHandlingChanges = () => {

        // to fix the bug for search and category based searching of books. write page=<pageNumber>
        setCurrentPage(1);   // so if we're on page 2 or 3 or any other page and then if we filter using the search bar or category so we have to land on page 1. Hence we're resetting the currentPage to land on page 1


        if (search === '') {
            setSearchUrl('');
        } 
        else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        }

        setCategorySelection('Book category');  // if we search using the srarch bar then to reset the category code written
    }

    // below creating a new function for searching the books using the Category
    // REMEMBER: that setSearchUrl is going to trigger the useEffect everytime to recall an API.
    const categoryField = (value: string) => {

        // to fix the bug for search and category based searching of books and wite page=<pageNumber>
        setCurrentPage(1);   // so if we're on page 2 or 3 or any other page and then if we filter using the search bar or category so we have to land on page 1. Hence we're resetting the currentPage to land on page 1

        if(
            value.toLowerCase() === 'fe' ||
            value.toLowerCase() === 'be' ||
            value.toLowerCase() === 'data' ||
            value.toLowerCase() === 'devops'
        ){
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`);
        } 
        else{
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
           
        }

        // code from Q & A : // below code from Q & A section to apply and remove the the search value from the search bar once the user clicks on the category section
        setSearch('');

    }

    

    // to dynamically update the number of books search in a currentpage
    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? booksPerPage * currentPage : totalAmountOfBooks;
    
   

    // to set the currentPage its a function
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (

        // here inside this div we start filling all of the DOM that we're going to need to continue for our search page.
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">

                        <div className="col-6">
                            <div className="d-flex">

                                <input className="form-control me-2" type="search"
                                    placeholder="Search" aria-labelledby="Search"
                                    // below the search functionality is changing and its accepting the user input
                                    onChange={event => setSearch(event.target.value)}
                                    // below code from Q & A section to apply and remove the the search value from the search bar once the user clicks on the category section
                                    value={search}
                                >
                                </input>

                                <button className="btn btn-outline-success" onClick={() => searchHandlingChanges()}>
                                    Search
                                </button>

                            </div>
                        </div>

                        <div className="col-4">
                            <div className="dropdown">

                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                    id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded='false'>
                                    {categorySelection}
                                </button>

                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" >

                                    <li onClick={() => categoryField('All')}>
                                        <a className="dropdown-item" href="#">All</a>
                                    </li>
                                    <li onClick={() => categoryField('FE')}>
                                        <a className="dropdown-item" href="#">Front End</a>
                                    </li>
                                    <li onClick={() => categoryField('BE')}>
                                        <a className="dropdown-item" href="#">Back End</a>
                                    </li>
                                    <li onClick={() => categoryField('Data')}>
                                        <a className="dropdown-item" href="#">Data</a>
                                    </li>
                                    <li onClick={() => categoryField('DevOps')}>
                                        <a className="dropdown-item" href="#">DevOps</a>
                                    </li>

                                </ul>

                            </div>

                        </div>

                    </div>
                    {/* Below using the ternary */}
                    {totalAmountOfBooks > 0 ?
                        <>
                            <div className="mt-3">
                                <h5>Number of results: ({totalAmountOfBooks})</h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                            </p>

                            {/* For searching books */}
                            {books.map(book => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </>
                        :
                        <div className="m-5">
                            <h3>
                                Can't find what you are looking for?
                            </h3>
                            <a type="button" className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                                href="#">Library Services</a>
                        </div>
                    }
                    
                    {/* For Pagination */}
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }


                </div>
            </div>

        </div>

    );
}