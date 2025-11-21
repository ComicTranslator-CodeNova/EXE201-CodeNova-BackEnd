const app = require("./src/app");
const { PORT, NODE_ENV } = require("./src/config/env");

console.log("MOMO PARTNER =", process.env.MOMO_PARTNER_CODE);

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT} (${NODE_ENV})`);
});
