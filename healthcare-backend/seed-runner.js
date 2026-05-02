const fs = require("fs")
const { Client } = require("pg")
require("dotenv").config()

async function run() {
  const sql = fs.readFileSync("sample_seed_data_simple.sql", "utf8")

  const statementsCount = (sql.match(/;/g) || []).length

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

  await db.connect()

  const usersTableRows = await db.query(
    `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    `,
    ["Users"]
  )
  const usersTableName = usersTableRows.rows[0]?.table_name || "Users"
  const sqlToRun = sql.replace(/\bUsers\b/g, usersTableName)

  await db.query(sqlToRun)

  const p = await db.query("SELECT COUNT(*) AS c FROM Patient")
  const d = await db.query("SELECT COUNT(*) AS c FROM Diagnosis_History")
  const t = await db.query("SELECT COUNT(*) AS c FROM Treatment_History")
  const u = await db.query(`SELECT COUNT(*) AS c FROM ${usersTableName}`)
  const l = await db.query("SELECT COUNT(*) AS c FROM Access_Log")

  console.log(
    JSON.stringify(
      {
        executedStatements: statementsCount,
        statementsInFile: statementsCount,
        counts: {
          Patient: p.rows[0].c,
          Diagnosis_History: d.rows[0].c,
          Treatment_History: t.rows[0].c,
          Users: u.rows[0].c,
          Access_Log: l.rows[0].c,
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
