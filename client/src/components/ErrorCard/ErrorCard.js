import React, { Component } from 'react';
import {
    Card,
    Typography,
} from '@material-ui/core';

export default class ErrorCard extends Component {

    render() {

        const { message } = this.props;
        return (
            <Card>
                <Typography
                    component="h2"
                    color="error">
                    {message}
                </Typography>
            </Card>
        );
    }
}