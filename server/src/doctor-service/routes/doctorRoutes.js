import express from "express";
import doctorController from "../controllers/doctorController";
import { authenticateToken, checkRole } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Specialization:
 *       type: object
 *       properties:
 *         specialization_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Doctor:
 *       type: object
 *       properties:
 *         doctor_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         position:
 *           type: string
 *         experience_years:
 *           type: number
 *         consultation_fee:
 *           type: number
 *         specialization_id:
 *           type: string
 *           format: uuid
 */

/**
 * @swagger
 * /api/doctors/specializations:
 *   get:
 *     summary: Get all specializations
 *     tags: [Specializations]
 *     responses:
 *       200:
 *         description: List of all specializations
 */
router.get("/specializations", doctorController.getAllSpecializations);

/**
 * @swagger
 * /api/doctors/specializations:
 *   post:
 *     summary: Create a new specialization
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the specialization
 *               description:
 *                 type: string
 *                 description: Description of the specialization
 *     responses:
 *       201:
 *         description: Specialization created successfully
 */
router.post(
  "/specializations",
  authenticateToken,
  checkRole(["ADMIN"]),
  doctorController.createSpecialization
);

/**
 * @swagger
 * /api/doctors/specializations/{id}:
 *   get:
 *     summary: Get specialization details
 *     tags: [Specializations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Specialization ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: "Get specialization success"
 *                 EC:
 *                   type: integer
 *                   example: 0
 *                 DT:
 *                   type: object
 *                   properties:
 *                     specialization_id:
 *                       type: string
 *                       example: "245870e8-637c-4cc6-af0b-2dd88fd8f089"
 *                     name:
 *                       type: string
 *                       example: "Khoa nội"
 *                     description:
 *                       type: string
 *                       example: "Chẩn đoán và điều trị các bệnh nội khoa"
 *       404:
 *         description: Specialization not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: "Specialization not found"
 *                 EC:
 *                   type: integer
 *                   example: -2
 *                 DT:
 *                   type: array
 *                   example: []
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: "Invalid input"
 *                 EC:
 *                   type: integer
 *                   example: -1
 *                 DT:
 *                   type: array
 *                   example: []
 */
router.get("/specializations/:id", doctorController.getSpecializationById);

/**
 * @swagger
 * /api/doctors/specializations/{id}:
 *   put:
 *     summary: Update a specialization
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the specialization to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the specialization
 *                 example: "Khoa Nội"
 *               description:
 *                 type: string
 *                 description: New description of the specialization
 *                 example: "Chẩn đoán và điều trị các bệnh nội khoa"
 *     responses:
 *       200:
 *         description: Specialization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Update specialization success
 *                 EC:
 *                   type: number
 *                   example: 0
 *                 DT:
 *                   $ref: '#/components/schemas/Specialization'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Error updating specialization
 *                 EC:
 *                   type: number
 *                   example: -1
 *                 DT:
 *                   type: array
 *                   example: []
 *       404:
 *         description: Specialization not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Specialization not found
 *                 EC:
 *                   type: number
 *                   example: -2
 *                 DT:
 *                   type: array
 *                   example: []
 */
router.put(
  "/specializations/:id",
  authenticateToken,
  checkRole(["ADMIN"]),
  doctorController.updateSpecialization
);

/**
 * @swagger
 * /api/doctors/specializations/{id}:
 *   delete:
 *     summary: Delete a specialization
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the specialization to delete
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Specialization deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Delete specialization success
 *                 EC:
 *                   type: number
 *                   example: 0
 *                 DT:
 *                   type: array
 *                   example: []
 *       400:
 *         description: Cannot delete specialization in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Cannot delete specialization that is being used by doctors
 *                 EC:
 *                   type: number
 *                   example: -1
 *                 DT:
 *                   type: array
 *                   example: []
 *       404:
 *         description: Specialization not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Specialization not found
 *                 EC:
 *                   type: number
 *                   example: -2
 *                 DT:
 *                   type: array
 *                   example: []
 */
