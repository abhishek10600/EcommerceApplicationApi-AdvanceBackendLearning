import { app } from "./app.js";
import { PORT } from "./config/env.config.js";
import redis from "./lib/redis.js";

const port = PORT;

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
});
