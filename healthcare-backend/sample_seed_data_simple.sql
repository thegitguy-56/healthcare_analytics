-- Simple seed data for PostgreSQL/Supabase
-- Insert in correct order to avoid foreign key issues

-- Clear existing data (optional - comment out if you want to keep data)
DELETE FROM access_log;
DELETE FROM treatment_history;
DELETE FROM diagnosis_history;
DELETE FROM patient;
DELETE FROM doctor;
DELETE FROM users;

-- Reset sequences to start from 1
ALTER SEQUENCE doctor_doctor_id_seq RESTART WITH 1;
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE patient_patient_id_seq RESTART WITH 1;
ALTER SEQUENCE diagnosis_history_diagnosis_id_seq RESTART WITH 1;
ALTER SEQUENCE treatment_history_treatment_id_seq RESTART WITH 1;
ALTER SEQUENCE access_log_log_id_seq RESTART WITH 1;

-- Insert Doctors (first, no dependencies)
INSERT INTO doctor (name, specialization) VALUES
('Dr. Emily Carter', 'General Medicine'),
('Dr. Rajesh Kumar', 'Pulmonology'),
('Dr. Sarah Ahmed', 'Cardiology'),
('Dr. David Lee', 'Endocrinology');

-- Insert Users
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'Admin'),
('doctor1', 'doctor123', 'Doctor'),
('nurse1', 'nurse123', 'Nurse');

-- Insert Patients
INSERT INTO patient (name, dob, gender, phone) VALUES
('Aarav Singh', '2001-06-12'::DATE, 'Male', '9876500011'),
('Maya Sharma', '1987-03-22'::DATE, 'Female', '9876500012'),
('Liam Joseph', '1975-09-05'::DATE, 'Male', '9876500013'),
('Noah Thomas', '2010-11-14'::DATE, 'Male', '9876500014'),
('Aisha Khan', '1993-01-30'::DATE, 'Female', '9876500015'),
('Rohan Mehta', '1968-07-19'::DATE, 'Male', '9876500016'),
('Sophia Patel', '1981-12-02'::DATE, 'Female', '9876500017'),
('Ishaan Verma', '1959-04-09'::DATE, 'Male', '9876500018');

-- Insert Diagnosis History
INSERT INTO diagnosis_history (patient_id, doctor_id, disease, valid_from, valid_to) VALUES
(1, 1, 'Flu', '2025-01-04'::DATE, '2025-01-18'::DATE),
(2, 2, 'Asthma', '2025-02-01'::DATE, '2025-03-10'::DATE),
(3, 3, 'Hypertension', '2025-01-15'::DATE, '2025-04-30'::DATE),
(4, 1, 'Flu', '2025-03-03'::DATE, '2025-03-12'::DATE),
(5, 4, 'Diabetes', '2025-02-12'::DATE, '2025-06-12'::DATE),
(6, 2, 'Pneumonia', '2025-01-27'::DATE, '2025-03-02'::DATE),
(7, 3, 'Hypertension', '2025-04-01'::DATE, '2025-08-01'::DATE),
(8, 4, 'Diabetes', '2025-05-10'::DATE, '2025-09-30'::DATE),
(1, 1, 'Flu', '2025-08-10'::DATE, '2025-08-19'::DATE),
(2, 2, 'Asthma', '2025-07-08'::DATE, '2025-09-01'::DATE),
(5, 4, 'Diabetes', '2025-09-03'::DATE, '2025-12-15'::DATE),
(6, 2, 'Pneumonia', '2025-10-01'::DATE, '2025-10-28'::DATE);

-- Insert Treatment History
INSERT INTO treatment_history (patient_id, treatment_type, medication, valid_from, valid_to) VALUES
(1, 'Antiviral Therapy', 'Oseltamivir', '2025-01-05'::DATE, '2025-01-10'::DATE),
(2, 'Inhalation Therapy', 'Budesonide', '2025-02-02'::DATE, '2025-02-20'::DATE),
(3, 'Blood Pressure Management', 'Amlodipine', '2025-01-16'::DATE, '2025-03-31'::DATE),
(4, 'Supportive Care', 'Paracetamol', '2025-03-03'::DATE, '2025-03-08'::DATE),
(5, 'Glycemic Control', 'Metformin', '2025-02-13'::DATE, '2025-04-25'::DATE),
(6, 'Antibiotic Course', 'Azithromycin', '2025-01-28'::DATE, '2025-02-05'::DATE),
(7, 'Cardiac Monitoring', 'Losartan', '2025-04-01'::DATE, '2025-06-20'::DATE),
(8, 'Insulin Management', 'Insulin Glargine', '2025-05-11'::DATE, '2025-09-20'::DATE),
(1, 'Follow-up Care', 'Vitamin C', '2025-08-10'::DATE, '2025-08-14'::DATE),
(2, 'Pulmonary Rehab', 'Montelukast', '2025-07-10'::DATE, '2025-08-30'::DATE),
(5, 'Diet & Medication Review', 'Metformin', '2025-09-05'::DATE, '2025-11-02'::DATE),
(6, 'Respiratory Follow-up', 'Levofloxacin', '2025-10-02'::DATE, '2025-10-25'::DATE),
(3, 'Long-term Management', 'Telmisartan', '2026-01-01'::DATE, '2026-04-15'::DATE),
(7, 'Advanced Follow-up', 'Atenolol', '2026-02-12'::DATE, '2026-05-30'::DATE);

-- Insert Access Logs
INSERT INTO access_log (user_role, table_accessed, access_time) VALUES
('Admin', 'users', '2026-03-20 09:10:00'::TIMESTAMP),
('Doctor', 'patient', '2026-03-20 10:22:00'::TIMESTAMP),
('Nurse', 'treatment_history', '2026-03-20 11:40:00'::TIMESTAMP),
('Admin', 'diagnosis_history', '2026-03-21 08:30:00'::TIMESTAMP),
('Doctor', 'patient', '2026-03-21 12:05:00'::TIMESTAMP),
('Admin', 'access_log', '2026-03-22 14:45:00'::TIMESTAMP);
