import React, {
    useState, useContext, useEffect, memo, useCallback, useMemo,
} from 'react';
import clsx from 'clsx';
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
    validAnswer: {
        fontStyle: 'italic',
        color: 'green',
        fontWeight: 'bold',
    },
    invalidAnswer: {
        backgroundColor: '#f5919178',
    },
}));

const ExercisePage = () => {
    const { isMobile } = useContext(MobileContext);
    const classes = useStyles({ isMobile });

    const { _id } = useParams();

    const [exercise, setExercise] = useState();

    const [tasks, setTasks] = useState([]);
    const [checkedTasks, setCheckedTasks] = useState([]);

    const checkAnswers = useCallback(() => {
        const checkedTasksArray = _.chain(tasks)
            .map((t) => ({
                ...t,
                isValid: _.chain(t.answer)
                    .split('|')
                    .map(_.toLowerCase)
                    .value()
                    .includes(
                        _.chain(t.userAnswer).toLower().trim().value(),
                    ),
            }))
            .value();

        setCheckedTasks(checkedTasksArray);
    }, [tasks]);

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
        setTasks((currentState) => {
            const targetTask = _.find(currentState, { uuid: task.uuid });

            return _.chain(currentState)
                .filter((t) => t.uuid !== task.uuid)
                .concat({
                    ...targetTask,
                    ...task,
                })
                .value();
        });
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

                    const validTask = _.chain(checkedTasks)
                        .find((t) => t.uuid === uuid && t.isValid)
                        .value();

                    if (validTask) {
                        return <span
                            key={uuid}
                            className={classes.validAnswer}
                        >
                            {validTask.userAnswer}
                        </span>;
                    }

                    const targetTaskAnswer = !_.chain(tasks).find({ uuid }).get('userAnswer').isEmpty()
                        .value();

                    return <TextField
                        classes={{
                            root: clsx(classes.textField, targetTaskAnswer && classes.invalidAnswer),
                        }}
                        onChange={(e) => onAnswerChange({
                            uuid,
                            value: e.target.value,
                        })}
                        color='secondary'
                        key={uuid}
                    />;
                }
                return null;
            } catch (e) {
                return null;
            }
        });
        return <p>{splitLine}</p>;
    }, [addTask, checkedTasks]);

    const renderedBody = useMemo(() => _.chain(exercise)
        .get('body')
        .split('\n')
    // eslint-disable-next-line react/jsx-key
        .map(renderLine)
        .value(), [exercise?.body, renderLine]);

    useEffect(() => {
        ExercisesHttpService.getExercise({
            _id,
            projection: ['title', 'body'],
        }).then((result) => {
            setExercise(result);
        });
    }, [_id]);

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
