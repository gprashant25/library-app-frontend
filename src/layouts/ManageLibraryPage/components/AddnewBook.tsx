import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";

export const AddNewBook = () => {

    const { authState } = useOktaAuth();

    // useState for adding New Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Display warning and sucess
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {

        setCategory(value);
    }


    // IMPORTANT PLEASE NOTE: Using below code, Now our application is grabbing the image and setting the images to a Base64 and then we're saving that Base64 image to a image useState so that we can send over to our backend application
    // function for images allow our client side application to render this into a BASE64 so we can send over this to the springboot application.
    async function base64ConversionForImages(e:any) {

        if(e.target.files[0]) {
            getBase64(e.target.files[0]);
        }
    }

    // IMPORTANT Note: Here we would be able to get for all our images to be able to get Base64 so that we can send it over to our springboot application. 
    // This new function will call a file reader that we can read a file and then we change that object into a BASE64 and then we set it as our piece of useState
    function getBase64(file: any) {

        // IMPORTANT: here below creating a javascript object called file reader, the FileReader lets our web application asynchronously read the contents of a file stored on the user's computer using the file or blob objects to specify the file or data to read. this is bcos the image is on our computer.
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = function () {
            setSelectedImage(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error', error);
        }

    }


    // creating a function for submiting the new book details to the springboot application to sava the new book details in the database as well.
    async function submitNewBook() {

        const url = `${process.env.REACT_APP_API}/admin/secure/add/book`;

        if( authState?.isAuthenticated && title !== '' && author !== '' && category !== 'Category'
            && description !== '' && copies >= 0) {
                
                const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
                book.img = selectedImage;

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(book)
                };

                const submitNewBookResponse = await fetch(url, requestOptions);

                if(!submitNewBookResponse.ok){
                    throw new Error('Something went wrong!');
                }

                // here after the response is successfully submitted then we want to reset all the piece of state
                setTitle('');
                setAuthor('');
                setDescription('');
                setCopies(0);
                setCategory('Category');
                setSelectedImage(null);

                setDisplayWarning(false);
                setDisplaySuccess(true);

            }else{
                setDisplayWarning(true);
                setDisplaySuccess(false);
            }

    }




    return (

        <div className='container mt-5 mb-5'>

            {displaySuccess && 
                <div className='alert alert-success' role='alert'>
                    Book added successfully
                </div>
            }

            { displayWarning && 
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }

            <div className='card'>

                <div className='card-header'>
                    Add a new book
                </div>

                <div className='card-body'>

                    <form method='POST'>

                        <div className='row'>

                            <div className='col-md-6 mb-3'>
                                <label className='form-label'> Title </label>
                                <input type='text' className='form-control' name='title' required
                                    onChange={e => setTitle(e.target.value)} value={title}></input>
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Author</label>
                                <input type='text' className='form-control' name='author' required
                                    onChange={e => setAuthor(e.target.value)} value={author}></input>
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Category </label>

                                <button className='form-control btn btn-secondary dropdown-toggle' type='button' 
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false' > 
                                        {category}
                                </button>

                                <ul id='addNewBookId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li><a onClick={() => categoryField('FE')} className='dropdown-item'> Front End </a> </li>
                                    <li><a onClick={() => categoryField('BE')} className='dropdown-item'> Back End </a> </li>
                                    <li><a onClick={() => categoryField('Data')} className='dropdown-item'> Data </a> </li>
                                    <li><a onClick={() => categoryField('DevOps')} className='dropdown-item'> DevOps </a> </li>
                                </ul>

                            </div>

                        </div>

                        <div className='col-md-12 mb-3' >
                            <label className='form-label'> Description</label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3} 
                               onChange={e => setDescription(e.target.value)} value={description} ></textarea>

                        </div>

                        <div className='col-md-3 mb-3'>
                            <label className='form-label'> Copies</label>
                            <input type='number' className='form-control' name='copies' required
                                onChange={e => setCopies(Number(e.target.value))} value={copies}></input>
                        </div>

                        {/* here please note that we have this input of type file, but we're not saving anything to the client or not sending it over to our springBoot application. */}
                        {/* here we need to do is when we select a file, allow our client side application to render this into a BASE64 so we can send over this to the springboot application. */}
                        <input type='file' onChange={e => base64ConversionForImages(e)}></input>
                        
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewBook}>
                                Add Book
                            </button>
                        </div>

                    </form>

                </div>

            </div>

        </div>

    );
}