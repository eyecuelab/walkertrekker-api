define({ "api": [
  {
    "type": "post",
    "url": "/api/players",
    "title": "Post",
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
    "title": "Get",
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
