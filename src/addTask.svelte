<script lang="ts">
  import { onMount } from "svelte";
  import iconClock from "@ktibow/iconset-mdi/clock";
  import iconClockFast from "@ktibow/iconset-mdi/clock-fast";
  import iconClockRemove from "@ktibow/iconset-mdi/clock-remove";
  import iconAdd from "@ktibow/iconset-mdi/add";
  import iconTrashCan from "@ktibow/iconset-mdi/trash-can";
  import iconEdit from "@ktibow/iconset-mdi/edit";
  import { relativeTime } from "svelte-relative-time";
  import { nanoid } from "nanoid";
  import {
    Button,
    Checkbox,
    CheckboxAnim,
    Chip,
    ChipChooser,
    DateField,
    FAB,
    Icon,
    SegmentedButtonContainer,
    SegmentedButtonItem,
    Switch,
    TextField,
    TextFieldOutlined,
  } from "m3-svelte";
  import {
    datetimeToDate,
    isDatetimeDue,
    t,
    type Task,
    type TDateTime,
  } from "./lib";
  var nearestSunday = new Date();
  nearestSunday.setDate(
    nearestSunday.getDate() + ((7 + (7 - nearestSunday.getDay())) % 7)
  );
  export let newTaskData: Task;
  export let addTask;
  export let showModal: boolean;
</script>

<div>
  <h1 class="m3-font-title-large">{t("task_title_add")}</h1>
  <TextFieldOutlined
    name={t("task_input_text_label")}
    bind:value={newTaskData.text}
  />
  <div class="time">
    <SegmentedButtonContainer>
      <input
        type="radio"
        name="datetimeType-{newTaskData.id}"
        id="datetimeType-0-{newTaskData.id}"
        checked={newTaskData.datetime !== null &&
          newTaskData.datetime !== undefined}
        on:click={() =>
          (newTaskData.datetime = {
            date: new Date().toISOString().split("T")[0],
            time: "",
            deadline: false,
          })}
      />
      <SegmentedButtonItem
        input="datetimeType-0-{newTaskData.id}"
        icon={iconClock}
        >{t("task_input_time_picker_title")}</SegmentedButtonItem
      >
      <input
        type="radio"
        name="datetimeType-{newTaskData.id}"
        id="datetimeType-1-{newTaskData.id}"
        checked={newTaskData.datetime === null}
        on:click={() => (newTaskData.datetime = null)}
      />
      <SegmentedButtonItem
        input="datetimeType-1-{newTaskData.id}"
        icon={iconClockFast}>{t("asap")}</SegmentedButtonItem
      >
      <input
        type="radio"
        name="datetimeType-{newTaskData.id}"
        id="datetimeType-2-{newTaskData.id}"
        checked={newTaskData.datetime === undefined}
        on:click={() => (newTaskData.datetime = undefined)}
      />
      <SegmentedButtonItem
        input="datetimeType-2-{newTaskData.id}"
        icon={iconClockRemove}
        >{t("task_input_anytime_title")}</SegmentedButtonItem
      >
    </SegmentedButtonContainer>

    {#if newTaskData.datetime !== null && newTaskData.datetime !== undefined}
      <div class="inline">
        <input
          type="time"
          name={t("time")}
          bind:value={newTaskData.datetime.time}
        />
        <DateField name={t("date")} bind:date={newTaskData.datetime.date} />
      </div>

      <div class="chips">
        <Chip
          type="assist"
          on:click={() => {
            if (
              newTaskData.datetime !== undefined &&
              newTaskData.datetime !== null
            ) {
              newTaskData.datetime.date = new Date(
                new Date().setDate(new Date().getDate() + 0)
              )
                .toISOString()
                .split("T")[0];
            }
          }}
          selected={newTaskData.datetime?.date ===
            new Date().toISOString().split("T")[0]}>{t("today")}</Chip
        >
        <Chip
          type="assist"
          selected={newTaskData.datetime?.date ===
            new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]}
          on:click={() => {
            if (
              newTaskData.datetime !== undefined &&
              newTaskData.datetime !== null
            ) {
              newTaskData.datetime.date = new Date(
                new Date().setDate(new Date().getDate() + 1)
              )
                .toISOString()
                .split("T")[0];
            }
          }}
        >
          {t("tomorrow")}
        </Chip>
        <Chip
          type="assist"
          selected={newTaskData.datetime?.date !==
            new Date().toISOString().split("T")[0] &&
            newTaskData.datetime?.date ===
              nearestSunday.toISOString().split("T")[0]}
          on:click={() => {
            if (
              newTaskData.datetime !== undefined &&
              newTaskData.datetime !== null
            ) {
              if (
                new Date().toISOString().split("T")[0] ===
                nearestSunday.toISOString().split("T")[0]
              ) {
                var nextSunday = nearestSunday;
                nextSunday.setDate(nearestSunday.getDate() + 7);
                newTaskData.datetime.date = nextSunday
                  .toISOString()
                  .split("T")[0];
              } else {
                newTaskData.datetime.date = nearestSunday
                  .toISOString()
                  .split("T")[0];
              }
              newTaskData.datetime.deadline = true;
            }
          }}
        >
          {new Date().toISOString().split("T")[0] ===
          nearestSunday.toISOString().split("T")[0]
            ? t("next_week")
            : t("this_week")}
        </Chip>
      </div>
      <div
        style="display: flex; flex-direction: row; gap: 0.5rem; align-items: center"
      >
        <Switch bind:checked={newTaskData.datetime.deadline} />
        <span class="m3-font-body-medium">{t("deadline_title")}</span>
      </div>
    {/if}
  </div>

  <Button
    type="filled"
    on:click={() => {
      addTask();
      showModal = false;
    }}>{t("task_add")}</Button
  >
  <Button type="text" on:click={() => (showModal = false)}>{t("cancel")}</Button
  >
</div>

<style>
  .inline {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .time {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 1.5rem 0;
    gap: 0.75rem;
  }
  .time .chips {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }
  input[type="time"] {
    display: block;
    background-color: rgb(var(--m3-scheme-surface-container-highest));
    border-radius: var(--m3-datefield-shape) var(--m3-datefield-shape) 0 0;
    border-bottom: solid 0.0625rem rgb(var(--m3-scheme-on-surface-variant));
    height: 3.5rem;
  }
</style>
