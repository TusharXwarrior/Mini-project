const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  deleteStudent,
} = require("../controllers/studentController");

// /api/students
router.route("/").post(createStudent).get(getAllStudents);

// /api/students/:id
router.route("/:id").get(getStudentById).delete(deleteStudent);

module.exports = router;
