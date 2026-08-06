import express from 'express';
import {
  getAdminDashboard,
  getUsers,
  changeUserRole,
  deleteUser,
  deletePatientRecord,
  getPatientRecord,
  getPatients,
  getAdminDoctors,
  changeDoctorStatus,
  getAddDoctor,
  postAddDoctor,

  getEditDoctor,
  postEditDoctor,
  deleteDoctor,

  getAdminAppointments,
  changeAppointmentStatus,
  deleteAppointment

} from "../controllers/adminController.js";
import { isAuthenticated, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route group configuration: requires both valid JWT and 'admin' DB role
router.use(isAuthenticated, authorizeRoles('admin'));

// Admin root
router.get('/dashboard', getAdminDashboard);

// User Management / Patient Tracking Routes
// router.get('/users', getUsers);
router.post('/users/role/:id', changeUserRole);
router.post('/users/delete-patient/:id', deletePatientRecord);
router.get('/patients', getPatients);
router.get('/patients/:id', getPatientRecord);
router.post('/users/delete/:id', deleteUser);

// Doctor Management Routes
router.get('/doctors', getAdminDoctors);
router.post('/doctors/status/:id', changeDoctorStatus);

// Appointment Management Routes
router.get('/appointments', getAdminAppointments);
router.post('/appointments/status/:id', changeAppointmentStatus);
router.post('/appointments/delete/:id', deleteAppointment);

// Add Doctor Page
router.get("/doctors/add",  getAddDoctor);

router.post("/doctors/add",  postAddDoctor);
router.get("/doctors/edit/:id", getEditDoctor);

router.post("/doctors/edit/:id", postEditDoctor);

router.post("/doctors/delete/:id", deleteDoctor);
export default router;
