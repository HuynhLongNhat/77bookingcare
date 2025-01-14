import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DOCTOR_SERVICE_URL =
  process.env.DOCTOR_SERVICE_URL || "http://localhost:8002";
const SERVICE_TOKEN = process.env.SERVICE_TOKEN;

class DoctorApiService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: DOCTOR_SERVICE_URL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_TOKEN}`,
      },
    });
  }

  async getDoctorById(doctorId) {
    try {
      const responseDoctor = await this.axiosInstance.get(`/api/doctors/${doctorId}`);
      const doctorData = responseDoctor.data.DT;

      return {
        doctorData,
      
      };
    } catch (error) {
      console.error("get doctor error:", {
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

export default new DoctorApiService();
