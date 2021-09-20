import path = require('path');
import { ServerConfigInterface } from '../global.interface';

let file: ServerConfigInterface;
const env: string | undefined | null = process.env.NODE_ENV || 'development';

if (env === 'development') {
    file = require('./dev');
} else {
    file = require('./prod');
}



export default file;