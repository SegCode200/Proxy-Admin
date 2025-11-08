import axios from "axios";

const API_URL = "https://proxy-backend-6of2.onrender.com/api/admin";
const API_URL_Rides = "https://proxy-backend-6of2.onrender.com/api/rider";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies with the request
});
const rides = axios.create({
  baseURL: API_URL_Rides,
  withCredentials: true, // This is important for sending cookies with the request
});

export const getRidesStat = async () => {
  try {
    const res = await api.get(`/rider-stats`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
export const getRidesMonthlyStat = async () => {
  try {
    const res = await api.get(`/rider-analytics/monthly`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
export const getAllRides = async () => {
  try {
    const res = await api.get(`/riders`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getOneRider = async (id: string) => {
  try {
    const res = await api.get(`/single-rider/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
export const acceptRidersKyc = async (id: string, token: string) => {
  try {
    console.log(token);
    const res = await rides.post(
      `/kyc/approve/${id}`,
      {},
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
export const acceptRider = async (id: string, token: string) => {
  try {
    const res = await rides.post(
      `approve/${id}`,
      {},
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
export const rejectRidersKyc = async (
  id: string,
  token: string,
  reason: string
) => {
  try {
    const res = await rides.post(
      `/kyc/reject/${id}`,
      { reason },
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
export const rejectRider = async (
  id: string,
  token: string,
  reason: string
) => {
  try {
    const res = await rides.post(
      `reject/${id}`,
      { reason },
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

// import axios from "axios";

// const API_URL = "https://proxy-backend-6of2.onrender.com/api/admin";

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // This is important for sending cookies with the request
// });

// export const getRidesStat = async () => {
//   try {
//     const res = await api.get(`/rider-stats`);
//     console.log(res);
//     return res.data;
//   } catch (error: any) {
//     throw error;
//   }
// };
// export const getRidesMonthlyStat = async () => {
//   try {
//     const res = await api.get(`/rider-analytics/monthly`);
//     console.log(res);
//     return res.data;
//   } catch (error: any) {
//     throw error;
//   }
// };
// export const getAllRides = async () => {
//   try {
//     const res = await api.get(`/riders`);
//     console.log(res);
//     return res.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// export const getOneRider = async (id: string) => {
//   try {
//     const res = await api.get(`/single-rider/${id}`);
//     console.log(res);
//     return res.data;
//   } catch (error: any) {
//     throw error;
//   }
// };
