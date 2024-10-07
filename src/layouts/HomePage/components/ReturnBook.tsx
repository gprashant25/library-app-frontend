import { Link } from "react-router-dom";
import BookModel from "../../../models/BookModel";

// Now we're able to call the REST API-code is written in Corousel.tsx, the next thing we need to do is configure our ReturnBook.tsx to now use props that are dynamically changing from our Carousel taks instead of using all the static data of the books
// here we're wrting the function ReturnBook with datatype React.FC<{book: BookModel}>. So here the prop is book , which is going to be our BookModel
export const ReturnBook: React.FC<{book: BookModel}> = (props) => {

    return (

        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">

                {/* here pls note that image is an optional variable in BookModel.ts and can be null. Hence we're using here ternary operator within the return dom  */}
                {props.book.img ? 
                    <img
                        src={props.book.img}
                        width='151'
                        height='233'
                        alt="book"
                    /> 
                    : 
                    <img   // below is the default image and it is displayed if there is no image in the book object or Entity
                        src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                        width='151'
                        height='233'
                        alt="book"
                    />
                }

                <h6 className="mt-2">{props.book.title}</h6>
                <p>{props.book.author}</p>
                <Link className="btn main-color text-white" to={`checkout/${props.book.id}`}>Reserve</Link>

            </div>

        </div>


    );
}