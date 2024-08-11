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
  import Litteinfo from "./litteinfo.svelte";
  import Modal from "./modal.svelte";
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
  export let task: Task;
  export let taskToEditId: string | null = null;
</script>

<div>
  <h1 class="m3-font-title-large">{t("task_title_edit")}</h1>
  <TextFieldOutlined name={t("task_input_text_label")} bind:value={task.text} />
  <div class="time">
    <SegmentedButtonContainer>
      <input
        type="radio"
        name="datetimeType-{task.id}"
        id="datetimeType-0-{task.id}"
        checked={task.datetime !== null && task.datetime !== undefined}
        on:click={() =>
          (task.datetime = {
            date: new Date().toISOString().split("T")[0],
            time: "",
            deadline: false,
          })}
      />
      <SegmentedButtonItem input="datetimeType-0-{task.id}" icon={iconClock}
        >{t("task_input_time_picker_title")}</SegmentedButtonItem
      >
      <input
        type="radio"
        name="datetimeType-{task.id}"
        id="datetimeType-1-{task.id}"
        checked={task.datetime === null}
        on:click={() => (task.datetime = null)}
      />
      <SegmentedButtonItem input="datetimeType-1-{task.id}" icon={iconClockFast}
        >{t("asap")}</SegmentedButtonItem
      >
      <input
        type="radio"
        name="datetimeType-{task.id}"
        id="datetimeType-2-{task.id}"
        checked={task.datetime === undefined}
        on:click={() => (task.datetime = undefined)}
      />
      <SegmentedButtonItem
        input="datetimeType-2-{task.id}"
        icon={iconClockRemove}
        >{t("task_input_anytime_title")}</SegmentedButtonItem
      >
    </SegmentedButtonContainer>
    {#if task.datetime !== null && task.datetime !== undefined}
      <div class="inline">
        <input type="time" name={t("time")} bind:value={task.datetime.time} />
        <DateField name={t("date")} bind:date={task.datetime.date} />
      </div>

      <div class="chips">
        <Chip
          type="assist"
          on:click={() => {
            if (task.datetime !== undefined && task.datetime !== null) {
              task.datetime.date = new Date(
                new Date().setDate(new Date().getDate() + 0)
              )
                .toISOString()
                .split("T")[0];
            }
          }}
          selected={task.datetime?.date ===
            new Date().toISOString().split("T")[0]}>{t("today")}</Chip
        >
        <Chip
          type="assist"
          selected={task.datetime?.date ===
            new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]}
          on:click={() => {
            if (task.datetime !== undefined && task.datetime !== null) {
              task.datetime.date = new Date(
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
          selected={task.datetime?.date !==
            new Date().toISOString().split("T")[0] &&
            task.datetime?.date === nearestSunday.toISOString().split("T")[0]}
          on:click={() => {
            if (task.datetime !== undefined && task.datetime !== null) {
              if (
                new Date().toISOString().split("T")[0] ===
                nearestSunday.toISOString().split("T")[0]
              ) {
                var nextSunday = nearestSunday;
                nextSunday.setDate(nearestSunday.getDate() + 7);
                task.datetime.date = nextSunday.toISOString().split("T")[0];
              } else {
                task.datetime.date = nearestSunday.toISOString().split("T")[0];
              }
              task.datetime.deadline = true;
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
        <Switch bind:checked={task.datetime.deadline} />
        <span class="m3-font-body-medium">{t("deadline_title")}</span>
      </div>
    {/if}
    <!-- 5.5 rem -->
  </div>

  <Button
    type="filled"
    on:click={() => {
      taskToEditId = null;
    }}>{t("close")}</Button
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
