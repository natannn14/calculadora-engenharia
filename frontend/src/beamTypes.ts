export interface BeamRequest {
  span: { value: number; unit: string };
  load: { value: number; unit: string };
}

export interface ValueUnit {
  value: number;
  unit: string;
}

export interface BeamResponse {
  reactions: Record<string, ValueUnit>;
  maxMoment: ValueUnit;
  maxShear: ValueUnit;
  steps: string[];
  momentDiagram: number[];
  shearDiagram: number[];
  positions: number[];
}
