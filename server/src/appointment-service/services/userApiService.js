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
      // Thêm validateStatus để chấp nhận mọi status code
      validateStatus: function (status) {
        return true; // Chấp nhận mọi status code
      },
    });
  }

  async getUserById(userId) {
    try {
      const response = await this.axiosInstance.get(`/api/users/${userId}`);
      const userData = response.data.DT;
      if (!userData) {
        return {
          EM: "Không nhận được dữ liệu từ server",
          EC: -1,
          DT: null,
        };
      }
      return {
        userData,
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return {
        EM: `Lỗi hệ thống: ${error.message}`,
        EC: -1,
        DT: null,
      };
    }
  }
}

export default new UserApiService();
