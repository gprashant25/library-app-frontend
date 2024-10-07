import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { useOktaAuth } from "@okta/okta-react";


export const ChangeQuantityOfBook: React.FC<{ book: BookModel, deleteBook: any }> = (props, key) => {

    const { authState } = useOktaAuth();

    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);


    useEffect(() => {

        const fetchBookInState = () => {

            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
            props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0);
        };
        
        fetchBookInState();

    }, []);

    // adding increase quantity functionality
    async function increaseQuantity(){

        const url = `${process.env.REACT_APP_API}/admin/secure/increase/book/quantity?bookId=${props.book?.id}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);

        if(!quantityUpdateResponse.ok){
            throw new Error('Something went wrong!');
        }

        // please note: here we're assuming that we're getting the successfull resposne hence we're physically changing the quantity anf the remaining on the client side.
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);

    }


    // adding the decrease quantity functionality
    async function decreaseQuantity() {

        const url = `${process.env.REACT_APP_API}/admin/secure/decrease/book/quantity?bookId=${props.book?.id}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);

        if(!quantityUpdateResponse.ok){
            throw new Error('Something went wrong!');
        }

        // please note: here we're assuming that we're getting the successfull resposne hence we're physically changing the quantity anf the remaining on the client side.
        setQuantity(quantity - 1);
        setRemaining(remaining - 1);

    }


    // creating a delete book function
    async function deleteBook() {

        const url = `${process.env.REACT_APP_API}/admin/secure/delete/book?bookId=${props.book?.id}`;

        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const updateResponse = await fetch(url, requestOptions);

        if(!updateResponse.ok){
            throw new Error('Something went wrong!');
        }

        // Once the book is successfully deleted at the database and we get the response without any error. 
        // so we will call the deleteBook() function so that the useEffect in ChangeQuantityOfBooks.tsx gets recalled as the as the bookDelete state changes.
        props.deleteBook();
    }


    return (

        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>

            <div className='row g-0'>

                <div className='col-md-2'>

                    {/* Desktop version */}
                    <div className='d-none d-lg-block'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='123' height='196' alt='Book' />
                        }
                    </div>

                    {/* Mobile version */}
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='123' height='196' alt='Book' />
                        } 
                    </div>
                    
                </div>

                <div className='col-md-6'>
                    <div className='card-body'>
                        
                        <h5 className='card-title'> {props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className='card-text'> {props.book.description}</p>

                    </div>
                </div>

                <div className='col-md-4 mt-3' >

                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>

                    <div className='d-flex justify-content-center align-item-centerr'>
                        <p>Books Remaining: <b>{remaining}</b></p>
                    </div>

                </div>

                <div className='col-md-1 mt-3'>
                     <div className='d-flex justify-content-start' >
                        <button className='m-1 btn btn-md btn-danger' onClick={deleteBook}> Delete</button>
                     </div>
                </div>

                <button className='m1 btn btn-md main-color text-white' onClick={increaseQuantity}>Add Quantity</button>
                <button className='m1 btn btn-md btn-warning' onClick={decreaseQuantity}>Decrease Quantity</button>
                 
            </div>

        </div>
    );
}