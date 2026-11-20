const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  deleteStudent,
  predictStudent,
  predictDirect,
} = require("../controllers/studentController");

// /api/students
router.route("/").post(createStudent).get(getAllStudents);

// Direct prediction endpoint: /api/students/predict
router.route("/predict").post(predictDirect);

// /api/students/:id
router.route("/:id").get(getStudentById).delete(deleteStudent);

// Student prediction: /api/students/:id/predict
router.route("/:id/predict").post(predictStudent);

module.exports = router;
