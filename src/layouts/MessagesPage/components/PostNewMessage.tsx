import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {

    const { authState }  = useOktaAuth();

    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);


    // here we're going to create a function that's going o be able to communicate with our Springboot backend endpoint so that we can add and submit question and messages.
    async function submitNewQuestion() {

        const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;

        if(authState?.isAuthenticated && title !== '' && question !== '') {

            // IMPORTANT: Please Note below
            //here below we're getting the title and question details which is entered by user in frontend react application and it is passed as body to springboot backend application as its a POST request
            const messageRequestModel: MessageModel = new MessageModel(title, question);

            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };

            // now we need to be able to fetch the endpoint here we're submiting new question from the user has entered in react application to the backend application
            const submitNewQuestionResponse = await fetch(url, requestOptions);
            
            if(!submitNewQuestionResponse.ok){
                throw new Error('Something went wrong');
            }

            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        }
        else{
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }

    }

    return (

        <div className='card mt-3'>

            <div className='card-header'>
                Ask question to Luv 2 Read Admin
            </div>

            <div className='card-body'>
                <form method='POST'>

                    {displayWarning &&
                        <div className='alert alert-danger' role='alert'>
                            All fields must be filled out
                        </div>
                    }

                    {displaySuccess &&
                        <div className='alert alert-success' role='alert'>
                            Question added successfully
                        </div>
                    }

                    <div className='mb-3'>
                        <label className='form-label'>
                            Title
                        </label>

                        <input type='text' className='form-control' id='exampleFormControlInput1'
                            placeholder='Title' onChange={e => setTitle(e.target.value)} value={title}> 
                        </input>

                    </div>

                    <div className='mb-3'>

                        <label className='form-label;'>
                            Question
                        </label>

                        <textarea className='form-control' id='exampleFormControlTextarea1'
                            rows={3} onChange={e => setQuestion(e.target.value)} value={question}>

                        </textarea>

                    </div>

                    <div>
                        <button type='button' className='btn btn-primary mt-3' onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>

        </div>

    );

}