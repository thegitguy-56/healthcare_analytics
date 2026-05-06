-- =====================================================
-- FULL HEALTHCARE TEMPORAL DATABASE SEED DATA
-- =====================================================

-- Clear existing data (in correct order to avoid foreign key constraint issues)
DELETE FROM access_log;
DELETE FROM treatment_history;
DELETE FROM diagnosis_history;
DELETE FROM patient;
DELETE FROM doctor;
DELETE FROM users;

-- Reset sequences to start from 1
ALTER SEQUENCE doctor_doctor_id_seq RESTART WITH 1;
ALTER SEQUENCE patient_patient_id_seq RESTART WITH 1;
ALTER SEQUENCE diagnosis_history_diagnosis_id_seq RESTART WITH 1;
ALTER SEQUENCE treatment_history_treatment_id_seq RESTART WITH 1;
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE access_log_log_id_seq RESTART WITH 1;

-- =========================
-- PATIENT DATA
-- =========================

INSERT INTO patient (name, dob, gender, phone) VALUES
('Rahul Sharma', '1998-05-10', 'Male', '9876543210'),
('Anita Patel', '2001-03-15', 'Female', '9123456780'),
('Kiran Reddy', '1995-08-20', 'Male', '9988776655'),
('Sneha Iyer', '1999-11-02', 'Female', '9090909090'),
('Arjun Verma', '2002-06-25', 'Male', '8888888888'),
('Priya Nair', '1997-04-17', 'Female', '9012345678'),
('Vikram Singh', '1993-09-09', 'Male', '9871209871'),
('Meera Joshi', '2000-12-14', 'Female', '9001122334'),
('Rohit Kumar', '1996-07-30', 'Male', '9445566778'),
('Divya Rao', '2003-02-18', 'Female', '9556677889'),
('Akash Menon', '1994-03-11', 'Male', '9000011111'),
('Neha Kapoor', '2001-09-19', 'Female', '9000022222'),
('Sanjay Das', '1992-06-28', 'Male', '9000033333'),
('Pooja Sharma', '1998-12-05', 'Female', '9000044444'),
('Manoj Kumar', '1990-08-15', 'Male', '9000055555'),
('Aishwarya Rao', '2002-01-20', 'Female', '9000066666'),
('Harish Patel', '1996-11-17', 'Male', '9000077777'),
('Keerthana S', '1999-07-14', 'Female', '9000088888'),
('Naveen Raj', '1995-04-30', 'Male', '9000099999'),
('Lavanya Iyer', '2000-10-08', 'Female', '9111100000'),
('Gokul Krishna', '1993-02-22', 'Male', '9222200000'),
('Swetha Reddy', '1997-05-27', 'Female', '9333300000'),
('Aditya Singh', '2001-06-12', 'Male', '9444400000'),
('Nithya Devi', '1998-09-09', 'Female', '9555500000'),
('Pranav Joshi', '1994-01-18', 'Male', '9666600000');

-- =========================
-- DOCTOR DATA
-- =========================

INSERT INTO doctor (name, specialization) VALUES
('Dr. Mehta', 'Cardiology'),
('Dr. Reddy', 'Neurology'),
('Dr. Sharma', 'General Medicine'),
('Dr. Priya', 'Dermatology'),
('Dr. Arvind', 'Orthopedics'),
('Dr. Kavya', 'Pulmonology'),
('Dr. Vivek', 'ENT'),
('Dr. Monica', 'Pediatrics'),
('Dr. Karthik', 'Oncology'),
('Dr. Sonia', 'Psychiatry');

-- =========================
-- APPOINTMENT DATA
-- =========================

-- Note: Appointment table doesn't exist in current schema
-- If you need appointments, please add the table to the schema

-- =========================
-- DIAGNOSIS HISTORY
-- =========================

