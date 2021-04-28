import React, { useState, useContext, useEffect } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useParams } from 'react-router-dom';
import MobileContext from '../../contexts/MobileContext';
import ExercisesHttpService from '../../services/ExercisesHttpService';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
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
const ExerciseEditPage = ({
    title,
}) => {
    const { isMobile } = useContext(MobileContext);
    const classes = useStyles({ isMobile });
    const { id } = useParams();

    const [exercise, setExercise] = useState();

    useEffect(() => {
        ExercisesHttpService.getExercises({
            filter: { id },
            projection: ['title'],
        }).then(([result] = []) => {
            setExercise(result);
        });
    }, [id]);

    return (
        <div className={classes.root}>
            <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                defaultValue={exercise?.title}
            />
        </div>
    );
};

export default ExerciseEditPage;
