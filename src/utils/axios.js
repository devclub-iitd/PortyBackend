import axios from 'axios';
import { getBackBaseUrl } from './utils'

export default axios.create({
    baseURL: getBackBaseUrl(),
    // baseURL: 'http://localhost:5000',
    // baseURL: 'https://portfolioback.devclub.in',
    responseType: 'json',
    withCredentials: true,
});