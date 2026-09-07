export interface TargetDetection {
  type: 'local' | 'remote' | 'unknown';
  url: string | null;
}

export interface SwitchResult {
  success: boolean;
  target: 'local' | 'remote';
  url: string | null;
  profileFileName: string;
  wasCreated: boolean;
}

export interface EnvStatus {
  exists: boolean;
  target: 'local' | 'remote' | 'unknown';
  url: string | null;
}

export function parseTarget(arg?: string): 'local' | 'remote' | 'status' | null;
export function detectTargetFromContent(content?: string): TargetDetection;
export function getProfileFileName(target: 'local' | 'remote'): string;
export function ensureProfileExists(profilePath: string, target: 'local' | 'remote'): boolean;
export function switchEnv(target: 'local' | 'remote', rootDir?: string): SwitchResult;
export function getStatus(rootDir?: string): EnvStatus;
