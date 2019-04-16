import React, { Component } from 'react';
import {
    Card,
    Typography,
} from '@material-ui/core';
import './LoadingCard.scss';

export default class LoadingCard extends Component {
    render() {
        return (
            <Card
                className="loadingCard__container">
                <Typography
                    className="loadingCard__label"
                    component="h1"
                    style={{
                        fontSize: '32px'
                    }}>
                    Loading...
                </Typography>
            </Card>
        );
    }
}