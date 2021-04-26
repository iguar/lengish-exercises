import _ from 'lodash';
import { gql } from '@apollo/client/core';
import HttpService from './HttpService';

export default class ExercisesHttpService {
    static async getExercises({ filter = {}, projection = ['title'] } = {}) {
        const tagsFilterPart = !_.isEmpty(filter.tags) ? `tags: ${JSON.stringify(filter.tags)}` : '';
        return HttpService.graphqlRequest({
            query: gql`
                query GetExercises {
                    exercises(filter: {${tagsFilterPart}})
                    {${_.join(projection, ' ')}}
                }
            `,
        }).then((response) => _.get(response, 'data.exercises'));
    }

    static async getTags() {
        return HttpService.graphqlRequest({
            query: gql`
                query GetTags {
                    tags
                }
            `,
        }).then((response) => _.get(response, 'data.tags'));
    }
}
