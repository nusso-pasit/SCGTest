var express = require('express');
const axios = require('axios');

var router = express.Router();
const {G_MAP_KEY, LINE_CHN_ACCTOKEN} = require('../config');

const regression = require('regression');
/* GET users listing. */
router.get('/', function (req, res, next) {
  msg = 'respond with a resource';
  res.send({msg});
});

//X, 5, 9, 15, 23, Y, Z  - Please create a new function for finding X, Y, Z value
router.get('/xyz', function (req, res, next) {
  const input_raw = req.query.input_raw;
  const inputs = input_raw.split(",");
  const inputs_with_index = inputs.map((val, idx) => {
    const num_val = parseFloat(val);
    if (!isNaN(num_val)) {
      return [idx, num_val];
    } else {
      return [idx, val.trim()];
    }
  });
  const regress_tests = inputs_with_index.filter((val) => {
    const indexofval = ['X', 'Y', 'Z'].indexOf(val[1]);
    return indexofval < 0
  });


  const result = regression.linear(regress_tests);
  const c = result.equation[0];
  const b = result.equation[1];
  let X = inputs_with_index.filter((val) => ['X'].indexOf(val[1]) !== -1)[0][0] * c + b;
  let Y = inputs_with_index.filter((val) => ['Y'].indexOf(val[1]) !== -1)[0][0] * c + b;
  let Z = inputs_with_index.filter((val) => ['Z'].indexOf(val[1]) !== -1)[0][0] * c + b;
  // cx+b = 5
  //http://localhost:3000/scg/xyz?input_raw=X, 5, 9, 15, 23, Y, Z
  let outputs = {X, Y, Z};
  res.send({outputs, input_raw});
});
//Please use “Place search|Place API(by Google)” for
//http://localhost:3000/scg/xyz?input_raw=X, 5, 9, 15, 23, Y, Z
// finding all restaurants in Bangsue area and show result by JSON
//http://localhost:3000/scg/gmapsearch?location=Bangsue
async function findPlace(location = 'Bangsue', cate = "restaurants") {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${cate}+in+${location}&key=${G_MAP_KEY}`;

  const response = await axios.get(url);
  // console.log(response.data.results);
  return response.data.results
}

router.get('/gmapsearch', async function (req, res, next) {

  let location = req.query.location;
  let results = await findPlace(location);
  res.send({results});

});
const redis = require("redis"),
  client = redis.createClient();
const {promisify} = require('util');
const getRedisAsync = promisify(client.get).bind(client);
const setRedisAsync = promisify(client.set).bind(client);
const CHAT_STATES = {
  BLANK: "blank",
  SEARCHING: "searching",
};

const MSG_ENJOY = "Enjoy :)";
const MSG_DEFAULT = "May I help you?. What you want to do today? (ex. Eat, Tour, Shopping, Stay)";
const MSG_WHAT = MSG_DEFAULT;
const MSG_WHERE = "Where you want to $doing (ex. Bangsue Sathorn ) To reset type No";
const MSG_WHAT_MORE = "What you want to do more? (ex. Eat, Tour, Shop, Stay )";


async function handleOther(userMsg, userJson) {
  const processed_msg = userMsg.trim().toLowerCase();
  if (["bye", "bye bye", "no"].indexOf(processed_msg) > -1) {
    await sendLineMsg([MSG_WHAT], userJson);
    return true
  } else {
    return false
  }
}

let CHAT_DO_MAP_SEARCH_RESP = {
  "eat": "restaurants",
  "tour": "attractions",
  "shop": "markets",
  "stay": "hotels",
}
let CHAT_STATE_MAP_FUNC_RESP = {};
CHAT_STATE_MAP_FUNC_RESP[CHAT_STATES.BLANK] = async (userMsg, userData) => {
  const processed_msg = userMsg.trim().toLowerCase();
  if (["eat", "tour", "shop", "stay"].indexOf(processed_msg) > -1) {
    let doing = CHAT_DO_MAP_SEARCH_RESP[processed_msg];
    userData["doing"] = doing;
    userData["state"] = CHAT_STATES.SEARCHING;
    setRedisAsync(userData.userId, JSON.stringify(userData));
    const _msg = MSG_WHERE.replace("$doing", doing);
    sendLineMsg([_msg], userData)
  } else {
    if (!await handleOther(userMsg, userData)) {
      await sendLineMsg([MSG_DEFAULT], userData);
    }
  }
};

CHAT_STATE_MAP_FUNC_RESP[CHAT_STATES.SEARCHING] = async (userMsg, userData) => {

  if (!await handleOther(userMsg, userData)) {
    const location = userMsg;
    userData["state"] = CHAT_STATES.BLANK;
    userData["location"] = location;
    let places = await findPlace(userData.location, userData.doing);
    places = places.slice(0, 3).map((place) => place.name)
    if (places.length > 0) {
      let msgs = places.concat([MSG_ENJOY, MSG_WHAT_MORE])
      await sendLineMsg(msgs, userData);
      setRedisAsync(userData.userId, JSON.stringify(userData));
    } else {
      sendLineMsg([`Nothing found in the location "${userData.location}" Please try the other location's name`], userData);
    }

  }
};
// change > $blank
// (eat sleep see) > $search
// e.complete ($what.do+$where.do) > $search
// ans.. eat sleep see > $search $do{eat sleep see}
// $search $do>  where to {$do} (Bangkok, Nonthaburi)?
//

async function sendLineMsg(msgs, userData) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + LINE_CHN_ACCTOKEN
  };
  const bodyParameters = {
    "to": userData.userId,
    "messages": msgs.map((msg) => {
        return {
          "type": "text",
          "text": msg
        }
      }
    )
  };

  const _result = await axios.post(
    'https://api.line.me/v2/bot/message/push',
    bodyParameters,
    {headers});
  console.log(_result)
}

router.post('/linemsg/webhook', async (req, res, next) => {
  const msg = 'respond with a resource';
  const userId = req.body.events[0].source.userId;
  let userData = await getRedisAsync(userId);

  let default_state = "blank"; // blank searching
  if (userData === null) {
    let state = default_state
    userData = {state, userId};
  } else {
    userData = JSON.parse(userData);
  }
  let text = req.body.events[0].message.text;
  console.log(userData)
  try{
    await CHAT_STATE_MAP_FUNC_RESP[userData.state](text, userData);
  }catch(err) {
    console.log("Error on handle"+err)
  }
  res.send({msg});
});
module.exports = router;
