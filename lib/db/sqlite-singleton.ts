/**
 * Loads sql.js from CDN by injecting a <script> tag — completely bypasses
 * webpack, which can't bundle sql.js reliably in Next.js due to Node.js internals.
 *
 * window.initSqlJs is set by the UMD build of sql.js when loaded via script tag.
 */

const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0'

// Minimal type so we don't need to import from 'sql.js' at runtime
type SqlJsStatic = { Database: new (data?: ArrayLike<number> | Buffer | null) => SqlDatabase }
type SqlDatabase = {
  run(sql: string, params?: unknown[]): SqlDatabase
  exec(sql: string): { columns: string[]; values: unknown[][] }[]
  prepare(sql: string): SqlStatement
  close(): void
}
type SqlStatement = {
  run(params?: unknown[]): SqlStatement
  free(): boolean
}

declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (f: string) => string }) => Promise<SqlJsStatic>
  }
}

let _SQL: SqlJsStatic | null = null
let _initPromise: Promise<SqlJsStatic> | null = null

function injectScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.initSqlJs !== 'undefined') { resolve(); return }
    const existing = document.querySelector(`script[src*="sql-wasm.js"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('sql.js script failed')))
      return
    }
    const s = document.createElement('script')
    s.src = `${CDN}/sql-wasm.js`
    s.async = true
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${s.src} — check network access`))
    document.head.appendChild(s)
  })
}

export async function getSqlJs(): Promise<SqlJsStatic> {
  if (_SQL) return _SQL
  if (_initPromise) return _initPromise

  _initPromise = (async () => {
    await injectScript()
    if (!window.initSqlJs) throw new Error('window.initSqlJs not found after script load')
    _SQL = await window.initSqlJs({ locateFile: () => `${CDN}/sql-wasm.wasm` })
    return _SQL
  })()

  return _initPromise
}

export type { SqlDatabase, SqlJsStatic }
