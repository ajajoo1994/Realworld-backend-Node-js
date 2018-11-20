const { db } = require("./db/index");

let app = require("./server");
var port = process.env.PORT || 3000;

db.sync()
  .then(() => {
    console.log("Database synced");
    app.listen(port, () => {
      console.log(`Server started http://localhost:${port}`);
    });
  })
  .catch(console.error);
