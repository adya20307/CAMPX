-- =====================================================
-- CAMPX DATABASE UPGRADE
-- SUPER ADMIN + DEPARTMENT ADMIN + BATCH + HOSTELLER
-- =====================================================

-- =====================================================
-- 1. ADD ROLE INFORMATION TO FACULTY
-- =====================================================

ALTER TABLE faculty
ADD COLUMN IF NOT EXISTS role
ENUM('SUPER_ADMIN', 'ADMIN')
NOT NULL DEFAULT 'ADMIN';

ALTER TABLE faculty
ADD COLUMN IF NOT EXISTS section
VARCHAR(100)
NULL;

ALTER TABLE faculty
ADD COLUMN IF NOT EXISTS is_active
BOOLEAN
NOT NULL DEFAULT TRUE;

-- =====================================================
-- 2. ADD STUDENT BATCH + HOSTELLER STATUS
-- =====================================================

ALTER TABLE students
ADD COLUMN IF NOT EXISTS batch_year
YEAR
NULL;

ALTER TABLE students
ADD COLUMN IF NOT EXISTS hostel_status
ENUM('HOSTELLER', 'NON_HOSTELLER')
NOT NULL DEFAULT 'NON_HOSTELLER';

-- =====================================================
-- 3. BATCHES
-- =====================================================

CREATE TABLE IF NOT EXISTS batches (
    id INT AUTO_INCREMENT PRIMARY KEY,

    batch_year YEAR NOT NULL UNIQUE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. INSERT CURRENT BATCHES
-- =====================================================

INSERT IGNORE INTO batches (batch_year)
VALUES
(2022),
(2024),
(2025),
(2026);

-- =====================================================
-- 5. DEPARTMENTS / SECTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    description TEXT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. CAMPX DEPARTMENTS
-- =====================================================

INSERT IGNORE INTO departments
(name, description)
VALUES

(
    'Documentation',
    'Student records, certificates, admissions and documents'
),

(
    'Accounts',
    'Fees, payments, scholarships and financial records'
),

(
    'Academic/Class',
    'Classes, schedules, attendance and faculty assignments'
),

(
    'Examination',
    'Exams, marks, results and hall tickets'
),

(
    'Notice & Communication',
    'Notices, announcements and campus communication'
),

(
    'Hostel',
    'Hostel management, rooms, mess and hostel services'
),

(
    'Student Affairs',
    'Student activities, requests and student welfare'
),

(
    'Administration',
    'General administration and institutional operations'
),

(
    'IT & Technical Support',
    'Website, login, technical and computer-related issues'
),

(
    'Transport',
    'Campus transportation and bus-related services'
),

(
    'Library',
    'Library books, membership and library services'
),

(
    'Placement & Career',
    'Placements, internships and career services'
),

(
    'Admission & Enrollment',
    'Admissions, enrollment and student registration'
),

(
    'Security & Campus Operations',
    'Security, campus access and safety issues'
),

(
    'Health & Wellness',
    'Medical and student wellness services'
),

(
    'Infrastructure & Maintenance',
    'Electricity, water, classroom and infrastructure issues'
);

-- =====================================================
-- 7. ADMIN ↔ DEPARTMENT RELATIONSHIP
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_departments (

    id INT AUTO_INCREMENT PRIMARY KEY,

    faculty_id VARCHAR(50) NOT NULL,

    department_id INT NOT NULL,

    can_view BOOLEAN NOT NULL DEFAULT TRUE,

    can_create BOOLEAN NOT NULL DEFAULT FALSE,

    can_update BOOLEAN NOT NULL DEFAULT FALSE,

    can_delete BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_admin_department
    (faculty_id, department_id),

    CONSTRAINT fk_admin_department_faculty
    FOREIGN KEY (faculty_id)
    REFERENCES faculty(faculty_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_admin_department_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE
);

-- =====================================================
-- 8. CURRENT STUDENTS
-- =====================================================

-- Existing students who already have a hostel
-- are automatically marked as HOSTELLER.

UPDATE students
SET hostel_status = 'HOSTELLER'
WHERE hostel IS NOT NULL
AND hostel <> '';

-- =====================================================
-- 9. CURRENT STUDENTS
-- =====================================================

-- The first four digits of your existing
-- registration numbers represent the batch.

UPDATE students
SET batch_year =
    CASE
        WHEN LEFT(student_id, 4) = '2401' THEN 2024
        ELSE NULL
    END;

-- =====================================================
-- FINISHED
-- =====================================================

SELECT
    'CAMPX database upgrade completed successfully'
    AS message;