import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import {
    Switch,
    Route,
    BrowserRouter as Router,
} from 'react-router-dom';
import MobileContext from './contexts/MobileContext';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import ExercisePage from './pages/ExercisePage';

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

    return (
        <Router>
            <div className={classes.root}>
                <Header/>

                <Switch>
                    {/* If the current URL is /about, this route is rendered
                while the rest are ignored */}
                    <Route path="/about">
                        <div>About</div>
                    </Route>

                    {/* Note how these two routes are ordered. The more specific
                path="/contact/:id" comes before path="/contact" so that
                route will render when viewing an individual contact */}
                    <Route path="/exercise/:id">
                        <ExercisePage/>
                    </Route>

                    {/* If none of the previous routes render anything,
                this route acts as a fallback.

                Important: A route with path="/" will *always* match
                the URL because all URLs begin with a /. So that's
                why we put this one last of all */}
                    <Route path="/">
                        <HomePage />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
