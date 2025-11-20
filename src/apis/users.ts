import axios from "axios";

const API_URL = "https://proxy-backend-6of2.onrender.com/api/admin";
const API_UR_Ven = "https://proxy-backend-6of2.onrender.com/api/vendor";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies with the request
});
const ven = axios.create({
  baseURL: API_UR_Ven,
  withCredentials: true, // This is important for sending cookies with the request
});

export const allUserList = async (token: string) => {
  try {
    const res = await api.get("/users", {
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

export const getOneUser = async (id: string) => {
  try {
    const res = await api.get(`/single-user/${id}`);
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
// Vendor Application APIs
export const getAllVendorApplications = async (token: string) => {
  try {
    const res = await ven.get("/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const approveVendor = async (id: string, token: string) => {
  try {
    const res = await ven.patch(
      `/approve/${id}`,
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

export const rejectVendor = async (id: string, token: string, note: string = '') => {
  try {
    const res = await ven.patch(
      `/reject/${id}`,
      { note }, // Include the rejection note in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error('Error rejecting vendor:', error);
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
export const updateUserRole = async (
  token: string,
  userId: string,
  newRole: string
) => {
  try {
    const res = await api.post(
      `/role`,
      { role: newRole, userId: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getOneVendor = async (id: string, token: string) => {
  try {
    const res = await ven.get(`/get-vendor/${id}`, {
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

// export const getVendorApplications = async (token: string) => {
//   try {
//     const res = await api.get("/vendor-applications", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// export const approveVendorApplication = async (id: string, token: string) => {
//   try {
//     const res = await api.post(
//       `/vendor-applications/${id}/approve`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return res.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// export const rejectVendorApplication = async (id: string, token: string) => {
//   try {
//     const res = await api.post(
//       `/vendor-applications/${id}/reject`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return res.data;
//   } catch (error: any) {
//     throw error;
//   }
// };
