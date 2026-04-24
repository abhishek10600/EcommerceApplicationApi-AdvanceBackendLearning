import { app } from "./app.js";
import { PORT } from "./config/env.config.js";

const port = PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
