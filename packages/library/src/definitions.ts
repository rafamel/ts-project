import { Serial, UnaryFn } from 'type-core';
import { Task } from 'kpo';
import { BuildParams, DistributeParams, DocsParams } from './tasks';
import { ConfigurePikaParams, ConfigureTypedocParams } from './configure';
import {
  ToolingOptions,
  ToolingReconfigure,
  ToolingTasks
} from '@riseup/tooling';
import {
  UniversalOptions,
  UniversalReconfigure,
  UniversalTasks
} from '@riseup/universal';

export interface LibraryParams {
  build?: ConfigurePikaParams & BuildParams;
  distribute?: DistributeParams;
  docs?: ConfigureTypedocParams & DocsParams;
}

export type LibraryOptions = LibraryParams & UniversalOptions & ToolingOptions;

export interface LibraryReconfigure
  extends UniversalReconfigure,
    ToolingReconfigure {
  pika?: Serial.Array | UnaryFn<Serial.Array, Serial.Array>;
  typedoc?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
}

export interface LibraryTasks extends UniversalTasks, ToolingTasks {
  build: Task;
  docs: Task;
  distribute: Task;
}
