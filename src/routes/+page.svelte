<script lang="ts">
  import { PGlite } from "@electric-sql/pglite"
  import { drizzle } from "drizzle-orm/pglite"
  import * as schema from "$lib/db/schema"
  import { onMount } from "svelte"
  import { env } from "$env/dynamic/public"
  const sqlFiles = import.meta.glob("$lib/db/migrations/*.sql", {
    eager: true,
    query: "?raw",
    import: "default",
  })
  const sqls = Object.values(sqlFiles) as string[]

  const DB_NAME = env.PUBLIC_IDB_NAME ?? "sveltekit-pglite-example"

  let pgClient: PGlite
  let db: ReturnType<typeof drizzle>
  let ready = $state(false)

  onMount(async () => {
    pgClient = await PGlite.create({
      dataDir: `idb://${DB_NAME}`,
      // extensions: {
      // 	live // Live query not supported by Drizzle
      // }
    })
    db = drizzle(pgClient, { schema })
    ready = true
  })

  async function createDb() {
    sqls.forEach(async (sql) => {
      console.log("Running migration", sql)
      await pgClient.exec(sql)
    })
  }

  async function insert() {
    const db = drizzle(pgClient, { schema })
    const user = await db.insert(schema.users).values({
      name: "test",
      age: ~~(Math.random() * 80),
    })

    console.log({ user })
  }

  async function getUsers() {
    const db = drizzle(pgClient, { schema })
    const users = await db.select().from(schema.users)
    console.log({ users })
  }

  async function dropDb() {
    if (confirm("Are you sure you want to drop the database?")) {
      window.indexedDB.deleteDatabase(`/pglite/${DB_NAME}`)
      console.log("Dropped database", `/pglite/${DB_NAME}`)
      window.location.reload()
    }
  }
</script>

{#if !ready}
  <p>Loading...</p>
{:else}
  <button onclick={createDb}>Create DB / Migrate</button>
  <button onclick={insert}>Insert Entry</button>
  <button onclick={getUsers}>Get Users</button>
  <button onclick={dropDb}>Drop DB</button>
{/if}
