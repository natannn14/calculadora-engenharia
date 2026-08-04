export type SymbolicTask =
  | "derive"
  | "integrate"
  | "simplify"
  | "solve"
  | "expand"
  | "factor"
  | "limit"
  | "taylor"
  | "partial_derivative"
  | "integral_trapezio"
  | "integral_simpson";

export interface SymbolicRequest {
  task: string;
  expr: string;
  variable: string;
  lang?: string;
  lowerLimit?: number;
  upperLimit?: number;
  subintervals?: number;
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
