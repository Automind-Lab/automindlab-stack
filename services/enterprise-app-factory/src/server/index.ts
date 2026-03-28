import { app } from "./app.js";

const port = Number(process.env.AUTOMIND_APP_FACTORY_PORT ?? 3102);

app.listen(port, () => {
  console.log(`Enterprise App Factory listening on http://127.0.0.1:${port}`);
});
