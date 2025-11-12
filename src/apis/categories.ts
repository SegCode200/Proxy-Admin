import axios from "axios";

const API_URL = "https://proxy-backend-6of2.onrender.com/api/admin";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies with the request
});

export const getCategories = async () => {
  try {
    const res = await api.get("/get-category");
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const editCategory = async (
  id: string,
  data: { name?: string; description?: string; image?: File },
  token: string
) => {
  try {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.image) formData.append("image", data.image);

    const res = await api.put(`/edit-category/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteCategory = async (id: string, token: string) => {
  try {
    const res = await api.delete(`/delete-category/${id}`, {
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

export const addCategory = async (
  data: { name: string; description: string; image?: File },
  token: string
) => {
  try {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.image) formData.append("image", data.image);

    const res = await api.post("/add-category", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
