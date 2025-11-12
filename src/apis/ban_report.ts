import axios from "axios";

const API_URL = "https://proxy-backend-6of2.onrender.com/api/admin";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies with the request
});

export const banUser = async (token: string, userId: string) => {
  try {
    const res = await api.post(
      `/ban/${userId}`,
      {}, // Empty data object since we don't need to send any data in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
export const unbanUser = async (token: string, userId: string) => {
  try {
    const res = await api.post(
      `/unban/${userId}`,
      {}, // Empty data object since we don't need to send any data in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllReports = async (token: string) => {
  try {
    const res = await api.get("/reports", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("RES",res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const resolveReport = async (token: string, reportId: string) => {
  try {
    const res = await api.post(
      `/resolve-report/${reportId}`,
      {}, // Empty data object since we don't need to send any data in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
