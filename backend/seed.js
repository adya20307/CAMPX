const bcrypt = require("bcryptjs");
const db = require("./db");

async function seedUsers() {
  try {
    const students = [
      ["2401289031", "Adya Anwesha Dash", "adya@campx.edu", "adya240", "CSE", "6th Semester", "A", "Hostel A", "A-204", "9876543210"],
      ["2401289277", "Subham Sahoo", "subham@campx.edu", "student123", "CSIT", "6th Semester", "A", "Hostel A", "A-206", "9876543215"],
      ["2401289294", "Bhagyalaxmi Kar", "bhagyalaxmi@campx.edu", "student123", "CST", "6th Semester", "A", "Hostel A", "A-207", "9876543216"],
      ["2401289078", "Jingyasha Mishra", "jingyasha@campx.edu", "student123", "CSE", "6th Semester", "A", "Hostel A", "A-208", "9876543217"],
      ["2401289156", "Swayam Prajna Mohanty", "swayam@campx.edu", "student123", "CSE", "6th Semester", "A", "Hostel A", "A-209", "9876543218"],
      ["2401289053", "Baijyanti Dash", "baijyanti@campx.edu", "student123", "CSE", "6th Semester", "A", "Hostel A", "A-210", "9876543219"],
      ["2401289032", "Rohan Mehta", "rohan@campx.edu", "student123", "CSE", "6th Semester", "A", "Hostel A", "A-205", "9876543211"],
      ["2401289033", "Priya Nair", "priya@campx.edu", "student123", "ECE", "6th Semester", "B", "Hostel B", "B-112", "9876543212"],
      ["2401289034", "Arjun Patnaik", "arjun@campx.edu", "student123", "EEE", "4th Semester", "A", "Hostel C", "C-018", "9876543213"],
      ["2401289035", "Sneha Kulkarni", "sneha@campx.edu", "student123", "IT", "4th Semester", "B", "Hostel B", "B-118", "9876543214"],
    ];

    const studentPasswordHashes = await Promise.all(
      students.map((student) => bcrypt.hash(student[3], 10))
    );

    for (const [index, student] of students.entries()) {
      await db.query(
        `INSERT INTO students
        (student_id, name, email, password_hash, branch, semester, section, hostel, room, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name), email = VALUES(email), password_hash = VALUES(password_hash),
          branch = VALUES(branch), semester = VALUES(semester), section = VALUES(section),
          hostel = VALUES(hostel), room = VALUES(room), phone = VALUES(phone)`,
        [student[0], student[1], student[2], studentPasswordHashes[index], ...student.slice(4)]
      );
    }

    const faculty = [
      ["FAC001", "Dr. S. R. Das", "admin@campx.edu", "admin123", "Administrator", "Computer Science & Engineering"],
      ["FAC005", "Aditya Narayan Das", "aditya.das@campx.edu", "admin123", "Assistant Professor", "Computer Science & Engineering"],
      ["FAC002", "Dr. Meera Rao", "meera.rao@campx.edu", "admin123", "Professor", "Electronics & Communication"],
      ["FAC003", "Prof. Kunal Singh", "kunal.singh@campx.edu", "admin123", "Associate Professor", "Electrical Engineering"],
      ["FAC004", "Dr. Nisha Verma", "nisha.verma@campx.edu", "admin123", "Head of Department", "Information Technology"],
    ];

    const facultyPasswordHashes = await Promise.all(
      faculty.map((member) => bcrypt.hash(member[3], 10))
    );

    for (const [index, member] of faculty.entries()) {
      await db.query(
        `INSERT INTO faculty
        (faculty_id, name, email, password_hash, designation, department)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name), email = VALUES(email), password_hash = VALUES(password_hash),
          designation = VALUES(designation), department = VALUES(department)`,
        [member[0], member[1], member[2], facultyPasswordHashes[index], member[4], member[5]]
      );
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS hackathon_teams (
        id INT NOT NULL AUTO_INCREMENT,
        team_name VARCHAR(100) NOT NULL,
        event_name VARCHAR(200) NOT NULL,
        event_date DATE NOT NULL,
        institution VARCHAR(200) NOT NULL,
        mentor_faculty_id VARCHAR(20) NOT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_team_event (team_name, event_name),
        CONSTRAINT fk_team_mentor FOREIGN KEY (mentor_faculty_id)
          REFERENCES faculty(faculty_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS hackathon_team_members (
        team_id INT NOT NULL,
        student_id VARCHAR(20) NOT NULL,
        PRIMARY KEY (team_id, student_id),
        CONSTRAINT fk_member_team FOREIGN KEY (team_id)
          REFERENCES hackathon_teams(id) ON DELETE CASCADE,
        CONSTRAINT fk_member_student FOREIGN KEY (student_id)
          REFERENCES students(student_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await db.query(
      `INSERT INTO hackathon_teams
       (team_name, event_name, event_date, institution, mentor_faculty_id)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         event_date = VALUES(event_date), institution = VALUES(institution),
         mentor_faculty_id = VALUES(mentor_faculty_id)`,
      [
        "COREX",
        "BPUT Hackathon 2026",
        "2026-09-09",
        "Trident Academy of Technology",
        "FAC005",
      ]
    );

    const [[team]] = await db.query(
      "SELECT id FROM hackathon_teams WHERE team_name = ? AND event_name = ?",
      ["COREX", "BPUT Hackathon 2026"]
    );

    for (const studentId of [
      "2401289031",
      "2401289277",
      "2401289294",
      "2401289078",
      "2401289156",
      "2401289053",
    ]) {
      await db.query(
        `INSERT IGNORE INTO hackathon_team_members (team_id, student_id)
         VALUES (?, ?)`,
        [team.id, studentId]
      );
    }

    console.log("");
    console.log("======================================");
    console.log("       CAMPX USERS CREATED");
    console.log("======================================");
    console.log("");
    console.log("STUDENT ACCOUNTS: 10");
    console.log("Existing account: 2401289031 / adya240");
    console.log("Additional accounts: student123 password");
    console.log("");
    console.log("FACULTY ACCOUNTS: 5");
    console.log("Faculty IDs: FAC001-FAC005 / admin123");
    console.log("TEAM: COREX / BPUT Hackathon 2026 / 6 members");
    console.log("");
    console.log("Users inserted successfully ✅");
    console.log("======================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create users:");
    console.error(error.message);
    process.exit(1);
  }
}

seedUsers();