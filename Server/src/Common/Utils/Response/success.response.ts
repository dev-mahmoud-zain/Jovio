import { IResponse } from "src/Common/Interfaces/response.interface";

export const SuccessResponse = <T = any>({
    message = 'done',
    info,
    statusCode = 200,
    data,
}: IResponse<T> = {}): IResponse<T> => {
    return { message, info, statusCode, data };
};