import { instance } from "./api";

export const SchedulerAPI = {
  postData: (data) => {
    return instance
      .post(`/schedule`, {data}, {
        headers: {
          'Content-type': 'application/json',
        }
      })
      .then(response => response)
      .catch(error => error.response)
  }
}