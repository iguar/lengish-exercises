import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        height: 70,
        backgroundColor: 'pink',
    },
}));

const Header = (props) => {
    const classes = useStyles();

    return <div className={classes.root}>

    </div>;
};

export default Header;
