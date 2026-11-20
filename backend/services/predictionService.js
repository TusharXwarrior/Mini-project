/**
 * AI Dropout Risk Prediction & Inference Engine
 * Evaluates student academic, attendance, engagement, and financial indicators
 * to compute a realistic dropout risk classification.
 */

function calculateStudentRisk(student) {
  if (!student) return null;

  const attendance = Number(student.attendance ?? 75);
  const cgpa = Number(student.cgpa ?? 7.0);
  const prevCgpa = Number(student.previousCgpa ?? student.prevCgpa ?? cgpa);
  const backlogs = Number(student.backlogs ?? 0);
  const internalMarks = Number(student.internalMarks ?? 35);
  const assignmentCompletion = Number(student.assignmentCompletion ?? 80);
  const classesMissed = Number(student.classesMissed ?? 5);
  const feeStatus = (student.feeStatus || "Paid").trim();
  const scholarship = (student.scholarship || "No").trim();

  let riskPoints = 0;
  const factors = [];

  // 1. Attendance Analysis (Primary Retention Indicator)
  if (attendance < 60) {
    riskPoints += 34;
    factors.push(`Critical attendance shortage (${attendance}% vs 75% required)`);
  } else if (attendance < 75) {
    riskPoints += 20;
    factors.push(`Attendance below mandatory threshold (${attendance}%)`);
  } else if (attendance >= 88) {
    riskPoints -= 8; // Protective factor
  }

  // 2. Academic Performance & Trajectory
  if (cgpa < 5.0) {
    riskPoints += 30;
    factors.push(`Current CGPA in severe danger zone (${cgpa.toFixed(2)}/10.0)`);
  } else if (cgpa < 6.2) {
    riskPoints += 16;
    factors.push(`CGPA in vulnerable margin (${cgpa.toFixed(2)}/10.0)`);
  } else if (cgpa >= 8.2) {
    riskPoints -= 10; // Protective factor
  }

  // Trend from previous semester
  if (cgpa < prevCgpa - 0.6) {
    riskPoints += 12;
    factors.push(`Declining academic trajectory (dropped from ${prevCgpa.toFixed(2)} to ${cgpa.toFixed(2)})`);
  } else if (cgpa > prevCgpa + 0.4) {
    riskPoints -= 5; // Positive improvement
  }

  // 3. Active Backlogs (Major Dropout Predictor)
  if (backlogs >= 3) {
    riskPoints += 28;
    factors.push(`Multiple active backlogs (${backlogs} subjects uncleared)`);
  } else if (backlogs >= 1) {
    riskPoints += 14;
    factors.push(`Active course backlogs (${backlogs} subject${backlogs > 1 ? "s" : ""})`);
  } else {
    riskPoints -= 6; // Clean academic record
  }

  // 4. Internal Marks & Sessional Performance (Scale: 0 - 50)
  if (internalMarks < 20) {
    riskPoints += 14;
    factors.push(`Low internal sessional score (${internalMarks}/50)`);
  } else if (internalMarks < 28) {
    riskPoints += 7;
    factors.push(`Marginal internal marks (${internalMarks}/50)`);
  }

  // 5. Coursework & Assignment Engagement
  if (assignmentCompletion < 55) {
    riskPoints += 16;
    factors.push(`Low coursework submission rate (${assignmentCompletion}%)`);
  } else if (assignmentCompletion < 70) {
    riskPoints += 8;
    factors.push(`Inconsistent assignment completion (${assignmentCompletion}%)`);
  } else if (assignmentCompletion >= 90) {
    riskPoints -= 5;
  }

  // 6. Missed Classes / Absenteeism
  if (classesMissed >= 25) {
    riskPoints += 12;
    factors.push(`High lecture absenteeism (${classesMissed} missed sessions)`);
  }

  // 7. Financial & Administrative Standing
  if (feeStatus === "Pending") {
    riskPoints += 10;
    factors.push("Tuition fee dues pending with administration");
    if (scholarship === "No") {
      riskPoints += 4;
      factors.push("Self-funded without scholarship aid");
    }
  }

  // Baseline calibration and bounds
  const rawScore = 15 + riskPoints;
  const clampedScore = Math.max(5, Math.min(96, Math.round(rawScore)));
  const probability = Number((clampedScore / 100).toFixed(2));

  // Categorize Risk Level
  let riskLevel = "Low Risk";
  let recommendation = "";

  if (clampedScore >= 65) {
    riskLevel = "High Risk";
    recommendation =
      "Immediate intervention recommended. Academic advisor should arrange remedial mentoring sessions, formulate an attendance recovery contract, and connect student with financial aid or counselling support.";
  } else if (clampedScore >= 38) {
    riskLevel = "Medium Risk";
    recommendation =
      "Proactive monitoring advised. Student should be encouraged to maintain attendance above 75%, submit pending assignments, and attend peer tutoring for vulnerable subjects.";
  } else {
    riskLevel = "Low Risk";
    recommendation =
      "Student demonstrates healthy academic progress and consistent engagement. Continue routine faculty check-ins and encourage participation in advanced technical electives.";
  }

  // Default factor if student is doing well
  if (factors.length === 0) {
    factors.push("Consistent attendance record (≥75%)");
    factors.push("Satisfactory cumulative grade performance");
    factors.push("Zero active subject backlogs");
  }

  return {
    riskLevel,
    riskScore: clampedScore,
    probability,
    factors,
    recommendation,
    evaluatedAt: new Date(),
  };
}

module.exports = {
  calculateStudentRisk,
};
