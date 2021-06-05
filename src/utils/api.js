import axios from "axios"
import Cookies from 'js-cookie';
// const token = Cookies.get('token');
// const BASE_API = "http://localhost:4000/api/";
// export const BASE_IMG = "http://localhost:4000/";
const BASE_API = "https://prueba.upgrap.com/api/";
export const BASE_IMG = "https://prueba.upgrap.com/";
export const GET_IMAGE = "https://static.upgrap.com/";

export const opt1 = {
    Accept: 'application/json'
}

export const opt2 = () => {
    return {
        "Accept": 'application/json',
        "x-access-token": Cookies.get('token')
    }
}
export const opt3 = () => {
    return {
        'Content-Type': 'multipart/form-data',
        "x-access-token": Cookies.get('token')
    }
}

export const getData = async (url, option) => {
    return await new Promise((resolve, reject) => {
        axios.get(BASE_API+url, {headers: option}).then(res => {
            resolve(res.data);
        }).catch(err => reject(err.response));
    })
}

export const addData = async (url, data, option) => {
    return await new Promise((resolve, reject) => {
        axios.post(BASE_API+url, data, {headers: option}).then(res => {
            resolve(res.data);
        }).catch(err => reject(err.response));
    })
}

export const getDataById = async (url, id, option) => {
    return await new Promise((resolve, reject) => {
        axios.get(BASE_API+url+id, {headers: option}).then(res => {
            resolve(res.data);
            console.log(res)
        }).catch(err => {
            console.log(err)
            reject(err.response)
        });
    })
}

export const UploadFile = async (url, data, option) => {
    return await new Promise((resolve, reject) => {
        axios.post(BASE_IMG+url, data, {headers: option}).then(res => {
            resolve(res.data);
        }).catch(err => reject(err.response));
    })
}


export const updateData = async (url, data, id, option) => {
    return await new Promise((resolve, reject) => {
        axios.put(BASE_API+url+id, data, {headers: option}).then(res => {
            resolve(res.data);
        }).catch(err => reject(err.response));
    })
}

export const deleteData = async (url, id, option) => {
    return await new Promise((resolve, reject) => {
        axios.delete(BASE_API+url+id, {headers: option}).then(res => {
            resolve(res.data);
        }).catch(err => reject(err.response));
    })
}