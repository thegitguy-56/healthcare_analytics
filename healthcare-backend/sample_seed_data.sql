-- Sample data to populate charts and admin lists
-- Database: healthcare_temporal

-- Doctors
INSERT INTO Doctor (name, specialization)
SELECT s.name, s.specialization
FROM (
	SELECT 'Dr. Emily Carter' AS name, 'General Medicine' AS specialization
	UNION ALL SELECT 'Dr. Rajesh Kumar', 'Pulmonology'
	UNION ALL SELECT 'Dr. Sarah Ahmed', 'Cardiology'
	UNION ALL SELECT 'Dr. David Lee', 'Endocrinology'
) AS s
WHERE NOT EXISTS (
	SELECT 1
	FROM Doctor d
	WHERE d.name = s.name
		AND d.specialization = s.specialization
);

-- Users for login/admin
INSERT INTO Users (username, password, role)
SELECT s.username, s.password, s.role
FROM (
	SELECT 'admin' AS username, 'admin123' AS password, 'Admin' AS role
	UNION ALL SELECT 'doctor1', 'doctor123', 'Doctor'
	UNION ALL SELECT 'nurse1', 'nurse123', 'Nurse'
) AS s
WHERE NOT EXISTS (
	SELECT 1
	FROM Users u
	WHERE u.username = s.username
);

-- Patients (schema uses dob/phone)
INSERT INTO Patient (name, dob, gender, phone)
SELECT s.name, s.dob, s.gender, s.phone
FROM (
	SELECT 'Aarav Singh' AS name, '2001-06-12' AS dob, 'Male' AS gender, '9876500011' AS phone
	UNION ALL SELECT 'Maya Sharma', '1987-03-22', 'Female', '9876500012'
	UNION ALL SELECT 'Liam Joseph', '1975-09-05', 'Male', '9876500013'
	UNION ALL SELECT 'Noah Thomas', '2010-11-14', 'Male', '9876500014'
	UNION ALL SELECT 'Aisha Khan', '1993-01-30', 'Female', '9876500015'
	UNION ALL SELECT 'Rohan Mehta', '1968-07-19', 'Male', '9876500016'
	UNION ALL SELECT 'Sophia Patel', '1981-12-02', 'Female', '9876500017'
	UNION ALL SELECT 'Ishaan Verma', '1959-04-09', 'Male', '9876500018'
) AS s
WHERE NOT EXISTS (
	SELECT 1
	FROM Patient p
	WHERE p.name = s.name
		AND p.dob = s.dob
		AND p.gender = s.gender
		AND p.phone = s.phone
);

-- Diagnosis history (drives disease distribution chart)
INSERT INTO Diagnosis_History (patient_id, doctor_id, disease, valid_from, valid_to)
SELECT s.patient_id, s.doctor_id, s.disease, s.valid_from, s.valid_to
FROM (
	SELECT 1 AS patient_id, 1 AS doctor_id, 'Flu' AS disease, '2025-01-04' AS valid_from, '2025-01-18' AS valid_to
	UNION ALL SELECT 2, 2, 'Asthma', '2025-02-01', '2025-03-10'
	UNION ALL SELECT 3, 3, 'Hypertension', '2025-01-15', '2025-04-30'
	UNION ALL SELECT 4, 1, 'Flu', '2025-03-03', '2025-03-12'
	UNION ALL SELECT 5, 4, 'Diabetes', '2025-02-12', '2025-06-12'
	UNION ALL SELECT 6, 2, 'Pneumonia', '2025-01-27', '2025-03-02'
	UNION ALL SELECT 7, 3, 'Hypertension', '2025-04-01', '2025-08-01'
	UNION ALL SELECT 8, 4, 'Diabetes', '2025-05-10', '2025-09-30'
	UNION ALL SELECT 1, 1, 'Flu', '2025-08-10', '2025-08-19'
	UNION ALL SELECT 2, 2, 'Asthma', '2025-07-08', '2025-09-01'
	UNION ALL SELECT 5, 4, 'Diabetes', '2025-09-03', '2025-12-15'
	UNION ALL SELECT 6, 2, 'Pneumonia', '2025-10-01', '2025-10-28'
) AS s
WHERE NOT EXISTS (
	SELECT 1
	FROM Diagnosis_History dh
	WHERE dh.patient_id = s.patient_id
		AND dh.doctor_id = s.doctor_id
		AND dh.disease = s.disease
		AND dh.valid_from = s.valid_from
		AND dh.valid_to = s.valid_to
);

