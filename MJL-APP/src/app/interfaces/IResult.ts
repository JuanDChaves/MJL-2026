export interface IResult<T> {
    success: boolean;
    error: { message: string } | null;
    data: T | null;
}