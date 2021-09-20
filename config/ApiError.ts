import errorCode from '../config/errorCode'; 

export interface ApiErrorInterface {
    code: string;
    message?: string;
}



const ApiError = (code: string, message?: string): ApiErrorInterface => {

    return {
        code: code || 'internal:unknown_error',
        message: errorCode[code] || '错误'
    }
}
// const ApiError = (config: ApiErrorInterface) => {
    
// };


export default ApiError;
