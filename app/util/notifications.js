const { Expo } = require('expo-server-sdk')
const expo = new Expo()

async function sendNotifications(messages) {
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (err) {
      console.error(error);
    }
  }
}

module.exports = {
  sendNotifications,
}
