const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "myverifytoken";

/*
PASTE YOUR PAGE ACCESS TOKEN BELOW
*/
const PAGE_ACCESS_TOKEN = "PASTE_TOKEN_HERE";


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


// RECEIVE EVENTS
app.post("/webhook", async (req, res) => {

  try {

    const entry = req.body.entry;

    for (const item of entry) {

      const changes = item.changes;

      for (const change of changes) {

        if (change.field === "comments") {

          const commentText = change.value.text?.toLowerCase();

          // IF USER COMMENTS "link"
          if (commentText && commentText.includes("link")) {

            const commentId = change.value.id;

            // PUBLIC REPLY
            await axios.post(
              `https://graph.facebook.com/v23.0/${commentId}/replies`,
              {
                message: "Sent you a DM 😊"
              },
              {
                params: {
                  access_token: PAGE_ACCESS_TOKEN
                }
              }
            );

            console.log("Reply sent");
          }
        }
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.sendStatus(500);
  }
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
