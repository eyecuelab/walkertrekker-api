const { Expo } = require('expo-server-sdk');
const expo = new Expo()
const messages = []
const message = {
  to: 'ExponentPushToken[yFGMZrE2YY1NSweba-j_J4]',
  sound: 'default',
  body: 'Hey there buddy check out this great push notification',
  data: { hi: 'hi there' },
}
messages.push(message)

let chunks = expo.chunkPushNotifications(messages);
console.log('chunks: ', chunks)
let tickets = [];
(async () => {
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
    } catch (error) {
      console.error(error);
    }
  }
})();
