import { loginAdmin } from "@/apis/adminLogin";
import { setUser } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";

export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await loginAdmin({ email, password });
      if (data.data) {
        dispatch(setUser(data.data));
      } else {
        // If user data is not in the expected format
        throw new Error("Invalid response from server");
      }
      return data; // Return the full response data
    } catch (error: any) {
      // The error is already processed in loginAdmin
      throw error;
    }
  };
