import React from 'react';

import { withFirebase } from '../Firebase';
import Context from "../../Context";

const withAuthentication = WrappedComponent => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authUser: null,
                userData: null
            };
        }

        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
                this.setState({authUser: authUser })
                if (authUser !== null) {
                    this.props.firebase.user(authUser.uid).on('value', snapshot => {
                        this.setState({ userData: snapshot.val() })
                    });
                }
            });
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <Context.Consumer>
                    {context => <WrappedComponent {...this.props} {...this.state} context={context} />}
                </Context.Consumer>
            );
        }
    }

    return withFirebase(WithAuthentication);
};

export default withAuthentication;
