require('dotenv').config()
const fetch = require('node-fetch')

const test = async playerId => {
  const url = process.env.ENDPOINT + `/api/players/${playerId}`
  const data = {
    method: 'GET',
    headers: {
      "appkey": process.env.CLIENT_APP_KEY,
      "body": '{}',
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await fetch(url, data).then(response => response.json())
    console.log(response)
  }

  catch (err) {
    console.log(err)
  }
}

test('3e1a793a-3906-4012-ac59-bb1aa6553a19')
