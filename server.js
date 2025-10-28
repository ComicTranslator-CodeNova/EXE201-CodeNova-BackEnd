const app = require("./src/app");
const { PORT, NODE_ENV } = require("./src/config/env");

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT} (${NODE_ENV})`);
});