INSERT INTO diagnosis_history (patient_id, doctor_id, disease, valid_from, valid_to) VALUES
(1,1,'Flu','2024-01-01','2024-01-10'),
(1,1,'Pneumonia','2024-01-11','2024-02-15'),
(2,2,'Diabetes','2024-02-01','2024-03-01'),
(2,2,'Hypertension','2024-03-15',NULL),
(3,3,'Flu','2024-02-05','2024-02-12'),
(3,6,'Asthma','2024-04-01',NULL),
(4,4,'Skin Allergy','2024-03-01','2024-03-10'),
(5,3,'Fever','2024-03-05','2024-03-12'),
(6,6,'Bronchitis','2024-04-10','2024-04-25'),
(7,1,'Heart Disease','2024-04-12',NULL),
(8,3,'Migraine','2024-05-10','2024-05-20'),
(9,2,'Diabetes','2024-05-25',NULL),
(10,4,'Skin Infection','2024-06-01','2024-06-15'),
(1,3,'Fever','2024-06-10','2024-06-15'),
(5,6,'Asthma','2024-06-18',NULL),
(8,3,'Flu','2024-07-01','2024-07-07'),
(9,5,'Joint Pain','2024-07-03',NULL),
(4,4,'Eczema','2024-07-05',NULL),
(11,7,'Sinusitis','2024-07-01','2024-07-10'),
(12,8,'Viral Fever','2024-07-02','2024-07-08'),
(13,9,'Cancer Screening','2024-07-03',NULL),
(14,10,'Anxiety','2024-07-04',NULL),
(15,3,'Flu','2024-07-05','2024-07-11'),
(16,2,'Migraine','2024-07-06','2024-07-15'),
(17,5,'Arthritis','2024-07-07',NULL),
(18,1,'Heart Disease','2024-07-08',NULL),
(19,4,'Psoriasis','2024-07-09',NULL),
(20,6,'Asthma','2024-07-10',NULL),
(21,7,'Ear Infection','2024-07-11','2024-07-18'),
(22,8,'Pneumonia','2024-07-12','2024-07-22'),
(23,9,'Tumor Analysis','2024-07-13',NULL),
(24,10,'Depression','2024-07-14',NULL),
(25,2,'Diabetes','2024-07-15',NULL),
(11,7,'Throat Infection','2024-08-01','2024-08-07'),
(12,8,'Flu','2024-08-02','2024-08-09'),
(13,9,'Leukemia','2024-08-03',NULL),
(14,10,'Stress Disorder','2024-08-04',NULL),
(15,3,'Food Poisoning','2024-08-05','2024-08-11'),
(16,2,'Hypertension','2024-08-06',NULL),
(17,5,'Joint Pain','2024-08-07',NULL),
(18,1,'Cardiac Arrhythmia','2024-08-08',NULL),
(19,4,'Skin Allergy','2024-08-09','2024-08-16'),
(20,6,'Bronchitis','2024-08-10','2024-08-20'),
(21,7,'Hearing Loss','2024-08-11',NULL),
(22,8,'Dengue','2024-08-12','2024-08-25'),
(23,9,'Cancer Follow-up','2024-08-13',NULL),
(24,10,'Insomnia','2024-08-14',NULL),
(25,2,'Diabetes','2024-08-15',NULL),
(11,3,'Fever','2024-09-01','2024-09-05'),
(12,3,'Flu','2024-09-02','2024-09-06'),
(13,1,'Chest Pain','2024-09-03',NULL),
(14,10,'Anxiety','2024-09-04',NULL),
(15,5,'Knee Pain','2024-09-05',NULL),
(16,2,'Migraine','2024-09-06','2024-09-10'),
(17,5,'Back Pain','2024-09-07',NULL),
(18,1,'Hypertension','2024-09-08',NULL),
(19,4,'Acne','2024-09-09','2024-09-14'),
(20,6,'Asthma','2024-09-10',NULL);

-- =========================
-- TREATMENT HISTORY
-- =========================

