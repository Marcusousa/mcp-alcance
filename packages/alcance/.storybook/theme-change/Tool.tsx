import React, { memo, useCallback, useEffect } from "react";
import { useGlobals, useStorybookApi } from 'storybook/manager-api';
import { IconButton } from "storybook/internal/components";
import { MoonIcon, SunIcon } from '@storybook/icons';
import { ADDON_ID, DARK_MODE, TOOL_ID } from "./constants";

export const Tool = memo(function toggleDark() {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();
  const isActive = [true, 'true'].includes(globals[DARK_MODE]);

  const toggleDarkMode = useCallback(
    () =>
      updateGlobals({
        [DARK_MODE]: !isActive,
      }),
    [isActive]
  );

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle Measure [O]',
      defaultShortcut: ['O'],
      actionName: 'outline',
      showInMenu: true,
      action: toggleDarkMode,
    });
  }, [toggleDarkMode, api]);

  return (
    <IconButton
      key={TOOL_ID}
      active={isActive}
      title={isActive ? `Ver no tema claro` : `Ver no tema escuro`}
      aria-label={isActive ? `Ver no tema claro` : `Ver no tema escuro`}
      onClick={toggleDarkMode}
    >
      {isActive ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
    </IconButton>
  );
});
