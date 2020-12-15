import { _get, _post } from "./index";

export const getList = (data) => _get("/house", data);

export const query = (data) => _get("/house/query", data);

export const diss = (data) => _post("/house/diss", data);

export const removeComm = (data) => _get("/house/removeComm", data);

export const edit = (data) => _post("/house/edit", data);
