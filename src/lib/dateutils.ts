import type { Task } from "../lib";

export type TDateTime = { date: string; time: string | ""; deadline: boolean };

export function datetimeToDate(datetime: TDateTime | null | undefined): Date {
  if (!datetime) return new Date();
  if (datetime.time === "" && !datetime.deadline)
    return new Date(datetime.date + " 23:59:00");
  const date = new Date(datetime.date + " " + datetime.time);
  return date;
}

export function isDatetimeDue(datetime: TDateTime | null | undefined): boolean {
  if (datetime === undefined) return false;
  if (datetime === null) return true;
  const now = new Date();
  return datetimeToDate(datetime) < now;
}

export function taskIsForToday(task: Task) {
  if (task.datetime === null) {
    return false;
  }
  if (task.datetime === undefined) {
    return false;
  }
  if (isDatetimeDue(task.datetime)) {
    return false;
  }
  if (task.datetime?.date === new Date().toISOString().split("T")[0]) {
    return true;
  } else {
    return false;
  }
}

export function taskIsForTomorrow(task: Task) {
  if (task.datetime === null) {
    return false;
  }
  if (task.datetime === undefined) {
    return false;
  }
  if (
    task.datetime?.date ===
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  ) {
    return true;
  } else {
    return false;
  }
}

export function taskIsForLater(task: Task) {
  if (task.datetime === null) {
    return false;
  }
  if (task.datetime === undefined) {
    return true;
  }
  if (isDatetimeDue(task.datetime)) {
    return false;
  }
  if (task.datetime?.date === new Date().toISOString().split("T")[0]) {
    return false;
  }
  if (
    task.datetime?.date ===
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0] &&
    datetimeToDate(task.datetime).getTime() > new Date().getTime()
  ) {
    return false;
  } else {
    return true;
  }
}
