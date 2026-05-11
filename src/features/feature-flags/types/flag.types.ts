export interface Flag {
  _id: string;
  workspaceId: string;
  name: string;
  key: string;
  description?: string;
  environments: {
    development: boolean;
    staging: boolean;
    production: boolean;
  };
  enabledUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EvaluateResult {
  enabled: boolean;
  reason: "FLAG_NOT_FOUND" | "ENV_DISABLED" | "USER_NOT_TARGETED" | "FLAG_ENABLED";
}
