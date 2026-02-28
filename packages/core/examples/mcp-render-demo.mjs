import { createMCPServer, LotosMCPClient } from '../dist/index.js';

const port = 3188;
const server = createMCPServer(port);

server.listen(port, async () => {
  const client = new LotosMCPClient({
    baseUrl: `http://127.0.0.1:${port}`,
  });

  try {
    const health = await client.health();
    const button = await client.component('button');
    const render = await client.renderComponent({
      framework: 'react',
      component: 'button',
      props: {
        variant: 'primary',
        size: 'md',
      },
      children: 'Launch sequence',
    });

    console.log('health', health.status, health.version);
    console.log('component', button);
    console.log('render', render.code);
  } finally {
    server.close();
  }
});
