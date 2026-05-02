-- Healthcare Database Schema for PostgreSQL/Supabase

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Doctor table
CREATE TABLE IF NOT EXISTS doctor (
  doctor_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Patient table
CREATE TABLE IF NOT EXISTS patient (
  patient_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  dob DATE,
  gender VARCHAR(50),
  phone VARCHAR(20),
  age INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Diagnosis_History table
CREATE TABLE IF NOT EXISTS diagnosis_history (
  diagnosis_id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES patient(patient_id) ON DELETE CASCADE,
  doctor_id INT NOT NULL REFERENCES doctor(doctor_id) ON DELETE CASCADE,
  disease VARCHAR(255),
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Treatment_History table
CREATE TABLE IF NOT EXISTS treatment_history (
  treatment_id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES patient(patient_id) ON DELETE CASCADE,
  treatment_type VARCHAR(255),
  medication VARCHAR(255),
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Access_Log table
CREATE TABLE IF NOT EXISTS access_log (
  log_id SERIAL PRIMARY KEY,
  user_role VARCHAR(50),
  table_accessed VARCHAR(255),
  access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_diagnosis_patient ON diagnosis_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_doctor ON diagnosis_history(doctor_id);
CREATE INDEX IF NOT EXISTS idx_treatment_patient ON treatment_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_access_log_time ON access_log(access_time);
