import doctorService from "../services/doctorService";

class DoctorController {
  // Doctor Management
  async createDoctor(req, res) {
    try {
      const result = await doctorService.createDoctor(req.body);
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
        req.user.userId,
        req.body
      );

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

      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống : " + error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  // Schedule Management
  async getAllSchedules(req, res) {
    try {
      const result = await doctorService.getAllSchedules();
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống : " + error.message,
        EC: -1,
        DT: [],
       
      });
    }
  }

  async createSchedule(req, res) {
    try {
      const { doctorId } = req.params;
      const scheduleData = req.body;

      const result = await doctorService.createSchedule(
        doctorId,
        scheduleData,   
      );
      return res.status(201).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
     return res.status(500).json({
       EM: "Lỗi hệ thống: " + error.message,
       EC: -1,
       DT: [],
     });

    }
  }

  async getDoctorSchedules(req, res) {
    try {
      const { doctorId } = req.params;
      const result = await doctorService.getDoctorSchedules(
        doctorId,
      );
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
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

      const result = await doctorService.updateSchedule(
        doctorId,
        scheduleId,
        updateData,
      );
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống :" + error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async deleteSchedule(req, res) {
    try {
      const { doctorId, scheduleId } = req.params;

      const result = await doctorService.deleteSchedule(
        doctorId,
        scheduleId,
      );
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
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
