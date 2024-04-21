import { Hono } from 'hono';
import { poweredBy } from 'hono/powered-by';
import { bearerAuth } from 'hono/bearer-auth';

type Bindings = {
  TOKEN: string;
  BASE_URL: string;
  IMAGE_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', poweredBy());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.put(
  '/upload',
  async (c, next) => bearerAuth({ token: c.env.TOKEN })(c, next),
  async (c) => {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    if (!file) {
      return c.json({ error: 'Invalid file' }, 400);
    }

    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return c.json({ error: 'Invalid file type' }, 400);
    }

    const uuid = crypto.randomUUID();
    const bucket = c.env.IMAGE_BUCKET;
    const key = `images/${uuid}`;
    await bucket.put(key, file);

    const url = `${c.env.BASE_URL}/${key}`;

    return c.json({ imageLink: url });
  }
);

export default app;
