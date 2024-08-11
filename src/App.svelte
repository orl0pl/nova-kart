<script lang="ts">
  import {
    DynamicScheme,
    Hct,
    MaterialDynamicColors,
    Scheme,
    SchemeContent,
    SchemeExpressive,
    SchemeTonalSpot,
    sourceColorFromImage,
    themeFromImage,
  } from "@material/material-color-utilities";
  import {
    Button,
    ChipChooser,
    FAB,
    Icon,
    NavDrawer,
    NavDrawerButton,
    serializeScheme,
    sharedAxisTransition,
    StyleFromScheme,
    Switch,
    Tabs,
    TabsLink,
    TextField,
  } from "m3-svelte";
  import Tasks from "./tasks.svelte";
  import { onMount } from "svelte";
  import iconSearch from "@ktibow/iconset-mdi/search";
  import iconGoogle from "@ktibow/iconset-mdi/google";
  import iconFormatListChecks from "@ktibow/iconset-mdi/format-list-checks";
  import iconCog from "@ktibow/iconset-mdi/cog";
  import iconAdd from "@ktibow/iconset-mdi/add";
  import { t } from "./lib";

  let resData: {
    start_date: string;
    end_date: string;
    url: string;
    copyright: string;
    copyright_url: string;
  } | null = null;
  let image: HTMLImageElement;
  let image_color = 2137;
  let userPreferences: {
    useDefaultLanguage: boolean | undefined;
    debugMode: boolean;
    customTheme: boolean;
    customThemeColor: string;
    language: string;
  };

  let fABClickFunction = () => {};

  onMount(() => {
    // fetch https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=random to get bing image

    fetch(
      "https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-GB"
    )
      .then((res) => res.json())
      .then((data) => {
        resData = data;
        if (data && data.url && image) {
          sourceColorFromImage(image).then((color) => {
            image_color = color;
            console.log(image_color, "iamge_color");
          });

          console.log(Hct.fromInt(image_color).hue, "hct");
        }
      });
    if (localStorage.getItem("userPreferences") !== null) {
      userPreferences = JSON.parse(
        localStorage.getItem("userPreferences") || ""
      );
    } else {
      userPreferences = {
        debugMode: false,
        customTheme: false,
        customThemeColor: "",
        useDefaultLanguage: true,
        language: navigator.language,
      };
      localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
    }
  });
  let time = new Date();

  setInterval(() => {
    time = new Date();
  }, 1000);

  function updateUserPreferences() {
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  }

  let activeTab: "tasks" | "settings" = "tasks";
  let searchText = "";

  function searchFn() {
    const button = document.querySelector("#search") as HTMLButtonElement;
    button.click();
  }
</script>

<img
  bind:this={image}
  alt="bing wallpaper"
  class="wallpaper"
  crossorigin="anonymous"
  loading="eager"
  src={resData?.url}
/>

