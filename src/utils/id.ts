/** Local-only unique id — sufficient for a single-device SQLite primary key. */
export function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