-- Treatment history (drives duration/trends/status charts)
INSERT INTO Treatment_History (patient_id, treatment_type, medication, valid_from, valid_to)
SELECT s.patient_id, s.treatment_type, s.medication, s.valid_from, s.valid_to
FROM (
	SELECT 1 AS patient_id, 'Antiviral Therapy' AS treatment_type, 'Oseltamivir' AS medication, '2025-01-05' AS valid_from, '2025-01-10' AS valid_to
	UNION ALL SELECT 2, 'Inhalation Therapy', 'Budesonide', '2025-02-02', '2025-02-20'
	UNION ALL SELECT 3, 'Blood Pressure Management', 'Amlodipine', '2025-01-16', '2025-03-31'
	UNION ALL SELECT 4, 'Supportive Care', 'Paracetamol', '2025-03-03', '2025-03-08'
	UNION ALL SELECT 5, 'Glycemic Control', 'Metformin', '2025-02-13', '2025-04-25'
	UNION ALL SELECT 6, 'Antibiotic Course', 'Azithromycin', '2025-01-28', '2025-02-05'
	UNION ALL SELECT 7, 'Cardiac Monitoring', 'Losartan', '2025-04-01', '2025-06-20'
	UNION ALL SELECT 8, 'Insulin Management', 'Insulin Glargine', '2025-05-11', '2025-09-20'
	UNION ALL SELECT 1, 'Follow-up Care', 'Vitamin C', '2025-08-10', '2025-08-14'
	UNION ALL SELECT 2, 'Pulmonary Rehab', 'Montelukast', '2025-07-10', '2025-08-30'
	UNION ALL SELECT 5, 'Diet & Medication Review', 'Metformin', '2025-09-05', '2025-11-02'
	UNION ALL SELECT 6, 'Respiratory Follow-up', 'Levofloxacin', '2025-10-02', '2025-10-25'
	UNION ALL SELECT 3, 'Long-term Management', 'Telmisartan', '2026-01-01', '2026-04-15'
	UNION ALL SELECT 7, 'Advanced Follow-up', 'Atenolol', '2026-02-12', '2026-05-30'
) AS s
WHERE NOT EXISTS (
	SELECT 1
	FROM Treatment_History th
	WHERE th.patient_id = s.patient_id
		AND th.treatment_type = s.treatment_type
		AND th.medication = s.medication
		AND th.valid_from = s.valid_from
		AND th.valid_to = s.valid_to
);

-- Access logs for admin table
INSERT INTO Access_Log (user_role, table_accessed, access_time)
SELECT s.user_role, s.table_accessed, s.access_time
FROM (
	SELECT 'Admin' AS user_role, 'Users' AS table_accessed, '2026-03-20 09:10:00' AS access_time
	UNION ALL SELECT 'Doctor', 'Patient', '2026-03-20 10:22:00'
	UNION ALL SELECT 'Nurse', 'Treatment_History', '2026-03-20 11:40:00'
	UNION ALL SELECT 'Admin', 'Diagnosis_History', '2026-03-21 08:30:00'
	UNION ALL SELECT 'Doctor', 'Patient', '2026-03-21 12:05:00'
	UNION ALL SELECT 'Admin', 'Access_Log', '2026-03-22 14:45:00'
) AS s
WHERE NOT EXISTS (
	SELECT 1
	FROM Access_Log al
	WHERE al.user_role = s.user_role
		AND al.table_accessed = s.table_accessed
		AND al.access_time = s.access_time
);
