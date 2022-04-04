require("dotenv").config()

const fetch = require("node-fetch")
const md5 = require("./scripts/epls")
const { JXG } = require("./scripts/jxg")
const {
  spec_decode,
  spec_encode,
  epl_compress,
  epl_decompress,
  get_current_timestamp,
  random_int,
} = require("./utils")

const data = {
  "server": 'https://vk.regiment.bravegames.ru/' + process.env.GAME_LOGIN + '/' + process.env.GAME_TOKEN + '/',
  "game_key": "pH70LrmHWW",
  "secret": "D5wGCi",
}

function server_init() {
  return server_query('init', 'friends=' + JSON['stringify']({}))
}

function server_get() {
  return server_query('get', '')
}

function handle_server_init(response) {
  if (response['secret']['length'] > 0) {
    data['secret'] = response['secret']
  };
  if (response['key']['length'] > 0) {
    data['game_key'] = response['key']
  };
  data['friends'] = response['friends'];
  data['top_level'] = response['top_level'];
  data['top_sut'] = response['top_sut'];
  data['top_damage'] = response['top_damage'];
  data['top_damage_old'] = response['top_damage_old'];
  data['top_boss_0_friends'] = response['top_boss_0_friends'];
  data['top_boss_1_friends'] = response['top_boss_1_friends'];
  data['top_boss_2_friends'] = response['top_boss_2_friends'];
  data['top_boss_3_friends'] = response['top_boss_3_friends'];
  data['top_boss_4_friends'] = response['top_boss_4_friends'];
  data['top_boss_5_friends'] = response['top_boss_5_friends'];
  data['top_boss_6_friends'] = response['top_boss_6_friends'];
  data['top_boss_7_friends'] = response['top_boss_7_friends'];
  data['top_boss_8_friends'] = response['top_boss_8_friends'];
  data['top_boss_9_friends'] = response['top_boss_9_friends'];
  data['top_boss_14_friends'] = response['top_boss_14_friends'];
  data['top_boss_15_friends'] = response['top_boss_15_friends'];
  data['top_boss_0'] = response['top_boss_0'];
  data['top_boss_1'] = response['top_boss_1'];
  data['top_boss_2'] = response['top_boss_2'];
  data['top_boss_3'] = response['top_boss_3'];
  data['top_boss_4'] = response['top_boss_4'];
  data['top_boss_5'] = response['top_boss_5'];
  data['top_boss_6'] = response['top_boss_6'];
  data['top_boss_7'] = response['top_boss_7'];
  data['top_boss_8'] = response['top_boss_8'];
  data['top_boss_9'] = response['top_boss_9'];
  data['top_boss_14'] = response['top_boss_14'];
  data['top_boss_15'] = response['top_boss_15'];
  data['top_boss_0_old'] = response['top_boss_0_old'];
  data['top_boss_1_old'] = response['top_boss_1_old'];
  data['top_boss_2_old'] = response['top_boss_2_old'];
  data['top_boss_3_old'] = response['top_boss_3_old'];
  data['top_boss_4_old'] = response['top_boss_4_old'];
  data['top_boss_5_old'] = response['top_boss_5_old'];
  data['top_boss_6_old'] = response['top_boss_6_old'];
  data['top_boss_7_old'] = response['top_boss_7_old'];
  data['top_boss_8_old'] = response['top_boss_8_old'];
  data['top_boss_9_old'] = response['top_boss_9_old'];
  data['top_boss_14_old'] = response['top_boss_14_old'];
  data['top_boss_15_old'] = response['top_boss_15_old'];
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 7; j++) {
      data['top_mission_' + i + '_' + j + '_friends'] = response['top_mission_' + i + '_' + j + '_friends']
    }
  };

}

async function handle_server_get(response) {
  data['system'] = response['system'];
  data['player'] = response['player'];
}

function server_action(method, params) {
  return server_query("action", 'requests=' + JSON['stringify']([{ method, params }]))
}

function server_query(action, param) {
  var query = 'ts=' + get_current_timestamp();
  if (param != '') {
    query += '&' + param
  };
  var random = random_int(1001, 9999);
  while (random == data['last_rnd']) {
    random = random_int(1001, 9999)
  };
  data['last_rnd'] = random;
  query += '&rnd=' + random;
  if (action == 'init') {
    var signature = md5(query)
  } else {
    var signature = md5(data['secret'] + query + data['secret'])
  };
  query += '&sign=' + signature;
  return xhr_query(data['server'] + action, query, signature)
}

async function xhr_query(url, query, signature) {
  console.log('query: ', query);
  
  const headers = {}
  headers["Content-type"] = "application/x-www-form-urlencoded"
  headers["Game-check"] = md5(signature)
  headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36"

  if (data["game_key"] && data["game_key"].length > 0) {
    headers["Game-key"] = data["game_key"]
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: encodeBody(query)
  })

  const text = await response.text()
  const json = JSON.parse(decodeResponse(text))

  if (json.error) {
    console.log(json)
    throw new Error(json.descr)
  }

  return json
}

function encodeBody(query) {
  return spec_encode(epl_compress(query))
}

function decodeBody(body) {
  return epl_decompress(spec_decode(body))
}

function decodeResponse(text) {
  return JXG.decompress(spec_decode(text))
}

async function main() {
  // ! both requests are failed
  // const initResponse = await server_init()
  // handle_server_init(initResponse)

  // const getResponse = await server_get()
  // handle_server_get(getResponse)

  // ! works if manually provide "game_key" and "secret" (received after init requests);
  const response = await server_action('missions.hit', {
    "front": 0,
    "mission": 1,
    "sector": 7
  })
  console.log(response)
}

main()
