const app = require("./app");


// set port, listen for requests
const PORT = 5678;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
