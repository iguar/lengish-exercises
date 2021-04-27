import _ from 'lodash';
import axios from 'axios';
import { ApolloClient, InMemoryCache } from '@apollo/client';
// eslint-disable-next-line import/no-unresolved
import env from 'react-dotenv';

export class HttpConnectorService {
    constructor() {
        this.setupClient();
    }

    setupClient(config) {
        this.apolloClient = new ApolloClient({
            uri: window?.env?.BACKEND_URL,
            cache: new InMemoryCache(),
        });
        this.axios = axios.create({
            baseURL: window?.env?.BACKEND_URL,
        });
    }

    async get(...args) {
        let result = null;
        try {
            const response = await this.axios.get(...args);

            result = _.get(response, 'data.result');
        } catch ({ response }) {
            const { message } = response.data;
            throw new Error(message);
        }
        return result;
    }

    async post(...args) {
        try {
            const response = await this.axios.post(...args);

            return _.get(response, 'data.result');
        } catch ({ response }) {
            const { message } = response.data;
            throw new Error(message);
        }
    }

    async put(...args) {
        let result = null;
        try {
            const response = await this.axios.put(...args);

            result = _.get(response, 'data.result');
        } catch ({ response }) {
            const { message } = response.data;
            throw new Error(message);
        }
        return result;
    }

    async delete(...args) {
        let result = null;
        try {
            const response = await this.axios.delete(...args);

            result = _.get(response, 'data.result');
        } catch ({ response }) {
            const { message } = response.data;
            throw new Error(message);
        }

        return result;
    }

    async graphqlRequest({ query }) {
        try {
            const result = await this.apolloClient
                .query({
                    query,
                });
            return result;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e.message);
            throw e;
        }
    }
}

export default new HttpConnectorService();
