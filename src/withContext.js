import React, {useContext} from "react";
import Context from "./Context";
import {FirebaseContext} from "./components/Firebase";



const withContext = WrappedComponent => {
    const WithHOC = props => {
        const firebase = useContext(FirebaseContext);
        return (
            <Context.Consumer>
                {context => <WrappedComponent {...props} context={context} firebase={firebase}/>}
            </Context.Consumer>
        );
    };
    return WithHOC;
};

export default withContext;