router.delete(
  "/specializations/:id",
  authenticateToken,
  checkRole(["ADMIN"]),
  doctorController.deleteSpecialization
);

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors (Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all doctors
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 */
router.get(
  "/",
  authenticateToken,
  checkRole(["ADMIN"]),
  doctorController.getAllDoctors
);
/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Add doctor details for existing user (Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - specialization_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of existing user with DOCTOR role
 *               specialization_id:
 *                 type: string
 *                 description: ID of the specialization
 *               position:
 *                 type: string
 *                 enum: [NONE, MASTER, DOCTOR, ASSOCIATE PROFESSOR, PROFESSOR]
 *                 default: NONE
 *               experience_years:
 *                 type: integer
 *                 default: 0
 *               consultation_fee:
 *                 type: number
 *                 default: 0
 *     responses:
 *       201:
 *         description: Doctor details added successfully
 *       400:
 *         description: Invalid input or user not found
 *       409:
 *         description: Doctor details already exists for this user
 */
router.post(
  "/",
  authenticateToken,
  checkRole(["ADMIN"]),
  doctorController.createDoctor
);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Get doctor details (Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor details retrieved successfully
 */
router.get(
  "/:id",
  authenticateToken,
  checkRole(["ADMIN", "DOCTOR"]),
  doctorController.getDoctorById
);

/**
 * @swagger
 * /api/doctors/{id}:
 *   put:
 *     summary: Update doctor (Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *
 *               specialization_id:
 *                 type: string
 *               position:
 *                 type: string
 *               experience_years:
 *                 type: number
 *               consultation_fee:
 *                 type: number
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 */
router.put(
  "/:id",
  authenticateToken,
  checkRole(["ADMIN"]),
  doctorController.updateDoctor
);

/**
 * @swagger
 * /api/doctors/{id}/profile:
 *   put:
 *     summary: Update doctor's own profile (Doctor only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               experience_years:
 *                 type: number
 *               consultation_fee:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put(
  "/:id/profile",
  authenticateToken,
  checkRole(["DOCTOR"]),
  doctorController.updateDoctorProfile
);

/**
 * @swagger
 * /api/doctors/{id}:
 *   delete:
 *     summary: Delete doctor (Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 */
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["ADMIN"]),
  doctorController.deleteDoctor
);

/**
 * @swagger
 * /api/doctors/specialization/{specializationId}:
 *   get:
 *     summary: Get all doctors by specialization
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: specializationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doctors in the specialization
 *       404:
 *         description: Specialization not found
 */
router.get(
  "/specialization/:specializationId",
  doctorController.getDoctorsBySpecialization
);

// Schedule Management Routes
/**
 * @swagger
 * /api/doctors/admin/schedules:
 *   get:
 *     summary: Get all doctor schedules (Admin only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all schedules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Get all schedules successfully
 *                 EC:
 *                   type: number
 *                   example: 0
 *                 DT:
 *                   type: object
 *                   properties:
 *                     total_doctors:
 *                       type: number
 *                       example: 10
 *                     total_schedules:
 *                       type: number
 *                       example: 150
 *                     schedules:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           doctor:
 *                             type: object
 *                             properties:
 *                               doctor_id:
 *                                 type: string
 *                               user_id:
 *                                 type: string
 *                               full_name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               phone:
 *                                 type: string
 *                               position:
 *                                 type: string
 *                               experience_years:
 *                                 type: number
 *                               consultation_fee:
 *                                 type: number
 *                               specialization:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   description:
 *                                     type: string
 *                           schedules:
 *                             type: object
 *                             properties:
 *                               today:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Schedule'
 *                               upcoming:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Schedule'
 *                               past:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Schedule'
 *                               all:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Schedule'
 *                           statistics:
 *                             type: object
 *                             properties:
 *                               total:
 *                                 type: number
 *                               available:
 *                                 type: number
 *                               booked:
 *                                 type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         schedule_id:
 *           type: string
 *         schedule_date:
 *           type: string
 *           format: date
 *         start_time:
 *           type: string
 *           format: time
 *         end_time:
 *           type: string
 *           format: time
 *         status:
 *           type: string
 *           enum: [AVAILABLE, BOOKED]
 */
router.get(
  "/admin/schedules",
  authenticateToken,
  checkRole(["ADMIN"]),
  doctorController.getAllSchedules
);

/**
 * @swagger
 * /api/doctors/{doctorId}/schedules:
 *   post:
 *     summary: Create schedule (ADMIN for any doctor, DOCTOR for self only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schedule_date
 *               - start_time
 *               - end_time
 *             properties:
 *               schedule_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-05"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "07:00:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "09:00:00"
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Schedule created successfully
 *                 EC:
 *                   type: number
 *                   example: 0
 *                 DT:
 *                   type: object
 *       400:
 *         description: Invalid input or duplicate schedule
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Invalid role or not own schedule
 */
router.post(
  "/:doctorId/schedules",
  authenticateToken,
  checkRole(["ADMIN", "DOCTOR"]),
  doctorController.createSchedule
);

/**
 * @swagger
 * /api/doctors/{doctorId}/schedules/{scheduleId}:
 *   put:
 *     summary: Update schedule (ADMIN for any doctor, DOCTOR for self only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schedule_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-05"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "07:00:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "09:00:00"
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, BOOKED]
 *                 example: "AVAILABLE"
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Schedule updated successfully
 *                 EC:
 *                   type: number
 *                   example: 0
 *                 DT:
 *                   type: object
 *       400:
 *         description: Invalid input or schedule not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Invalid role or not own schedule
 */
router.put(
  "/:doctorId/schedules/:scheduleId",
  authenticateToken,
  checkRole(["ADMIN", "DOCTOR"]),
  doctorController.updateSchedule
);

/**
 * @swagger
 * /api/doctors/{doctorId}/schedules:
 *   get:
 *     summary: Get doctor's schedules (ADMIN for any doctor, DOCTOR for self only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor
 *     responses:
 *       200:
 *         description: Doctor's schedules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Get schedules successfully
 *                 EC:
 *                   type: number
 *                   example: 0
 *                 DT:
 *                   type: object
 *                   properties:
 *                     doctor:
 *                       type: object
 *                     schedules:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Invalid role or not own schedule
 */
router.get(
  "/:doctorId/schedules",
  authenticateToken,
  checkRole(["ADMIN", "DOCTOR"]),
  doctorController.getDoctorSchedules
);

/**
 * @swagger
 * /api/doctors/{doctorId}/schedules/{scheduleId}:
 *   delete:
 *     summary: Delete schedule (ADMIN for any doctor, DOCTOR for self only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the schedule
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EM:
 *                   type: string
 *                   example: Schedule deleted successfully
 *                 EC:
 *                   type: number
 *                   example: 0
 *                 DT:
 *                   type: array
 *                   example: []
 *       400:
 *         description: Schedule not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Invalid role or not own schedule
 */
router.delete(
  "/:doctorId/schedules/:scheduleId",
  authenticateToken,
  checkRole(["ADMIN", "DOCTOR"]),
  doctorController.deleteSchedule
);

export default router;
