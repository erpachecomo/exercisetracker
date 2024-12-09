const express = require("express");
const app = express();
const cors = require("cors");
const { Exercise, User } = require(__dirname + "/mongoose");
require("dotenv").config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// USERS
/**
 * You can POST to /api/users with form data username to create a new user.
 * The returned response from POST /api/users with form data username will be an object with username and _id properties.
 */
app.post("/api/users", async function (req, res) {
  const data = req.body;
  const user = new User(data);
  try {
    const { username, _id } = await user.save();
    res.json({ username, _id });
  } catch (err) {
    console.error(err);
    return res.json({ err });
  }
});
/**
 * 4. You can make a GET request to /api/users to get a list of all users.
 * 5. The GET request to /api/users returns an array.
 * 6. Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.
 */
app.get("/api/users", async (req, res) => {
  try {
    const data = await User.find().select("-__v").exec();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.json({ err });
  }
});
/**
 * 7. You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
 * 8. The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
 */
app.post("/api/users/:id/exercises", async function (req, res) {
  const { description, duration, date: dateParam } = req.body;
  const userId = req.params.id;
  const date = dateParam ? new Date(dateParam) : new Date();

  try {
    const user = await User.findOne({ _id: userId });
    const exercise = new Exercise({
      description,
      duration,
      date,
      username: user.username,
    });
    const newExercise = await exercise.save();
    return res.json({
      username: user.username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date.toDateString(),
      _id: newExercise._id,
    });
  } catch (err) {
    console.error(err);
    return res.json({ err });
  }
});

/**
 * 9. You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
 * 10. A request to a user's log GET /api/users/:_id/logs returns a user object with a count property representing the number of exercises that belong to that user.
 * 11. A GET request to /api/users/:_id/logs will return the user object with a log array of all the exercises added.
 * 12. Each item in the log array that is returned from GET /api/users/:_id/logs is an object that should have a description, duration, and date properties.
 * 13. The description property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string.
 * 14. The duration property of any object in the log array that is returned from GET /api/users/:_id/logs should be a number.
 * 15. The date property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string. Use the dateString format of the Date API.
 * 16. You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
 */
app.get("/api/users/:_id/logs", async (req, res) => {
  const _id = req.params._id;
  const { from, to, limit } = req.query;
  try {
    const { username } = await User.findOne({ _id });
    const query = Exercise.find({ username });
    if (limit && Number(limit)) {
      query.limit(limit);
    }
    if (from) {
      const fromDate = new Date(from);
      query.find({ date: { $gte: fromDate } });
    }
    if (to) {
      const toDate = new Date(to);
      query.find({ date: { $lte: toDate } });
    }
    const logs = await query.exec();
    const count = logs.length;
    const response = {
      username,
      count,
      _id,
      log: logs.map(({ description, duration, date }) => ({
        description,
        duration,
        date: date.toDateString(),
      })),
    };
    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.json({ err });
  }
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
