import '../src/styles.css';

const preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'slate',
      values: [
        { name: 'slate', value: '#0f172a' },
        { name: 'paper', value: '#f8fafc' },
      ],
    },
  },
};

export default preview;
