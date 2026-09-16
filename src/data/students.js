// Demo student records for showcase (Part 1 - Data Collection Prototype)

export const initialStudents = [
  {
    id: "STU-2024-001",
    name: "Aarav Sharma",
    age: 20,
    gender: "Male",
    branch: "Computer Science",
    semester: "4th Semester",
    cgpa: 8.85,
    prevCgpa: 8.70,
    backlogs: 0,
    internalMarks: 44,
    attendance: 92,
    assignmentCompletion: 95,
    classesMissed: 6,
    scholarship: "Yes",
    feeStatus: "Paid"
  },
  {
    id: "STU-2024-002",
    name: "Ananya Patel",
    age: 19,
    gender: "Female",
    branch: "Information Technology",
    semester: "3rd Semester",
    cgpa: 7.40,
    prevCgpa: 7.60,
    backlogs: 1,
    internalMarks: 36,
    attendance: 78,
    assignmentCompletion: 80,
    classesMissed: 18,
    scholarship: "No",
    feeStatus: "Paid"
  },
  {
    id: "STU-2024-003",
    name: "Rohan Verma",
    age: 21,
    gender: "Male",
    branch: "Mechanical Engineering",
    semester: "6th Semester",
    cgpa: 5.90,
    prevCgpa: 6.20,
    backlogs: 3,
    internalMarks: 28,
    attendance: 64,
    assignmentCompletion: 60,
    classesMissed: 28,
    scholarship: "No",
    feeStatus: "Pending"
  },
  {
    id: "STU-2024-004",
    name: "Sneha Mukherjee",
    age: 20,
    gender: "Female",
    branch: "Electronics & Communication",
    semester: "4th Semester",
    cgpa: 9.15,
    prevCgpa: 9.00,
    backlogs: 0,
    internalMarks: 47,
    attendance: 96,
    assignmentCompletion: 98,
    classesMissed: 3,
    scholarship: "Yes",
    feeStatus: "Paid"
  },
  {
    id: "STU-2024-005",
    name: "Vikram Reddy",
    age: 22,
    gender: "Male",
    branch: "Civil Engineering",
    semester: "6th Semester",
    cgpa: 6.10,
    prevCgpa: 6.00,
    backlogs: 2,
    internalMarks: 31,
    attendance: 69,
    assignmentCompletion: 68,
    classesMissed: 24,
    scholarship: "No",
    feeStatus: "Paid"
  },
  {
    id: "STU-2024-006",
    name: "Pooja Deshmukh",
    age: 19,
    gender: "Female",
    branch: "Computer Science",
    semester: "2nd Semester",
    cgpa: 8.30,
    prevCgpa: 8.10,
    backlogs: 0,
    internalMarks: 42,
    attendance: 88,
    assignmentCompletion: 90,
    classesMissed: 9,
    scholarship: "No",
    feeStatus: "Paid"
  },
  {
    id: "STU-2024-007",
    name: "Aditya Nair",
    age: 21,
    gender: "Male",
    branch: "Electrical Engineering",
    semester: "5th Semester",
    cgpa: 5.40,
    prevCgpa: 5.80,
    backlogs: 4,
    internalMarks: 25,
    attendance: 58,
    assignmentCompletion: 50,
    classesMissed: 35,
    scholarship: "No",
    feeStatus: "Pending"
  },
  {
    id: "STU-2024-008",
    name: "Meera Krishnan",
    age: 20,
    gender: "Female",
    branch: "Data Science & AI",
    semester: "4th Semester",
    cgpa: 8.90,
    prevCgpa: 8.75,
    backlogs: 0,
    internalMarks: 46,
    attendance: 94,
    assignmentCompletion: 92,
    classesMissed: 5,
    scholarship: "Yes",
    feeStatus: "Paid"
  },
  {
    id: "STU-2024-009",
    name: "Karan Johar Malhotra",
    age: 21,
    gender: "Male",
    branch: "Information Technology",
    semester: "5th Semester",
    cgpa: 6.70,
    prevCgpa: 7.00,
    backlogs: 1,
    internalMarks: 34,
    attendance: 73,
    assignmentCompletion: 75,
    classesMissed: 21,
    scholarship: "No",
    feeStatus: "Paid"
  },
  {
    id: "STU-2024-010",
    name: "Divya Sengupta",
    age: 20,
    gender: "Female",
    branch: "Computer Science",
    semester: "4th Semester",
    cgpa: 7.80,
    prevCgpa: 7.90,
    backlogs: 0,
    internalMarks: 39,
    attendance: 84,
    assignmentCompletion: 85,
    classesMissed: 13,
    scholarship: "No",
    feeStatus: "Paid"
  }
];

const LOCAL_STORAGE_KEY = "edurisk_students";
const LATEST_SUBMISSION_KEY = "edurisk_latest_submission";

export const getStoredStudents = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStudents));
      return initialStudents;
    }
    return JSON.parse(data);
  } catch {
    return initialStudents;
  }
};

export const saveStudent = (newStudent) => {
  try {
    const existing = getStoredStudents();
    const updated = [newStudent, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LATEST_SUBMISSION_KEY, JSON.stringify(newStudent));
    return updated;
  } catch (error) {
    console.error("Failed to save student:", error);
    return initialStudents;
  }
};

export const getLatestSubmission = () => {
  try {
    const data = localStorage.getItem(LATEST_SUBMISSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