INSERT INTO treatment_history (patient_id, treatment_type, medication, valid_from, valid_to) VALUES
(1,'Medication','Paracetamol','2024-01-01','2024-01-10'),
(1,'Respiratory Therapy','Ventolin','2024-01-11','2024-02-10'),
(2,'Insulin Therapy','Insulin','2024-02-01','2024-03-01'),
(2,'BP Control','Amlodipine','2024-03-15',NULL),
(3,'Medication','Antibiotics','2024-02-05','2024-02-12'),
(3,'Inhaler','Salbutamol','2024-04-01',NULL),
(4,'Topical Treatment','Ointment','2024-03-01','2024-03-10'),
(5,'Medication','Paracetamol','2024-03-05','2024-03-12'),
(6,'Respiratory Therapy','Azithromycin','2024-04-10','2024-04-25'),
(7,'Cardiac Monitoring','Beta Blockers','2024-04-12',NULL),
(8,'Neurological Therapy','Painkillers','2024-05-10','2024-05-20'),
(9,'Insulin Therapy','Insulin','2024-05-25',NULL),
(10,'Skin Treatment','Antifungal Cream','2024-06-01','2024-06-15'),
(5,'Inhaler','Budesonide','2024-06-18',NULL),
(9,'Physiotherapy','Pain Relief Gel','2024-07-03',NULL),
(11,'ENT Medication','Cetirizine','2024-07-01','2024-07-10'),
(12,'Fever Treatment','Paracetamol','2024-07-02','2024-07-08'),
(13,'Chemotherapy','Cancer Drugs','2024-07-03',NULL),
(14,'Counselling','Therapy Sessions','2024-07-04',NULL),
(15,'Medication','Antibiotics','2024-07-05','2024-07-11'),
(16,'Neurological Therapy','Painkillers','2024-07-06','2024-07-15'),
(17,'Physiotherapy','Pain Relief Gel','2024-07-07',NULL),
(18,'Cardiac Monitoring','Beta Blockers','2024-07-08',NULL),
(19,'Skin Treatment','Steroid Cream','2024-07-09',NULL),
(20,'Inhaler Therapy','Salbutamol','2024-07-10',NULL),
(21,'ENT Treatment','Hearing Drops','2024-07-11','2024-07-18'),
(22,'Respiratory Therapy','Azithromycin','2024-07-12','2024-07-22'),
(23,'Cancer Therapy','Radiation','2024-07-13',NULL),
(24,'Mental Therapy','Sleep Medication','2024-07-14',NULL),
(25,'Insulin Therapy','Insulin','2024-07-15',NULL),
(11,'Medication','Cough Syrup','2024-08-01','2024-08-07'),
(12,'Medication','Antibiotics','2024-08-02','2024-08-09'),
(13,'Cancer Monitoring','Target Therapy','2024-08-03',NULL),
(14,'Stress Therapy','Meditation','2024-08-04',NULL),
(15,'Hydration Therapy','ORS','2024-08-05','2024-08-11'),
(16,'BP Control','Amlodipine','2024-08-06',NULL),
(17,'Orthopedic Therapy','Calcium Supplements','2024-08-07',NULL),
(18,'Heart Monitoring','ECG Monitoring','2024-08-08',NULL),
(19,'Skin Therapy','Ointment','2024-08-09','2024-08-16'),
(20,'Respiratory Therapy','Nebulizer','2024-08-10','2024-08-20');

-- =========================
-- USERS DATA
-- =========================

INSERT INTO users (username, password, role) VALUES
('admin','admin123','admin'),
('admin2','admin123','admin'),
('admin3','admin123','admin'),
('doctor1','doc123','doctor'),
('doctor2','doc123','doctor'),
('doctor3','doc123','doctor'),
('doctor4','doc123','doctor'),
('doctor5','doc123','doctor'),
('nurse1','nurse123','nurse'),
('nurse2','nurse123','nurse'),
('nurse3','nurse123','nurse'),
('nurse4','nurse123','nurse'),
('nurse5','nurse123','nurse');

-- =========================
-- ACCESS LOG DATA
-- =========================

INSERT INTO access_log (user_role, table_accessed) VALUES
('admin','Patient'),
('admin','Users'),
('doctor','Diagnosis_History'),
('doctor','Treatment_History'),
('nurse','Patient'),
('doctor','Appointment'),
('admin','Access_Log'),
('nurse','Treatment_History'),
('doctor','Patient'),
('admin','Diagnosis_History'),
('doctor','Appointment'),
('doctor','Diagnosis_History'),
('nurse','Patient'),
('admin','Users'),
('doctor','Treatment_History'),
('admin','Patient'),
('nurse','Treatment_History'),
('doctor','Diagnosis_History'),
('admin','Access_Log'),
('doctor','Appointment'),
('nurse','Patient'),
('doctor','Treatment_History'),
('admin','Users'),
('doctor','Diagnosis_History'),
('nurse','Appointment');
