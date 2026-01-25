export interface IResponse<T = any> {
    message?: string,
    info?:string,
    statusCode?: number,
    data?: T
}