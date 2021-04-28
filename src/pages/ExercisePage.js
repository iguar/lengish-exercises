import React, {
    useState, useContext, useEffect, memo, useCallback, useMemo,
} from 'react';
import reactStringReplace from 'react-string-replace';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import {
    Button, makeStyles, Paper, TextField,
} from '@material-ui/core';
import MobileContext from '../contexts/MobileContext';
import ExercisesHttpService from '../services/ExercisesHttpService';

const useStyles = makeStyles((theme) => ({
    root: {
        lineHeight: '2.3em',
        padding: 20,
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
    textField: {
        fontStyle: 'italic',
        color: 'green',
    },
}));

const ExercisePage = () => {
    const { isMobile } = useContext(MobileContext);
    const classes = useStyles({ isMobile });

    const { id } = useParams();

    const [exercise, setExercise] = useState();

    const [tasks, setTasks] = useState([]);

    const checkAnswers = useCallback(() => {
        setTasks((currentState) => {
            const checkedTasks = _.chain(currentState)
                .map((t) => ({
                    ...t,
                    isValid: _.toLower(t.answer) === _.toLower(t.userAnswer),
                }))
                .value();

            return checkedTasks;
        });
    }, []);

    const onAnswerChange = useCallback(({
        uuid,
        value,
    }) => {
        setTasks((currentState) => {
            const targetTask = _.find(currentState, { uuid });
            if (targetTask) {
                const otherTasks = _.filter(currentState, (t) => t.uuid !== uuid);
                return [
                    ...otherTasks,
                    {
                        ...targetTask,
                        userAnswer: value,
                    },
                ];
            }
            return currentState;
        });
    }, []);

    const addTask = useCallback(({ task }) => {
        setTasks((currentState) => _.chain(currentState)
            .filter((t) => t.uuid !== task.uuid)
            .concat(task)
            .value());
    }, [setTasks]);

    const renderLine = useCallback((line, index) => {
        const splitLine = reactStringReplace(line, /\{\{\{(.*?)\}\}\}/, (match, i) => {
            const json = `{${match}}`;
            try {
                const uuid = `${index}-${i}`;
                const itemData = JSON.parse(json);
                if (itemData.type === 'text') {
                    addTask({
                        task: {
                            uuid,
                            ...itemData,
                        },
                    });

                    return <TextField
                        classes={{
                            root: classes.textField,
                        }}
                        onChange={(e) => onAnswerChange({
                            uuid,
                            value: e.target.value,
                        })}
                        color='secondary'
                        key={id}
                    />;
                }
                return null;
            } catch (e) {
                return null;
            }
        });
        return <p>{splitLine}</p>;
    }, [addTask]);

    const renderedBody = useMemo(() => _.chain(exercise)
        .get('body')
        .split('\n')
    // eslint-disable-next-line react/jsx-key
        .map(renderLine)
        .value(), [exercise, renderLine]);

    useEffect(() => {
        ExercisesHttpService.getExercises({
            filter: { id },
            projection: ['title', 'body'],
        }).then(([result] = []) => {
            setExercise(result);
        });
    }, [id]);

    return (
        <Paper classes={{
            root: classes.root,
        }}>
            {
                renderedBody
            }
            <Button variant="contained" color="primary" onClick={checkAnswers}>
                Check
            </Button>
        </Paper>
    );
};

export default memo(ExercisePage);
