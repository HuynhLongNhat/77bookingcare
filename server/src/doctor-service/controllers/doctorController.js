import doctorService from "../services/doctorService";

class DoctorController {
  // Doctor Management
  async createDoctor(req, res) {
    try {
      const result = await doctorService.createDoctor(req.body);
      const statusCode = result.EC === 0 ? 201 : 400;
      return res.status(statusCode).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async getAllDoctors(req, res) {
    try {
      const result = await doctorService.getAllDoctors();
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(400).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async getDoctorById(req, res) {
    try {
      const result = await doctorService.getDoctorById(req.params.id);

      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async updateDoctor(req, res) {
    try {
      const result = await doctorService.updateDoctor(req.params.id, req.body);

      if (result.EC === -2) {
        return res.status(404).json({
          EM: result.EM,
          EC: result.EC,
          DT: result.DT,
        });
      }

      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async updateDoctorProfile(req, res) {
    try {
      // Verify that the requesting doctor is updating their own profile
      if (req.user.userId !== req.params.id) {
        return res.status(403).json({
          EM: "You can only update your own profile",
          EC: -1,
          DT: [],
        });
      }

      const result = await doctorService.updateDoctorProfile(
        req.params.id,
        req.body
      );

      if (result.EC === -2) {
        return res.status(404).json({
          EM: result.EM,
          EC: result.EC,
          DT: result.DT,
        });
      }

      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async deleteDoctor(req, res) {
    try {
      const result = await doctorService.deleteDoctor(req.params.id);

      if (result.EC === -2) {
        return res.status(404).json({
          EM: result.EM,
          EC: result.EC,
          DT: result.DT,
        });
      }

      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  // Specialization Management
  async createSpecialization(req, res) {
    try {
      const result = await doctorService.createSpecialization(req.body);
      return res.status(201).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(400).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async getAllSpecializations(req, res) {
    try {
      const result = await doctorService.getAllSpecializations();
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(400).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async getSpecializationById(req, res) {
    try {
      const result = await doctorService.getSpecializationById(req.params.id);
      if (result.EC === -2) {
        return res.status(404).json({
          EM: result.EM,
          EC: result.EC,
          DT: result.DT,
        });
      }
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(400).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async updateSpecialization(req, res) {
    try {
      const result = await doctorService.updateSpecialization(
        req.params.id,
        req.body
      );
      if (result.EC === -2) {
        return res.status(404).json({
          EM: result.EM,
          EC: result.EC,
          DT: result.DT,
        });
      }
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(400).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async deleteSpecialization(req, res) {
    try {
      const result = await doctorService.deleteSpecialization(req.params.id);
      if (result.EC === -2) {
        return res.status(404).json({
          EM: result.EM,
          EC: result.EC,
          DT: result.DT,
        });
      }
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(400).json({
        EM: error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async getDoctorsBySpecialization(req, res) {
    try {
      const { specializationId } = req.params;
      const result = await doctorService.getDoctorsBySpecialization(
        specializationId
      );

      if (result.EC !== 0) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        EM: "Error getting doctors by specialization",
        EC: -1,
        DT: [],
      });
    }
  }

  // Schedule Management
  async getAllSchedules(req, res) {
    try {
      // Kiểm tra quyền ADMIN (thêm layer bảo mật)
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({
          EM: "You don't have permission to access this resource",
          EC: -3,
          DT: [],
        });
      }

      const result = await doctorService.getAllSchedules();

      // Xử lý các trường hợp lỗi
      if (result.EC !== 0) {
        const statusCode = result.EC === -1 ? 500 : 400;
        return res.status(statusCode).json(result);
      }

      // Thêm metadata vào response
      const response = {
        ...result,
        metadata: {
          timestamp: new Date().toISOString(),
          admin_id: req.user.userId,
        },
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Controller - Get all schedules error:", error);
      return res.status(500).json({
        EM: "Internal server error while getting schedules",
        EC: -1,
        DT: [],
        error: {
          message: error.message,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
      });
    }
  }

  async createSchedule(req, res) {
    try {
      const { doctorId } = req.params;
      const scheduleData = req.body;
      const currentUser = req.user;

      const result = await doctorService.createSchedule(
        doctorId,
        scheduleData,
        currentUser
      );
      if (result.EC !== 0) {
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        EM: "Error creating schedule",
        EC: -1,
        DT: [],
      });
    }
  }

  async getDoctorSchedules(req, res) {
    try {
      const { doctorId } = req.params;
      const currentUser = req.user;

      const result = await doctorService.getDoctorSchedules(
        doctorId,
        currentUser
      );
      if (result.EC !== 0) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        EM: "Error getting schedules",
        EC: -1,
        DT: [],
      });
    }
  }

  async updateSchedule(req, res) {
    try {
      const { doctorId, scheduleId } = req.params;
      const updateData = req.body;
      const currentUser = req.user;

      const result = await doctorService.updateSchedule(
        doctorId,
        scheduleId,
        updateData,
        currentUser
      );

      if (result.EC !== 0) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        EM: "Error updating schedule",
        EC: -1,
        DT: [],
      });
    }
  }

  async deleteSchedule(req, res) {
    try {
      const { doctorId, scheduleId } = req.params;
      const currentUser = req.user;

      const result = await doctorService.deleteSchedule(
        doctorId,
        scheduleId,
        currentUser
      );
      if (result.EC !== 0) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        EM: "Error deleting schedule",
        EC: -1,
        DT: [],
      });
    }
  }
}

export default new DoctorController();
