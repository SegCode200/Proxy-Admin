import axios from "axios";

const API_URL = "https://proxy-backend-6of2.onrender.com/api/admin";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies with the request
});

export const getKycRequests = async (token: string) => {
  try {
    const res = await api.get("/kyc", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateKycStatus = async (
  kycId: string,
  status: "APPROVED" | "REJECTED",
  token: string
) => {
  try {
    const res = await api.post(
      "/kyc/status",
      { status, kycId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
