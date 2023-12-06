export interface InternalServerError {
    msg: string;
    ok: boolean;
    error: any;
    status: number
}

export interface NotFoundItems {
    msg: string;
    ok: boolean;
    status: number;
}

export interface ValidateError {
    message: string;
    status: number;
    name: string;
}