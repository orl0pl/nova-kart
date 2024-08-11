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
    Dialog,
    FAB,
    Icon,
    SegmentedButtonContainer,
    SegmentedButtonItem,
    sharedAxisTransition,
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
    taskIsForLater,
    taskIsForToday,
    taskIsForTomorrow,
    type Task,
    type TDateTime,
  } from "./lib";
  import EditTask from "./editTask.svelte";
  import AddTask from "./addTask.svelte";

  let tasks: Task[] = [];

  let newTaskData: Task = {
    id: nanoid(),
    text: "",
    datetime: {
      date: new Date().toISOString().split("T")[0],
      time: "",
      deadline: false,
    },
    completed: false,
  };

  onMount(() => {
    var ls = localStorage.getItem("tasks");
    if (ls) {
      if (JSON.parse(ls) instanceof Array) {
        tasks = JSON.parse(ls);
      }
    }
  });

  function addTask() {
    tasks = [...tasks, newTaskData];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    newTaskData = {
      id: nanoid(),
      text: "",
      datetime: {
        date: new Date().toISOString().split("T")[0],
        time: "",
        deadline: false,
      },
      completed: false,
    };
  }

  let showModal = false;
  let taskToEditId: string | null = null;
  var nearestSunday = new Date();
  nearestSunday.setDate(
    nearestSunday.getDate() + ((7 + (7 - nearestSunday.getDay())) % 7)
  );

  export let userPreferences;

  export let fABClickFunction;

  fABClickFunction = () => {
    showModal = true;
  };

  function selfDestruct(e: HTMLElementEventMap["load"]) {
    setTimeout(() => {
      if (e.currentTarget instanceof HTMLElement) {
        if (
          e.currentTarget !== null &&
          e.currentTarget.parentElement !== null
        ) {
          e.currentTarget.parentElement.removeChild(e.currentTarget);
        }
      }
    }, 300);
  }

  $: editedTask = tasks.find((task) => task.id === taskToEditId);

  $: nowTasks = tasks.filter((task) => isDatetimeDue(task.datetime));
  $: todayTasks = tasks.filter((task) => taskIsForToday(task));
  $: tomorrowTasks = tasks.filter((task) => taskIsForTomorrow(task));
  $: laterTasks = tasks.filter((task) => taskIsForLater(task));

  $: nowTasksCompleted = nowTasks.find((x) => !x.completed) === undefined;
  $: todayTasksCompleted = todayTasks.find((x) => !x.completed) === undefined;
  $: tomorrowTasksCompleted =
    tomorrowTasks.find((x) => !x.completed) === undefined;
  $: laterTasksCompleted = laterTasks.find((x) => !x.completed) === undefined;
</script>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
/>

