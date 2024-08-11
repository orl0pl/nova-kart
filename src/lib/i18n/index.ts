export type Laguage = "en" | "pl";
export type I18nKey =
  | "search_label"
  | "now"
  | "today"
  | "tomorrow"
  | "this_week"
  | "next_week"
  | "later"
  | "deadline"
  | "deadline_title"
  | "title_completed"
  | "tab_tasks"
  | "tab_settings"
  | "fab_label"
  | "settings_custom_theme"
  | "settings_custom_theme_color"
  | "settings_debug_mode"
  | "settings_user_navigator_language"
  | "settings_use_default_language"
  | "settings_language"
  | "save"
  | "task_title_add"
  | "task_title_edit"
  | "task_input_text_label"
  | "task_input_time_picker_title"
  | "asap"
  | "task_input_anytime_title"
  | "task_add"
  | "cancel"
  | "close"
  | "date"
  | "time"
  | "yesterday"
  | "no_tasks";

const en: Record<I18nKey, string> = {
  search_label: "Search",
  now: "Now",
  today: "Today",
  tomorrow: "Tomorrow",
  yesterday: "Yesterday",
  this_week: "This week",
  next_week: "Next week",
  later: "Later",
  deadline: "Deadline",
  deadline_title: "Deadline",
  title_completed: "Completed",
  tab_tasks: "Tasks",
  tab_settings: "Settings",
  fab_label: "Add task",
  settings_custom_theme: "Custom theme",
  settings_custom_theme_color: "Custom theme color",
  settings_debug_mode: "Debug mode",
  settings_user_navigator_language: "User navigator language",
  settings_use_default_language: "Use default language",
  settings_language: "Language",
  save: "Save",
  task_title_add: "Add task",
  task_title_edit: "Edit task",
  task_input_text_label: "Task text",
  task_input_time_picker_title: "Time picker",
  asap: "ASAP",
  task_input_anytime_title: "Anytime",
  task_add: "Add",
  cancel: "Cancel",
  close: "Close",
  date: "Date",
  time: "Time",
  no_tasks: "No tasks",
};

const pl: Record<I18nKey, string> = {
  search_label: "Szukaj",
  now: "Teraz",
  today: "Dzisiaj",
  tomorrow: "Jutro",
  yesterday: "Wczoraj",
  this_week: "W tym tygodniu",
  next_week: "W przyszłym tygodniu",
  later: "Później",
  deadline: "Termin",
  deadline_title: "Termin",
  title_completed: "Zrobione",
  tab_tasks: "Zadania",
  tab_settings: "Ustawienia",
  fab_label: "Dodaj zadanie",
  settings_custom_theme: "Własny motyw",
  settings_custom_theme_color: "Własny kolor motywu",
  settings_debug_mode: "Tryb debugowania",
  settings_user_navigator_language: "Język przeglądarki",
  settings_use_default_language: "Użyj domyślnego języka",
  settings_language: "Język",
  save: "Zapisz",
  task_title_add: "Dodaj zadanie",
  task_title_edit: "Edytuj zadanie",
  task_input_text_label: "Treść zadania",
  task_input_time_picker_title: "Wybierz czas",
  asap: "Jak najszybciej",
  task_input_anytime_title: "Dowolny czas",
  task_add: "Dodaj",
  cancel: "Anuluj",
  close: "Zamknij",
  date: "Data",
  time: "Czas",
  no_tasks: "Brak zadań",
};

export function getLanguage(): Laguage {
  const lsUserPreferences = localStorage.getItem("userPreferences");

  if (lsUserPreferences === null) {
    return navigator.language.split("-")[0] as Laguage;
  }

  const userPreferences = JSON.parse(lsUserPreferences);

  if (userPreferences.useDefaultLanguage) {
    return navigator.language.split("-")[0] as Laguage;
  }
  if (userPreferences.language) {
    return userPreferences.language;
  } else {
    return navigator.language.split("-")[0] as Laguage;
  }
}

export function t(key: I18nKey): string {
  if (getLanguage() === "en") {
    return en[key];
  } else {
    return pl[key];
  }
}
