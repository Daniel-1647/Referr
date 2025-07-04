import { isAxiosError } from "axios";

type ErrorInfo = {
    message: string;
    status?: number;
    redirect?: string;
};

export function getAxiosErrorInfo(err: unknown, fallback = "Something went wrong"): ErrorInfo {
    if (isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data || {};

        const message = typeof data?.message === "string" ? data.message : fallback;
        const redirect = typeof data?.redirect === "string" ? data.redirect : undefined;

        return {
            message,
            status,
            redirect,
        };
    }

    return {
        message: fallback,
    };
}

export function isStatusError(err: unknown, code: number): boolean {
    return isAxiosError(err) && err.response?.status === code;
}

export function isAnyStatusError(err: unknown, codes: number[]): boolean {
    return isAxiosError(err) && codes.includes(err.response?.status ?? -1);
}
