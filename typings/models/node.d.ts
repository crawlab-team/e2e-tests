export declare global {
  interface Node extends BaseModel {
    type: string;
    status: string;
    enabled: string;
  }
}