<div class="group {nowTasksCompleted ? 'empty' : ''}">
  {#if !nowTasksCompleted}
    <span class="m3-font-title-small">{t("now")}</span>
  {/if}
  <ul class="asap">
    {#each nowTasks as task}
      {#if task.completed !== true}
        <li
          in:sharedAxisTransition={{ direction: "Y", rightSeam: true }}
          class={datetimeToDate(task.datetime).getTime() < new Date().getTime()
            ? "due"
            : ""}
        >
          <div>
            <!-- FIXME CheckboxAnim is not passing click to input -->
            <!-- <CheckboxAnim> -->
            <input
              type="checkbox"
              name="task-{task.id}"
              bind:checked={task.completed}
              on:change={(e) => {
                task.completed = e.currentTarget.checked;
                localStorage.setItem("tasks", JSON.stringify(tasks));
              }}
            />
            <!-- </CheckboxAnim> -->
            {task.text}
          </div>
          <div>
            <Litteinfo color="background">
              {#if task.datetime === null}
                {t("asap")}
              {:else if datetimeToDate(task.datetime).getTime() < new Date().getTime()}
                {#if task.datetime?.time !== ""}
                  <span
                    use:relativeTime={{
                      date: datetimeToDate(task.datetime),
                      locale: userPreferences.useDefaultLanguage
                        ? undefined
                        : userPreferences.language,
                    }}
                  />
                {:else if datetimeToDate(task.datetime).getTime() < new Date().getTime() - 86400000}
                  {datetimeToDate(task.datetime).toDateString()}
                {:else}
                  {t("yesterday")}
                {/if}
              {/if}
            </Litteinfo>
            <div class="editbutton">
              <Button
                type="text"
                iconType="full"
                on:click={() => (taskToEditId = task.id)}
              >
                <Icon icon={iconEdit} />
              </Button>
            </div>
          </div>
        </li>
      {:else}
        <li class="completed" on:load={selfDestruct}></li>
      {/if}
    {/each}
  </ul>
</div>

<div class="group {todayTasksCompleted ? 'empty' : ''}">
  {#if !todayTasksCompleted}
    <span class="m3-font-title-small">{t("today")}</span>
  {/if}
  <ul>
    {#each todayTasks as task}
      {#if task.completed !== true}
        <li in:sharedAxisTransition={{ direction: "Y", rightSeam: true }}>
          <div>
            <!-- FIXME CheckboxAnim is not passing click to input -->
            <!-- <CheckboxAnim> -->
            <input
              type="checkbox"
              name="task-{task.id}"
              bind:checked={task.completed}
              on:change={(e) => {
                task.completed = e.currentTarget.checked;
                localStorage.setItem("tasks", JSON.stringify(tasks));
              }}
            />
            <!-- </CheckboxAnim> -->
            {task.text}
          </div>
          <div>
            {#if task.datetime?.time !== ""}
              {#if datetimeToDate(task.datetime).getTime() < new Date().getTime() + 30 * 60 * 1000}
                <Litteinfo color="primary">
                  <span
                    use:relativeTime={{
                      date: datetimeToDate(task.datetime),
                      locale: userPreferences.useDefaultLanguage
                        ? undefined
                        : userPreferences.language,
                    }}
                  />
                </Litteinfo>
              {:else}
                <Litteinfo color="outline">
                  {datetimeToDate(task.datetime)
                    .toTimeString()
                    .split(":")
                    .splice(0, 2)
                    .join(":")}
                </Litteinfo>
              {/if}
            {/if}
            <div class="editbutton">
              <Button
                type="text"
                iconType="full"
                on:click={() => (taskToEditId = task.id)}
                ><Icon icon={iconEdit} /></Button
              >
            </div>
          </div>
        </li>
      {:else}
        <li class="completed" on:load={selfDestruct}></li>
      {/if}
    {/each}
  </ul>
</div>

<div class="group {tomorrowTasksCompleted ? 'empty' : ''}">
  <span class="m3-font-title-small">{t("tomorrow")}</span>
  <ul>
    {#each tomorrowTasks as task}
      {#if task.completed !== true}
        <li in:sharedAxisTransition={{ direction: "Y", rightSeam: true }}>
          <div>
            <!-- FIXME CheckboxAnim is not passing click to input -->
            <!-- <CheckboxAnim> -->
            <input
              type="checkbox"
              name="task-{task.id}"
              bind:checked={task.completed}
              on:change={(e) => {
                task.completed = e.currentTarget.checked;
                localStorage.setItem("tasks", JSON.stringify(tasks));
              }}
            />
            <!-- </CheckboxAnim> -->
            {task.text}
          </div>
          <div>
            {#if task.datetime?.time !== "" && task.datetime !== undefined}
              <Litteinfo color="outline">
                {task.datetime?.time}
              </Litteinfo>
            {/if}
            <div class="editbutton">
              <Button
                type="text"
                iconType="full"
                on:click={() => (taskToEditId = task.id)}
                ><Icon icon={iconEdit} /></Button
              >
            </div>
          </div>
        </li>
      {:else}
        <li class="completed" on:load={selfDestruct}></li>
      {/if}
    {/each}
  </ul>
</div>

<div class="group {laterTasksCompleted ? 'empty' : ''}">
  <span class="m3-font-title-small">{t("later")}</span>
  <ul>
    {#each laterTasks as task}
      {#if task.completed !== true}
        <li in:sharedAxisTransition={{ direction: "Y", rightSeam: true }}>
          <div>
            <!-- FIXME CheckboxAnim is not passing click to input -->
            <!-- <CheckboxAnim> -->
            <input
              type="checkbox"
              name="task-{task.id}"
              bind:checked={task.completed}
              on:change={(e) => {
                task.completed = e.currentTarget.checked;
                localStorage.setItem("tasks", JSON.stringify(tasks));
              }}
            />
            <!-- </CheckboxAnim> -->
            {task.text}
          </div>
          <div>
            {#if task.datetime !== undefined}
              <Litteinfo color="outline">
                {task.datetime?.date}
              </Litteinfo>
            {/if}
            <div class="editbutton">
              <Button
                type="text"
                iconType="full"
                on:click={() => (taskToEditId = task.id)}
                ><Icon icon={iconEdit} /></Button
              >
            </div>
          </div>
        </li>
      {:else}
        <li class="completed" on:load={selfDestruct}></li>
      {/if}
    {/each}
  </ul>
</div>

<div class="group">
  <span class="m3-font-title-small">{t("title_completed")}</span>
  <ul>
    {#each tasks.filter((task) => task.completed) as task}
      <li out:sharedAxisTransition={{ direction: "X", rightSeam: false }}>
        <div>
          <!-- FIXME CheckboxAnim is not passing click to input -->
          <!-- <CheckboxAnim> -->
          <input
            type="checkbox"
            name="task-{task.id}"
            bind:checked={task.completed}
            on:change={(e) => {
              task.completed = e.currentTarget.checked;
              localStorage.setItem("tasks", JSON.stringify(tasks));
            }}
          />
          <!-- </CheckboxAnim> -->
          {task.text}
        </div>
        <div class="editbutton delete">
          <Button
            type="text"
            iconType="full"
            on:click={() => {
              tasks = tasks.filter((t) => t.id !== task.id);
              localStorage.setItem("tasks", JSON.stringify(tasks));
            }}><Icon icon={iconTrashCan} /></Button
          >
        </div>
      </li>
    {/each}
  </ul>
</div>

{#if tasks.length === 0}
  <p style="text-align: center;">{t("no_tasks")}</p>
{/if}

<Modal show={taskToEditId !== null}>
  {#if taskToEditId !== null && editedTask !== undefined}
    <EditTask bind:task={editedTask} bind:taskToEditId />
  {/if}
</Modal>

<Modal bind:show={showModal}>
  <AddTask {addTask} bind:showModal bind:newTaskData />
</Modal>

{#if userPreferences.debugMode}
  <pre>
	{JSON.stringify(tasks, null, 2)}
</pre>
{/if}

<style>
  input[type="checkbox"] {
    display: block;
    width: 1rem;
    height: 1rem;
  }
  @keyframes shrinkToZero {
    0% {
      height: 5.5rem;
    }
    100% {
      height: 0rem;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 1rem;
    list-style-type: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 3rem;
  }

  li > div {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
  }

  li .editbutton {
    /* display: none; */
    visibility: hidden;
    align-items: center;
    overflow: hidden;
    width: 0px;
    transition: width 0.3s;
    animation: hideH40 0.5s;
  }

  .asap li .editbutton {
    & button {
      --text: rgb(var(--m3-scheme-on-primary)) !important;
    }
  }

  li .editbutton.delete {
    & button {
      --text: rgb(var(--m3-scheme-error)) !important;
    }
  }

  li.completed {
    display: hidden;
    height: 0px;
    padding: 0px;
    animation: hideV 0.3s;
  }

  li:hover .editbutton,
  li:focus-within .editbutton {
    display: flex;
    visibility: visible;
    width: 40px;
    animation: hideH40 0.5s reverse;
  }

  @keyframes hideH40 {
    0% {
      width: 40px;
      display: block;
    }
    100% {
      width: 0px;
      display: none;
    }
  }

  @keyframes hideV {
    0% {
      height: 48px;
      display: block;
    }
    100% {
      height: 0px;
      display: none;
    }
  }

  ul.asap {
    gap: 0.25rem;
  }

  ul.asap li {
    background-color: rgb(var(--m3-scheme-primary));
    color: rgb(var(--m3-scheme-on-primary));
    border-radius: 1rem;
  }

  .group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;

    /* transition: margin 0.3s; */
  }

  .group.empty {
    animation: hideGroup 0.3s;
    margin: 0px 0;
    overflow: hidden;
  }

  @keyframes hideGroup {
    0% {
      flex-shrink: 0;
      display: block;
      margin-bottom: 1rem;
    }
    100% {
      flex-shrink: 100;
      margin-bottom: 0rem;
      display: none;
    }
  }

  @keyframes hideV20px {
    0% {
      height: 20px;
      display: block;
    }
    100% {
      height: 0px;
      display: none;
    }
  }

  .group.empty > span {
    display: none;
    animation: hideV20px 0.3s;
  }

  .group > span {
    margin-left: 1rem;
  }

  .due {
    background-color: rgb(var(--m3-scheme-error));
    color: rgb(var(--m3-scheme-on-error));
  }
</style>
