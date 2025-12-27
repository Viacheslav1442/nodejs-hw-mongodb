export const HttpError = (status, message = "Error") => {
    const err = new Error(message);
    err.status = status;
    return err;
};
