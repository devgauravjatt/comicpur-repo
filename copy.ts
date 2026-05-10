//@ts-nocheck
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const source = 'apps/api/build/router.d.mts';
const destination = 'apps/web/hono/app.d.mts';

async function moveFile() {
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);

  console.log('File copied successfully');
}

moveFile();
