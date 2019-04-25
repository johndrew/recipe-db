import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Card } from '@material-ui/core';
import Joi from 'joi';
import * as userActions from '../../store/user/actions';
import * as userSelectors from '../../store/user/reducer';
import './LoginScreen.scss';

class LoginScreen extends Component {

    constructor(props) {

        super(props);
        this.state = {
            email: null,
            password: null,
        };
    }

    render() {

        return (
            <Card
                className="loginScreen__container">
                {this.props.login_pending && <h1>Logging In. Please Wait.</h1>}
                {!this.props.login_pending && this.props.error_message && <h1>{this.props.error_message}</h1>}
                {!this.props.login_pending && 
                    <Fragment>
                        <Input
                            label="Email"
                            onChange={this.handleEmail.bind(this)}
                            value={this.state.email} />
                        <Input
                            label="Password"
                            onChange={this.handlePassword.bind(this)}
                            value={this.state.password} />
                        <Button
                            onClick={this.submit.bind(this)}>
                            Submit
                        </Button>
                    </Fragment>
                }
            </Card>
        );
    }

    handleEmail(event) {

        const invalid = Joi.validate(event.target.value, Joi.string().email());
        if (invalid) {

            this.setState({ error: invalid });
            return;
        }

        this.setState({
            email: event.target.value,
        });
        this.resetError();
    }

    handlePassword(event) {

        const invalid = Joi.validate(event.target.value, Joi.string());
        if (invalid) {

            this.setState({ error: invalid });
            return;
        }

        this.setState({
            password: event.target.value,
        });
        this.resetError();
    }

    resetError() {

        this.setState({ error: null });
    }

    submit() {

        this.props.dispatch(userActions.login());
    }
}

function mapStateToProps(state) {
    
    return {
        error_message: userSelectors.getErrorMessage(state),
        login_pending: userSelectors.loginPending(state),
    };
}

export default connect(mapStateToProps)(LoginScreen);