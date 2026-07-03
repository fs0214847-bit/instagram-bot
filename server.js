const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "myverifytoken";
const PAGE_ACCESS_TOKEN = "EAAYLBneY4kkBR91cV00AZBkfuYn93u00mt3CtRaZCOiQ1Rbl2YQN7hZA1FCFzQfByXR3Jke9y262SodFHgZA2lASNnjNXFSSeIz6mtwtEVfvoxnZAlhXuy1nCUTiQbOGmw1LWXGcn3LBK2nwSMjFE7OVyWF8MK2aNuKV91RLjNc8C7uZAIlQD17MemnPkCIXe6Km0boAnGiElyxrZAhgVGTrN83FdSO6z2lUNxB5pvbacoFPMJnNJZCMxZAUU3ad3tQP6ZBSlViItfSe63hkFvgClQ7xat7DkI";


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
                message: "Check your DMs 😊"
              },
              {
                params: {
                  access_token: PAGE_ACCESS_TOKEN
                }
              }
            );

            console.log("Comment reply sent");


            // SEND DM
            await axios.post(
              `https://graph.facebook.com/v23.0/me/messages`,
              {
                recipient: {
                  id: userId
                },
                message: {
                  text: `Assalamualayikum! 
Jazakallahu khairan for your interest 💖

Here’s the guide you requested:

https://raisingmuslimkids.gumroad.com/l/zjqbpa

Hope it helps! Let me know if you have any questions 😊`
                },
                messaging_type: "RESPONSE"
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
