import React, { useState, useContext, useEffect } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core';
import MobileContext from '../contexts/MobileContext';

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

const ExercisePage = (props) => {
    const { isMobile } = useContext(MobileContext);
    const classes = useStyles({ isMobile });

    return (
        <div>
            this is n exercise page
        </div>
    );
};

export default ExercisePage;
