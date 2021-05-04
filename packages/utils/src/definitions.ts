import { Task } from 'kpo';
import { Empty, Dictionary, Serial } from 'type-core';

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
  export interface Fetcher<T extends Dictionary<Configure<Serial.Type>>> {
    (fetch: T): void;
  }
  export interface Create<
    O extends Dictionary,
    R extends Dictionary<Serial.Type | Reconfigure<Serial.Type>>,
    C extends Dictionary<Configure<Serial.Type>>,
    T extends Dictionary<Task>
  > {
    (
      options: O | Empty,
      reconfigure: R | Empty,
      fetcher: Fetcher<C> | Empty
    ): T;
  }
}
