import axios from "axios";

const API_URL = "https://proxy-backend-6of2.onrender.com/api/admin";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies with the request
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const loginAdmin = async (data: { email: string; password: string }) => {
  try {
    const res = await api.post("/login", data);
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
