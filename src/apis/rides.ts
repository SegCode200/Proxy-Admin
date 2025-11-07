import axios from "axios";

const API_URL = "https://proxy-backend-6of2.onrender.com/api/admin";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies with the request
});

export const getRidesStat = async () => {
  try {
    const res = await api.get(`/rider-stats`);
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
export const getRidesMonthlyStat = async () => {
  try {
    const res = await api.get(`/rider-analytics/monthly`);
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
export const getAllRides = async () => {
  try {
    const res = await api.get(`/riders`);
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getOneRider = async (id: string) => {
  try {
    const res = await api.get(`/single-rider/${id}`);
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};