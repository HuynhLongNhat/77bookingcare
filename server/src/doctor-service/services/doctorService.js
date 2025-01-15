import { v4 as uuidv4 } from "uuid";
import db from "../models";
import userApiService from "./userApiService";
class DoctorService {
  // Doctor Management

  async createDoctor(doctorData) {
    try {
      const doctorExist = await db.doctor_details.findOne({
        where: { doctor_id: doctorData.user_id },
      });
      if (doctorExist) {
        return {
          EM: "Bác sĩ đã tồn tại.",
          EC: -1,
          DT: [],
        };
      }
      const userResponse = await userApiService.getUserById(doctorData.user_id);
      const userRole = userResponse.userData?.user_role;
      if (userRole !== "DOCTOR") {
        return {
          EM: "Người dùng phải có vai trò là bác sĩ.",
          EC: -3,
          DT: [],
        };
      }

      // Tiếp tục xử lý logic
      const specialization = await db.specializations.findOne({
        where: { specialization_id: doctorData.specialization_id },
      });

      if (!specialization) {
        return {
          EM: "Không tìm thấy chuyên khoa.",
          EC: -4,
          DT: [],
        };
      }

      const newDoctor = await db.doctor_details.create({
        doctor_id: doctorData.user_id,
        specialization_id: doctorData.specialization_id,
        position: doctorData.position,
        experience_years: doctorData.experience_years || 0,
        consultation_fee: doctorData.consultation_fee || 0,
      });

      return {
        EM: "Tạo mới bác sĩ thành công.",
        EC: 0,
        DT: {
          newDoctor,
        },
      };
    } catch (error) {
      return {
        EM: `Lỗi hệ thống: ${error.message}`,
        EC: -5,
        DT: [],
      };
    }
  }

