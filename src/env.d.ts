/// <reference types="vite/client" />

declare module '*.ink.json' {
  const value: Record<string, unknown>
  export default value
}
