import axios, { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData = require('form-data');

interface APIResponse<T> {
  result: T;
}

const client: Axios = axios.create({
  baseURL: 'https://slack.com/api', // 프론트 URL
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

//TODO: GET 메서드
export const getData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await client.get<APIResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//TODO: POST 메서드
export const postData = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    // console.log(data);
    const response = await client.post<APIResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const postFormData = async <T>(
  url: string,
  data?: any,
  //   config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    console.log(
      'token:',
      data.token,
      'Channel:',
      data.channel,
      'Message:',
      data.message,
    );

    const form = new FormData();
    form.append('token', data.token);
    form.append('channel', data.channel);
    form.append('text', data.message);
    // console.log(form);
    const response = await client.postForm<APIResponse<T>>(
      '/chat.postMessage',
      form,
    );

    // const response = await client.post<APIResponse<T>>(url, data, config);

    // const response = axios.postForm(
    //   'https://slack.com/api/chat.postMessage',
    //   form,
    //   {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //     transformRequest: [
    //       function () {
    //         return form;
    //       },
    //     ],
    //   },
    // );
    // console.log(response);
    return response.data;
    // return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

//TODO: PUT 메서드
export const putData = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await client.put<APIResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//TODO: Delete 메서드
export const deleteData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await client.delete<APIResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
