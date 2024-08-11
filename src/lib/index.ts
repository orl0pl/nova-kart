// place files you want to import through the `$lib` alias in this folder.

import type { TDateTime } from "./dateutils";

export * from "./dateutils";
export * from "./icon.svelte";
export * from "./i18n/index";

type ASAP = null;
type NoTimeSet = undefined;
export type Task = {
  id: string;
  text: string;
  datetime: TDateTime | ASAP | NoTimeSet;
  completed: boolean;
};
