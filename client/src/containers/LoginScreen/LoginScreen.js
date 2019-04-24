import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Card } from '@material-ui/core';
import Joi from 'joi';
import './LoginScreen.scss';

class LoginScreen extends Component {

    constructor(props) {

        super(props);
        this.state = {
            error: null,
            email: null,
            password: null,
        };
    }

    render() {

        return (
            <Card
                className="loginScreen__container">
                {this.state.error && <h1>{this.state.error}</h1>}
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

        this.props.dispatch();
    }
}

function mapStateToProps(state) {
    
    return {};
}

export default connect(mapStateToProps)(LoginScreen);