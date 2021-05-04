import { Task } from 'kpo';
import { Empty, Dictionary, Serial } from 'type-core';
import { Riseup } from './definitions';

export interface ExtractResult<
  T extends Dictionary<Task>,
  C extends Dictionary<Riseup.Configure<Serial.Type>>
> {
  tasks: T;
  configure: C;
}

export function extract<
  O extends Dictionary,
  R extends Dictionary<Serial.Type | Riseup.Reconfigure<any>>,
  C extends Dictionary<Riseup.Configure<Serial.Type>>,
  T extends Dictionary<Task>
>(
  create: Riseup.Create<O, R, C, T>,
  options: O | Empty,
  reconfigure: R | Empty
): ExtractResult<T, C> {
  let configure: C | undefined;
  const tasks = create(options, reconfigure, (conf) => {
    configure = conf;
  });

  return { tasks, configure: configure as C };
}
