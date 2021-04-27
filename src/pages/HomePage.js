import React, { useState, useContext, useEffect } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import MobileContext from '../contexts/MobileContext';
import ExercisesHttpService from '../services/ExercisesHttpService';
import ExerciseCard from '../components/ExerciseCard';

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

const HomePage = (props) => {
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
            projection: ['id', 'title', 'tags'],
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
        <div>
            tags
            <div className={classes.tagsContainer}>
                {_.map(tags, (t, index) => (_.includes(selectedTags, t) ? <Chip
                    key={index}
                    label={t}
                    onClick={() => toggleSelectedTag(t)}
                    color="primary"
                /> : <Chip
                    key={index}
                    label={t}
                    onClick={() => toggleSelectedTag(t)}
                    variant="outlined"
                    color="primary"
                />))}
            </div>

            <div className={classes.exercisesContainer}>
                {_.map(exercises, (e, index) => <ExerciseCard
                    key={index}
                    id={e.id}
                    title={e.title}
                    tags={e.tags}
                />)}
            </div>
        </div>
    );
};

export default HomePage;
