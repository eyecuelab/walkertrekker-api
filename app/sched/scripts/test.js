require('dotenv').config()

const { sendNotifications } = require('../../util/notifications')
const { Expo } = require('expo-server-sdk')
const expo = new Expo()

async function notifications() {
  const josh = {
    to: 'ExponentPushToken[BuxOuTPmOosgZE9z91tKN1]',
    body: 'This is Joe say hi in slack if you got this',
    sound: 'default',
    data: {
      type: 'test',
      data: {},
    }
  }

  const joe = {
    to: 'ExponentPushToken[5NluvuF7RehX72unMC3esb]',
    body: 'This is Joe say howdy in slack if you got this',
    sound: 'default',
    data: {
      type: 'test',
      data: {},
    }
  }

  const messages = [joe]

  await sendNotifications(messages)

  process.exit(0)
}

notifications()
