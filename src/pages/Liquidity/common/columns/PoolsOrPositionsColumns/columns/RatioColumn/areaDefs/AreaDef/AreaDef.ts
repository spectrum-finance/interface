export interface AreaDef {
  readonly id: string;
  readonly onAreaStylesChange: (styles: [string, string]) => void;
}
