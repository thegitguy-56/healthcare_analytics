const { Client } = require("pg")
require("dotenv").config()

async function testDatabase() {
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
    console.log("✓ Connected!\n")

    console.log("=== DATABASE TEST ===\n")

    // Test each table
    const tables = [
      { name: "patient", query: "SELECT COUNT(*) as count FROM patient" },
      { name: "doctor", query: "SELECT COUNT(*) as count FROM doctor" },
      { name: "diagnosis_history", query: "SELECT COUNT(*) as count FROM diagnosis_history" },
      { name: "treatment_history", query: "SELECT COUNT(*) as count FROM treatment_history" },
      { name: "users", query: "SELECT COUNT(*) as count FROM users" },
      { name: "access_log", query: "SELECT COUNT(*) as count FROM access_log" },
    ]

    for (const table of tables) {
      try {
        const result = await db.query(table.query)
        const count = result.rows[0]?.count || 0
        console.log(`✓ ${table.name.padEnd(20)} : ${count} records`)
      } catch (err) {
        console.log(`✗ ${table.name.padEnd(20)} : ERROR - ${err.message}`)
      }
    }

    console.log("\n=== Sample Data ===\n")

    // Get sample patient data
    try {
      const patients = await db.query("SELECT patient_id, name, phone FROM patient LIMIT 3")
      console.log("Sample Patients:")
      patients.rows.forEach((p, i) => {
        console.log(`  ${i + 1}. ID: ${p.patient_id}, Name: ${p.name}, Phone: ${p.phone}`)
      })
    } catch (err) {
      console.log(`Error fetching patients: ${err.message}`)
    }

    console.log("\n=== Dashboard Stats ===\n")

    try {
      const [patients, doctors, treatments, diagnoses] = await Promise.all([
        db.query("SELECT COUNT(*) AS totalPatients FROM patient"),
        db.query("SELECT COUNT(*) AS totalDoctors FROM doctor"),
        db.query("SELECT COUNT(*) AS totalTreatments FROM treatment_history"),
        db.query("SELECT COUNT(*) AS totalDiagnoses FROM diagnosis_history"),
      ])

      console.log(`Total Patients   : ${patients.rows[0]?.totalPatients || 0}`)
      console.log(`Total Doctors    : ${doctors.rows[0]?.totalDoctors || 0}`)
      console.log(`Total Treatments : ${treatments.rows[0]?.totalTreatments || 0}`)
      console.log(`Total Diagnoses  : ${diagnoses.rows[0]?.totalDiagnoses || 0}`)
    } catch (err) {
      console.log(`Error: ${err.message}`)
    }

    await db.end()
    console.log("\n✓ Test complete!")
  } catch (err) {
    console.error("Database error:", err.message)
    process.exit(1)
  }
}

testDatabase()
