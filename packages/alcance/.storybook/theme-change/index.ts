/**
 * to load the built addon in this test Storybook
 */
function previewAnnotations(entry = []) {
    return [...entry, require.resolve("./preset/preview.ts")];
  }
  
  function managerEntries(entry = []) {
    return [...entry, require.resolve("./preset/manager.ts")];
  }
  
  module.exports = {
    managerEntries,
    previewAnnotations,
  };