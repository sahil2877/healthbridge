export interface AuditLog {
  _id?: string;
  actor: { id?: string; name?: string; role?: string };
  action: string;     // create | update | delete
  entity: string;     // patients | appointments | ...
  entityId?: string;
  method: string;
  path: string;
  statusCode: number;
  ip?: string;
  at: string;
}
