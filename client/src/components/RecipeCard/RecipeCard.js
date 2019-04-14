import React, { Component } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Collapse,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@material-ui/core';
import './RecipeCard.scss';

export default class RecipeCard extends Component {

    constructor(props) {

        super(props);
        this.state = {
            details_open: false,
        };

        // Bind functions
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    render() {

        const { category, ingredients, link, name } = this.props.recipe;
        return (
            <Card
                className="recipeCard__container"
                onClick={this.toggleDetails}
                styles={{ backgroundColor: 'gray' }}>

                {/* Collapsed View */}
                <CardHeader
                    align="center"
                    color="primary"
                    title={name} />

                {/* Details View */}
                <Collapse
                    in={this.state.details_open}
                    onClick={this.toggleDetails}
                    unmountOnExit>
                    <Divider />
                    <CardContent>
                        <Typography
                            color="primary">
                            Category: {category}
                        </Typography>
                        <List
                            subheader={
                                <Typography
                                    color="primary">
                                    Ingredients
                                </Typography>
                            }>
                            {ingredients.map((ingredient) => 
                                <ListItem key={ingredient}>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                color="primary">
                                                {ingredient}
                                            </Typography>
                                        }/>
                                </ListItem>
                            )}
                        </List>
                        <Button
                            color="primary"
                            href={link}
                            target="_blank">
                            Go To Site
                        </Button>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }

    toggleDetails() {

        this.setState({
            details_open: !this.state.details_open,
        });
    }
}