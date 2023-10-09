const express = require("express");
const app = express();
const cors = require("cors");

require("./Config/database");

app.use(express.json());
app.use(cors());

const moviesRouter = require("./Routers/moviesRouter");
const userRouter = require("./Routers/userRouter");
const subsRouter = require("./Routers/subRouter");
const memberRouter = require("./Routers/memberRouter")

app.use("/movies", moviesRouter);
app.use("/user", userRouter);
app.use("/subs", subsRouter);
app.use("/members",memberRouter);

app.listen(8000, () => {
  console.log("listening on port 8000");
});
