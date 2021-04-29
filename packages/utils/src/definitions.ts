import { Serial } from 'type-core';

export declare namespace Riseup {
  export interface Context {
    cwd: string;
    task: string;
  }
  export interface Configure<T extends Serial.Type> {
    (context: Context): T;
  }
  export interface Reconfigure<T extends Serial.Type> {
    (configuration: T, context: Context): T;
  }
}
