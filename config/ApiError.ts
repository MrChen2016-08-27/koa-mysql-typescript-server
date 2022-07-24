import errorCode from "../config/errorCode";

export interface ApiErrorInterface {
    code: string;
    message?: string;
}

const ApiError = (code: string | null, message?: string): ApiErrorInterface => {
    let errorMessage = "错误";
    if (message) {
        errorMessage = message;
    }
    if (code && errorCode[code]) {
        errorMessage = errorCode[code];
    }
    return {
        code: code || "internal:unknown_error",
        message: errorMessage,
    };
};
// const ApiError = (config: ApiErrorInterface) => {

// };

export default ApiError;
