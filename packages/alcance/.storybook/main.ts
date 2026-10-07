import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from '@storybook/html-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  // Required
  framework: "@storybook/html-vite",

  stories: ['../src/**/*.@(mdx)', '../src/**/*.stories.@(ts|tsx)'],
  staticDirs: ['../src/stories/', '../src/stories/assets/'],

  core: {
    disableWhatsNewNotifications: true,
  },

  // Optional
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      assetsInclude: ['**/*.md'],
      define: { 'process.env': {} },
    });
  },

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "./theme-change/index",
    "@chromatic-com/storybook",
    "storybook-addon-tag-badges",
    "@storybook/addon-designs",
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],

  docs: {
    defaultName: 'Documentação'
  },

  features: {
    backgrounds: false,
  }
};

export default config;