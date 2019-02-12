define({ "api": [
  {
    "type": "post",
    "url": "/api/campaigns",
    "title": "Create New Campaign",
    "name": "Create_New_Campaign",
    "group": "Campaigns",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" -d '{ \"params\": { \"campaignLength\": \"30\", \"difficultyLevel\": \"hard\", \"randomEvents\": \"low\", \"startNow\": true } }' https://walkertrekker.herokuapp.com/api/campaigns",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Campaign UUID</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>First day of campaign (not necessarily createdAt date)</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>Last day of campaign</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "currentDay",
            "description": "<p>Current step of campaign (default: 0)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "length",
            "description": "<p>'15', '30', '90'</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "difficultyLevel",
            "description": "<p>'easy', 'hard', 'xtreme'</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "randomEvents",
            "description": "<p>'low', 'mid', 'high'</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "numPlayers",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer[]",
            "optional": false,
            "field": "stepTargets",
            "description": "<p>array of steps each player needs to complete per day</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "inventory",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "inventory.foodItems",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "inventory.medicineItems",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "inventory.weaponItems",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Player[]",
            "optional": false,
            "field": "players",
            "description": "<p>array of player instances associated with this game (default to [] on creation)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"id\": \"9801ce7c-ad31-4c7e-ab91-fe53e65642c5\",\n     \"startDate\": \"2019-02-08\",\n     \"endDate\": \"2019-03-10\",\n     \"currentDay\": 0,\n     \"length\": \"30\",\n     \"difficultyLevel\": \"hard\",\n     \"randomEvents\": \"low\",\n     \"numPlayers\": 0,\n     \"stepTargets\": [\n         6000,\n         0, ...\n     ],\n     \"inventory\": {\n         \"foodItems\": 0,\n         \"weaponItems\": 0,\n         \"medicineItems\": 0\n     },\n     \"players\": []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/campaigns.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "get",
    "url": "/api/campaigns/",
    "title": "Fetch Campaign",
    "name": "Fetch_Campaign",
    "group": "Campaigns",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" -d \"{ campaignId: '4028d623-e955-4b16-a7e4-88b555c6cdf3' }\" https://walkertrekker.herokuapp.com/api/campaigns",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Campaign UUID</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>First day of campaign (not necessarily createdAt date)</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>Last day of campaign</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "currentDay",
            "description": "<p>Current step of campaign (default: 0)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "length",
            "description": "<p>'15', '30', '90'</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "difficultyLevel",
            "description": "<p>'easy', 'hard', 'xtreme'</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "randomEvents",
            "description": "<p>'low', 'mid', 'high'</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "numPlayers",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer[]",
            "optional": false,
            "field": "stepTargets",
            "description": "<p>array of steps each player needs to complete per day</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "inventory",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "inventory.foodItems",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "inventory.medicineItems",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "inventory.weaponItems",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Player[]",
            "optional": false,
            "field": "players",
            "description": "<p>array of player instances associated with this game (default to [] on creation)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"id\": \"9801ce7c-ad31-4c7e-ab91-fe53e65642c5\",\n     \"startDate\": \"2019-02-08\",\n     \"endDate\": \"2019-03-10\",\n     \"currentDay\": 0,\n     \"length\": \"30\",\n     \"difficultyLevel\": \"hard\",\n     \"randomEvents\": \"low\",\n     \"numPlayers\": 0,\n     \"stepTargets\": [\n         6000,\n         0, ...\n     ],\n     \"inventory\": {\n         \"foodItems\": 0,\n         \"weaponItems\": 0,\n         \"medicineItems\": 0\n     },\n     \"players\": []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/campaigns.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "post",
    "url": "/api/campaigns/invite",
    "title": "Invite To Campaign",
    "name": "Invite_To_Campaign",
    "group": "Campaigns",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" -d '{ \"campaignId\": \"9801ce7c-ad31-4c7e-ab91-fe53e65642c5\", \"playerId\": \"7dd089c0-7f4b-4f39-a662-53554834a8f7\", \"number\": \"5035558989\", \"link\": \"(this is optional)\" }' https://walkertrekker.herokuapp.com/api/campaigns/join/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg:",
            "description": "<p>Success</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n   \"msg\": \"SMS invite sent to phone number +15035558989\"\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/campaigns.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "patch",
    "url": "/api/campaigns/join/:campaignId",
    "title": "Join Campaign",
    "name": "Join_Campaign",
    "group": "Campaigns",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" -d '{ \"campaignId\": \"9801ce7c-ad31-4c7e-ab91-fe53e65642c5\", \"playerId\": \"7dd089c0-7f4b-4f39-a662-53554834a8f7\" }' https://walkertrekker.herokuapp.com/api/campaigns/join/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Campaign UUID</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>First day of campaign (not necessarily createdAt date)</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>Last day of campaign</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "currentDay",
            "description": "<p>Current step of campaign (default: 0)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "length",
            "description": "<p>'15', '30', '90'</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "difficultyLevel",
            "description": "<p>'easy', 'hard', 'xtreme'</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "randomEvents",
            "description": "<p>'low', 'mid', 'high'</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "numPlayers",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer[]",
            "optional": false,
            "field": "stepTargets",
            "description": "<p>array of steps each player needs to complete per day</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "inventory",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "inventory.foodItems",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "inventory.medicineItems",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "inventory.weaponItems",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Player[]",
            "optional": false,
            "field": "players",
            "description": "<p>array of player instances associated with this game (default to [] on creation)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"id\": \"9801ce7c-ad31-4c7e-ab91-fe53e65642c5\",\n     \"startDate\": \"2019-02-08\",\n     \"endDate\": \"2019-03-10\",\n     \"currentDay\": 0,\n     \"length\": \"30\",\n     \"difficultyLevel\": \"hard\",\n     \"randomEvents\": \"low\",\n     \"numPlayers\": 0,\n     \"stepTargets\": [\n         6000,\n         0, ...\n     ],\n     \"inventory\": {\n         \"foodItems\": 0,\n         \"weaponItems\": 0,\n         \"medicineItems\": 0\n     },\n     \"players\": []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/campaigns.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "post",
    "url": "/api/players",
    "title": "Create New Player",
    "name": "Create_New_Player",
    "group": "Players",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" -d '{\"displayName\": \"Oscar Robertson\", \"phoneNumber\": * \"5035558989\"}' http://localhost:5000/api/players",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Player UUID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "displayName",
            "description": "<p>Player Name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>Phone Number</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "inActiveGame",
            "description": "<p>True if player is in a game</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"id\": \"a2e8a0da-9b6a-4ead-b783-f57af591cf4a\",\n     \"displayName\": \"Oscar Robertson\",\n     \"phoneNumber\": \"5035558989\",\n     \"inActiveGame\": false\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/players.js",
    "groupTitle": "Players"
  },
  {
    "type": "get",
    "url": "/api/players",
    "title": "Fetch All Players",
    "name": "GetAllPlayers",
    "group": "Players",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" http://localhost:5000/api/players",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Player UUID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "displayName",
            "description": "<p>Player Name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>Phone Number</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "inActiveGame",
            "description": "<p>True if player is in a game</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "campaignId",
            "description": "<p>UUID of current game (if inActiveGame is true, else null)</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "health",
            "description": "<p>Current player health</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "hunger",
            "description": "<p>Current player hunger</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer[]",
            "optional": false,
            "field": "steps",
            "description": "<p>Number of steps per campaign day</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  HTTP/1.1 200 OK\n[\n {\n    \"id\": \"58568813-712d-451b-9125-4103c6f1d7e5\",\n    \"displayName\": \"Wilt Chamberlain\",\n    \"phoneNumber\": \"5035551582\",\n    \"inActiveGame\": false,\n    \"campaignId\": null,\n    \"health\": null,\n    \"hunger\": null,\n     \"steps\": null\n   }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/players.js",
    "groupTitle": "Players"
  }
] });
