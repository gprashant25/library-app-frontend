// Please note here we're using the LoginWidget.jsx and not using the tsx file bcos we're using the okta's documentation for creating the Authentication
import { Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";
import OktaSignInWidget from "./OktaSignInWidget";

//For secure authentication we're using the baics of Okta. Here we're using the dependencies of useOktaAuth

// NOW, we have reated  LoginWidget.jsx and OktaSignInWidget.jsx all created and connected with our OktaConfig.ts

const LoginWidget = ({ config }) => {

    const { oktaAuth, authState } = useOktaAuth();

    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.log('Sign in error: ', err);
    }

    if (!authState) {
        return (
            <SpinnerLoading />
        );
    }

    return authState.isAuthenticated ? 
        <Redirect to={{ pathname: '/' }}/>
        :
       <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />;
};

export default LoginWidget;