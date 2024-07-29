// bot-handlers.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export async function registerHandlers(bot) {
  //ESM获取路径的方法
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const handlersDir = path.resolve(__dirname, './handlers');

  console.log('registerHandlers-->进入注册函数 path=' + handlersDir);

  try {
    const files = await fs.readdir(handlersDir);
    const handlerPromises = files
      .filter(file => file.endsWith('.js'))
      .map(async file => {
        const handlerName = path.parse(file).name;
        const handlerPath = path.join(handlersDir, file);
        const fileURL = new URL(`file://${handlerPath}`);

        try {
          const handlerModule = await import(fileURL);
          const handler = handlerModule.default || handlerModule[handlerName];

          if (typeof handler === 'function') {
            bot[handlerName] = handler;
            console.log(`Successfully registered handler: ${handlerName}`);
          } else {
            console.log(`Warning: ${handlerName} does not export a valid handler function`);
          }
        } catch (error) {
          console.log(`Error importing ${handlerName}:`, error);
        }
      });

    await Promise.all(handlerPromises);
  } catch (error) {
    console.log('Error reading handlers directory:', error);
  }
}