require('dotenv').config()

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const Twilio = require('twilio')
const client = Twilio(twilioAccountSid, twilioAuthToken)

// send SMS
// const msg = `What up. walkertrekker://invite/9801ce7c-ad31-4c7e-ab91-fe53e65642c5`
// const phone = '+19712357572'
// client.messages
//   .create({
//      body: msg,
//      from: process.env.TWILIO_NUMBER,
//      to: phone
//    })
//   .then(message => console.log(message))

// lookup phone number
client.lookups.phoneNumbers('5038470304').fetch()
.then(res => {
  console.log(res)
}).catch(err => console.log(err.message))
//
// result:
// { [Function: PhoneNumberListInstance]
//   _version:
//    V1 {
//      _domain:
//       Lookups {
//         twilio: [Twilio],
//         baseUrl: 'https://lookups.twilio.com',
//         _v1: [Circular] },
//      _version: 'v1',
//      _phoneNumbers: [Circular] },
//   _solution: {},
//   get: [Function: get] }
// PS C:\Users\fries\Desktop\projects\walkertrekker-api> node twilio.js
// PhoneNumberInstance {
//   _version:
//    V1 {
//      _domain:
//       Lookups {
//         twilio: [Twilio],
//         baseUrl: 'https://lookups.twilio.com',
//         _v1: [Circular] },
//      _version: 'v1',
//      _phoneNumbers:
//       { [Function: PhoneNumberListInstance] _version: [Circular], _solution: {}, get: [Function: get] } },
//   callerName: null,
//   countryCode: 'US',
//   phoneNumber: '+15038470304',
//   nationalFormat: '(503) 847-0304',
//   carrier:
//    { mobile_country_code: '310',
//      mobile_network_code: '150',
//      name: 'AT&T Wireless',
//      type: 'mobile',
//      error_code: null },
//   addOns: null,
//   url:
//    'https://lookups.twilio.com/v1/PhoneNumbers/+15038470304?Type=carrier',
//   _context: undefined,
//   _solution: { phoneNumber: '+15038470304' } }
