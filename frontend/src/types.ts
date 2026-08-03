export type SymbolicTask =
  | "derive"
  | "integrate"
  | "simplify"
  | "solve"
  | "expand"
  | "factor"
  | "limit"
  | "taylor";

export interface SymbolicRequest {
  task: SymbolicTask;
  expr: string;
  variable: string;
  lang?: string;
}

export interface SymbolicResponse {
  result: string;
  input: string;
  task: string;
  steps: string[];
}

export interface ApiError {
  error: string;
}
