// Crazynewworld: on the appearance settings pages (the user's and the admin's
// site defaults), follow the selected theme:
// - offer the wallpapers the theme lists in config/themes.yml (`wallpapers:`)
// - hide the color scheme ("Mode") choice when the theme forces one
//   (`color_scheme:`); the user's saved choice is kept and applies again
//   when they switch to another theme.
// The data comes from SettingsHelper#themes_select_collection.

import { on } from 'delegated-events';

const THEME_SELECT =
  '#user_settings_attributes_theme, #form_admin_settings_theme';

const parseWallpapers = (json: string | undefined): Record<string, string> => {
  if (!json) return {};

  try {
    return JSON.parse(json) as Record<string, string>;
  } catch {
    return {};
  }
};

const updateColorScheme = (form: HTMLFormElement, option: HTMLOptionElement) => {
  const container = form
    .querySelector('.user_settings_web\\.color_scheme')
    ?.closest<HTMLElement>('.horizontal-options');
  if (!container) return;

  container.hidden = !!option.dataset.forcedColorScheme;
};

const updateWallpapers = (form: HTMLFormElement, option: HTMLOptionElement) => {
  const wrapper = form.querySelector<HTMLDivElement>(
    '.user_settings_web\\.wallpaper .label_input__wrapper, .form_admin_settings_wallpaper .label_input__wrapper',
  );
  const container = wrapper?.closest<HTMLElement>('.horizontal-options');
  if (!wrapper || !container) return;

  const hiddenInput =
    wrapper.querySelector<HTMLInputElement>('input[type=hidden]');
  if (!hiddenInput) return;

  const inputName = hiddenInput.name;
  const idPrefix = wrapper.closest('.form_admin_settings_wallpaper')
    ? 'form_admin_settings_wallpaper'
    : 'user_settings_attributes_web.wallpaper';
  const selected = form.querySelector<HTMLInputElement>(
    `input[name="${inputName}"]:checked`,
  )?.value;

  const wallpapers = parseWallpapers(option.dataset.wallpapers);

  // A theme without wallpapers only hides the choice, so the saved one is
  // still submitted and comes back when switching to a theme that has it.
  container.hidden = Object.keys(wallpapers).length === 0;
  if (container.hidden) return;

  wrapper.querySelectorAll('span.radio').forEach((element) => {
    element.remove();
  });

  for (const [wallpaper, translation] of Object.entries(wallpapers)) {
    const span = document.createElement('span');
    const label = document.createElement('label');
    const input = document.createElement('input');

    input.className = 'radio_buttons optional';
    input.type = 'radio';
    input.value = wallpaper;
    input.name = inputName;
    input.id = `${idPrefix}_${wallpaper}`;
    input.checked = wallpaper === selected;

    label.htmlFor = input.id;
    label.appendChild(document.createTextNode(translation));
    label.appendChild(input);

    span.className = 'radio';
    span.appendChild(label);

    wrapper.appendChild(span);
  }

  if (!selected || !(selected in wallpapers)) {
    const first = wrapper.querySelector<HTMLInputElement>('input[type=radio]');
    if (first) first.checked = true;
  }
};

export const updateCznwSettingsFromTheme = (themeSelect: EventTarget | null) => {
  if (!(themeSelect instanceof HTMLSelectElement) || !themeSelect.form) return;

  const option = themeSelect.options[themeSelect.selectedIndex];
  if (!option) return;

  updateColorScheme(themeSelect.form, option);
  updateWallpapers(themeSelect.form, option);
};

export const setupCznwAppearanceSettings = () => {
  updateCznwSettingsFromTheme(document.querySelector(THEME_SELECT));
};

on('change', THEME_SELECT, ({ target }) => {
  updateCznwSettingsFromTheme(target);
});
