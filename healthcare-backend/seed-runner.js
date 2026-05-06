const fs = require("fs")
const { Client } = require("pg")
require("dotenv").config()

async function run() {
  const sql = fs.readFileSync("seed_data_new.sql", "utf8")

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
      WHERE table_schema = 'public' AND lower(table_name) = $1
    `,
    ["users"]
  )
  const usersTableName = usersTableRows.rows[0]?.table_name || "users"
  const sqlToRun = sql.replace(/\bUsers\b/g, usersTableName)

  await db.query(sqlToRun)

  const p = await db.query("SELECT COUNT(*) AS c FROM patient")
  const d = await db.query("SELECT COUNT(*) AS c FROM diagnosis_history")
  const t = await db.query("SELECT COUNT(*) AS c FROM treatment_history")
  const u = await db.query(`SELECT COUNT(*) AS c FROM ${usersTableName}`)
  const l = await db.query("SELECT COUNT(*) AS c FROM access_log")

  console.log(
    JSON.stringify(
      {
        executedStatements: statementsCount,
        statementsInFile: statementsCount,
        counts: {
          patient: p.rows[0].c,
          diagnosis_history: d.rows[0].c,
          treatment_history: t.rows[0].c,
          users: u.rows[0].c,
          access_log: l.rows[0].c,
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
