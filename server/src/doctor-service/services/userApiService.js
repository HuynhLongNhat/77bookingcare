import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:8001";
const SERVICE_TOKEN = process.env.SERVICE_TOKEN;

class UserApiService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: USER_SERVICE_URL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_TOKEN}`,
      },
    });
  }

  async getUserById(userId) {
    try {
      const response = await this.axiosInstance.get(`/api/users/${userId}`);
      const userData = response.data.data;
      const userProfile = userData.user_profiles[0] || {};

      return {
        ...userData,
        full_name: userProfile.full_name,
        date_of_birth: userProfile.date_of_birth,
        gender: userProfile.gender,
        address: userProfile.address,
        avatar: userProfile.avatar,
      };
    } catch (error) {
      console.error("getUserById error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return {
        EM: `Error fetching user: ${
          error.response?.data?.message || error.message
        }`,
        EC: error.response?.status || -1,
        DT: null,
      };
    }
  }
}

export default new UserApiService();
