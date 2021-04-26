import React, { useContext, useState, useEffect } from 'react';
import _ from 'lodash';
import { makeStyles, Chip } from '@material-ui/core';
import {
    Switch,
    Route,
} from 'react-router-dom';
import MobileContext from './contexts/MobileContext';
import Header from './components/Header/Header';
import ExercisesHttpService from './services/ExercisesHttpService';
import ExerciseCard from './components/ExerciseCard';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1100,
        width: 'calc(100% - 164px)',
        display: 'flex',
        flexFlow: 'column',
        background: ({ isMobile }) => (isMobile ? '#fff' : '#777'),
        color: '#202124',
    },
    tagsContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    exercisesContainer: {
        display: 'flex',
        // justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const App = () => {
    const { isMobile } = useContext(MobileContext);
    const classes = useStyles({ isMobile });

    const [exercises, setExercises] = useState();
    const [tags, setTags] = useState();
    const [selectedTags, setSelectedTags] = useState();

    const toggleSelectedTag = (tag) => {
        setSelectedTags((currentState) => {
            if (_.includes(currentState, tag)) {
                return _.filter(currentState, (t) => t !== tag);
            }
            const newState = _.chain(currentState)
                .concat(tag)
                .filter(Boolean)
                .uniq()
                .value();
            return newState;
        });
    };

    useEffect(() => {
        ExercisesHttpService.getExercises({
            filter: {
                tags: selectedTags,
            },
            projection: ['title', 'body', 'tags'],
        }).then((result) => {
            setExercises(result);
        });
    }, [selectedTags]);

    useEffect(() => {
        ExercisesHttpService.getTags().then((result) => {
            setTags(result);
        });
    }, []);

    return (
        <div className={classes.root}>
            <Header/>
            tags
            <div className={classes.tagsContainer}>
                {_.map(tags, (t) => (_.includes(selectedTags, t) ? <Chip
                    label={t}
                    onClick={() => toggleSelectedTag(t)}
                    color="primary"
                /> : <Chip
                    label={t}
                    onClick={() => toggleSelectedTag(t)}
                    variant="outlined"
                    color="primary"
                />))}
            </div>

            <div className={classes.exercisesContainer}>
                {_.map(exercises, (e) => <ExerciseCard title={e.title} tags={e.tags}/>)}
            </div>
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
                    <div>Home</div>
                </Route>
            </Switch>
        </div>
    );
};

export default App;
