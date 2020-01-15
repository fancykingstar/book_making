module.exports = {
  "rewrite": [
      { "from": "/api/(.*)", "to": "http://rc.deflamel.com/api/$1" },
      { "from": "/tariff/(.*)", "to": "http://rc.deflamel.com/tariff/$1" },
      { "from": "/account/(.*)", "to": "http://rc.deflamel.com/account/$1" },
  ]
}
