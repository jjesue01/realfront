import { instance } from "./api";

export const LoginAPI = {
  login: (email, password) => {
    return instance
      .post(`/auth/login`, {
        email,
        password
      })
      .then(response => response)
      .catch(error => error.response)
  }
}