{#if image_color !== 2137}
  <StyleFromScheme
    lightScheme={serializeScheme(
      new SchemeTonalSpot(
        Hct.fromInt(
          userPreferences.customTheme
            ? parseInt(userPreferences.customThemeColor.replace("#", ""), 16)
            : image_color
        ),
        false,
        0
      )
    )}
    darkScheme={serializeScheme(
      new SchemeContent(
        Hct.fromInt(
          userPreferences.customTheme
            ? parseInt(userPreferences.customThemeColor.replace("#", ""), 16)
            : image_color
        ),
        true,
        0
      )
    )}
  />

  <div class="time-container">
    <h1 class="m3-font-display-large">
      <!-- <span id="bg">{time.toTimeString().split(' ')[0]}</span> -->
      <span id="fg">{time.toTimeString().split(" ")[0]}</span>
    </h1>
    <h2 class="m3-font-title-large">
      {time.toLocaleDateString(
        userPreferences.useDefaultLanguage
          ? navigator.language
          : userPreferences.language,
        { weekday: "long", month: "long", day: "numeric" }
      )}
    </h2>
    <div class="searchbox">
      <Icon height={"24px"} width={"24px"} icon={iconGoogle} />
      <!-- svelte-ignore a11y-autofocus -->
      <input
        type="search"
        placeholder={t("search_label")}
        autofocus
        bind:value={searchText}
        on:keydown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            searchFn();
          }
        }}
      />
      <Button
        type="text"
        iconType="full"
        extraOptions={{ id: "search" }}
        on:click={() => {
          document.location.href = "https://google.com/search?q=" + searchText;
        }}><Icon icon={iconSearch} /></Button
      >
    </div>
  </div>

  <div class="task-container">
    <div class="sticky">
      <Tabs
        bind:tab={activeTab}
        items={[
          { name: t("tab_tasks"), value: "tasks", icon: iconFormatListChecks },
          // { name: 'Summary', value: 'tasks', icon: iconFormatListChecks }, // SOON (tm)
          { name: t("tab_settings"), value: "settings", icon: iconCog },
        ]}
      />
    </div>

    {#if activeTab === "tasks"}
      <div
        class="tasks"
        transition:sharedAxisTransition={{ direction: "X", rightSeam: true }}
      >
        <Tasks {userPreferences} bind:fABClickFunction />
      </div>
    {:else if activeTab === "settings"}
      <div
        class="settings"
        transition:sharedAxisTransition={{ direction: "X", rightSeam: false }}
      >
        <ul>
          <li>
            {t("settings_custom_theme")}
            <Switch
              bind:checked={userPreferences.customTheme}
              on:change={updateUserPreferences}
            />
          </li>

          {#if userPreferences.customTheme}
            <li>
              {t("settings_custom_theme_color")}
              {userPreferences.customThemeColor}
              <input
                type="color"
                bind:value={userPreferences.customThemeColor}
                on:change={updateUserPreferences}
              />
            </li>
          {/if}
          <li>
            {t("settings_use_default_language")}
            <Switch
              bind:checked={userPreferences.useDefaultLanguage}
              on:change={updateUserPreferences}
            />
          </li>
          {#if !userPreferences.useDefaultLanguage}
            <li>
              {t("settings_language")}
              <select
                bind:value={userPreferences.language}
                on:change={updateUserPreferences}
              >
                {#each [{ name: "English", value: "en-US" }, { name: "Polish", value: "pl-PL" }] as language}
                  <option value={language.value}>{language.name}</option>
                {/each}
              </select>
            </li>
          {/if}
          <li>
            {t("settings_debug_mode")}
            <Switch
              bind:checked={userPreferences.debugMode}
              on:change={updateUserPreferences}
            />
          </li>

          {#if userPreferences.debugMode}
            <li>
              <span>{t("settings_user_navigator_language")}</span>
              {navigator.language}
            </li>
          {/if}
        </ul>
        <Button
          type="filled"
          on:click={() => {
            updateUserPreferences();
            location.reload();
          }}>{t("save")}</Button
        >
      </div>
    {/if}
  </div>
{/if}

{#if activeTab === "tasks"}
  <div
    class="FAB"
    id="FAB"
    transition:sharedAxisTransition={{ direction: "X", rightSeam: false }}
  >
    <FAB
      color="primary"
      size="normal"
      text={t("task_add")}
      icon={iconAdd}
      extraOptions={{ tabindex: 1 }}
      on:click={() => {
        fABClickFunction();
      }}
    />
  </div>
{/if}

<style>
  * {
    box-sizing: border-box;
  }
  .wallpaper {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  img {
    background-color: rgb(var(--m3-scheme-background)) black;
  }
  .time-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .time-container h1,
  h2 {
    text-shadow:
      0px 0px 10px rgb(0, 0, 0),
      0px 0px 20px rgb(0, 0, 0),
      0px 0px 30px rgb(0, 0, 0);
  }

  .task-container {
    flex: 0;
    min-width: 500px;
    background-color: rgb(var(--m3-scheme-background));
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 3rem 0 0 3rem;
    position: relative;
  }

  .searchbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    background-color: rgb(var(--m3-scheme-surface));
    border-radius: 3rem;
    padding: 0.5rem 1rem;
    width: 300px;
  }

  .searchbox input {
    flex: 1;
    height: 100%;
    background-color: transparent;
    color: rgb(var(--m3-scheme-on-surface));
    font-size: 1rem;
    border: none;
    outline: none;
  }

  .sticky {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .tasks,
  .settings {
    position: absolute;
    width: 100%;
    padding: 1rem;
    padding-bottom: 3rem;
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

  #FAB {
    position: fixed;
    bottom: 3rem;
    right: 2rem;
  }
</style>
