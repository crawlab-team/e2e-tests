export declare global {
  interface Spider extends BaseModel {
    project: string;
    git: string;
    last_status: string;
    last_run_ts: string;
    stats: string;
    description: string;
    cmd: string;
  }
}
