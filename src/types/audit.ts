export interface AuditLog {
  id: string;
  action: string;
  entityType: 'budget' | 'transaction' | 'user' | 'supplier' | 'document';
  entityId: string;
  userId: string;
  userRole: string;
  timestamp: Date;
  details: Record<string, any>;
  ipAddress: string;
}

export interface AuditTrail {
  id: string;
  entityId: string;
  entityType: string;
  changes: AuditChange[];
  timestamp: Date;
  user: string;
}

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}

export interface ComplianceReport {
  id: string;
  period: {
    start: Date;
    end: Date;
  };
  status: 'compliant' | 'non-compliant' | 'pending-review';
  findings: ComplianceFinding[];
  generatedBy: string;
  generatedAt: Date;
}

export interface ComplianceFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  status: 'open' | 'in-progress' | 'resolved';
}
