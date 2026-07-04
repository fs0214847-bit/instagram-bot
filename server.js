const PAGE_ID = "1138065599398604";
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "myverifytoken";
const PAGE_ACCESS_TOKEN = "EAAYLBneY4kkBR1pa3jBtP33ScmLJBcNdfLFRtgPn5Ix4gUtqH2y5ebyQEvTssuMirLrJ5ZCV2recIKrJjzoBqAqcX5CeAUxDWkJnTS5GVJSUq4bckTm6ZC4Rl02WYGcRaA37gZBuUosvlDMfMmxFas03kEZAyMV4dl4IPjlyLZAZBKPthPP5AE9N4OaSrrknFhH5DtBpZATkEUJODeuIQrEQuLFbNOb3tSYixOt0si1dWMPyAtkg8SpAVZA4C5yUg4z6HnnE00NzjdvWV3vcX0EftvAEjX87ivkZD";


// VERIFY WEBHOOK
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});


// RECEIVE WEBHOOK EVENTS
app.post("/webhook", async (req, res) => {

  try {

    const entries = req.body.entry;

    for (const entry of entries) {

      const changes = entry.changes;

      for (const change of changes) {

        if (change.field === "comments") {

          const commentText = change.value.text?.toLowerCase();

          // DETECT "guide"
          if (
            commentText &&
            commentText.includes("guide")
          ) {

            const commentId = change.value.id;
            const userId = change.value.from.id;

            // PUBLIC COMMENT REPLY
  await axios.post(
  `https://graph.facebook.com/v23.0/${commentId}/replies`,
  {
    message: "Assalamualayikum 😊 Here’s the guide: https://raisingmuslimkids.gumroad.com/l/zjqbpa"
  },
  {
    params: {
      access_token: PAGE_ACCESS_TOKEN
    }
  }
);
            console.log("DM sent");
          }
        }
      }
    }

    res.sendStatus(200);

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.sendStatus(500);
  }
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
