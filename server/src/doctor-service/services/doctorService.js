import { v4 as uuidv4 } from "uuid";
import db from "../models";
import { Op } from "sequelize";
import userApiService from "./userApiService";
class DoctorService {
  // Doctor Management
  async createDoctor(doctorData) {
    try {
      // 1. Validate required fields
      if (!doctorData.user_id || !doctorData.specialization_id) {
        return {
          EM: "User ID and Specialization ID are required",
          EC: -1,
          DT: [],
        };
      }

      // 2. Check if doctor_details already exists
      const existingDoctor = await db.doctor_details.findOne({
        where: { user_id: doctorData.user_id },
      });

      if (existingDoctor) {
        return {
          EM: "Professional details already exist for this doctor",
          EC: -1,
          DT: [],
        };
      }

      // 3. Verify user exists and has DOCTOR role through User Service API
      try {
        const userResponse = await userApiService.getUserById(
          doctorData.user_id
        );
        console.log("userResponse", userResponse);
        if (!userResponse) {
          return {
            EM: "User not found",
            EC: -1,
            DT: [],
          };
        }

        if (userResponse.user_role !== "DOCTOR") {
          return {
            EM: "Selected user must have DOCTOR role",
            EC: -1,
            DT: [],
          };
        }
      } catch (error) {
        return {
          EM: "Error verifying user details",
          EC: -1,
          DT: [],
        };
      }

      // 4. Verify specialization exists
      const specialization = await db.specializations.findOne({
        where: { specialization_id: doctorData.specialization_id },
      });

      if (!specialization) {
        return {
          EM: "Specialization not found",
          EC: -1,
          DT: [],
        };
      }

      // 5. Create doctor professional details
      const doctor = await db.doctor_details.create({
        doctor_id: doctorData.user_id,
        user_id: doctorData.user_id,
        specialization_id: doctorData.specialization_id,
        position: doctorData.position,
        experience_years: doctorData.experience_years || 0,
        consultation_fee: doctorData.consultation_fee || 0,
      });

      // 6. Get user info again for response
      const userInfo = await userApiService.getUserById(doctorData.user_id);

      // 7. Return response with user info
      return {
        EM: "Doctor professional details created successfully",
        EC: 0,
        DT: {
          ...doctor.dataValues,
          user: userInfo.DT,
        },
      };
    } catch (error) {
      console.error("Create doctor error:", error);
      return {
        EM: `Error creating doctor details: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }
  async getDoctorById(id) {
    try {
      // Find doctor with specialization info
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: id },
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
          EM: "Doctor not found",
          EC: -2,
          DT: [],
        };
      }

      // Get user info from user service
      const userInfo = await userApiService.getUserById(doctor.user_id);
      console.log("userInfo", userInfo);
      return {
        EM: "Get doctor successfully",
        EC: 0,
        DT: {
          doctor_id: doctor.doctor_id || "",
          user_id: doctor.user_id || "",
          specialization_id: doctor.specialization_id || "",
          position: doctor.position || "",
          experience_years: doctor.experience_years || "",
          consultation_fee: doctor.consultation_fee || "",
          specialization: doctor.specialization || "",
          // Add user information
          username: userInfo.username || "",
          email: userInfo.email || "",
          phone: userInfo.phone || "",
          full_name: userInfo.full_name || "",
          date_of_birth: userInfo.date_of_birth || "",
          gender: userInfo.gender || "",
          address: userInfo.address || "",
          avatar: userInfo.avatar || "",
        },
      };
    } catch (error) {
      console.error("Get doctor error:", error);
      return {
        EM: `Error getting doctor: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }
  // async getDoctors(filters = {}) {
  //   try {
  //     return await db.doctor_details.findAll({
  //       where: filters,
  //       include: [
  //         {
  //           model: db.specializations,
  //           as: "specialization",
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     throw new Error(`Error getting doctors: ${error.message}`);
  //   }
  // }

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

      // Get detailed information for each doctor
      const doctorsWithUserInfo = await Promise.all(
        doctors.map(async (doctor) => {
          try {
            // Get user info from user service - using the same method as getDoctorById
            const userInfo = await userApiService.getUserById(doctor.user_id);

            if (!userInfo) {
              console.error(
                `No user data found for doctor ${doctor.doctor_id}`
              );
              return null;
            }

            return {
              doctor_id: doctor.doctor_id,
              user_id: doctor.user_id,
              specialization_id: doctor.specialization_id,
              position: doctor.position,
              experience_years: doctor.experience_years,
              consultation_fee: doctor.consultation_fee,
              specialization: doctor.specialization,
              // Add user information directly like getDoctorById
              username: userInfo.username || "",
              email: userInfo.email || "",
              phone: userInfo.phone || "",
              full_name: userInfo.full_name || "",
              date_of_birth: userInfo.date_of_birth || "",
              gender: userInfo.gender || "",
              address: userInfo.address || "",
              avatar: userInfo.avatar || "",
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

      // Filter out any null values from failed user info fetches
      const validDoctors = doctorsWithUserInfo.filter(
        (doctor) => doctor !== null
      );

      return {
        EM: "Get all doctors success",
        EC: 0,
        DT: validDoctors,
      };
    } catch (error) {
      console.error("Get all doctors error:", error);
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
            EM: "Specialization not found",
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

      const userInfo = await userApiService.getUserById(doctor.user_id);

      return {
        EM: "Update doctor successfully",
        EC: 0,
        DT: {
          ...updatedDoctor.dataValues,
          user: userInfo.DT,
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
          EM: "Doctor not found",
          EC: -2,
          DT: [],
        };
      }

      // Delete from both tables
      await doctor.destroy();

      return {
        EM: "Delete doctor successfully",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      return {
        EM: `Error deleting doctor: ${error.message}`,
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
          EM: "Doctor not found",
          EC: -2,
          DT: [],
        };
      }
      await doctor.update(updateData);
      return {
        EM: "Update doctor profile successfully",
        EC: 0,
        DT: doctor,
      };
    } catch (error) {
      throw new Error(`Error updating doctor profile: ${error.message}`);
    }
  }

  // Specialization Management
  async createSpecialization(data) {
    try {
      const specialization = await db.specializations.create({
        specialization_id: uuidv4(),
        name: data.name,
        description: data.description,
      });
      if (!specialization) {
        return {
          EM: "Create specialization failed",
          EC: -1,
          DT: [],
        };
      }
      return {
        EM: "Create specialization success",
        EC: 0,
        DT: specialization,
      };
    } catch (error) {
      throw new Error(`Error creating specialization: ${error.message}`);
    }
  }

  async getAllSpecializations() {
    try {
      const listSpecializations = await db.specializations.findAll();
      if (!listSpecializations) {
        return {
          EM: "Get all specializations failed",
          EC: -1,
          DT: [],
        };
      }
      return {
        EM: "Get all specializations success",
        EC: 0,
        DT: listSpecializations,
      };
    } catch (error) {
      return {
        EM: `Error getting specializations: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async getSpecializationById(id) {
    try {
      if (!id) {
        return {
          EM: "Invalid specialization ID",
          EC: -1,
          DT: [],
        };
      }

      // Tìm specialization với ID cụ thể
      const specialization = await db.specializations.findOne({
        where: { specialization_id: id },
        attributes: ["specialization_id", "name", "description"],
      });

      // Kiểm tra nếu không tìm thấy
      if (!specialization) {
        return {
          EM: "Specialization not found",
          EC: -2,
          DT: [],
        };
      }

      // Trả về kết quả nếu tìm thấy
      return {
        EM: "Get specialization success",
        EC: 0,
        DT: specialization,
      };
    } catch (error) {
      console.error("Error in getSpecializationById:", error); // Thêm log để debug
      return {
        EM: `Error getting specialization: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async updateSpecialization(id, updateData) {
    try {
      const specialization = await db.specializations.findByPk(id);
      if (!specialization) {
        return {
          EM: "Specialization not found",
          EC: -1,
          DT: [],
        };
      }

      // Kiểm tra xem có bác sĩ nào đang sử dụng chuyên khoa này không
      const doctorsUsingSpecialization = await db.doctor_details.count({
        where: { specialization_id: id },
      });

      if (doctorsUsingSpecialization > 0) {
        return {
          EM: "Cannot update specialization that is being used by doctors",
          EC: -2,
          DT: [],
        };
      }

      await specialization.update(updateData);
      return {
        EM: "Specialization is update success",
        EC: 0,
        DT: specialization,
      };
    } catch (error) {
      throw new Error(`Error updating specialization: ${error.message}`);
    }
  }

  async deleteSpecialization(id) {
    try {
      const specialization = await db.specializations.findByPk(id);
      if (!specialization) {
        return {
          EM: "Specialization not found",
          EC: -1,
          DT: [],
        };
      }
      // Kiểm tra xem có bác sĩ nào đang sử dụng chuyên khoa này không
      const doctorsUsingSpecialization = await db.doctor_details.count({
        where: { specialization_id: id },
      });

      if (doctorsUsingSpecialization > 0) {
        throw new Error(
          "Cannot delete specialization that is being used by doctors"
        );
      }

      await specialization.destroy();
      return {
        EM: "Delete specialization success",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      throw new Error(`Error deleting specialization: ${error.message}`);
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
          EM: "Specialization not found",
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
      });

      // Lấy thông tin user cho từng bác sĩ
      const doctorsWithUserInfo = await Promise.all(
        doctors.map(async (doctor) => {
          try {
            const userInfo = await userApiService.getUserById(doctor.user_id);

            if (!userInfo) {
              console.error(
                `No user data found for doctor ${doctor.doctor_id}`
              );
              return null;
            }

            return {
              doctor_id: doctor.doctor_id,
              user_id: doctor.user_id,
              specialization_id: doctor.specialization_id,
              position: doctor.position,
              experience_years: doctor.experience_years,
              consultation_fee: doctor.consultation_fee,
              specialization: doctor.specialization,
              // Thông tin user
              username: userInfo.username || "",
              email: userInfo.email || "",
              phone: userInfo.phone || "",
              full_name: userInfo.full_name || "",
              date_of_birth: userInfo.date_of_birth || "",
              gender: userInfo.gender || "",
              address: userInfo.address || "",
              avatar: userInfo.avatar || "",
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
        EM: "Get doctors by specialization successfully",
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
      console.error("Get doctors by specialization error:", error);
      return {
        EM: `Error getting doctors: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  // Schedule Management
  async getAllSchedules() {
    try {
      // Lấy tất cả lịch làm việc kèm thông tin bác sĩ và chuyên khoa
      const schedules = await db.doctor_schedules.findAll({
        include: [
          {
            model: db.doctor_details,
            as: "doctor",
            attributes: ["doctor_id", "user_id", "position"],
            include: [
              {
                model: db.specializations,
                as: "specialization",
                attributes: ["name"],
              },
            ],
          },
        ],
        order: [
          ["schedule_date", "ASC"],
          ["start_time", "ASC"],
        ],
      });

      // Xử lý và format dữ liệu
      const formattedSchedules = await Promise.all(
        schedules.map(async (schedule) => {
          // Lấy thông tin user của bác sĩ
          const userInfo = await userApiService.getUserById(
            schedule.doctor.user_id
          );

          return {
            schedule_id: schedule.schedule_id,
            doctor_name: userInfo.full_name,
            position: schedule.doctor.position,
            specialization: schedule.doctor.specialization.name,
            schedule_date: schedule.schedule_date,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            status: schedule.status,
          };
        })
      );

      return {
        EM: "Get all schedules successfully",
        EC: 0,
        DT: {
          total_schedules: formattedSchedules.length,
          schedules: formattedSchedules,
        },
      };
    } catch (error) {
      console.error("Get all schedules error:", error);
      return {
        EM: `Error getting schedules: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async createSchedule(doctorId, scheduleData, currentUser) {
    try {
      // Kiểm tra bác sĩ tồn tại
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: doctorId },
      });

      if (!doctor) {
        return {
          EM: "Doctor not found",
          EC: -1,
          DT: [],
        };
      }

      // Kiểm tra quyền
      if (currentUser.role === "DOCTOR" && currentUser.userId !== doctorId) {
        return {
          EM: "You can only manage your own schedule",
          EC: -3,
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
          EM: "Schedule already exists for this date and time",
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
        status: "AVAILABLE", // Mặc định là AVAILABLE
      });

      return {
        EM: "Schedule created successfully",
        EC: 0,
        DT: newSchedule,
      };
    } catch (error) {
      console.error("Create schedule error:", error);
      return {
        EM: `Error creating schedule: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async getDoctorSchedules(doctorId, currentUser) {
    try {
      // Kiểm tra bác sĩ tồn tại
      const doctor = await db.doctor_details.findOne({
        where: { doctor_id: doctorId },
      });

      if (!doctor) {
        return {
          EM: "Doctor not found",
          EC: -1,
          DT: [],
        };
      }

      // Kiểm tra quyền: DOCTOR chỉ có thể xem lịch của chính mình
      if (currentUser.role === "DOCTOR" && currentUser.userId !== doctorId) {
        return {
          EM: "You can only view your own schedule",
          EC: -3,
          DT: [],
        };
      }

      // Lấy lịch làm việc
      const schedules = await db.doctor_schedules.findAll({
        where: { doctor_id: doctorId },
        order: [
          ["schedule_date", "ASC"],
          ["start_time", "ASC"],
        ],
      });

      // Lấy thông tin bác sĩ và user
      const userInfo = await userApiService.getUserById(doctor.user_id);
      console.log("userInfo", userInfo);
      return {
        EM: "Get schedules successfully",
        EC: 0,
        DT: {
          doctor: {
            ...doctor.dataValues,
            user: userInfo,
          },
          schedules,
        },
      };
    } catch (error) {
      console.error("Get schedules error:", error);
      return {
        EM: `Error getting schedules: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async updateSchedule(doctorId, scheduleId, updateData, currentUser) {
    try {
      const schedule = await db.doctor_schedules.findOne({
        where: {
          schedule_id: scheduleId,
          doctor_id: doctorId,
        },
      });

      if (!schedule) {
        return {
          EM: "Schedule not found",
          EC: -1,
          DT: [],
        };
      }

      // Kiểm tra quyền
      if (currentUser.role === "DOCTOR" && currentUser.userId !== doctorId) {
        return {
          EM: "You can only manage your own schedule",
          EC: -3,
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
          EM: "Cannot update time for booked schedule",
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
        EM: "Schedule updated successfully",
        EC: 0,
        DT: schedule,
      };
    } catch (error) {
      console.error("Update schedule error:", error);
      return {
        EM: `Error updating schedule: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }

  async deleteSchedule(doctorId, scheduleId, currentUser) {
    try {
      const schedule = await db.doctor_schedules.findOne({
        where: {
          schedule_id: scheduleId,
          doctor_id: doctorId,
        },
      });

      if (!schedule) {
        return {
          EM: "Schedule not found",
          EC: -1,
          DT: [],
        };
      }

      // Kiểm tra quyền
      if (currentUser.role === "DOCTOR" && currentUser.userId !== doctorId) {
        return {
          EM: "You can only manage your own schedule",
          EC: -3,
          DT: [],
        };
      }

      // Không cho phép xóa lịch đã BOOKED
      if (schedule.status === "BOOKED") {
        return {
          EM: "Cannot delete booked schedule",
          EC: -4,
          DT: [],
        };
      }

      await schedule.destroy();

      return {
        EM: "Schedule deleted successfully",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      console.error("Delete schedule error:", error);
      return {
        EM: `Error deleting schedule: ${error.message}`,
        EC: -1,
        DT: [],
      };
    }
  }
}

export default new DoctorService();
