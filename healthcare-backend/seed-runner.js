const fs = require("fs")
const mysql = require("mysql2/promise")
require("dotenv").config()

async function run() {
  const sql = fs.readFileSync("sample_seed_data.sql", "utf8")

  const statementsCount = (sql.match(/;/g) || []).length

  const shouldUseSsl = ["true", "1", "yes"].includes(
    String(process.env.DB_SSL || "").toLowerCase()
  )

  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123",
    database: process.env.DB_NAME || "healthcare_temporal",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
    multipleStatements: true,
  })

  const [usersTableRows] = await db.query(
    `
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ? AND LOWER(TABLE_NAME) = LOWER('Users')
      LIMIT 1
    `,
    [process.env.DB_NAME || "healthcare_temporal"]
  )
  const usersTableName = usersTableRows[0]?.TABLE_NAME || "Users"
  const sqlToRun = sql.replace(/\bUsers\b/g, usersTableName)

  await db.query(sqlToRun)

  const [p] = await db.query("SELECT COUNT(*) AS c FROM Patient")
  const [d] = await db.query("SELECT COUNT(*) AS c FROM Diagnosis_History")
  const [t] = await db.query("SELECT COUNT(*) AS c FROM Treatment_History")
  const [u] = await db.query(`SELECT COUNT(*) AS c FROM ${usersTableName}`)
  const [l] = await db.query("SELECT COUNT(*) AS c FROM Access_Log")

  console.log(
    JSON.stringify(
      {
        executedStatements: statementsCount,
        statementsInFile: statementsCount,
        counts: {
          Patient: p[0].c,
          Diagnosis_History: d[0].c,
          Treatment_History: t[0].c,
          Users: u[0].c,
          Access_Log: l[0].c,
        },
      },
      null,
      2
    )
  )

  await db.end()
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