  async getDoctorById(id) {
    try {
      // Get doctor information with specialization
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: id },
        include: [
          {
            model: db.specializations,
            as: "specialization",
            attributes: ["name", "description"],
          },
        ],
        raw: true,
        nest: true,
      });

      if (!doctor) {
        return {
          EM: "Không tìm thấy bác sĩ",
          EC: -2,
          DT: [],
        };
      }
      // Fetch user info from user service
      const { userData } = await userApiService.getUserById(id);
      const { email, user_role, user_profiles = [] } = userData || {};
      const { full_name, phone, date_of_birth, gender, address, avatar } =
        user_profiles[0] || {};

      return {
        EM: "Lấy bác sĩ thành công.",
        EC: 0,
        DT: {
          doctor_id: doctor.doctor_id || "",
          specialization_id: doctor.specialization_id || "",
          position: doctor.position || "",
          experience_years: doctor.experience_years || "",
          consultation_fee: doctor.consultation_fee || "",
          specialization: doctor.specialization || {},

          // User data (if exists)
          email: email || "",
          full_name: full_name || "",
          phone: phone || "",
          user_role: user_role || "",
          date_of_birth: date_of_birth || "",
          gender: gender || "",
          address: address || "",
          avatar: avatar || "",
        },
      };
    } catch (error) {
      return {
        EM: `Lỗi hệ thống: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async getAllDoctors() {
    try {
      // Get all doctors with their specializations
      const doctors = await db.doctor_details.findAll({
        include: [
          {
            model: db.specializations,
            as: "specialization",
            attributes: ["name", "description"],
          },
        ],
      });

      // Fetch user info for each doctor concurrently
      const doctorDetailsPromises = doctors.map(async (doctor) => {
        try {
          const { userData } = await userApiService.getUserById(
            doctor.doctor_id
          );
          if (!userData) return null;

          const { email, user_role, user_profiles = [] } = userData;
          const { full_name, phone, date_of_birth, gender, address, avatar } =
            user_profiles[0] || {};

          return {
            // Doctor data
            doctor_id: doctor.doctor_id || "",
            position: doctor.position || "",
            experience_years: doctor.experience_years || "",
            consultation_fee: doctor.consultation_fee || "",
            specialization: doctor.specialization || {},

            // User data
            email: email || "",
            full_name: full_name || "",
            phone: phone || "",
            user_role: user_role || "",
            date_of_birth: date_of_birth || "",
            gender: gender || "",
            address: address || "",
            avatar: avatar || "",
          };
        } catch (error) {
          console.error(
            `Error fetching user info for doctor ${doctor.doctor_id}:`,
            error
          );
          return null;
        }
      });

      // Resolve all promises and filter out null values
      const validDoctors = (await Promise.all(doctorDetailsPromises)).filter(
        Boolean
      );

      return {
        EM: "Lấy danh sách bác sĩ thành công.",
        EC: 0,
        DT: validDoctors,
      };
    } catch (error) {
      console.error("Error getting doctors:", error);
      return {
        EM: `Error getting doctors: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async updateDoctor(id, updateData) {
    try {
      // 1. Find doctor details
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: id },
      });

      if (!doctor) {
        return {
          EM: "Doctor not found",
          EC: -2,
          DT: [],
        };
      }

      // 2. If specialization is being updated, verify it exists
      if (updateData.specialization_id) {
        const specialization = await db.specializations.findOne({
          where: { specialization_id: updateData.specialization_id },
        });

        if (!specialization) {
          return {
            EM: "Không tìm thấy chuyên khoa",
            EC: -1,
            DT: [],
          };
        }
      }

      // 3. Update doctor details
      await doctor.update({
        specialization_id:
          updateData.specialization_id || doctor.specialization_id,
        position: updateData.position || doctor.position,
        experience_years:
          updateData.experience_years || doctor.experience_years,
        consultation_fee:
          updateData.consultation_fee || doctor.consultation_fee,
      });

      // 4. Get updated doctor info with user details
      const updatedDoctor = await db.doctor_details.findOne({
        where: { doctor_id: id },
        include: [
          {
            model: db.specializations,
            as: "specialization",
            attributes: ["name", "description"],
          },
        ],
      });
      return {
        EM: "Cập nhật bác sĩ thành công",
        EC: 0,
        DT: {
          updatedDoctor,
        },
      };
    } catch (error) {
      console.error("Update doctor error:", error);
      return {
        EM: `Error updating doctor: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async deleteDoctor(id) {
    try {
      // Find and verify it's a doctor
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: id },
      });

      if (!doctor) {
        return {
          EM: "Không tìm thấy bác sĩ",
          EC: -2,
          DT: [],
        };
      }
      await doctor.destroy();

      return {
        EM: "Xóa bác sĩ thành công",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      return {
        EM: `Lỗi hệ thống: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async updateDoctorProfile(id, updateData) {
    try {
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: id },
      });
      if (!doctor) {
        return {
          EM: "Không tìm thấy bác sĩ",
          EC: -2,
          DT: [],
        };
      }
      await doctor.update(updateData);
      return {
        EM: "Cập nhật bác sĩ thành công",
        EC: 0,
        DT: doctor,
      };
    } catch (error) {
      return {
        EM: "Lỗi hệ thống : " + error.message,
        EC: -1,
        DT: doctor,
      };
    }
  }

  // Specialization Management
  async createSpecialization(data) {
    try {
      const specialization = await db.specializations.create({
        specialization_id: uuidv4(),
        name: data.name,
        description: data.description,
        avatar: data.avatar,
      });
      if (!specialization) {
        return {
          EM: "Tạo mới chuyên khoa thất bại!",
          EC: -1,
          DT: [],
        };
      }
      return {
        EM: "Tạo mới chuyên khoa thành công!",
        EC: 0,
        DT: specialization,
      };
    } catch (error) {
      return {
        EM: `Lỗi hệ thống: ${error.message}`,
        EC: -2,
        DT: [],
      };
    }
  }

  async getAllSpecializations() {
    try {
      const listSpecializations = await db.specializations.findAll();
      if (!listSpecializations) {
        return {
          EM: "Lấy danh sách chuyên khoa thất bại!",
          EC: -1,
          DT: [],
        };
      }
      return {
        EM: "Lấy danh sách chuyên khoa thành công!",
        EC: 0,
        DT: listSpecializations,
      };
    } catch (error) {
      return {
        EM: `Lỗi hệt thống: ${error.message}`,
        EC: -2,
        DT: [],
      };
    }
  }

  async getSpecializationById(id) {
    try {
      if (!id) {
        return {
          EM: "Không tìm thấy id của chuyên khoa",
          EC: -1,
          DT: [],
        };
      }

      // Tìm specialization với ID cụ thể
      const specialization = await db.specializations.findOne({
        where: { specialization_id: id },
        attributes: ["specialization_id", "name", "description", "avatar"],
      });

      // Kiểm tra nếu không tìm thấy
      if (!specialization) {
        return {
          EM: "Không tìm thấy chuyên khoa",
          EC: -2,
          DT: [],
        };
      }

      // Trả về kết quả nếu tìm thấy
      return {
        EM: "Lấy chuyên khoa thành công",
        EC: 0,
        DT: specialization,
      };
    } catch (error) {
      return {
        EM: `Lỗi hệ thống ${error.message}`,
        EC: -3,
        DT: [],
      };
    }
  }

  async updateSpecialization(id, updateData) {
    try {
      const specialization = await db.specializations.findByPk(id);
      if (!specialization) {
        return {
          EM: "Không tìm thấy chuyên khoa",
          EC: -1,
          DT: [],
        };
      }
      const doctorsUsingSpecialization = await db.doctor_details.count({
        where: { specialization_id: id },
      });

      if (doctorsUsingSpecialization > 0) {
        return {
          EM: "Chuyên khoa này đang được sử dụng không thể cập nhật",
          EC: -2,
          DT: [],
        };
      }

      await specialization.update({
        name: updateData.name,
        description: updateData.description,
        avatar: updateData.avatar,
      });
      return {
        EM: "Chuyên khoa được cập nhật thành công!",
        EC: 0,
        DT: specialization,
      };
    } catch (error) {
      return {
        EM: "Lỗi hệ thống : " + error.message,
        EC: -3,
        DT: "",
      };
    }
  }

  async deleteSpecialization(id) {
    try {
      const specialization = await db.specializations.findByPk(id);
      if (!specialization) {
        return {
          EM: "Không tìm thấy chuyên khoa",
          EC: -1,
          DT: [],
        };
      }
      // Kiểm tra xem có bác sĩ nào đang sử dụng chuyên khoa này không
      const doctorsUsingSpecialization = await db.doctor_details.count({
        where: { specialization_id: id },
      });

      if (doctorsUsingSpecialization > 0) {
        throw new Error("Chuyên khoa này đang được sử dung không thể xóa");
      }

      await specialization.destroy();
      return {
        EM: "Xóa chuyên khoa thành công",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      return {
        EM: "Lỗi hệ thống : " + error.message,
        EC: 0,
        DT: [],
      };
    }
  }

  async getDoctorsBySpecialization(specializationId) {
    try {
      // Kiểm tra specialization có tồn tại không
      const specialization = await db.specializations.findOne({
        where: { specialization_id: specializationId },
      });

      if (!specialization) {
        return {
          EM: "Không tìm thấy chuyên khoa",
          EC: -1,
          DT: [],
        };
      }

      // Lấy danh sách bác sĩ theo specialization_id
      const doctors = await db.doctor_details.findAll({
        where: { specialization_id: specializationId },
        include: [
          {
            model: db.specializations,
            as: "specialization",
            attributes: ["name", "description"],
          },
        ],
        raw: true,
        nest: true,
      });

      // Lấy thông tin user cho từng bác sĩ
      const doctorsWithUserInfo = await Promise.all(
        doctors.map(async (doctor) => {
          try {
            const { userData } = await userApiService.getUserById(
              doctor.doctor_id
            );
            if (!userData) {
              console.error(
                `No user data found for doctor ${doctor.doctor_id}`
              );
              return null;
            }

            const { email, user_role, user_profiles = [] } = userData || {};
            const { full_name, phone, date_of_birth, gender, address, avatar } =
              user_profiles[0] || {};

            return {
              doctor_id: doctor.doctor_id,
              user_id: doctor.user_id,
              specialization_id: doctor.specialization_id,
              position: doctor.position,
              experience_years: doctor.experience_years,
              consultation_fee: doctor.consultation_fee,
              specialization: doctor.specialization,
              // Thông tin user
              email: email || "",
              full_name: full_name || "",
              phone: phone || "",
              user_role: user_role || "",
              date_of_birth: date_of_birth || "",
              gender: gender || "",
              address: address || "",
              avatar: avatar || "",
            };
          } catch (error) {
            console.error(
              `Error fetching user info for doctor ${doctor.doctor_id}:`,
              error
            );
            return null;
          }
        })
      );

      // Lọc bỏ các bác sĩ không lấy được thông tin user
      const validDoctors = doctorsWithUserInfo.filter(
        (doctor) => doctor !== null
      );

      return {
        EM: "Lấy danh sách bác sĩ theo chuyên khoa thành công",
        EC: 0,
        DT: {
          specialization: {
            id: specialization.specialization_id,
            name: specialization.name,
            description: specialization.description,
          },
          doctors: validDoctors,
        },
      };
    } catch (error) {
      return {
        EM: `Lỗi hệ thống: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  // Schedule Management
  async getAllSchedules() {
    try {
      // Lấy danh sách lịch hẹn cùng thông tin bác sĩ và chuyên môn
      const schedules = await db.doctor_schedules.findAll({
        include: [
          {
            model: db.doctor_details,
            as: "doctor",
            attributes: { exclude: ["specialization_id"] },
            include: [
              {
                model: db.specializations,
                as: "specialization",
                attributes: ["name", "description"],
              },
            ],
          },
        ],
        order: [
          ["schedule_date", "ASC"],
          ["start_time", "ASC"],
        ],
      });

      if (!schedules || schedules.length === 0) {
        return {
          EM: "Không có lịch hẹn nào",
          EC: -1,
          DT: [],
        };
      }

      // Format dữ liệu
      const formattedSchedules = await Promise.all(
        schedules.map(async (schedule) => {
          try {
            // Lấy thông tin user từ API cho bác sĩ tương ứng
            const userInfo = await userApiService.getUserById(
              schedule.doctor.doctor_id
            );

            return {
              schedule_id: schedule.schedule_id,
              schedule_date: schedule.schedule_date,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              status: schedule.status,
              doctor: {
                doctor_id: schedule.doctor.doctor_id,
                position: schedule.doctor.position,
                specialization: schedule.doctor.specialization.name,
                user: userInfo, // Thông tin user của bác sĩ
              },
            };
          } catch (error) {
            console.error(
              `Lỗi khi xử lý lịch hẹn với ID ${schedule.schedule_id}:`,
              error
            );
            return null; // Bỏ qua nếu có lỗi
          }
        })
      );

      // Lọc bỏ các lịch hẹn không hợp lệ (nếu có lỗi trong Promise)
      const validSchedules = formattedSchedules.filter((item) => item !== null);

      return {
        EM: "Lấy danh sách lịch hẹn thành công",
        EC: 0,
        DT: validSchedules,
      };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
      return {
        EM: `Error getting schedules: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async createSchedule(doctorId, scheduleData) {
    try {
      // Kiểm tra bác sĩ tồn tại
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: doctorId },
      });

      if (!doctor) {
        return {
          EM: "Không tìm thấy bác sĩ",
          EC: -1,
          DT: [],
        };
      }
      // Kiểm tra trùng lặp lịch
      const existingSchedule = await db.doctor_schedules.findOne({
        where: {
          doctor_id: doctorId,
          schedule_date: scheduleData.schedule_date,
          start_time: scheduleData.start_time,
          end_time: scheduleData.end_time,
        },
      });

      if (existingSchedule) {
        return {
          EM: "Lịch làm việc đã tồn tại ngày và giờ này.",
          EC: -2,
          DT: [],
        };
      }

      // Tạo lịch mới với UUID
      const newSchedule = await db.doctor_schedules.create({
        schedule_id: uuidv4(), // Tự động tạo UUID
        doctor_id: doctorId,
        schedule_date: scheduleData.schedule_date,
        start_time: scheduleData.start_time,
        end_time: scheduleData.end_time,
        status: "AVAILABLE",
      });

      return {
        EM: "Tạo lịch hẹn thành công",
        EC: 0,
        DT: newSchedule,
      };
    } catch (error) {
      return {
        EM: `Lỗi hệ thống ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async getDoctorSchedules(doctorId) {
    try {
      console.log("vào hàm doctor schedule");
      // Kiểm tra bác sĩ tồn tại và lấy thông tin bác sĩ cùng chuyên môn
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: doctorId },
        attributes: { exclude: ["specialization_id"] },
        include: [
          {
            model: db.specializations,
            as: "specialization",
            attributes: ["name", "description"],
          },
        ],
      });

      if (!doctor) {
        return {
          EM: "Không tìm thấy bác sĩ",
          EC: -1,
          DT: [],
        };
      }

      // Lấy danh sách lịch hẹn của bác sĩ theo ID
      const schedules = await db.doctor_schedules.findAll({
        where: { doctor_id: doctorId },
        order: [
          ["schedule_date", "ASC"],
          ["start_time", "ASC"],
        ],
      });

      if (!schedules || schedules.length === 0) {
        return {
          EM: "Không có lịch làm việc nào cho bác sĩ này",
          EC: 0,
          DT: {
            doctor: doctor.dataValues,
            schedules: [],
          },
        };
      }

      // Lấy thông tin user của bác sĩ
      const userInfo = await userApiService.getUserById(doctorId);

      // Chuẩn bị dữ liệu trả về
      const doctorData = {
        doctor: {
          ...doctor.dataValues,
          user: userInfo, // Thông tin user kèm theo
        },
        schedules: schedules.map((schedule) => ({
          schedule_id: schedule.schedule_id,
          schedule_date: schedule.schedule_date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          status: schedule.status,
        })),
      };

      return {
        EM: "Lấy danh sách lịch hẹn của bác sĩ thành công",
        EC: 0,
        DT: doctorData,
      };
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn của bác sĩ:", error);
      return {
        EM: `Error getting schedules for doctor: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }
  async getDetailSchedule(doctorId, scheduleId) {
    console.log("doctorId: ", doctorId);
    console.log("scheduleId: ", scheduleId);
    try {
      console.log("Fetching schedule details...");

      // Kiểm tra bác sĩ tồn tại và lấy thông tin bác sĩ cùng chuyên môn
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: doctorId },
        attributes: { exclude: ["specialization_id"] },
        include: [
          {
            model: db.specializations,
            as: "specialization",
            attributes: ["name", "description"],
          },
        ],
      });

      if (!doctor) {
        return {
          EM: "Không tìm thấy bác sĩ",
          EC: -1,
          DT: null,
        };
      }
      // Lấy thông tin chi tiết của lịch hẹn
      const schedule = await db.doctor_schedules.findOne({
        where: {
          doctor_id: doctorId,
          schedule_id: scheduleId,
        },
       
      });

      if (!schedule) {
        return {
          EM: "Không tìm thấy lịch hẹn chi tiết",
          EC: -1,
          DT: null,
        };
      }

      // Lấy thông tin user của bác sĩ
      const userInfo = await userApiService.getUserById(doctorId);

      // Chuẩn bị dữ liệu trả về
      const scheduleDetails = {
        doctor: {
          ...doctor.dataValues,
          user: userInfo || null,
        },
        schedule: {
          schedule_id: schedule.schedule_id,
          schedule_date: schedule.schedule_date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          status: schedule.status,
         
        },
      };

      return {
        EM: "Lấy chi tiết lịch hẹn thành công",
        EC: 0,
        DT: scheduleDetails,
      };
    } catch (error) {
      console.error("Error fetching schedule details:", error);
      return {
        EM: `Đã xảy ra lỗi khi lấy chi tiết lịch hẹn: ${error.message}`,
        EC: -1,
        DT: null,
      };
    }
  }

  async updateSchedule(doctorId, scheduleId, updateData) {
    try {
      const schedule = await db.doctor_schedules.findOne({
        where: {
          schedule_id: scheduleId,
          doctor_id: doctorId,
        },
      });

      if (!schedule) {
        return {
          EM: "Lịch hẹn không tồn tại",
          EC: -1,
          DT: [],
        };
      }
      // Nếu lịch đã BOOKED, không cho phép cập nhật thời gian
      if (
        schedule.status === "BOOKED" &&
        (updateData.schedule_date ||
          updateData.start_time ||
          updateData.end_time)
      ) {
        return {
          EM: "Lịch hẹn đã được đặt không thể cập nhật",
          EC: -4,
          DT: [],
        };
      }

      // Cập nhật lịch
      await schedule.update({
        schedule_date: updateData.schedule_date || schedule.schedule_date,
        start_time: updateData.start_time || schedule.start_time,
        end_time: updateData.end_time || schedule.end_time,
        status: updateData.status || schedule.status,
      });

      return {
        EM: "Lịch hẹn đã được cập nhật thành công!",
        EC: 0,
        DT: schedule,
      };
    } catch (error) {
      return {
        EM: `Error updating schedule: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async deleteSchedule(doctorId, scheduleId) {
    try {
      const schedule = await db.doctor_schedules.findOne({
        where: {
          schedule_id: scheduleId,
          doctor_id: doctorId,
        },
      });

      if (!schedule) {
        return {
          EM: "Lịch hẹn không tồn tại",
          EC: -1,
          DT: [],
        };
      }
      // Không cho phép xóa lịch đã BOOKED
      if (schedule.status === "BOOKED") {
        return {
          EM: "Không thể xóa lịch đã đặt.",
          EC: -4,
          DT: [],
        };
      }

      await schedule.destroy();

      return {
        EM: "Lịch hẹn đã được xóa thành công.",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      return {
        EM: `Error deleting schedule: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }
}

export default new DoctorService();
