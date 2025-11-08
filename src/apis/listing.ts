import axios from "axios";

const API_URL = "https://proxy-backend-6of2.onrender.com/api/admin";
const API_URLList = "https://proxy-backend-6of2.onrender.com/api/listings";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies with the request
});
const list = axios.create({
  baseURL: API_URLList,
  withCredentials: true, // This is important for sending cookies with the request
});

export const AllProduct = async (token: any) => {
  try {
    const res = await api.get("/", {
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

export const GetProductById = async (id: string) => {
  try {
    const res = await list.get(`/listing/${id}`);
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const approveListing = async (listingId: string, token: string) => {
  try {
    const res = await api.post(
      "/approve",
      { listingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const rejectListing = async (
  listingId: string,
  rejectionNote: string,
  token: string
) => {
  try {
    const res = await api.post(
      "/reject",
      { listingId, rejectionNote },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const removeListing = async (listingId: string, token: string) => {
  try {
    const res = await api.post(
      "/remove",
      { listingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
