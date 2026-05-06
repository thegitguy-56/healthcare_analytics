const fs = require("fs")
const { Client } = require("pg")
require("dotenv").config()

async function loadSeedData() {
  const sqlFile = "seed_data_new.sql"
  const sql = fs.readFileSync(sqlFile, "utf8")

  const shouldUseSsl = ["true", "1", "yes"].includes(
    String(process.env.DB_SSL || "").toLowerCase()
  )

  const db = new Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123",
    database: process.env.DB_NAME || "postgres",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
    family: process.env.DB_FAMILY ? Number(process.env.DB_FAMILY) : 4,
  })

  try {
    console.log("Connecting to database...")
    await db.connect()
    console.log("✓ Connected to database")

    console.log("Loading seed data...")
    await db.query(sql)
    console.log("✓ Seed data loaded successfully")

    // Verify data was loaded
    const patientCount = await db.query("SELECT COUNT(*) AS count FROM patient")
    const doctorCount = await db.query("SELECT COUNT(*) AS count FROM doctor")
    const diagnosisCount = await db.query("SELECT COUNT(*) AS count FROM diagnosis_history")
    const treatmentCount = await db.query("SELECT COUNT(*) AS count FROM treatment_history")
    const usersCount = await db.query("SELECT COUNT(*) AS count FROM users")
    const accessLogCount = await db.query("SELECT COUNT(*) AS count FROM access_log")

    console.log("\n=== Data Summary ===")
    console.log(`Patients: ${patientCount.rows[0].count}`)
    console.log(`Doctors: ${doctorCount.rows[0].count}`)
    console.log(`Diagnoses: ${diagnosisCount.rows[0].count}`)
    console.log(`Treatments: ${treatmentCount.rows[0].count}`)
    console.log(`Users: ${usersCount.rows[0].count}`)
    console.log(`Access Logs: ${accessLogCount.rows[0].count}`)
    console.log("==================")

    await db.end()
    console.log("\n✓ Database operation completed successfully!")
    process.exit(0)
  } catch (err) {
    console.error("Error loading seed data:", err.message)
    await db.end()
    process.exit(1)
  }
}

loadSeedData()
