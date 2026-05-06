const express = require("express")
const { Pool } = require("pg")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123",
  database: process.env.DB_NAME || "postgres",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  family: process.env.DB_FAMILY ? Number(process.env.DB_FAMILY) : 4,
}

const db = new Pool(dbConfig)

db.on("error", (err) => {
  console.error("Unexpected error on idle client", err)
})

console.log("PostgreSQL pool initialized")

const query = (sql, params = []) => {
  // Convert MySQL style ? placeholders to PostgreSQL style $1, $2, etc.
  let paramIndex = 1
  const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`)
  
  return new Promise((resolve, reject) => {
    db.query(pgSql, params, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.rows || result)
      }
    })
  })
}

const getTableColumns = async (tableName) => {
  const rows = await query(
    `
      SELECT column_name as "COLUMN_NAME"
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
    `,
    [tableName]
  )
  return new Set(rows.map((r) => r.COLUMN_NAME))
}

const resolveTableName = async (tableName) => {
  const rows = await query(
    `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
      LIMIT 1
    `,
    [tableName]
  )
  return rows[0]?.table_name || tableName
}

const getFirstExistingColumn = (columns, candidates) =>
  candidates.find((name) => columns.has(name)) || null

const getDefaultDoctorId = async () => {
  const doctorColumns = await getTableColumns("doctor")
  const doctorIdColumn = getFirstExistingColumn(doctorColumns, ["doctor_id", "id"])

  if (!doctorIdColumn) {
    return null
  }

  const rows = await query(
    `
      SELECT ${doctorIdColumn} AS doctor_id
      FROM doctor
      ORDER BY ${doctorIdColumn}
      LIMIT 1
    `
  )

  return rows[0]?.doctor_id || null
}

const normalizeRole = (role) => {
  if (!role || typeof role !== "string") return "Doctor"
  const lower = role.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    const role = String(req.headers.role || "").trim().toLowerCase()
    const normalizedAllowedRoles = allowedRoles.map((r) => String(r).toLowerCase())

    if (!normalizedAllowedRoles.includes(role)) {
      return res.status(403).json({ message: "Access denied" })
    }
    next()
  }
}

app.get("/patients", async (req, res) => {
  try {
    const result = await query("SELECT * FROM patient")
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patients", error: err.message })
  }
})

app.post("/patients", async (req, res) => {
  const { name, age, dob, gender, phone } = req.body

  if (!name || !gender || (!dob && (age === undefined || age === null || age === ""))) {
    return res.status(400).json({ message: "name, gender and dob (or age) are required" })
  }

  try {
    const columns = await getTableColumns("patient")
    const payload = {}

    if (columns.has("name")) payload.name = String(name).trim()
    if (columns.has("gender")) payload.gender = String(gender).trim()

    if (columns.has("dob")) {
      if (dob) {
        payload.dob = dob
      } else {
        const numericAge = Number(age)
        const year = Number.isFinite(numericAge) ? new Date().getFullYear() - numericAge : null
        if (!year) {
          return res.status(400).json({ message: "Valid age or dob is required" })
        }
        payload.dob = `${year}-01-01`
      }
    }

    if (columns.has("age") && age !== undefined && age !== null && age !== "") {
      payload.age = Number(age)
    }

    if (columns.has("phone")) {
      payload.phone = phone ? String(phone).trim() : "N/A"
    }

    if (columns.has("address") && req.body.address) {
      payload.address = String(req.body.address).trim()
    }

    if (Object.keys(payload).length === 0) {
      return res.status(500).json({ message: "Patient table schema is not compatible" })
    }

    const insertColumns = Object.keys(payload)
    const placeholders = insertColumns.map(() => "?").join(", ")
    const sql = `INSERT INTO patient (${insertColumns.join(", ")}) VALUES (${placeholders})`
    const result = await query(sql, insertColumns.map((k) => payload[k]))

    res.status(201).json({
      message: "Patient added successfully",
      patientId: result.insertId,
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to add patient",
      error: err.message,
    })
  }
})

app.get("/diagnoses/:patientId", async (req, res) => {
  const patientId = Number(req.params.patientId)

  if (!Number.isFinite(patientId)) {
    return res.status(400).json({ message: "Invalid patient id" })
  }

  try {
    const result = await query(
      `
        SELECT *
        FROM diagnosis_history
        WHERE patient_id = ?
        ORDER BY valid_from DESC
      `,
      [patientId]
    )
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch diagnoses", error: err.message })
  }
})

app.post("/diagnoses/:patientId", async (req, res) => {
  const patientId = Number(req.params.patientId)
  const { disease, validFrom, validTo, doctorId } = req.body

  if (!Number.isFinite(patientId)) {
    return res.status(400).json({ message: "Invalid patient id" })
  }

  if (!disease || !validFrom) {
    return res.status(400).json({ message: "disease and validFrom are required" })
  }

  try {
    const columns = await getTableColumns("diagnosis_history")
    const payload = {}

    if (columns.has("patient_id")) payload.patient_id = patientId
    if (columns.has("disease")) payload.disease = String(disease).trim()
    if (columns.has("valid_from")) payload.valid_from = validFrom
    if (columns.has("valid_to") && validTo) payload.valid_to = validTo

    if (columns.has("doctor_id")) {
      const selectedDoctorId =
        doctorId !== undefined && doctorId !== null && doctorId !== ""
          ? Number(doctorId)
          : await getDefaultDoctorId()

      if (Number.isFinite(selectedDoctorId)) {
        payload.doctor_id = selectedDoctorId
      }
    }

    if (!payload.patient_id || !payload.disease || !payload.valid_from) {
      return res.status(500).json({ message: "diagnosis_history schema is not compatible" })
    }

    const insertColumns = Object.keys(payload)
    const placeholders = insertColumns.map(() => "?").join(", ")
    const sql = `INSERT INTO diagnosis_history (${insertColumns.join(", ")}) VALUES (${placeholders})`
    const result = await query(sql, insertColumns.map((k) => payload[k]))

    res.status(201).json({
      message: "Diagnosis added successfully",
      diagnosisId: result.insertId,
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to add diagnosis", error: err.message })
  }
})

app.get("/treatments/:patientId", authorizeRole(["Admin", "Doctor", "Nurse"]), async (req, res) => {
  const patientId = Number(req.params.patientId)

  if (!Number.isFinite(patientId)) {
    return res.status(400).json({ message: "Invalid patient id" })
  }

  try {
    const result = await query(
      `
        SELECT
          treatment_type,
          medication,
          valid_from,
          valid_to,
          CASE
            WHEN valid_to IS NOT NULL AND valid_to < CURDATE() THEN 'Completed'
            WHEN valid_from > CURDATE() THEN 'Scheduled'
            ELSE 'Active'
          END AS status
        FROM treatment_history
        WHERE patient_id = ?
        ORDER BY valid_from DESC
      `,
      [patientId]
    )
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch treatments", error: err.message })
  }
})

app.post("/treatments/:patientId", async (req, res) => {
  const patientId = Number(req.params.patientId)
  const { treatmentType, medication, validFrom, validTo, status } = req.body

  if (!Number.isFinite(patientId)) {
    return res.status(400).json({ message: "Invalid patient id" })
  }

  if (!treatmentType || !validFrom) {
    return res.status(400).json({ message: "treatmentType and validFrom are required" })
  }

  try {
    const columns = await getTableColumns("treatment_history")
    const payload = {}

    if (columns.has("patient_id")) payload.patient_id = patientId
    if (columns.has("treatment_type")) payload.treatment_type = String(treatmentType).trim()
    if (columns.has("medication") && medication) payload.medication = String(medication).trim()
    if (columns.has("valid_from")) payload.valid_from = validFrom
    if (columns.has("valid_to") && validTo) payload.valid_to = validTo
    if (columns.has("status") && status) payload.status = String(status).trim()

    if (!payload.patient_id || !payload.treatment_type || !payload.valid_from) {
      return res.status(500).json({ message: "treatment_history schema is not compatible" })
    }

    const insertColumns = Object.keys(payload)
    const placeholders = insertColumns.map(() => "?").join(", ")
    const sql = `INSERT INTO treatment_history (${insertColumns.join(", ")}) VALUES (${placeholders})`
    const result = await query(sql, insertColumns.map((k) => payload[k]))

    res.status(201).json({
      message: "Treatment added successfully",
      treatmentId: result.insertId,
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to add treatment", error: err.message })
  }
})

app.get("/active-treatments/:date", async (req, res) => {
  const date = req.params.date

  try {
    const result = await query(
      `
        SELECT *
        FROM treatment_history
        WHERE ? BETWEEN valid_from AND valid_to
      `,
      [date]
    )
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch active treatments", error: err.message })
  }
})

app.get("/analytics/diseases", async (req, res) => {
  try {
    const result = await query(
      `
        SELECT disease, COUNT(*) AS total
        FROM diagnosis_history
        GROUP BY disease
        ORDER BY total DESC
      `
    )
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch disease analytics", error: err.message })
  }
})

app.get("/analytics/summary", async (req, res) => {
  try {
    const patientColumns = await getTableColumns("patient")
    const ageExpression = patientColumns.has("age")
      ? "age"
      : "EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob))"

     const [diseaseRows, durationRows, trendsRows, ageRows] = await Promise.all([
      query(
        `
          SELECT disease, COUNT(*) AS total
          FROM diagnosis_history
          GROUP BY disease
          ORDER BY total DESC
          LIMIT 8
        `
      ),
      query(
        `
          SELECT
            SUM(CASE WHEN (valid_to - valid_from) >= 0 AND (valid_to - valid_from) <= 7 THEN 1 ELSE 0 END) AS d_0_7,
            SUM(CASE WHEN (valid_to - valid_from) >= 8 AND (valid_to - valid_from) <= 14 THEN 1 ELSE 0 END) AS d_8_14,
            SUM(CASE WHEN (valid_to - valid_from) >= 15 AND (valid_to - valid_from) <= 30 THEN 1 ELSE 0 END) AS d_15_30,
            SUM(CASE WHEN (valid_to - valid_from) > 30 THEN 1 ELSE 0 END) AS d_31_plus
          FROM treatment_history
        `
      ),
      query(
        `
          SELECT
            TO_CHAR(valid_from, 'YYYY-MM') AS month,
            COUNT(*) AS admissions,
            SUM(CASE WHEN valid_to <= CURRENT_DATE THEN 1 ELSE 0 END) AS completed
          FROM treatment_history
          GROUP BY TO_CHAR(valid_from, 'YYYY-MM')
          ORDER BY month
        `
      ),
      query(
        `
          SELECT
            CASE
              WHEN ${ageExpression} < 18 THEN '0-17'
              WHEN ${ageExpression} BETWEEN 18 AND 30 THEN '18-30'
              WHEN ${ageExpression} BETWEEN 31 AND 45 THEN '31-45'
              WHEN ${ageExpression} BETWEEN 46 AND 60 THEN '46-60'
              ELSE '61+'
            END AS age_group,
            COUNT(*) AS total
          FROM patient
          WHERE ${ageExpression} IS NOT NULL
          GROUP BY CASE
              WHEN ${ageExpression} < 18 THEN '0-17'
              WHEN ${ageExpression} BETWEEN 18 AND 30 THEN '18-30'
              WHEN ${ageExpression} BETWEEN 31 AND 45 THEN '31-45'
              WHEN ${ageExpression} BETWEEN 46 AND 60 THEN '46-60'
              ELSE '61+'
            END
          ORDER BY
            CASE
              WHEN age_group = '0-17' THEN 1
              WHEN age_group = '18-30' THEN 2
              WHEN age_group = '31-45' THEN 3
              WHEN age_group = '46-60' THEN 4
              WHEN age_group = '61+' THEN 5
            END
        `
      ),
    ])

    const duration = durationRows[0] || {}

    res.json({
      treatmentDuration: {
        labels: ["0-7 days", "8-14 days", "15-30 days", "31+ days"],
        datasets: [
          {
            label: "Treatments",
            data: [
              Number(duration.d_0_7 || 0),
              Number(duration.d_8_14 || 0),
              Number(duration.d_15_30 || 0),
              Number(duration.d_31_plus || 0),
            ],
            backgroundColor: [
              "rgba(25, 118, 210, 0.8)",
              "rgba(0, 172, 193, 0.8)",
              "rgba(46, 125, 50, 0.8)",
              "rgba(245, 124, 0, 0.8)",
            ],
            borderColor: [
              "rgb(25, 118, 210)",
              "rgb(0, 172, 193)",
              "rgb(46, 125, 50)",
              "rgb(245, 124, 0)",
            ],
            borderWidth: 2,
          },
        ],
      },
      diseaseDistribution: {
        labels: diseaseRows.map((d) => d.disease),
        datasets: [
          {
            data: diseaseRows.map((d) => Number(d.total || 0)),
            backgroundColor: [
              "rgba(25, 118, 210, 0.8)",
              "rgba(0, 172, 193, 0.8)",
              "rgba(46, 125, 50, 0.8)",
              "rgba(245, 124, 0, 0.8)",
              "rgba(198, 40, 40, 0.8)",
              "rgba(123, 31, 162, 0.8)",
              "rgba(94, 53, 177, 0.8)",
              "rgba(2, 136, 209, 0.8)",
            ],
            borderWidth: 2,
          },
        ],
      },
      patientTrends: {
        labels: trendsRows.map((r) => r.month),
        datasets: [
          {
            label: "Admissions",
            data: trendsRows.map((r) => Number(r.admissions || 0)),
            borderColor: "rgb(25, 118, 210)",
            backgroundColor: "rgba(25, 118, 210, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
          {
            label: "Completed",
            data: trendsRows.map((r) => Number(r.completed || 0)),
            borderColor: "rgb(46, 125, 50)",
            backgroundColor: "rgba(46, 125, 50, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      ageDistribution: {
        labels: ageRows.map((r) => r.age_group),
        datasets: [
          {
            label: "Patients",
            data: ageRows.map((r) => Number(r.total || 0)),
            backgroundColor: "rgba(0, 172, 193, 0.25)",
            borderColor: "rgb(0, 172, 193)",
            borderWidth: 2,
            pointBackgroundColor: "rgb(0, 172, 193)",
          },
        ],
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics summary", error: err.message })
  }
})

app.get("/dashboard/charts", async (req, res) => {
  try {
    const [diseaseRows, trendRows, treatmentRows] = await Promise.all([
      query(
        `
          SELECT disease, COUNT(*) AS total
          FROM diagnosis_history
          GROUP BY disease
          ORDER BY total DESC
          LIMIT 6
        `
      ),
      query(
        `
          SELECT TO_CHAR(valid_from, 'YYYY-MM') AS month, COUNT(*) AS total
          FROM treatment_history
          GROUP BY TO_CHAR(valid_from, 'YYYY-MM')
          ORDER BY month
        `
      ),
      query(
        `
          SELECT
            CASE
              WHEN valid_to < CURRENT_DATE THEN 'Completed'
              WHEN valid_from > CURRENT_DATE THEN 'Scheduled'
              ELSE 'Active'
            END AS status,
            COUNT(*) AS total
          FROM treatment_history
          GROUP BY CASE
              WHEN valid_to < CURRENT_DATE THEN 'Completed'
              WHEN valid_from > CURRENT_DATE THEN 'Scheduled'
              ELSE 'Active'
            END
        `
      ),
    ])

    const statusTotals = {
      Active: 0,
      Completed: 0,
      Scheduled: 0,
    }

    treatmentRows.forEach((row) => {
      statusTotals[row.status] = Number(row.total || 0)
    })

    res.json({
      barChart: {
        labels: diseaseRows.map((r) => r.disease),
        datasets: [
          {
            label: "Diagnoses",
            data: diseaseRows.map((r) => Number(r.total || 0)),
            backgroundColor: "rgba(25, 118, 210, 0.8)",
            borderColor: "rgb(25, 118, 210)",
            borderWidth: 2,
          },
        ],
      },
      lineChart: {
        labels: trendRows.map((r) => r.month),
        datasets: [
          {
            label: "Admissions",
            data: trendRows.map((r) => Number(r.total || 0)),
            borderColor: "rgb(0, 172, 193)",
            backgroundColor: "rgba(0, 172, 193, 0.2)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      doughnutChart: {
        labels: ["Active", "Completed", "Scheduled"],
        datasets: [
          {
            data: [
              statusTotals.Active,
              statusTotals.Completed,
              statusTotals.Scheduled,
            ],
            backgroundColor: [
              "rgba(46, 125, 50, 0.8)",
              "rgba(25, 118, 210, 0.8)",
              "rgba(245, 124, 0, 0.8)",
            ],
            borderWidth: 2,
          },
        ],
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard charts", error: err.message })
  }
})

app.get("/dashboard/stats", async (req, res) => {
  try {
    const [patients, doctors, treatments, diagnoses] = await Promise.all([
      query("SELECT COUNT(*) AS totalPatients FROM patient"),
      query("SELECT COUNT(*) AS totalDoctors FROM doctor"),
      query("SELECT COUNT(*) AS totalTreatments FROM treatment_history"),
      query("SELECT COUNT(*) AS totalDiagnoses FROM diagnosis_history"),
    ])

    res.json({
      totalPatients: Number(patients[0]?.totalPatients || 0),
      totalDoctors: Number(doctors[0]?.totalDoctors || 0),
      totalTreatments: Number(treatments[0]?.totalTreatments || 0),
      totalDiagnoses: Number(diagnoses[0]?.totalDiagnoses || 0),
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: err.message })
  }
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  try {
    const usersTable = await resolveTableName("users")
    const result = await query(
      `
        SELECT role FROM ${usersTable}
        WHERE username = ? AND password = ?
      `,
      [username, password]
    )

    if (result.length === 0) {
      return res.json({ message: "Invalid login" })
    }

    res.json({
      message: "Login success",
      role: result[0].role,
    })
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message })
  }
})

app.get("/logs", async (req, res) => {
  try {
    const result = await query(
      `
        SELECT *
        FROM access_log
        ORDER BY access_time DESC
      `
    )
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs", error: err.message })
  }
})

app.get("/admin/users", async (req, res) => {
  try {
    const columns = await getTableColumns("users")
    const usersTable = await resolveTableName("users")

    const idColumn = getFirstExistingColumn(columns, ["user_id", "id", "uid", "username"])
    const usernameColumn = getFirstExistingColumn(columns, ["username", "name"])
    const emailColumn = getFirstExistingColumn(columns, ["email"])
    const roleColumn = getFirstExistingColumn(columns, ["role"])
    const statusColumn = getFirstExistingColumn(columns, ["status"])
    const createdColumn = getFirstExistingColumn(columns, ["created_at", "created_on", "created"])

    const sql = `
      SELECT
        ${idColumn ? idColumn : "NULL"} AS user_id,
        ${usernameColumn ? usernameColumn : "NULL"} AS username,
        ${emailColumn ? emailColumn : "NULL"} AS email,
        ${roleColumn ? roleColumn : "NULL"} AS role,
        ${statusColumn ? statusColumn : "'Active'"} AS status,
        ${createdColumn ? createdColumn : "NOW()"} AS created_at
      FROM ${usersTable}
      ORDER BY created_at DESC
    `

    const users = await query(sql)
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message })
  }
})

app.post("/admin/users", async (req, res) => {
  const { username, password, email, role } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" })
  }

  try {
    const columns = await getTableColumns("users")
    const usersTable = await resolveTableName("users")
    const payload = {}

    const normalizedRole = String(role || "").trim().toLowerCase()
    if (!["doctor", "nurse"].includes(normalizedRole)) {
      return res.status(400).json({ message: "role must be doctor or nurse" })
    }
    const roleValue = normalizeRole(normalizedRole)

    if (columns.has("username")) payload.username = String(username).trim()
    if (columns.has("password")) payload.password = String(password)
    if (columns.has("email")) payload.email = email ? String(email).trim() : null
    if (columns.has("role")) payload.role = roleValue
    if (columns.has("status")) payload.status = "Active"
    if (columns.has("created_at")) payload.created_at = new Date()

    if (Object.keys(payload).length === 0) {
      return res.status(500).json({ message: "Users table schema is not compatible" })
    }

    const insertColumns = Object.keys(payload)
    const placeholders = insertColumns.map(() => "?").join(", ")
    const sql = `INSERT INTO ${usersTable} (${insertColumns.join(", ")}) VALUES (${placeholders})`
    const result = await query(sql, insertColumns.map((k) => payload[k]))

    res.status(201).json({ message: "User added successfully", userId: result.insertId })
  } catch (err) {
    res.status(500).json({ message: "Failed to add user", error: err.message })
  }
})

app.delete("/admin/users/:id", async (req, res) => {
  try {
    const columns = await getTableColumns("users")
    const usersTable = await resolveTableName("users")
    const idColumn = getFirstExistingColumn(columns, ["user_id", "id", "uid"])

    if (idColumn) {
      await query(`DELETE FROM ${usersTable} WHERE ${idColumn} = ?`, [req.params.id])
      return res.json({ message: "User deleted" })
    }

    if (columns.has("username")) {
      await query(`DELETE FROM ${usersTable} WHERE username = ?`, [req.params.id])
      return res.json({ message: "User deleted" })
    }

    return res.status(500).json({ message: "Users table schema is not compatible for delete" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message })
  }
})

app.get("/admin/access-logs", async (req, res) => {
  try {
    const columns = await getTableColumns("access_log")
    const idColumn = getFirstExistingColumn(columns, ["log_id", "id"])
    const userColumn = getFirstExistingColumn(columns, ["username", "user_name", "user", "user_role"])
    const actionColumn = getFirstExistingColumn(columns, ["action", "activity", "table_accessed"])
    const timeColumn = getFirstExistingColumn(columns, ["timestamp", "access_time", "created_at"])
    const statusColumn = getFirstExistingColumn(columns, ["status"])

    const sql = `
      SELECT
        ${idColumn ? idColumn : "NULL"} AS log_id,
        ${userColumn ? userColumn : "'Unknown'"} AS username,
        ${actionColumn ? actionColumn : "'N/A'"} AS action,
        ${timeColumn ? timeColumn : "NOW()"} AS timestamp,
        ${statusColumn ? statusColumn : "'Success'"} AS status
      FROM access_log
      ORDER BY timestamp DESC
    `

    const logs = await query(sql)
    res.json(logs)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch access logs", error: err.message })
  }
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})