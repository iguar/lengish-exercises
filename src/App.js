import React, { useContext, useState, useEffect } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core';
// eslint-disable-next-line import/no-unresolved
import env from 'react-dotenv';
import {
    Switch,
    Route,
} from 'react-router-dom';
import MobileContext from './contexts/MobileContext';
import Header from './components/Header/Header';
import ExercisesHttpService from './services/ExercisesHttpService';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 1100,
        width: 'calc(100% - 164px)',
        display: 'flex',
        flexFlow: 'column',
        background: ({ isMobile }) => (isMobile ? '#fff' : '#777'),
        color: '#202124',
    },
}));

const App = () => {
    const { isMobile } = useContext(MobileContext);
    const classes = useStyles({ isMobile });
    const [exercises, setExercises] = useState();
    const [tags, setTags] = useState();
    useEffect(() => {
        ExercisesHttpService.getExercises().then((result) => {
            setExercises(result);
        });
        ExercisesHttpService.getTags().then((result) => {
            setTags(result);
        });
    });
    return (
        <div className={classes.root}>
            <Header/>
            tags
            {_.map(tags, (t) => t)}
            exercises
            {_.map(exercises, (e) => e.title)}
            <Switch>
                {/* If the current URL is /about, this route is rendered
            while the rest are ignored */}
                <Route path="/about">
                    <div>About</div>
                </Route>

                {/* Note how these two routes are ordered. The more specific
            path="/contact/:id" comes before path="/contact" so that
            route will render when viewing an individual contact */}
                <Route path="/contact/:id">
                    <div>About</div>
                </Route>

                {/* If none of the previous routes render anything,
            this route acts as a fallback.

            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
            why we put this one last of all */}
                <Route path="/">
                    <div>Home {env.BACKEND_URL}</div>
                </Route>
            </Switch>
        </div>
    );
};

export default App;
