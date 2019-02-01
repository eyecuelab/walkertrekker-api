define({ "api": [  {    "type": "post",    "url": "/api/login",    "title": "Login with code",    "name": "PostLogin",    "group": "Auth",    "examples": [      {        "title": "Example usage:",        "content": "curl -X POST -H \"Content-type: application/json\" -H \"appkey: abc\" -d '{\"code\":\"12345\"}' http://localhost:5000/api/login",        "type": "curl"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "auth_token",            "description": "<p>Access token</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"auth_token\": \"dc16a136b95d24267606dc9cf297ce756199f96b\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "app/routes/auth.js",    "groupTitle": "Auth"  },  {    "type": "post",    "url": "/api/verify",    "title": "Verify phone number",    "name": "PostVerifyPhone",    "group": "Auth",    "examples": [      {        "title": "Example usage:",        "content": "curl -X POST -H \"Content-type: application/json\" -H \"appkey: abc\" -d '{\"phone\":\"1231231234\"}' http://localhost:5000/api/verify",        "type": "curl"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "phone",            "description": "<p>Phone number.</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "app/routes/auth.js",    "groupTitle": "Auth"  },  {    "type": "delete",    "url": "/api/games/:accessToken",    "title": "Delete",    "name": "DeleteGame",    "group": "Games",    "examples": [      {        "title": "Example usage:",        "content": "curl -X DELETE -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" http://localhost:5000/api/games/1111-1111-1111-1111",        "type": "curl"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "app/routes/games.js",    "groupTitle": "Games"  },  {    "type": "get",    "url": "/api/games/:accessToken",    "title": "Get",    "name": "GetGame",    "group": "Games",    "examples": [      {        "title": "Example usage:",        "content": "curl -X GET -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" http://localhost:5000/api/games/1111-1111-1111-1111",        "type": "curl"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>Game uid</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "accessToken",            "description": "<p>Access Token</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "player1",            "description": "<p>Game initiator profile information</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "player1.id",            "description": "<p>Id</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "player1.username",            "description": "<p>First name</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "player1.imageUrl",            "description": "<p>Image url</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "player2",            "description": "<p>Opponent profile information</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "player2.id",            "description": "<p>Id</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "player2.username",            "description": "<p>First name</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "player2.imageUrl",            "description": "<p>Image url</p>"          },          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "boards",            "description": "<p>Boards list</p>"          },          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "manaItems",            "description": "<p>Mana items list</p>"          },          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "goldItems",            "description": "<p>Gold items list</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 123,\n  \"accessToken\": 123,\n  \"player1\": {},\n  \"player2\": {},\n  \"boards\": [],\n  \"manaItems\": [],\n  \"goldItems\": []\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "app/routes/games.js",    "groupTitle": "Games"  },  {    "type": "post",    "url": "/api/games/:accessToken/events",    "title": "Post game event",    "name": "PostEvent",    "group": "Games",    "examples": [      {        "title": "Example usage:",        "content": "curl -X POST -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" -d '{\"key\": \"value\"}' http://localhost:5000/api/games/1111-1111-1111-1111/events",        "type": "curl"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "app/routes/games.js",    "groupTitle": "Games"  },  {    "type": "post",    "url": "/api/games",    "title": "Join",    "name": "PostGame",    "group": "Games",    "examples": [      {        "title": "Example usage:",        "content": "curl -X POST -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" -d '{\"boards\": [], \"manaItems\": [], \"gameItems\": []}' http://localhost:5000/api/games",        "type": "curl"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>Game uid</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "accessToken",            "description": "<p>Access Token</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "player1",            "description": "<p>Game initiator profile information</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "player1.id",            "description": "<p>Id</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "player1.username",            "description": "<p>First name</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "player1.imageUrl",            "description": "<p>Image url</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "player2",            "description": "<p>Opponent profile information</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "player2.id",            "description": "<p>Id</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "player2.username",            "description": "<p>First name</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "player2.imageUrl",            "description": "<p>Image url</p>"          },          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "boards",            "description": "<p>Boards list</p>"          },          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "manaItems",            "description": "<p>Mana items list</p>"          },          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "goldItems",            "description": "<p>Gold items list</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 123,\n  \"accessToken\": 123,\n  \"player1\": {},\n  \"player2\": {},\n  \"boards\": [],\n  \"manaItems\": [],\n  \"goldItems\": []\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "app/routes/games.js",    "groupTitle": "Games"  },  {    "type": "delete",    "url": "/api/profile",    "title": "Delete",    "name": "DeleteProfile",    "group": "Profile",    "examples": [      {        "title": "Example usage:",        "content": "curl -X DELETE -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" http://localhost:5000/api/profile",        "type": "curl"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "app/routes/users.js",    "groupTitle": "Profile"  },  {    "type": "get",    "url": "/api/profile",    "title": "User profile",    "name": "GetProfile",    "group": "Profile",    "examples": [      {        "title": "Example usage:",        "content": "curl -X GET -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" http://localhost:5000/api/profile",        "type": "curl"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "id",            "description": "<p>User id</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>First name</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "phone",            "description": "<p>Phone number</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "imageUrl",            "description": "<p>Image url</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "info",            "description": "<p>Info</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 123,\n  \"username\": \"Bob\",\n  \"phone\": \"+1231231234\",\n  \"imageUrl\": \"http://example.com/image.jpg\",\n  \"info\": {}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "app/routes/users.js",    "groupTitle": "Profile"  },  {    "type": "patch",    "url": "/api/profile",    "title": "Update user profile",    "name": "PatchProfile",    "group": "Profile",    "examples": [      {        "title": "Example usage:",        "content": "curl -X PATCH -H \"Content-type: application/json\" -H \"appkey: abc\" -H \"auth_token: abc\" -d '{\"username\":\"Jim\", \"email\": \"email@example.com\", \"imageUrl\":\"http://test.com.a.jpg\", \"info\": \"{'something': 'value'}\"}' http://localhost:5000/api/profile",        "type": "curl"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "id",            "description": "<p>User id</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>First name</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "phone",            "description": "<p>Phone number</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "imageUrl",            "description": "<p>Image url</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "info",            "description": "<p>Info</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 123,\n  \"username\": \"Bob\",\n  \"phone\": \"+1231231234\",\n  \"info\": {},\n  \"imageUrl\": \"http://example.com/image.jpg\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "app/routes/users.js",    "groupTitle": "Profile"  }] });
