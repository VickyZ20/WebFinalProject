import { _get, _post } from "./index";
export const login = (data) => _post("/user/login", data);

export const register = (data) => _post("/user/register", data);

export const query = (data) => _get("/user", data);
