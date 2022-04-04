/*
HTTP/1.1 200 OK
Server: nginx/1.20.2
Date: Thu, 31 Mar 2022 13:27:42 GMT
Content-Type: application/javascript; charset=utf-8
Last-Modified: Tue, 29 Mar 2022 12:42:18 GMT
Transfer-Encoding: chunked
Connection: keep-alive
ETag: W/"6242feaa-f5bde"
Content-Encoding: gzip
*/
document['addEventListener']('DOMContentLoaded', vk_sdk);
window['xhr'] = [];
window['num'] = 0;
window['server'] = 'https://vk.regiment.bravegames.ru/' + window['game_login'] + '/' + window['game_token'] + '/';
window['secret'] = '';
window['friends'] = [];
window['top_level'] = [];
window['top_sut'] = [];
window['other_friends'] = [];
window['last_friend'] = -1;
window['last_friend2'] = -1;
window['last_friend3'] = -1;
window['iinlist'] = -1;
window['view_modal'] = 0;
window['player'] = {};
window['friends_mode'] = -1;
window['supply_send_type'] = -1;
window['supply_send_mode'] = 0;
window['supply_send_loaded'] = 0;
window['count_fronts'] = 7;
window['selected_front'] = -1;
window['selected_mission'] = -1;
window['loc_page'] = '';
window['count_weapons'] = 0;
window['game_loaded'] = 0;
window['hangar_next'] = 0;
window['friend_profile'] = null;
window['friend_hangar_next'] = 0;
window['box_is_hack'] = -1;
window['tutorial_arrow_stoped'] = 0;
window['bg_music'] = null;
window['sound_last'] = -1;
window['last_rnd'] = 0;
window['requests'] = [];
window['xhr_timer'] = null;
window['fullscreen'] = 0;
window['tmp_encryptions'] = 0;
window['bs_input'] = 0;
window['status_query'] = 0;
setInterval2(update_time, 1000);

function update_time() {
  window['current_time']++;
  if (window['game_loaded'] == 1) {
    check_gifts_status();
    check_boxes_status();
    update_renewable_resources_supply();
    if (window['player']['subscription'] && window['player']['subscription']['paid_time'] > get_current_timestamp()) {
      if (window['loc_page'] != 'boxes') {
        work_subscription_boxes()
      };
      if (window['player']['subscription']['tariff'] == 0) {
        if (window['loc_page'] == 'subscription_functions') {
          work_bm_begin()
        }
      } else {
        if (window['player']['subscription']['tariff'] == 1) {
          if (window['loc_page'] == 'boss_manager') {
            work_boss_manager()
          }
        }
      }
    }
  }
}

function vk_sdk() {
  VK['init'](function() {
    load_game_resources_start()
  }, function() {
    alert('Не удалось загрузить игру. Перезагрузите страницу!')
  }, '5.131')
}

function load_game_resources_start() {
  for (var i = 0; i < window['audio_resources']['length']; i++) {
    var link = document['createElement']('link');
    link['href'] = 'https://cdn.bravegames.space/regiment/sounds/' + window['audio_resources'][i];
    link['rel'] = 'prefetch';
    link['as'] = 'audio';
    document['head']['appendChild'](link)
  };
  window['proc'] = window['images_resources']['length'] / 75;
  document['getElementById']('current_step')['innerHTML'] = 'Загрузка ресурсов игры';
  document['getElementById']('progress')['innerHTML'] = 0;
  document['getElementById']('preloader_meter')['style']['width'] = '0%';
  var a = window['images_resources']['length'] % 10;
  var chunk = (window['images_resources']['length'] - a) / 10;
  window['loaded_resources'] = 0;
  window['loaded_final'] = 0;
  load_game_resources(0, chunk);
  load_game_resources(chunk, chunk * 2);
  load_game_resources(chunk * 2, chunk * 3);
  load_game_resources(chunk * 3, chunk * 4);
  load_game_resources(chunk * 4, chunk * 5);
  load_game_resources(chunk * 5, chunk * 6);
  load_game_resources(chunk * 6, chunk * 7);
  load_game_resources(chunk * 7, chunk * 8);
  load_game_resources(chunk * 8, chunk * 9);
  load_game_resources(chunk * 9, window['images_resources']['length'])
}

function load_game_resources(a, b) {
  load_game_resources_result();
  if (a < b) {
    var img = document['createElement']('img');
    img['onload'] = function() {
      load_game_resources(a + 1, b)
    };
    img['src'] = 'https://cdn.bravegames.space/regiment/images/' + window['images_resources'][a]
  } else {
    load_game_resources_final()
  }
}

function load_game_resources_result(_0xdbf0xd) {
  window['loaded_resources']++;
  var percentage = Math['ceil'](window['loaded_resources'] / window['proc']);
  document['getElementById']('progress')['innerHTML'] = percentage;
  document['getElementById']('preloader_meter')['style']['width'] = percentage + '%'
}

function load_game_resources_final() {
  window['loaded_final']++;
  if (window['loaded_final'] == 10) {
    window['resources'] = [];
    load_game()
  }
}

function load_game() {
  document['getElementById']('progress')['innerHTML'] = 80;
  document['getElementById']('current_step')['innerHTML'] = 'Получение списка друзей';
  document['getElementById']('preloader_meter')['style']['width'] = '80%';
  VK['api']('friends.getAppUsers', {}, vk_app_friends)
}

function vk_app_friends(obj) {
  document['getElementById']('progress')['innerHTML'] = 85;
  document['getElementById']('current_step')['innerHTML'] = 'Проверка статуса дружбы';
  document['getElementById']('preloader_meter')['style']['width'] = '85%';
  if (obj['response']['length'] > 0) {
    friends_parted(obj['response'])
  } else {
    vk_signs_empty()
  }
}

function friends_parted(array) {
  var length = array['length'];
  var _0xdbf0x6 = length % 1000;
  var _0xdbf0x16 = (length - _0xdbf0x6) / 1000;
  if (_0xdbf0x6 > 0) {
    _0xdbf0x16++
  };
  window['friends_parted'] = _0xdbf0x16;
  window['load_friends'] = 0;
  window['signs'] = {};
  for (var i = 0; i < _0xdbf0x16; i++) {
    var ids = array['slice'](i * 1000, i * 1000 + 1000);
    VK['api']('friends.areFriends', {
      "user_ids": ids['join'](','),
      need_sign: 1
    }, vk_signs)
  }
}

function vk_signs(obj) {
  document['getElementById']('progress')['innerHTML'] = 90;
  document['getElementById']('current_step')['innerHTML'] = 'Отправка сигнатур';
  document['getElementById']('preloader_meter')['style']['width'] = '90%';
  for (var i = 0; i < obj['response']['length']; i++) {
    window['signs'][obj['response'][i]['user_id']] = obj['response'][i]['sign']
  };
  window['load_friends']++;
  if (window['load_friends'] == window['friends_parted']) {
    server_query('init', 'friends=' + JSON['stringify'](window['signs']), 'server_init')
  }
}

function vk_signs_empty() {
  document['getElementById']('progress')['innerHTML'] = 90;
  document['getElementById']('current_step')['innerHTML'] = 'Отправка сигнатур';
  document['getElementById']('preloader_meter')['style']['width'] = '90%';
  var empty = {};
  server_query('init', 'friends=' + JSON['stringify'](empty), 'server_init')
}

function server_query(action, _0xdbf0x12, methodToCall) {
  window['status_query'] = 1;
  var query = 'ts=' + get_current_timestamp();
  if (_0xdbf0x12 != '') {
    query += '&' + _0xdbf0x12
  };
  var random = random_int(1001, 9999);
  while (random == window['last_rnd']) {
    random = random_int(1001, 9999)
  };
  window['last_rnd'] = random;
  query += '&rnd=' + random;
  if (action == 'init') {
    var signature = md5(query)
  } else {
    var signature = md5(window['secret'] + query + window['secret'])
  };
  query += '&sign=' + signature;
  xhr_query(window['num']++, window['server'] + action, query, methodToCall, 1, signature)
}

function random_int(from, to) {
  var value = Math['round'](from - 0.5 + Math['random']() * (to - from + 1));
  return value
}

function xhr_query(index, url, query, methodToCall, _0xdbf0x28, signature) {
  xhr[index] = new XMLHttpRequest();
  xhr[index]['open']('POST', url, true);
  xhr[index]['setRequestHeader']('Content-type', 'application/x-www-form-urlencoded');
  if (window['game_key'] && window['game_key']['length'] > 0) {
    xhr[index]['setRequestHeader']('Game-key', window['game_key'])
  };
  xhr[index]['setRequestHeader']('Game-check', md5(signature));
  xhr[index]['onreadystatechange'] = function() {
    if (xhr[index]['readyState'] == 4) {
      if (xhr[index]['status'] == 200) {
        window['status_query'] = 0;
        var response = JXG['decompress'](spec_decode(xhr[index]['responseText']));
        if (_0xdbf0x28 == 1) {
          response = JSON['parse'](response)
        };
        console['log']('answer:', response);
        if (response['error']) {
          modal_error(response)
        } else {
          if (response['result'] == 'ok') {
            if (methodToCall != '') {
              window[methodToCall](response)
            }
          }
        }
      } else {
        modal_error({
          error: true,
          descr: 'connection error'
        })
      }
    }
  };
  console['log']('query: ', query);
  xhr[index]['send'](spec_encode(epl_compress(query)))
}

function spec_encode(str) {
  var output = '';
  var array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var obj = {
    "a": 'b',
    "b": 'h',
    "c": 'k',
    "d": 'd',
    "e": 'u',
    "f": 'g',
    "g": 't',
    "h": 'i',
    "i": 'l',
    "j": 'a',
    "k": 'e',
    "l": 'w',
    "m": 'r',
    "n": 'p',
    "o": 'x',
    "p": 'y',
    "q": 'm',
    "r": 'z',
    "s": 'c',
    "t": 'v',
    "u": 'j',
    "v": 's',
    "w": 'f',
    "x": 'o',
    "y": 'q',
    "z": 'n',
    "A": 'E',
    "B": 'G',
    "C": 'J',
    "D": 'P',
    "E": 'L',
    "F": 'U',
    "G": 'W',
    "H": 'S',
    "I": 'V',
    "J": 'A',
    "K": 'N',
    "L": 'R',
    "M": 'C',
    "N": 'Z',
    "O": 'X',
    "P": 'M',
    "Q": 'Y',
    "R": 'B',
    "S": 'I',
    "T": 'H',
    "U": 'F',
    "V": 'K',
    "W": 'Q',
    "X": 'O',
    "Y": 'D',
    "Z": 'T',
    "0": '2',
    "1": '6',
    "2": '0',
    "3": '7',
    "4": '5',
    "5": '1',
    "6": '4',
    "7": '8',
    "8": '3',
    "9": '9'
  };
  for (var i = 0; i < str['length']; i++) {
    if (in_array(str[i], array)) {
      output += obj[str[i]]
    } else {
      output += str[i]
    }
  };
  return output
}

function spec_decode(str) {
  var output = '';
  var array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var obj = {
    "b": 'a',
    "h": 'b',
    "k": 'c',
    "d": 'd',
    "u": 'e',
    "g": 'f',
    "t": 'g',
    "i": 'h',
    "l": 'i',
    "a": 'j',
    "e": 'k',
    "w": 'l',
    "r": 'm',
    "p": 'n',
    "x": 'o',
    "y": 'p',
    "m": 'q',
    "z": 'r',
    "c": 's',
    "v": 't',
    "j": 'u',
    "s": 'v',
    "f": 'w',
    "o": 'x',
    "q": 'y',
    "n": 'z',
    "E": 'A',
    "G": 'B',
    "J": 'C',
    "P": 'D',
    "L": 'E',
    "U": 'F',
    "W": 'G',
    "S": 'H',
    "V": 'I',
    "A": 'J',
    "N": 'K',
    "R": 'L',
    "C": 'M',
    "Z": 'N',
    "X": 'O',
    "M": 'P',
    "Y": 'Q',
    "B": 'R',
    "I": 'S',
    "H": 'T',
    "F": 'U',
    "K": 'V',
    "Q": 'W',
    "O": 'X',
    "D": 'Y',
    "T": 'Z',
    "2": '0',
    "6": '1',
    "0": '2',
    "7": '3',
    "5": '4',
    "1": '5',
    "4": '6',
    "8": '7',
    "3": '8',
    "9": '9'
  };
  for (var i = 0; i < str['length']; i++) {
    if (in_array(str[i], array)) {
      output += obj[str[i]]
    } else {
      output += str[i]
    }
  };
  return output
}

function epl_compress(strData) {
  var strData = encodeURIComponent(strData);
  var compressed = pako['deflate'](strData, {
    level: 9
  });
  var strOutput = Base64['fromUint8Array'](compressed);
  return strOutput
}

function modal_error(obj) {
  var arr = ['supply', 'weapons'];
  for (var i = 0; i < arr['length']; i++) {
    hide_modal(arr[i] + '_block')
  };
  hide_modal2(0);
  hide_loader();
  window['view_modal'] = 1;
  if (obj['descr'] == 'session expired') {
    var modalError = document['getElementsByClassName']('modal_error')[0];
    modalError['getElementsByClassName']('modal_error_text')[0]['innerHTML'] = 'В связи с длительным отсутствием активности с вашей стороны, игровая сессия была автоматически завершена. Пожалуйста, перезагрузите игру!';
    modalError['style']['display'] = 'flex'
  } else {
    if (obj['descr'] == 'failed authorization') {
      var modalError = document['getElementsByClassName']('modal_error')[0];
      modalError['getElementsByClassName']('modal_error_text')[0]['innerHTML'] = 'Ошибка авторизации. Скорее всего, игра запущена на другой вкладке или на другом устройстве. Нужно перезагрузить игру, чтобы продолжить';
      modalError['style']['display'] = 'flex'
    } else {
      if (obj['descr'] == 'connection error') {
        var modalError = document['getElementsByClassName']('modal_error')[0];
        modalError['getElementsByClassName']('modal_error_text')[0]['innerHTML'] = 'Похоже, что-то не так. Пожалуйста, проверьте ваше Интернет-соединение и перезагрузите игру.';
        modalError['style']['display'] = 'flex'
      } else {
        var modalError = document['getElementsByClassName']('modal_error')[0];
        modalError['getElementsByClassName']('modal_error_text')[0]['innerHTML'] = 'Произошла неизвестная ошибка. Попробуйте перезагрузить игру. Если это не помогло, то сообщите Администрации';
        modalError['style']['display'] = 'flex'
      }
    }
  };
  var modalShadow = document['getElementsByClassName']('modal_shadow')[0]['style'];
  modalShadow['display'] = 'block';
  modalShadow['height'] = '630px';
  modalShadow['top'] = '0';
  modalShadow['zIndex'] = '4'
}

function server_init(obj) {
  if (obj['secret']['length'] > 0) {
    window['secret'] = obj['secret']
  };
  if (obj['key']['length'] > 0) {
    window['game_key'] = obj['key']
  };
  window['friends'] = obj['friends'];
  window['top_level'] = obj['top_level'];
  window['top_sut'] = obj['top_sut'];
  window['top_damage'] = obj['top_damage'];
  window['top_damage_old'] = obj['top_damage_old'];
  window['top_boss_0_friends'] = obj['top_boss_0_friends'];
  window['top_boss_1_friends'] = obj['top_boss_1_friends'];
  window['top_boss_2_friends'] = obj['top_boss_2_friends'];
  window['top_boss_3_friends'] = obj['top_boss_3_friends'];
  window['top_boss_4_friends'] = obj['top_boss_4_friends'];
  window['top_boss_5_friends'] = obj['top_boss_5_friends'];
  window['top_boss_6_friends'] = obj['top_boss_6_friends'];
  window['top_boss_7_friends'] = obj['top_boss_7_friends'];
  window['top_boss_8_friends'] = obj['top_boss_8_friends'];
  window['top_boss_9_friends'] = obj['top_boss_9_friends'];
  window['top_boss_14_friends'] = obj['top_boss_14_friends'];
  window['top_boss_15_friends'] = obj['top_boss_15_friends'];
  window['top_boss_0'] = obj['top_boss_0'];
  window['top_boss_1'] = obj['top_boss_1'];
  window['top_boss_2'] = obj['top_boss_2'];
  window['top_boss_3'] = obj['top_boss_3'];
  window['top_boss_4'] = obj['top_boss_4'];
  window['top_boss_5'] = obj['top_boss_5'];
  window['top_boss_6'] = obj['top_boss_6'];
  window['top_boss_7'] = obj['top_boss_7'];
  window['top_boss_8'] = obj['top_boss_8'];
  window['top_boss_9'] = obj['top_boss_9'];
  window['top_boss_14'] = obj['top_boss_14'];
  window['top_boss_15'] = obj['top_boss_15'];
  window['top_boss_0_old'] = obj['top_boss_0_old'];
  window['top_boss_1_old'] = obj['top_boss_1_old'];
  window['top_boss_2_old'] = obj['top_boss_2_old'];
  window['top_boss_3_old'] = obj['top_boss_3_old'];
  window['top_boss_4_old'] = obj['top_boss_4_old'];
  window['top_boss_5_old'] = obj['top_boss_5_old'];
  window['top_boss_6_old'] = obj['top_boss_6_old'];
  window['top_boss_7_old'] = obj['top_boss_7_old'];
  window['top_boss_8_old'] = obj['top_boss_8_old'];
  window['top_boss_9_old'] = obj['top_boss_9_old'];
  window['top_boss_14_old'] = obj['top_boss_14_old'];
  window['top_boss_15_old'] = obj['top_boss_15_old'];
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 7; j++) {
      window['top_mission_' + i + '_' + j + '_friends'] = obj['top_mission_' + i + '_' + j + '_friends']
    }
  };
  change_friends_mode(0);
  VK['api']('users.get', {
    user_ids: window['game_login'],
    fields: 'photo_50,sex'
  }, vk_load_my_profile);
  document['getElementById']('progress')['innerHTML'] = 95;
  document['getElementById']('current_step')['innerHTML'] = 'Загрузка игровых данных';
  document['getElementById']('preloader_meter')['style']['width'] = '95%';
  server_query('get', '', 'server_get')
}

function friends_vk_load_window(obj) {
  for (var i = 0; i < window['friends']['length']; i++) {
    for (var j = 0; j < obj['response']['length']; j++) {
      if (obj['response'][j]['id'] == window['friends'][i]['id']) {
        window['friends'][i]['profile'] = {};
        window['friends'][i]['profile']['first_name'] = obj['response'][j]['first_name'];
        window['friends'][i]['profile']['last_name'] = obj['response'][j]['last_name'];
        window['friends'][i]['profile']['photo_50'] = obj['response'][j]['photo_50'];
        window['friends'][i]['profile']['sex'] = obj['response'][j]['sex']
      }
    }
  }
}

function friends_vk_load_otwindow(obj) {
  for (var i = 0; i < window['friends']['length']; i++) {
    for (var j = 0; j < obj['response']['length']; j++) {
      if (obj['response'][j]['id'] == window['friends'][i]['id']) {
        window['friends'][i]['profile'] = {};
        window['friends'][i]['profile']['first_name'] = obj['response'][j]['first_name'];
        window['friends'][i]['profile']['last_name'] = obj['response'][j]['last_name'];
        window['friends'][i]['profile']['photo_50'] = obj['response'][j]['photo_50'];
        window['friends'][i]['profile']['sex'] = obj['response'][j]['sex'];
        obj['response'][j]['is_friend'] = 1
      }
    }
  };
  for (var i = 0; i < window['other_friends']['length']; i++) {
    for (var j = 0; j < obj['response']['length']; j++) {
      if (obj['response'][j]['is_friend'] != 1 && obj['response'][j]['id'] == window['other_friends'][i]['id']) {
        window['other_friends'][i]['profile'] = {};
        window['other_friends'][i]['profile']['first_name'] = obj['response'][j]['first_name'];
        window['other_friends'][i]['profile']['last_name'] = obj['response'][j]['last_name'];
        window['other_friends'][i]['profile']['photo_50'] = obj['response'][j]['photo_50'];
        window['other_friends'][i]['profile']['sex'] = obj['response'][j]['sex']
      }
    }
  }
}

function friends_vk_load(obj) {
  for (var i = 0; i < obj['response']['length']; i++) {
    for (var j = 1; j <= 10; j++) {
      var friendElement = document['getElementById']('friend' + j);
      if (friendElement['dataset']['id'] == obj['response'][i]['id']) {
        window['friends'][friendElement['dataset']['iinlist']]['profile'] = {};
        window['friends'][friendElement['dataset']['iinlist']]['profile']['first_name'] = obj['response'][i]['first_name'];
        window['friends'][friendElement['dataset']['iinlist']]['profile']['last_name'] = obj['response'][i]['last_name'];
        window['friends'][friendElement['dataset']['iinlist']]['profile']['photo_50'] = obj['response'][i]['photo_50'];
        window['friends'][friendElement['dataset']['iinlist']]['profile']['sex'] = obj['response'][i]['sex'];
        var firstName = obj['response'][i]['first_name'];
        if (firstName['length'] > 7) {
          firstName = firstName['substr'](0, 7);
          firstName += '...'
        };
        friendElement['getElementsByClassName']('friend_name')[0]['innerHTML'] = firstName;
        var avatarElement = friendElement['getElementsByClassName']('friend_avatar')[0];
        if (avatarElement['dataset']['iavatar'] == 1) {
          avatarElement['getElementsByTagName']('img')[0]['src'] = obj['response'][i]['photo_50']
        } else {
          var img = document['createElement']('img');
          img['src'] = obj['response'][i]['photo_50'];
          avatarElement['appendChild'](img);
          avatarElement['dataset']['iavatar'] = 1
        }
      }
    }
  }
}

function friends_vk_load2(obj) {
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < obj['response']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 1; _0xdbf0x38 <= 10; _0xdbf0x38++) {
      var friendElement = document['getElementById']('friend' + _0xdbf0x38);
      if (friendElement['dataset']['id'] == obj['response'][_0xdbf0x4]['id']) {
        window['top_level'][friendElement['dataset']['iinlist']]['profile'] = {};
        window['top_level'][friendElement['dataset']['iinlist']]['profile']['first_name'] = obj['response'][_0xdbf0x4]['first_name'];
        window['top_level'][friendElement['dataset']['iinlist']]['profile']['last_name'] = obj['response'][_0xdbf0x4]['last_name'];
        window['top_level'][friendElement['dataset']['iinlist']]['profile']['photo_50'] = obj['response'][_0xdbf0x4]['photo_50'];
        window['top_level'][friendElement['dataset']['iinlist']]['profile']['sex'] = obj['response'][_0xdbf0x4]['sex'];
        var firstName = obj['response'][_0xdbf0x4]['first_name'];
        if (firstName['length'] > 7) {
          firstName = firstName['substr'](0, 7);
          firstName += '...'
        };
        friendElement['getElementsByClassName']('friend_name')[0]['innerHTML'] = firstName;
        var friendAvatar = friendElement['getElementsByClassName']('friend_avatar')[0];
        if (friendAvatar['dataset']['iavatar'] == 1) {
          friendAvatar['getElementsByTagName']('img')[0]['src'] = obj['response'][_0xdbf0x4]['photo_50']
        } else {
          var img = document['createElement']('img');
          img['src'] = obj['response'][_0xdbf0x4]['photo_50'];
          friendAvatar['appendChild'](img);
          friendAvatar['dataset']['iavatar'] = 1
        }
      }
    };
    var in_array = 0;
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['other_friends']['length']; _0xdbf0x38++) {
      if (window['other_friends'][_0xdbf0x38]['id'] == obj['response'][_0xdbf0x4]['id']) {
        in_array = 1;
        window['other_friends'][_0xdbf0x38]['profile'] = {};
        window['other_friends'][_0xdbf0x38]['profile']['first_name'] = obj['response'][_0xdbf0x4]['first_name'];
        window['other_friends'][_0xdbf0x38]['profile']['last_name'] = obj['response'][_0xdbf0x4]['last_name'];
        window['other_friends'][_0xdbf0x38]['profile']['photo_50'] = obj['response'][_0xdbf0x4]['photo_50'];
        window['other_friends'][_0xdbf0x38]['profile']['sex'] = obj['response'][_0xdbf0x4]['sex']
      }
    };
    if (in_array == 0) {
      var friend = {};
      friend['id'] = obj['response'][_0xdbf0x4]['id'];
      friend['profile'] = {};
      friend['profile']['first_name'] = obj['response'][_0xdbf0x4]['first_name'];
      friend['profile']['last_name'] = obj['response'][_0xdbf0x4]['last_name'];
      friend['profile']['photo_50'] = obj['response'][_0xdbf0x4]['photo_50'];
      friend['profile']['sex'] = obj['response'][_0xdbf0x4]['sex'];
      window['other_friends']['push'](friend)
    }
  }
}

function friends_vk_load3(_0xdbf0x12) {
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x12['response']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 1; _0xdbf0x38 <= 10; _0xdbf0x38++) {
      var friendElement = document['getElementById']('friend' + _0xdbf0x38);
      if (friendElement['dataset']['id'] == _0xdbf0x12['response'][_0xdbf0x4]['id']) {
        window['top_sut'][friendElement['dataset']['iinlist']]['profile'] = {};
        window['top_sut'][friendElement['dataset']['iinlist']]['profile']['first_name'] = _0xdbf0x12['response'][_0xdbf0x4]['first_name'];
        window['top_sut'][friendElement['dataset']['iinlist']]['profile']['last_name'] = _0xdbf0x12['response'][_0xdbf0x4]['last_name'];
        window['top_sut'][friendElement['dataset']['iinlist']]['profile']['photo_50'] = _0xdbf0x12['response'][_0xdbf0x4]['photo_50'];
        window['top_sut'][friendElement['dataset']['iinlist']]['profile']['sex'] = _0xdbf0x12['response'][_0xdbf0x4]['sex'];
        var firstName = _0xdbf0x12['response'][_0xdbf0x4]['first_name'];
        if (firstName['length'] > 7) {
          firstName = firstName['substr'](0, 7);
          firstName += '...'
        };
        friendElement['getElementsByClassName']('friend_name')[0]['innerHTML'] = firstName;
        var friendAvatar = friendElement['getElementsByClassName']('friend_avatar')[0];
        if (friendAvatar['dataset']['iavatar'] == 1) {
          friendAvatar['getElementsByTagName']('img')[0]['src'] = _0xdbf0x12['response'][_0xdbf0x4]['photo_50']
        } else {
          var img = document['createElement']('img');
          img['src'] = _0xdbf0x12['response'][_0xdbf0x4]['photo_50'];
          friendAvatar['appendChild'](img);
          friendAvatar['dataset']['iavatar'] = 1
        }
      }
    };
    var in_array = 0;
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['other_friends']['length']; _0xdbf0x38++) {
      if (window['other_friends'][_0xdbf0x38]['id'] == _0xdbf0x12['response'][_0xdbf0x4]['id']) {
        in_array = 1;
        window['other_friends'][_0xdbf0x38]['profile'] = {};
        window['other_friends'][_0xdbf0x38]['profile']['first_name'] = _0xdbf0x12['response'][_0xdbf0x4]['first_name'];
        window['other_friends'][_0xdbf0x38]['profile']['last_name'] = _0xdbf0x12['response'][_0xdbf0x4]['last_name'];
        window['other_friends'][_0xdbf0x38]['profile']['photo_50'] = _0xdbf0x12['response'][_0xdbf0x4]['photo_50'];
        window['other_friends'][_0xdbf0x38]['profile']['sex'] = _0xdbf0x12['response'][_0xdbf0x4]['sex']
      }
    };
    if (in_array == 0) {
      var friend = {};
      friend['id'] = _0xdbf0x12['response'][_0xdbf0x4]['id'];
      friend['profile'] = {};
      friend['profile']['first_name'] = _0xdbf0x12['response'][_0xdbf0x4]['first_name'];
      friend['profile']['last_name'] = _0xdbf0x12['response'][_0xdbf0x4]['last_name'];
      friend['profile']['photo_50'] = _0xdbf0x12['response'][_0xdbf0x4]['photo_50'];
      friend['profile']['sex'] = _0xdbf0x12['response'][_0xdbf0x4]['sex'];
      window['other_friends']['push'](friend)
    }
  }
}

function vk_load_my_profile(obj) {
  for (var i = 0; i < window['friends']['length']; i++) {
    if (window['friends'][i]['id'] == window['game_login']) {
      window['iinlist'] = i
    }
  };
  for (var i = 0; i < obj['response']['length']; i++) {
    if (obj['response'][i]['id'] == window['game_login']) {
      window['friends'][window['iinlist']]['profile'] = {};
      window['friends'][window['iinlist']]['profile']['first_name'] = obj['response'][i]['first_name'];
      window['friends'][window['iinlist']]['profile']['last_name'] = obj['response'][i]['last_name'];
      window['friends'][window['iinlist']]['profile']['photo_50'] = obj['response'][i]['photo_50'];
      window['friends'][window['iinlist']]['profile']['sex'] = obj['response'][i]['sex']
    }
  }
}

function server_action_fast(method, params, methodToCall) {
  if (window['status_query'] == 0) {
    window['requests']['push']({
      "method": method,
      "params": params
    });
    if (window['xhr_timer'] !== null) {
      clearTimeout(window['xhr_timer']);
      window['xhr_timer'] = null
    };
    send_server_action(methodToCall)
  } else {
    setTimeout(server_action_fast, 250, method, params, methodToCall)
  }
}

function server_action(method, params) {
  if (window['status_query'] == 0) {
    window['requests']['push']({
      "method": method,
      "params": params
    });
    if (window['xhr_timer'] === null) {
      window['xhr_timer'] = setTimeout2(send_server_action2, 2000)
    }
  } else {
    setTimeout(server_action, 250, method, params)
  }
}

function answer_server(_0xdbf0x12) {
  if (_0xdbf0x12['player'] && _0xdbf0x12['player']['raid']) {
    if (typeof _0xdbf0x12['player']['raid']['health'] !== 'undefined') {
      window['player']['raid']['health'] = _0xdbf0x12['player']['raid']['health'];
      if (window['loc_page'] == 'boss_fight') {
        update_raid_health()
      }
    };
    if (_0xdbf0x12['player']['raid']['top']) {
      window['player']['raid']['top'] = _0xdbf0x12['player']['raid']['top'];
      if (window['loc_page'] == 'boss_fight') {
        update_boss_top()
      }
    }
  }
}

function update_raid_health() {
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_foe_line_health')[0];
  if (window['player']['raid']['boss'] == 17) {
    if (window['player']['raid']['paid_mode'] == 0) {
      var _0xdbf0x4a = window['bosses'][17]['health'][window['player']['static_resources']['boss_17_level']]
    } else {
      if (window['player']['raid']['paid_mode'] == 1) {
        var _0xdbf0x4a = 3 * window['bosses'][17]['health'][window['player']['static_resources']['boss_17_level']]
      }
    }
  } else {
    var _0xdbf0x4a = window['bosses'][window['player']['raid']['boss']]['health']
  };
  _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_count')[0]['innerHTML'] = window['player']['raid']['health']['toLocaleString']() + ' / ' + _0xdbf0x4a['toLocaleString']();
  var _0xdbf0x4b = _0xdbf0x4a / 100;
  var _0xdbf0x4c = Math['round'](window['player']['raid']['health'] / _0xdbf0x4b);
  _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_current')[0]['style']['width'] = _0xdbf0x4c + '%'
}

function send_server_action(methodToCall) {
  server_query('action', 'requests=' + JSON['stringify'](window['requests']), methodToCall);
  window['requests'] = [];
  clearTimeout(window['xhr_timer']);
  window['xhr_timer'] = null
}

function send_server_action2() {
  if (window['requests']['length'] > 0) {
    server_query('action', 'requests=' + JSON['stringify'](window['requests']), 'answer_server');
    window['requests'] = []
  };
  clearTimeout(window['xhr_timer']);
  window['xhr_timer'] = null
}

function in_array(element, array) {
  var exists = false;
  for (var i = 0; i < array['length']; i++) {
    if (array[i] == element) {
      exists = true
    }
  };
  return exists
}

function show_modal_new_level() {
  var a = 200;
  for (var i = 3; i <= window['player']['static_resources']['level']; i++) {
    var b = Math['ceil'](i * 2.5);
    a += b
  };
  var c = a;
  if (window['player']['static_resources']['tutorial'] == 24) {
    document['getElementById']('level_up')['innerHTML'] = window['player']['static_resources']['level'];
    document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
    var modalElement = document['getElementById']('modal');
    modalElement['style']['display'] = 'block';
    window['tmp_fnc'] = modalElement['getElementsByClassName']('modal_close')[0]['onclick'];
    modalElement['getElementsByClassName']('modal_close')[0]['onclick'] = hide_modal_new_level;
    var modalItems = modalElement['getElementsByClassName']('modal_item');
    for (var i = 0; i < modalItems['length']; i++) {
      if (modalItems[i]['style']['display'] == 'block') {
        modalItems[i]['dataset']['width'] = modalElement['style']['width'];
        modalItems[i]['dataset']['left'] = modalElement['style']['left'];
        modalItems[i]['style']['display'] = 'none';
        modalItems[i]['dataset']['opened'] = 1
      }
    };
    modalElement['style']['width'] = 450 + 'px';
    modalElement['style']['left'] = ((1000 - 450) / 2) + 'px';
    var levelBlock = modalElement['getElementsByClassName']('level_block')[0];
    var awardElement = levelBlock['getElementsByClassName']('level_up_award_item');
    awardElement[1]['getElementsByClassName']('level_up_award_item_count')[0]['innerHTML'] = 'x' + c;
    var checkbox = document['getElementById']('level_up_share');
    if (window['player']['settings']['share_level'] == 1) {
      checkbox['checked'] = true
    } else {
      checkbox['checked'] = false
    };
    checkbox['onchange'] = function() {
      change_share('level')
    };
    levelBlock['style']['display'] = 'block';
    levelBlock['getElementsByClassName']('level_up_get_button')[0]['onclick'] = function() {
      get_reward_new_level(c)
    }
  } else {
    setTimeout(get_reward_new_level, 3000, c)
  }
}

function get_reward_new_level(coins) {
  window['player']['boxes']['push']({
    "id": window['player']['static_resources']['boxes_id']++,
    "open_time": get_current_timestamp(),
    "type": 3
  });
  window['player']['static_resources']['coins'] += coins;
  window['player']['achievements']['coins'] += coins;
  update_static_resources_coins();
  var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
  _0xdbf0x59 += 100;
  window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x59;
  window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
  update_renewable_resources_supply();
  for (var i = 0; i < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; i++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][i]['type'] == 'get_coins') {
      window['player']['calendar'][window['system']['moth']][window['system']['day']][i] += coins;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][i] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][i]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][i]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][i];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][i]['done'] = 1
      }
    }
  };
  server_action('level.get_reward', {});
  if (window['player']['static_resources']['tutorial'] == 24) {
    if (document['getElementById']('level_up_share')['checked']) {
      post_wall('new_level', window['player']['static_resources']['level'])
    };
    hide_modal_new_level()
  }
}

function hide_modal_new_level() {
  play_effect('click.mp3');
  document['getElementsByClassName']('level_block')[0]['style']['display'] = 'none';
  var modalElement = document['getElementById']('modal');
  var modalItem = modalElement['getElementsByClassName']('modal_item');
  var flag = 0;
  for (var i = 0; i < modalItem['length']; i++) {
    if (modalItem[i]['dataset']['opened'] == '1') {
      modalItem[i]['dataset']['opened'] = '0';
      modalItem[i]['style']['display'] = 'block';
      modalElement['style']['width'] = modalItem[i]['dataset']['width'];
      modalElement['style']['left'] = modalItem[i]['dataset']['left'];
      flag = 1
    }
  };
  if (flag == 1) {
    modalElement['getElementsByClassName']('modal_close')[0]['onclick'] = window['tmp_fnc']
  } else {
    hide_modal('level_block');
    if (window['player']['bonuses']['length'] > 0) {
      show_bonuses()
    }
  }
}

function check_level(intFlag) {
  var output = false;
  var _0xdbf0x38 = 0;
  for (var i = 0; i < window['levels']['length']; i++) {
    if (window['player']['experiences']['experience']['amount'] >= window['levels'][i]) {
      _0xdbf0x38++
    }
  };
  if (_0xdbf0x38 > window['player']['static_resources']['level']) {
    window['player']['static_resources']['level'] = _0xdbf0x38;
    show_modal_new_level();
    var _0xdbf0x5f = document['getElementById']('level_profile');
    _0xdbf0x5f['innerHTML'] = window['player']['static_resources']['level'];
    for (var i = 0; i < window['top_level']['length']; i++) {
      if (window['top_level'][i]['id'] == window['game_login']) {
        window['top_level'][i]['static_resources']['level']++
      }
    };
    for (var i = 0; i < window['friends']['length']; i++) {
      if (window['friends'][i]['id'] == window['game_login']) {
        window['friends'][i]['static_resources']['level']++
      }
    };
    if (window['friends_mode'] == 0) {
      window['friends_mode'] = 1;
      change_friends_mode(0)
    } else {
      if (window['friends_mode'] == 1) {
        window['friends_mode'] = 0;
        change_friends_mode(1)
      }
    }
  };
  if (intFlag == 1) {
    window['player']['static_resources']['level'] = _0xdbf0x38;
    var _0xdbf0x5f = document['getElementById']('level_profile');
    _0xdbf0x5f['innerHTML'] = window['player']['static_resources']['level'];
    var _0xdbf0x38 = 0;
    for (var i = 0; i < window['levels']['length']; i++) {
      if (window['player']['experiences']['experience']['amount'] >= window['levels'][i]) {
        _0xdbf0x38++
      }
    };
    var _0xdbf0x60 = _0xdbf0x38 - 1;
    if (window['player']['static_resources']['level_reward'] < _0xdbf0x60 && _0xdbf0x60 > 0) {
      show_modal_new_level();
      output = true
    }
  };
  var _0xdbf0x61 = window['levels'][_0xdbf0x38] - window['levels'][_0xdbf0x38 - 1];
  var _0xdbf0x62 = _0xdbf0x61 - (window['player']['experiences']['experience']['amount'] - window['levels'][_0xdbf0x38 - 1]);
  var _0xdbf0x63 = _0xdbf0x61 / 100;
  var _0xdbf0x64 = window['player']['experiences']['experience']['amount'] - window['levels'][_0xdbf0x38 - 1];
  var _0xdbf0x65 = ((1.8 * _0xdbf0x64 / _0xdbf0x63) - 179);
  var _0xdbf0x36 = document['getElementsByClassName']('progress_level')[0];
  _0xdbf0x36['style']['backgroundPosition'] = _0xdbf0x65 + 'px 0';
  _0xdbf0x36['setAttribute']('tooltipbig', 'До следующего уровня ' + _0xdbf0x62 + ' опыта');
  return output
}

function update_level(intFlag) {
  var _0xdbf0x38 = 0;
  for (var i = 0; i < window['levels']['length']; i++) {
    if (window['player']['experiences']['experience']['amount'] >= window['levels'][i]) {
      _0xdbf0x38++
    }
  };
  if (_0xdbf0x38 > window['player']['static_resources']['level']) {
    window['player']['static_resources']['level'] = _0xdbf0x38;
    show_modal_new_level();
    var levelProfileElement = document['getElementById']('level_profile');
    levelProfileElement['innerHTML'] = window['player']['static_resources']['level'];
    for (var i = 0; i < window['top_level']['length']; i++) {
      if (window['top_level'][i]['id'] == window['game_login']) {
        window['top_level'][i]['static_resources']['level']++
      }
    };
    for (var i = 0; i < window['friends']['length']; i++) {
      if (window['friends'][i]['id'] == window['game_login']) {
        window['friends'][i]['static_resources']['level']++
      }
    };
    if (window['friends_mode'] == 0) {
      window['friends_mode'] = 1;
      change_friends_mode(0)
    } else {
      if (window['friends_mode'] == 1) {
        window['friends_mode'] = 0;
        change_friends_mode(1)
      }
    }
  };
  if (intFlag == 1) {
    window['player']['static_resources']['level'] = _0xdbf0x38;
    var levelProfileElement = document['getElementById']('level_profile');
    levelProfileElement['innerHTML'] = window['player']['static_resources']['level'];
    var _0xdbf0x38 = 0;
    for (var i = 0; i < window['levels']['length']; i++) {
      if (window['player']['experiences']['experience']['amount'] >= window['levels'][i]) {
        _0xdbf0x38++
      }
    };
    var _0xdbf0x60 = _0xdbf0x38 - 1;
    if (window['player']['static_resources']['level_reward'] < _0xdbf0x60 && _0xdbf0x60 > 0) {
      show_modal_new_level()
    }
  };
  var _0xdbf0x61 = window['levels'][_0xdbf0x38] - window['levels'][_0xdbf0x38 - 1];
  var _0xdbf0x62 = _0xdbf0x61 - (window['player']['experiences']['experience']['amount'] - window['levels'][_0xdbf0x38 - 1]);
  var _0xdbf0x63 = _0xdbf0x61 / 100;
  var _0xdbf0x64 = window['player']['experiences']['experience']['amount'] - window['levels'][_0xdbf0x38 - 1];
  var _0xdbf0x65 = ((1.8 * _0xdbf0x64 / _0xdbf0x63) - 179);
  var _0xdbf0x36 = document['getElementsByClassName']('progress_level')[0];
  _0xdbf0x36['style']['backgroundPosition'] = _0xdbf0x65 + 'px 0';
  _0xdbf0x36['setAttribute']('tooltipbig', 'До следующего уровня ' + _0xdbf0x62 + ' опыта')
}

function change_resource(_0xdbf0x68, _0xdbf0x69) {
  var rteElement = document['getElementById']('rte');
  var _0xdbf0x36 = rteElement['getElementsByClassName']('default_icon')[0];
  if (_0xdbf0x68 == 'tokens') {
    var _0xdbf0x6b = 'Жетоны'
  } else {
    if (_0xdbf0x68 == 'encryptions') {
      var _0xdbf0x6b = 'Шифровки'
    }
  };
  _0xdbf0x36['setAttribute']('tooltip', _0xdbf0x6b);
  _0xdbf0x36['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/' + _0xdbf0x68 + '_interface.png';
  rteElement['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources'][_0xdbf0x68];
  if (_0xdbf0x68 == 'tokens') {
    var _0xdbf0x6c = 0
  } else {
    var _0xdbf0x6c = 1
  };
  if (_0xdbf0x69 == 1 && window['player']['settings']['resource'] != _0xdbf0x6c) {
    server_action('settings.resource', {
      "resource": +_0xdbf0x6c
    })
  };
  window['player']['settings']['resource'] = _0xdbf0x6c;
  var _0xdbf0x55 = rteElement['getElementsByTagName']('li');
  _0xdbf0x55[0]['getElementsByClassName']('tokens_count')[0]['innerHTML'] = window['player']['static_resources']['tokens'];
  _0xdbf0x55[0]['getElementsByClassName']('tokens_plus')[0]['onclick'] = function() {
    show_shop(1);
    shop_menu('tokens', 1)
  };
  _0xdbf0x55[1]['getElementsByClassName']('encryptions_count')[0]['innerHTML'] = window['player']['static_resources']['encryptions'];
  _0xdbf0x55[1]['getElementsByClassName']('encryptions_plus')[0]['onclick'] = function() {
    show_shop(1);
    shop_menu('encryptions', 1)
  };
  rteElement['getElementsByClassName']('tokens_plus')[0]['onclick'] = function() {
    show_shop(0);
    shop_menu(_0xdbf0x68, 1)
  }
}

function check_music() {
  if (window['player']['settings']['music'] == 1) {
    if (window['player']['static_resources']['tutorial'] == 24) {
      window['bg_music']['volume'] = 1
    }
  } else {
    window['bg_music']['volume'] = 0
  }
}

function change_music() {
  play_effect('click.mp3');
  if (window['player']['settings']['music'] == 1) {
    window['player']['settings']['music'] = 0;
    var musicInteraceElement = document['getElementsByClassName']('music_interface')[0];
    musicInteraceElement['classList']['add']('off');
    musicInteraceElement['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/music_off.png';
    window['bg_music']['volume'] = 0
  } else {
    if (window['player']['settings']['music'] == 0) {
      window['player']['settings']['music'] = 1;
      var musicInteraceElement = document['getElementsByClassName']('music_interface')[0];
      musicInteraceElement['classList']['remove']('off');
      musicInteraceElement['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/music_on.png';
      window['bg_music']['volume'] = 1
    }
  };
  server_action('settings.music', {
    "music": window['player']['settings']['music']
  })
}

function change_sound() {
  play_effect('click.mp3');
  if (window['player']['settings']['sound'] == 1) {
    window['player']['settings']['sound'] = 0;
    var soundInterface = document['getElementsByClassName']('sound_interface')[0];
    soundInterface['classList']['add']('off');
    soundInterface['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/sound_off.png'
  } else {
    if (window['player']['settings']['sound'] == 0) {
      window['player']['settings']['sound'] = 1;
      var soundInterface = document['getElementsByClassName']('sound_interface')[0];
      soundInterface['classList']['remove']('off');
      soundInterface['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/sound_on.png'
    }
  };
  server_action('settings.sound', {
    "sound": window['player']['settings']['sound']
  })
}

function update_static_resources_coins() {
  var element = document['getElementsByClassName']('coins_block')[0];
  element['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['coins']
}

function update_static_resources_tickets() {
  var element = document['getElementsByClassName']('tickets_block')[0];
  element['getElementsByClassName']('tickets_count')[0]['innerHTML'] = window['player']['static_resources']['tickets']
}

function update_renewable_resources_supply() {
  var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
  var _0xdbf0x74 = 300;
  if (window['player']['static_resources']['boost_speed_recovery_supply']) {
    _0xdbf0x74 -= window['player']['static_resources']['boost_speed_recovery_supply']
  };
  var suppyBlockElement = document['getElementsByClassName']('res_supply_block')[0];
  suppyBlockElement['getElementsByClassName']('default_count')[0]['innerHTML'] = _0xdbf0x59;
  if (_0xdbf0x59 < (window['limit_supply_max'] + window['player']['static_resources']['boost_max_supply'])) {
    var _0xdbf0x75 = get_current_timestamp() - window['player']['renewable_resources']['supply']['time'];
    var _0xdbf0x76 = _0xdbf0x74 - (_0xdbf0x75 % _0xdbf0x74);
    var _0xdbf0x6 = _0xdbf0x76 % 60;
    if (_0xdbf0x6 < 10) {
      _0xdbf0x6 = '0' + _0xdbf0x6
    };
    var _0xdbf0x22 = (_0xdbf0x76 - _0xdbf0x6) / 60;
    suppyBlockElement['getElementsByClassName']('default_count')[0]['setAttribute']('tooltip', _0xdbf0x22 + ':' + _0xdbf0x6)
  } else {
    suppyBlockElement['getElementsByClassName']('default_count')[0]['setAttribute']('tooltip', '--:--')
  }
}

function server_get(response) {
  window['game_loaded'] = 1;
  window['system'] = response['system'];
  window['player'] = response['player'];
  check_gifts_status();
  check_boxes_status();
  for (var i = 0; i < window['player']['payments']['length']; i++) {
    switch (window['player']['payments'][i]['resource']) {
      case 0:
        window['player']['static_resources']['coins'] += window['player']['payments'][i]['amount'];
        update_static_resources_coins();
        window['player']['achievements']['coins'] += window['player']['payments'][i]['amount'];
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x38++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x38]['type'] == 'get_coins') {
            window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x38] += window['player']['payments'][i]['amount'];
            if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x38] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x38]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x38]['done'] != 1) {
              window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x38];
              window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x38]['done'] = 1
            }
          }
        };
        break;
      case 1:
        var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
        _0xdbf0x78 += window['player']['payments'][i]['amount'];
        window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
        window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
        update_renewable_resources_supply();
        break;
      case 2:
        window['player']['static_resources']['encryptions'] += window['player']['payments'][i]['amount'];
        if (window['player']['settings']['resource'] == 0) {
          change_resource('tokens', 0)
        } else {
          change_resource('encryptions', 0)
        };
        window['player']['achievements']['encryptions'] += window['player']['payments'][i]['amount'];
        break;
      case 3:
        window['player']['static_resources']['tokens'] += window['player']['payments'][i]['amount'];
        if (window['player']['settings']['resource'] == 0) {
          change_resource('tokens', 0)
        } else {
          change_resource('encryptions', 0)
        };
        window['player']['achievements']['tokens'] += window['player']['payments'][i]['amount'];
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x38++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x38]['type'] == 'get_tokens') {
            window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x38] += window['player']['payments'][i]['amount'];
            if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x38] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x38]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x38]['done'] != 1) {
              window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x38];
              window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x38]['done'] = 1
            }
          }
        };
        break;
      case 4:
        window['player']['static_resources']['tickets'] += window['player']['payments'][i]['amount'];
        update_static_resources_tickets();
        window['player']['achievements']['tickets'] += window['player']['payments'][i]['amount'];
        break
    };
    server_action('shop.buy', {
      "order": window['player']['payments'][i]['order']
    })
  };
  var arr = [];
  if (window['player']['raid'] && window['player']['raid']['top']) {
    for (var i = 0; i < window['friends']['length']; i++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['player']['raid']['top']['length']; _0xdbf0x38++) {
        if (window['player']['raid']['top'][_0xdbf0x38][0] == window['friends'][i]['id'] && !window['friends'][i]['profile']) {
          arr['push'](window['player']['raid']['top'][_0xdbf0x38][0])
        }
      }
    };
    if (arr['length'] > 0) {
      VK['api']('users.get', {
        user_ids: arr['join'](','),
        fields: 'photo_50,sex'
      }, friends_vk_load_window)
    }
  };
  for (var i = 0; i < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; i++) {
    if (window['player']['calendar'][window['system']['moth']][window['system']['day']][i] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][i]['count']) {
      window['calendar_tasks'][window['system']['moth']][window['system']['day']][i]['done'] = 1
    }
  };
  var arr = [];
  var _0xdbf0x7a = [];
  var _0xdbf0x7b = [];
  var _0xdbf0x7c = [];
  for (var i = 0; i < window['friends']['length']; i++) {
    if (window['friends'][i]['profile']) {
      _0xdbf0x7c['push'](window['friends'][i]['id'])
    }
  };
  for (var i = 0; i < window['other_friends']['length']; i++) {
    if (window['other_friends'][i]['profile']) {
      _0xdbf0x7c['push'](window['other_friends'][i]['id'])
    }
  };
  if (window['player']['gifts']) {
    for (var _0xdbf0x7d in window['player']['gifts']) {
      for (var i = 0; i < window['friends']['length']; i++) {
        if (window['friends'][i]['id'] == window['player']['gifts'][_0xdbf0x7d]['sender'] && !window['friends'][i]['profile']) {
          arr['push'](_0xdbf0x7d)
        }
      };
      if (!in_array(window['player']['gifts'][_0xdbf0x7d]['sender'], _0xdbf0x7c)) {
        _0xdbf0x7b['push'](window['player']['gifts'][_0xdbf0x7d]['sender'])
      }
    }
  };
  if (window['player']['newsfeed']) {
    for (var i = 0; i < window['friends']['length']; i++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['player']['newsfeed']['length']; _0xdbf0x38++) {
        if (window['player']['newsfeed'][_0xdbf0x38]['sender'] == window['friends'][i]['id'] && !window['friends'][i]['profile']) {
          arr['push'](window['player']['newsfeed'][_0xdbf0x38]['sender'])
        };
        if (!in_array(window['player']['newsfeed'][_0xdbf0x38]['sender'], _0xdbf0x7c)) {
          _0xdbf0x7b['push'](window['player']['newsfeed'][_0xdbf0x38]['sender'])
        }
      }
    }
  };
  if (_0xdbf0x7b['length'] > 0) {
    var _0xdbf0x7e = [];
    for (var i = 0; i < window['other_friends']['length']; i++) {
      _0xdbf0x7e['push'](window['other_friends'][i]['id'])
    };
    for (var i = 0; i < _0xdbf0x7b['length']; i++) {
      if (!in_array(_0xdbf0x7b[i], _0xdbf0x7e)) {
        var _0xdbf0x42 = {
          id: _0xdbf0x7b[i],
          sign: null,
          static_resources: {
            level: 1
          }
        };
        window['other_friends']['push'](_0xdbf0x42);
        _0xdbf0x7a['push'](_0xdbf0x7b[i]);
        _0xdbf0x7e['push'](_0xdbf0x7b[i])
      }
    }
  };
  if (arr['length'] > 0) {
    VK['api']('users.get', {
      user_ids: arr['join'](','),
      fields: 'photo_50,sex'
    }, friends_vk_load_window)
  };
  if (_0xdbf0x7a['length'] > 0) {
    VK['api']('users.get', {
      user_ids: _0xdbf0x7a['join'](','),
      fields: 'photo_50,sex'
    }, friends_vk_load_otwindow)
  };
  document['getElementById']('level_profile')['onclick'] = show_my_profile;
  document['getElementById']('name_profile')['innerHTML'] = window['player']['squad_name'];
  document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
  update_renewable_resources_supply();
  document['getElementsByClassName']('supply_plus')[0]['onclick'] = function() {
    show_shop(0);
    shop_menu('supply', 1)
  };
  var selectTokenElement = document['getElementById']('select_tokens');
  selectTokenElement['onclick'] = function() {
    play_effect('click.mp3');
    change_resource('tokens', 1)
  };
  selectTokenElement['getElementsByClassName']('tokens_count')[0]['innerHTML'] = window['player']['static_resources']['tokens'];
  var selectEncryptionsElement = document['getElementById']('select_encryptions');
  selectEncryptionsElement['onclick'] = function() {
    play_effect('click.mp3');
    change_resource('encryptions', 1)
  };
  selectEncryptionsElement['getElementsByClassName']('encryptions_count')[0]['innerHTML'] = window['player']['static_resources']['encryptions'];
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  document['getElementById']('rte')['onmouseover'] = rte_mouseover;
  document['getElementById']('rte')['onmouseout'] = rte_mouseout;
  document['getElementsByClassName']('coins_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['coins'];
  document['getElementsByClassName']('coins_plus')[0]['onclick'] = function() {
    show_shop(0);
    shop_menu('coins', 1)
  };
  document['getElementsByClassName']('tickets_block')[0]['getElementsByClassName']('tickets_count')[0]['innerHTML'] = window['player']['static_resources']['tickets'];
  document['getElementsByClassName']('tickets_plus')[0]['onclick'] = function() {
    show_shop(0);
    shop_menu('tickets', 1)
  };
  if (window['player']['settings']['music'] == 1) {
    document['getElementsByClassName']('music_interface')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/music_on.png'
  } else {
    if (window['player']['settings']['music'] == 0) {
      var musicInterfaceElement = document['getElementsByClassName']('music_interface')[0];
      musicInterfaceElement['classList']['add']('off');
      musicInterfaceElement['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/music_off.png'
    }
  };
  document['getElementsByClassName']('music_interface')[0]['onclick'] = function() {
    change_music()
  };
  if (window['player']['settings']['sound'] == 1) {
    document['getElementsByClassName']('sound_interface')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/sound_on.png'
  } else {
    if (window['player']['settings']['sound'] == 0) {
      var musicInterfaceElement = document['getElementsByClassName']('sound_interface')[0];
      musicInterfaceElement['classList']['add']('off');
      musicInterfaceElement['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/sound_off.png'
    }
  };
  document['getElementsByClassName']('sound_interface')[0]['onclick'] = function() {
    change_sound()
  };
  document['getElementsByClassName']('full_interface')[0]['onclick'] = change_fullscreen_mode;
  document['getElementsByClassName']('edit_profile')[0]['onclick'] = show_edit_profile_name;
  update_calendar_current_day();
  create_homeland_background();
  document['getElementById']('main_missions')['onclick'] = show_missions;
  document['getElementById']('main_raids')['onclick'] = show_raids;
  document['getElementById']('main_hangar')['onclick'] = show_hangar;
  document['getElementById']('main_shop')['onclick'] = show_shop;
  document['getElementsByClassName']('calendar_icon')[0]['onclick'] = show_calendar;
  document['getElementsByClassName']('subscription_icon')[0]['onclick'] = show_subscription;
  document['getElementById']('my_friends')['className'] = 'active';
  document['getElementById']('my_friends')['onclick'] = function() {
    play_effect('click.mp3');
    change_friends_mode(0)
  };
  document['getElementById']('top_level')['onclick'] = function() {
    play_effect('click.mp3');
    change_friends_mode(1)
  };
  document['getElementById']('top_tech')['onclick'] = function() {
    play_effect('click.mp3');
    change_friends_mode(2)
  };
  document['getElementById']('search_friends')['onclick'] = show_modal2;
  document['getElementById']('my_profile')['onclick'] = show_my_profile;
  document['getElementById']('supply')['onclick'] = show_supply_block;
  document['getElementById']('boxes')['onclick'] = show_boxes_block;
  document['getElementById']('weapons')['onclick'] = show_weapons;
  document['getElementById']('talents')['onclick'] = show_talents;
  document['getElementById']('arrow_prev')['onclick'] = my_friends_prev;
  var arrowNextElement = document['getElementById']('arrow_next');
  if (window['friends']['length'] > 10) {
    arrowNextElement['style']['right'] = '-22px'
  };
  arrowNextElement['onclick'] = my_friends_next;
  document['getElementsByClassName']('add_friend')[0]['onclick'] = invite_friends;
  document['getElementById']('progress')['innerHTML'] = 100;
  document['getElementById']('preloader_meter')['style']['width'] = '100%';
  show_game()
}

function show_subscription() {
  if (window['player']['subscription'] && window['player']['subscription']['paid_time'] && window['player']['subscription']['paid_time'] > get_current_timestamp()) {
    if (window['player']['subscription']['tariff'] == 0) {
      show_subscription_functions()
    } else {
      if (window['player']['subscription']['tariff'] == 1) {
        show_boss_manager()
      }
    }
  } else {
    show_subscription_buy()
  }
}

function show_subscription_functions() {
  window['loc_page'] = 'subscription_functions';
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('main')[0]['className'] = 'main subscription';
  var subscriptionBlockElement = document['getElementsByClassName']('subscription_block')[0];
  subscriptionBlockElement['style']['display'] = 'block';
  subscriptionBlockElement['getElementsByClassName']('subscription_settings_raids')[0]['style']['display'] = 'none';
  subscriptionBlockElement['getElementsByClassName']('subscription_functions_block')[0]['style']['display'] = 'flex';
  subscriptionBlockElement['getElementsByClassName']('subscription_journal_button')[0]['style']['display'] = 'none';
  subscriptionBlockElement['getElementsByClassName']('modal_close')[0]['onclick'] = hide_boss_manager;
  var buttons = subscriptionBlockElement['getElementsByClassName']('subscription_functions_block_button');
  buttons[0]['onclick'] = function() {
    hide_boss_manager();
    show_hangar()
  };
  buttons[1]['onclick'] = function() {
    show_boxes_subscription()
  };
  buttons[2]['onclick'] = function() {
    hide_boss_manager();
    show_collections()
  }
}

function work_bm_begin() {
  if (get_current_timestamp() < window['player']['subscription']['paid_time']) {
    var subscriptionBlockElement = document['getElementsByClassName']('subscription_block')[0];
    var _0xdbf0x76 = window['player']['subscription']['paid_time'] - get_current_timestamp();
    var _0xdbf0x6 = _0xdbf0x76 % 86400;
    var days = (_0xdbf0x76 - _0xdbf0x6) / 86400;
    if (days > 0) {
      if (_0xdbf0x6 > 0) {
        days++
      };
      var output = word_form(days, 'день', 'дня', 'дней')
    } else {
      var _0xdbf0x86 = _0xdbf0x6 % 3600;
      var hours = (_0xdbf0x6 - _0xdbf0x86) / 3600;
      if (hours > 0) {
        if (_0xdbf0x86 > 0) {
          hours++
        };
        var output = word_form(hours, 'час', 'часа', 'часов')
      } else {
        var _0xdbf0x88 = _0xdbf0x86 % 60;
        var minutes = (_0xdbf0x86 - _0xdbf0x88) / 60;
        if (minutes > 0) {
          if (_0xdbf0x88 > 0) {
            minutes++
          };
          var output = word_form(minutes, 'минута', 'минуты', 'минут')
        } else {
          var _0xdbf0x88 = _0xdbf0x86 % 60;
          var output = word_form(seconds, 'секунда', 'секунды', 'секунд')
        }
      }
    };
    var span = subscriptionBlockElement['getElementsByClassName']('subscription_status')[0]['getElementsByTagName']('span')[0];
    span['innerHTML'] = output;
    span['style']['cursor'] = 'pointer';
    span['onclick'] = show_status_subscription
  } else {
    clearTimeout(window['ubt']);
    hide_boss_manager();
    show_subscription_buy()
  }
}

function show_boss_manager() {
  window['bm_active_slot'] = -1;
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('main')[0]['className'] = 'main subscription';
  var subscriptionBlockElement = document['getElementsByClassName']('subscription_block')[0];
  subscriptionBlockElement['style']['display'] = 'block';
  subscriptionBlockElement['getElementsByClassName']('subscription_functions_block')[0]['style']['display'] = 'none';
  subscriptionBlockElement['getElementsByClassName']('subscription_settings_raids')[0]['style']['display'] = 'block';
  subscriptionBlockElement['getElementsByClassName']('modal_close')[0]['onclick'] = hide_boss_manager;
  subscriptionBlockElement['getElementsByClassName']('subscription_hacking_boxes')[0]['onclick'] = function() {
    window['bs_input'] = 1;
    show_boxes_subscription()
  };
  boss_manager_change_mode(0);
  var divElement = subscriptionBlockElement['getElementsByClassName']('subscription_raid_buttons')[0]['getElementsByTagName']('div');
  divElement[0]['onclick'] = show_boss_manager_add;
  divElement[1]['innerHTML'] = 'Запустить';
  divElement[1]['className'] = 'button button_green';
  divElement[1]['onclick'] = boss_manager_start;
  divElement[2]['style']['cursor'] = 'pointer';
  divElement[2]['onclick'] = boss_manager_clear;
  boss_manager_update_list();
  window['ubt_i'] = 0;
  window['boss_manager'] = 0;
  window['loc_page'] = 'boss_manager';
  boss_manager_update_journal()
}

function boss_manager_update_journal() {
  var subscriptionBlockElement = document['getElementsByClassName']('subscription_block')[0];
  var scrollListElement = subscriptionBlockElement['getElementsByClassName']('subscription_journal_list_scroll')[0];
  while (scrollListElement['firstChild']) {
    scrollListElement['removeChild'](scrollListElement['firstChild'])
  };
  window['player']['boss_manager_journal']['sort'](function(a, b) {
    if (a['time'] < b['time']) {
      return 1
    } else {
      if (a['time'] > b['time']) {
        return -1
      } else {
        if (a['id'] < b['id']) {
          return 1
        } else {
          if (a['id'] > b['id']) {
            return -1
          } else {
            return 0
          }
        }
      }
    }
  });
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boss_manager_journal']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'subscription_journal_list_item';
    if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 8) {
      _0xdbf0x8e['classList']['add']('no_boss')
    } else {
      if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 9) {
        _0xdbf0x8e['classList']['add']('no_weapons')
      } else {
        if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 10) {
          _0xdbf0x8e['classList']['add']('no_coins')
        }
      }
    };
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'subscription_journal_list_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 0 || window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 1 || window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 8) {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/' + window['player']['boss_manager_journal'][_0xdbf0x4]['info'] + '.jpg'
    } else {
      if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 2) {
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/boss_fight_surrender_icon.png'
      } else {
        if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 3) {
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/w' + (window['player']['boss_manager_journal'][_0xdbf0x4]['info'] + 1) + '-small.png'
        } else {
          if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 4 || window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 5 || window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 6 || window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 7 || window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 9) {
            _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/w' + (window['player']['boss_manager_journal'][_0xdbf0x4]['info'] + 4) + '-small.png'
          } else {
            if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 10) {
              _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/coin_2.png'
            } else {
              if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 11) {
                _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_limit_icon.png'
              }
            }
          }
        }
      }
    };
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0x91 = document['createElement']('div');
    if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 0) {
      _0xdbf0x91['innerHTML'] = 'Атаковали босса "' + window['bosses'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['default_name'] + '"'
    } else {
      if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 1) {
        var _0xdbf0x2c = '';
        var _0xdbf0x76 = window['player']['boss_manager_journal'][_0xdbf0x4]['subinfo'];
        var _0xdbf0x6 = _0xdbf0x76 % 3600;
        var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
        if (_0xdbf0x87 > 0) {
          _0xdbf0x2c += _0xdbf0x87 + ' ч '
        };
        var _0xdbf0x86 = _0xdbf0x6 % 60;
        var _0xdbf0x89 = (_0xdbf0x6 - _0xdbf0x86) / 60;
        if (_0xdbf0x89 > 0) {
          _0xdbf0x2c += _0xdbf0x89 + ' мин '
        };
        if (_0xdbf0x86 > 0) {
          _0xdbf0x2c += _0xdbf0x86 + ' сек'
        };
        _0xdbf0x91['innerHTML'] = 'Победили босса "' + window['bosses'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['default_name'] + '". Время битвы: ' + _0xdbf0x2c
      } else {
        if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 2) {
          _0xdbf0x91['innerHTML'] = 'Проиграли бой боссу "' + window['bosses'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['default_name'] + '". Осталось здоровья: ' + window['player']['boss_manager_journal'][_0xdbf0x4]['subinfo']['toLocaleString']()
        } else {
          if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 3) {
            _0xdbf0x91['innerHTML'] = 'Использовали "' + window['free_hits'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['name'] + '". Нанесено урона: ' + window['player']['boss_manager_journal'][_0xdbf0x4]['subinfo']['toLocaleString']()
          } else {
            if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 4) {
              _0xdbf0x91['innerHTML'] = 'Использовали "' + window['weapons_damage'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['name'] + '" (1 000 шт.). Нанесено урона: ' + window['player']['boss_manager_journal'][_0xdbf0x4]['subinfo']['toLocaleString']()
            } else {
              if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 5) {
                _0xdbf0x91['innerHTML'] = 'Использовали "' + window['weapons_damage'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['name'] + '" (100 шт.). Нанесено урона: ' + window['player']['boss_manager_journal'][_0xdbf0x4]['subinfo']['toLocaleString']()
              } else {
                if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 6) {
                  _0xdbf0x91['innerHTML'] = 'Использовали "' + window['weapons_damage'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['name'] + '" (10 шт.). Нанесено урона: ' + window['player']['boss_manager_journal'][_0xdbf0x4]['subinfo']['toLocaleString']()
                } else {
                  if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 7) {
                    _0xdbf0x91['innerHTML'] = 'Использовали "' + window['weapons_damage'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['name'] + '" (1 шт.). Нанесено урона: ' + window['player']['boss_manager_journal'][_0xdbf0x4]['subinfo']['toLocaleString']()
                  } else {
                    if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 8) {
                      _0xdbf0x91['innerHTML'] = 'Босс "' + window['bosses'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['default_name'] + '" недоступен для нападения'
                    } else {
                      if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 9) {
                        _0xdbf0x91['innerHTML'] = 'Отсутствуют "' + window['weapons_damage'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['name'] + '" в указанном количестве'
                      } else {
                        if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 10) {
                          _0xdbf0x91['innerHTML'] = 'Не хватает монет для ослабления босса "' + window['bosses'][window['player']['boss_manager_journal'][_0xdbf0x4]['info']]['default_name'] + '"'
                        } else {
                          if (window['player']['boss_manager_journal'][_0xdbf0x4]['code'] == 11) {
                            _0xdbf0x91['innerHTML'] = 'Достигнут лимит побед над боссами'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    _0xdbf0x91['className'] = 'subscription_journal_list_item_event';
    _0xdbf0x8e['appendChild'](_0xdbf0x91);
    var _0xdbf0x76 = document['createElement']('div');
    var _0xdbf0x2c = '';
    var _0xdbf0x75 = window['player']['boss_manager_journal'][_0xdbf0x4]['time'] * 1000;
    var _0xdbf0x92 = new Date(_0xdbf0x75);
    var _0xdbf0x87 = _0xdbf0x92['getHours']();
    if (_0xdbf0x87 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x87 + ':'
    } else {
      _0xdbf0x2c += _0xdbf0x87 + ':'
    };
    var _0xdbf0x89 = _0xdbf0x92['getMinutes']();
    if (_0xdbf0x89 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
    } else {
      _0xdbf0x2c += _0xdbf0x89 + ':'
    };
    var _0xdbf0x88 = _0xdbf0x92['getSeconds']();
    if (_0xdbf0x88 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x88
    } else {
      _0xdbf0x2c += _0xdbf0x88
    };
    _0xdbf0x76['innerHTML'] = _0xdbf0x2c;
    _0xdbf0x76['className'] = 'subscription_journal_list_item_time';
    _0xdbf0x8e['appendChild'](_0xdbf0x76);
    scrollListElement['appendChild'](_0xdbf0x8e)
  }
}

function boss_manager_stop() {
  window['boss_manager'] = 0;
  var subscriptionBlockElement = document['getElementsByClassName']('subscription_block')[0];
  var divElement = subscriptionBlockElement['getElementsByClassName']('subscription_raid_buttons')[0]['getElementsByTagName']('div');
  divElement[1]['innerHTML'] = 'Запустить';
  divElement[1]['className'] = 'button button_green';
  divElement[1]['onclick'] = boss_manager_start
}

function boss_manager_start() {
  window['boss_manager'] = 1;
  var subscriptionBlockElement = document['getElementsByClassName']('subscription_block')[0];
  var divElement = subscriptionBlockElement['getElementsByClassName']('subscription_raid_buttons')[0]['getElementsByTagName']('div');
  divElement[1]['innerHTML'] = 'Остановить';
  divElement[1]['className'] = 'button button_red';
  divElement[1]['onclick'] = boss_manager_stop
}

function boss_manager_select_boss_active() {
  var modalElement = document['getElementById']('modal');
  var _0xdbf0x36 = modalElement['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x5e = 0;
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[2];
  if (_0xdbf0x96['style']['zIndex'] == '2') {
    _0xdbf0x5e = 1
  };
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[3];
  if (_0xdbf0x96['style']['zIndex'] == '2') {
    _0xdbf0x5e = 1
  };
  if ((event['target']['tagName'] == 'DIV' || event['target']['tagName'] == 'LABEL' || event['target']['tagName'] == 'SPAN') && _0xdbf0x5e == 0) {
    _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[0];
    _0xdbf0x96['onclick'] = boss_manager_select_boss_deactive;
    _0xdbf0x96['style']['zIndex'] = '2';
    _0xdbf0x96['getElementsByTagName']('ul')[0]['style']['display'] = 'block'
  }
}

function boss_manager_select_free_hit_active() {
  var modalElement = document['getElementById']('modal');
  var _0xdbf0x36 = modalElement['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x5e = 0;
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[0];
  if (_0xdbf0x96['style']['zIndex'] == '2') {
    _0xdbf0x5e = 1
  };
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[3];
  if (_0xdbf0x96['style']['zIndex'] == '2') {
    _0xdbf0x5e = 1
  };
  if ((event['target']['tagName'] == 'DIV' || event['target']['tagName'] == 'LABEL' || event['target']['tagName'] == 'SPAN') && _0xdbf0x5e == 0) {
    _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[2];
    _0xdbf0x96['onclick'] = boss_manager_select_free_hit_deactive;
    _0xdbf0x96['style']['zIndex'] = '2';
    _0xdbf0x96['getElementsByTagName']('ul')[0]['style']['display'] = 'block'
  }
}

function boss_manager_select_hit_active() {
  var modalElement = document['getElementById']('modal');
  var _0xdbf0x36 = modalElement['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x5e = 0;
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[0];
  if (_0xdbf0x96['style']['zIndex'] == '2') {
    _0xdbf0x5e = 1
  };
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[2];
  if (_0xdbf0x96['style']['zIndex'] == '2') {
    _0xdbf0x5e = 1
  };
  if ((event['target']['tagName'] == 'DIV' || event['target']['tagName'] == 'LABEL' || event['target']['tagName'] == 'SPAN') && _0xdbf0x5e == 0) {
    _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[3];
    _0xdbf0x96['onclick'] = boss_manager_select_hit_deactive;
    _0xdbf0x96['style']['zIndex'] = '2';
    _0xdbf0x96['getElementsByTagName']('ul')[0]['style']['display'] = 'block'
  }
}

function boss_manager_edit(_0xdbf0x9a) {
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var modalElement = document['getElementById']('modal');
  modalElement['getElementsByClassName']('modal_close')[0]['onclick'] = hide_boss_manager_add;
  modalElement['style']['width'] = '470px';
  modalElement['style']['left'] = '265px';
  modalElement['style']['display'] = 'block';
  var button = modalElement['getElementsByClassName']('subscription_add_boss')[0];
  button['getElementsByClassName']('modal_header')[0]['innerHTML'] = 'Редактирование слота';
  button['onclick'] = function() {
    if (event['target']['tagName'] == 'DIV' && event['target']['className'] != 'subscription_add_boss_select select_boss' && event['target']['className'] != 'subscription_add_boss_select select_weapon') {
      boss_manager_select_boss_deactive();
      boss_manager_select_free_hit_deactive();
      boss_manager_select_hit_deactive()
    }
  };
  var _0xdbf0x96 = button['getElementsByClassName']('subscription_add_boss_select')[0];
  _0xdbf0x96['dataset']['bid'] = window['player']['boss_manager'][_0xdbf0x9a]['boss'];
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = window['bosses'][window['player']['boss_manager'][_0xdbf0x9a]['boss']]['default_name'];
  _0xdbf0x96['onclick'] = boss_manager_select_boss_active;
  var _0xdbf0x55 = _0xdbf0x96['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55['className'] != 'separator') {
      _0xdbf0x55[_0xdbf0x4]['onclick'] = function() {
        var _0xdbf0x9b = parseInt(this['dataset']['bid']);
        boss_manager_add_select_boss(_0xdbf0x9b)
      }
    }
  };
  _0xdbf0x96 = button['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = window['player']['boss_manager'][_0xdbf0x9a]['amount'];
  _0xdbf0x9c['onfocus'] = boss_manager_add_number_focus;
  _0xdbf0x9c['onblur'] = boss_manager_add_number_blur;
  _0xdbf0x9c['oninput'] = boss_manager_add_number_input;
  _0xdbf0x96['getElementsByTagName']('button')[0]['onclick'] = boss_manager_add_number_plus;
  _0xdbf0x96['getElementsByTagName']('button')[1]['onclick'] = boss_manager_add_number_minus;
  _0xdbf0x9c = button['getElementsByClassName']('subscription_add_boss_weakening')[0]['getElementsByTagName']('input')[0];
  if (window['player']['boss_manager'][_0xdbf0x9a]['debuff'] == 1) {
    _0xdbf0x9c['checked'] = true
  } else {
    _0xdbf0x9c['checked'] = false
  };
  _0xdbf0x96 = button['getElementsByClassName']('subscription_add_boss_select')[2];
  _0xdbf0x96['dataset']['fhid'] = window['player']['boss_manager'][_0xdbf0x9a]['free_hit'];
  _0xdbf0x96['onclick'] = boss_manager_select_free_hit_active;
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = window['free_hits'][window['player']['boss_manager'][_0xdbf0x9a]['free_hit']]['name'];
  _0xdbf0x55 = _0xdbf0x96['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['onclick'] = function() {
      var _0xdbf0x9d = parseInt(this['dataset']['fhid']);
      boss_manager_add_select_hit(_0xdbf0x9d)
    }
  };
  _0xdbf0x96 = button['getElementsByClassName']('subscription_add_boss_select')[3];
  _0xdbf0x96['onclick'] = boss_manager_select_hit_active;
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = 'Выбор удара';
  _0xdbf0x55 = _0xdbf0x96['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['onclick'] = function() {
      var _0xdbf0x9e = parseInt(this['dataset']['wid']);
      boss_manager_add_select_hit2(_0xdbf0x9e)
    }
  };
  _0xdbf0x96 = button['getElementsByClassName']('subscription_add_boss_select')[4];
  _0xdbf0x96['style']['display'] = 'none';
  _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '0';
  _0xdbf0x9c['onfocus'] = boss_manager_add_number2_focus;
  _0xdbf0x9c['onblur'] = boss_manager_add_number2_blur;
  _0xdbf0x9c['oninput'] = boss_manager_add_number2_input;
  _0xdbf0x96['getElementsByTagName']('button')[0]['onclick'] = boss_manager_add_number2_plus;
  _0xdbf0x96['getElementsByTagName']('button')[1]['onclick'] = boss_manager_add_number2_minus;
  var _0xdbf0x9f = button['getElementsByClassName']('subscription_add_boss_apply')[0];
  _0xdbf0x9f['style']['display'] = 'none';
  _0xdbf0x9f['onclick'] = boss_manager_add_hit;
  var _0xdbf0x55 = button['getElementsByClassName']('subscription_weapons_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0xa0 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boss_manager'][_0xdbf0x9a]['hits']['length']; _0xdbf0x4++) {
    _0xdbf0xa0++;
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'subscription_weapons_item';
    _0xdbf0x8e['dataset']['wid'] = window['player']['boss_manager'][_0xdbf0x9a]['hits'][_0xdbf0x4]['hit'];
    _0xdbf0x8e['dataset']['amount'] = window['player']['boss_manager'][_0xdbf0x9a]['hits'][_0xdbf0x4]['amount'];
    var _0xdbf0xa1 = document['createElement']('div');
    _0xdbf0xa1['className'] = 'subscription_weapons_item_number';
    var _0xdbf0x26 = document['createTextNode'](_0xdbf0xa0);
    _0xdbf0xa1['appendChild'](_0xdbf0x26);
    _0xdbf0x8e['appendChild'](_0xdbf0xa1);
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'subscription_weapons_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/w' + (window['player']['boss_manager'][_0xdbf0x9a]['hits'][_0xdbf0x4]['hit'] + 1) + '-small.png';
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0xa2 = document['createElement']('div');
    _0xdbf0xa2['className'] = 'subscription_weapons_item_count';
    var _0xdbf0x15 = document['createTextNode'](window['player']['boss_manager'][_0xdbf0x9a]['hits'][_0xdbf0x4]['amount']);
    _0xdbf0xa2['appendChild'](_0xdbf0x15);
    _0xdbf0x8e['appendChild'](_0xdbf0xa2);
    var _0xdbf0xa3 = document['createElement']('div');
    _0xdbf0xa3['className'] = 'subscription_weapons_item_delete';
    _0xdbf0xa3['onclick'] = boss_manager_add_delete_hit;
    _0xdbf0x8e['appendChild'](_0xdbf0xa3);
    _0xdbf0x55['appendChild'](_0xdbf0x8e);
    _0xdbf0x55['dataset']['last_id'] = _0xdbf0xa0;
    _0xdbf0x96 = button['getElementsByClassName']('subscription_add_boss_select')[3];
    _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = 'Выбор удара';
    _0xdbf0x96 = button['getElementsByClassName']('subscription_add_boss_select')[4];
    _0xdbf0x96['style']['display'] = 'none';
    _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
    _0xdbf0x9c['value'] = '0';
    var _0xdbf0x9f = button['getElementsByClassName']('subscription_add_boss_apply')[0];
    _0xdbf0x9f['style']['display'] = 'none'
  };
  _0xdbf0x55['dataset']['last_id'] = _0xdbf0xa0;
  _0xdbf0x55 = button['getElementsByClassName']('subscription_add_boss_button')[0]['getElementsByClassName']('button');
  _0xdbf0x55[0]['onclick'] = function() {
    boss_manager_edit_save(_0xdbf0x9a)
  };
  _0xdbf0x55[1]['style']['cursor'] = 'pointer';
  _0xdbf0x55[1]['onclick'] = boss_manager_add_clear;
  button['style']['display'] = 'block'
}

function show_boss_manager_add() {
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = 4;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementById']('modal');
  _0xdbf0x35['getElementsByClassName']('modal_close')[0]['onclick'] = hide_boss_manager_add;
  _0xdbf0x35['style']['width'] = '470px';
  _0xdbf0x35['style']['left'] = '265px';
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  _0xdbf0x36['getElementsByClassName']('modal_header')[0]['innerHTML'] = 'Добавление слота';
  _0xdbf0x36['onclick'] = function() {
    if (event['target']['tagName'] == 'DIV' && event['target']['className'] != 'subscription_add_boss_select select_boss' && event['target']['className'] != 'subscription_add_boss_select select_weapon') {
      boss_manager_select_boss_deactive();
      boss_manager_select_free_hit_deactive();
      boss_manager_select_hit_deactive()
    }
  };
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[0];
  _0xdbf0x96['dataset']['bid'] = '-1';
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = 'Выбор босса';
  _0xdbf0x96['onclick'] = boss_manager_select_boss_active;
  var _0xdbf0x55 = _0xdbf0x96['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55['className'] != 'separator') {
      _0xdbf0x55[_0xdbf0x4]['onclick'] = function() {
        var _0xdbf0x9b = parseInt(this['dataset']['bid']);
        boss_manager_add_select_boss(_0xdbf0x9b)
      }
    }
  };
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '0';
  _0xdbf0x9c['onfocus'] = boss_manager_add_number_focus;
  _0xdbf0x9c['onblur'] = boss_manager_add_number_blur;
  _0xdbf0x9c['oninput'] = boss_manager_add_number_input;
  _0xdbf0x96['getElementsByTagName']('button')[0]['onclick'] = boss_manager_add_number_plus;
  _0xdbf0x96['getElementsByTagName']('button')[1]['onclick'] = boss_manager_add_number_minus;
  _0xdbf0x9c = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_weakening')[0]['getElementsByTagName']('input')[0];
  _0xdbf0x9c['checked'] = false;
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[2];
  _0xdbf0x96['dataset']['fhid'] = '-1';
  _0xdbf0x96['onclick'] = boss_manager_select_free_hit_active;
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = 'Выбор удара';
  _0xdbf0x55 = _0xdbf0x96['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['onclick'] = function() {
      var _0xdbf0x9d = parseInt(this['dataset']['fhid']);
      boss_manager_add_select_hit(_0xdbf0x9d)
    }
  };
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[3];
  _0xdbf0x96['onclick'] = boss_manager_select_hit_active;
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = 'Выбор удара';
  _0xdbf0x55 = _0xdbf0x96['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['onclick'] = function() {
      var _0xdbf0x9e = parseInt(this['dataset']['wid']);
      boss_manager_add_select_hit2(_0xdbf0x9e)
    }
  };
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
  _0xdbf0x96['style']['display'] = 'none';
  _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '0';
  _0xdbf0x9c['onfocus'] = boss_manager_add_number2_focus;
  _0xdbf0x9c['onblur'] = boss_manager_add_number2_blur;
  _0xdbf0x9c['oninput'] = boss_manager_add_number2_input;
  _0xdbf0x96['getElementsByTagName']('button')[0]['onclick'] = boss_manager_add_number2_plus;
  _0xdbf0x96['getElementsByTagName']('button')[1]['onclick'] = boss_manager_add_number2_minus;
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_apply')[0];
  _0xdbf0x9f['style']['display'] = 'none';
  _0xdbf0x9f['onclick'] = boss_manager_add_hit;
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_weapons_list')[0];
  _0xdbf0x55['dataset']['last_id'] = '0';
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_button')[0]['getElementsByClassName']('button');
  _0xdbf0x55[0]['onclick'] = boss_manager_add_save;
  _0xdbf0x55[1]['style']['cursor'] = 'pointer';
  _0xdbf0x55[1]['onclick'] = boss_manager_add_clear;
  _0xdbf0x36['style']['display'] = 'block'
}

function boss_manager_edit_save(_0xdbf0x9a) {
  var modalElement = document['getElementById']('modal');
  var _0xdbf0x36 = modalElement['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[0];
  var _0xdbf0x9b = parseInt(_0xdbf0x96['dataset']['bid']);
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  var _0xdbf0xa6 = parseInt(_0xdbf0x9c['value']);
  _0xdbf0x9c = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_weakening')[0]['getElementsByTagName']('input')[0];
  if (_0xdbf0x9c['checked']) {
    var _0xdbf0xa7 = 1
  } else {
    var _0xdbf0xa7 = 0
  };
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[2];
  var _0xdbf0x9d = parseInt(_0xdbf0x96['dataset']['fhid']);
  if (_0xdbf0x9b > -1 && _0xdbf0xa6 > 0 && _0xdbf0x9d > -1) {
    var _0xdbf0xa8 = [];
    var _0xdbf0xa9 = [];
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_weapons_list')[0]['getElementsByClassName']('subscription_weapons_item');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      var _0xdbf0x9e = parseInt(_0xdbf0x55[_0xdbf0x4]['dataset']['wid']);
      var _0xdbf0xaa = parseInt(_0xdbf0x55[_0xdbf0x4]['dataset']['amount']);
      _0xdbf0xa8['push']({
        hit: _0xdbf0x9e,
        amount: _0xdbf0xaa
      });
      _0xdbf0xa9['push'](_0xdbf0x9e + '_' + _0xdbf0xaa)
    };
    var _0xdbf0xab = window['player']['boss_manager'][_0xdbf0x9a]['rid'];
    var _0xdbf0xac = window['player']['boss_manager'][_0xdbf0x9a]['done'];
    var _0xdbf0x42 = {
      boss: _0xdbf0x9b,
      free_hit: _0xdbf0x9d,
      debuff: _0xdbf0xa7,
      amount: _0xdbf0xa6,
      done: _0xdbf0xac,
      hits: _0xdbf0xa8,
      rid: _0xdbf0xab
    };
    window['player']['boss_manager'][_0xdbf0x9a] = _0xdbf0x42;
    boss_manager_update_list();
    hide_boss_manager_add();
    _0xdbf0x42 = {
      "row": _0xdbf0xab,
      "boss": _0xdbf0x9b,
      "free_hit": _0xdbf0x9d,
      "debuff": _0xdbf0xa7,
      "amount": _0xdbf0xa6
    };
    if (_0xdbf0xa9['length'] > 0) {
      _0xdbf0x42['hits'] = _0xdbf0xa9['join'](',')
    };
    server_action('boss_manager.edit', _0xdbf0x42)
  } else {
    hide_boss_manager_add();
    show_boss_manager_add_error()
  }
}

function boss_manager_add_save() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[0];
  var _0xdbf0x9b = parseInt(_0xdbf0x96['dataset']['bid']);
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  var _0xdbf0xa6 = parseInt(_0xdbf0x9c['value']);
  _0xdbf0x9c = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_weakening')[0]['getElementsByTagName']('input')[0];
  if (_0xdbf0x9c['checked']) {
    var _0xdbf0xa7 = 1
  } else {
    var _0xdbf0xa7 = 0
  };
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[2];
  var _0xdbf0x9d = parseInt(_0xdbf0x96['dataset']['fhid']);
  if (_0xdbf0x9b > -1 && _0xdbf0xa6 > 0 && _0xdbf0x9d > -1) {
    var _0xdbf0xa8 = [];
    var _0xdbf0xa9 = [];
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_weapons_list')[0]['getElementsByClassName']('subscription_weapons_item');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      var _0xdbf0x9e = parseInt(_0xdbf0x55[_0xdbf0x4]['dataset']['wid']);
      var _0xdbf0xaa = parseInt(_0xdbf0x55[_0xdbf0x4]['dataset']['amount']);
      _0xdbf0xa8['push']({
        hit: _0xdbf0x9e,
        amount: _0xdbf0xaa
      });
      _0xdbf0xa9['push'](_0xdbf0x9e + '_' + _0xdbf0xaa)
    };
    var _0xdbf0x42 = {
      boss: _0xdbf0x9b,
      rid: window['player']['static_resources']['bm_row_id']++,
      free_hit: _0xdbf0x9d,
      debuff: _0xdbf0xa7,
      amount: _0xdbf0xa6,
      done: 0,
      hits: _0xdbf0xa8
    };
    window['player']['boss_manager']['push'](_0xdbf0x42);
    boss_manager_update_list();
    hide_boss_manager_add();
    _0xdbf0x42 = {
      "boss": _0xdbf0x9b,
      "free_hit": _0xdbf0x9d,
      "debuff": _0xdbf0xa7,
      "amount": _0xdbf0xa6,
      "line": window['player']['boss_manager']['length'] - 1
    };
    if (window['player']['boss_manager']['length'] > 0) {
      _0xdbf0x42['line'] = window['player']['boss_manager']['length'] - 1
    } else {
      _0xdbf0x42['line'] = 0
    };
    if (_0xdbf0xa9['length'] > 0) {
      _0xdbf0x42['hits'] = _0xdbf0xa9['join'](',')
    };
    server_action('boss_manager.add', _0xdbf0x42)
  } else {
    hide_boss_manager_add();
    show_boss_manager_add_error()
  }
}

function show_boss_manager_add_error() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('boss_manager_add_error')[0];
  _0xdbf0x36['style']['display'] = 'block';
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_manager_add_error_button')[0];
  _0xdbf0x9f['onclick'] = hide_boss_manager_add_error
}

function hide_boss_manager_add_error() {
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('boss_manager_add_error')[0];
  _0xdbf0x36['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementById']('modal');
  _0xdbf0x35['style']['display'] = 'block';
  _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0]['style']['display'] = 'block'
}

function boss_manager_add_clear() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[0];
  _0xdbf0x96['dataset']['bid'] = '-1';
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = 'Выбор босса';
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '0';
  _0xdbf0x9c = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_weakening')[0]['getElementsByTagName']('input')[0];
  _0xdbf0x9c['checked'] = false;
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[2];
  _0xdbf0x96['dataset']['fhid'] = '-1';
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = 'Выбор удара';
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[3];
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = 'Выбор удара';
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
  _0xdbf0x96['style']['display'] = 'none';
  _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '0';
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_apply')[0];
  _0xdbf0x9f['style']['display'] = 'none';
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_weapons_list')[0];
  _0xdbf0x55['dataset']['last_id'] = '0';
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  }
}

function boss_manager_add_delete_hit() {
  var _0xdbf0x8e = event['target']['parentNode'];
  _0xdbf0x8e['parentNode']['removeChild'](_0xdbf0x8e);
  boss_manager_update_hits()
}

function boss_manager_update_hits() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_weapons_list')[0];
  var _0xdbf0xb3 = _0xdbf0x55['getElementsByClassName']('subscription_weapons_item');
  var _0xdbf0xa0 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0xb3['length']; _0xdbf0x4++) {
    _0xdbf0xa0++;
    _0xdbf0xb3[_0xdbf0x4]['getElementsByClassName']('subscription_weapons_item_number')[0]['innerHTML'] = _0xdbf0xa0
  };
  _0xdbf0x55['dataset']['last_id'] = _0xdbf0xa0
}

function boss_manager_add_hit() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[3];
  var _0xdbf0x9e = parseInt(_0xdbf0x96['dataset']['wid']);
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  var _0xdbf0xa6 = parseInt(_0xdbf0x9c['value']);
  if (_0xdbf0x9e < 3) {
    _0xdbf0xa6 = 1
  };
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_weapons_list')[0];
  var _0xdbf0xa0 = parseInt(_0xdbf0x55['dataset']['last_id']);
  if (_0xdbf0xa0 < 16) {
    _0xdbf0xa0++;
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'subscription_weapons_item';
    _0xdbf0x8e['dataset']['wid'] = _0xdbf0x9e;
    _0xdbf0x8e['dataset']['amount'] = _0xdbf0xa6;
    var _0xdbf0xa1 = document['createElement']('div');
    _0xdbf0xa1['className'] = 'subscription_weapons_item_number';
    var _0xdbf0x26 = document['createTextNode'](_0xdbf0xa0);
    _0xdbf0xa1['appendChild'](_0xdbf0x26);
    _0xdbf0x8e['appendChild'](_0xdbf0xa1);
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'subscription_weapons_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/w' + (_0xdbf0x9e + 1) + '-small.png';
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0xa2 = document['createElement']('div');
    _0xdbf0xa2['className'] = 'subscription_weapons_item_count';
    var _0xdbf0x15 = document['createTextNode'](_0xdbf0xa6);
    _0xdbf0xa2['appendChild'](_0xdbf0x15);
    _0xdbf0x8e['appendChild'](_0xdbf0xa2);
    var _0xdbf0xa3 = document['createElement']('div');
    _0xdbf0xa3['className'] = 'subscription_weapons_item_delete';
    _0xdbf0xa3['onclick'] = boss_manager_add_delete_hit;
    _0xdbf0x8e['appendChild'](_0xdbf0xa3);
    _0xdbf0x55['appendChild'](_0xdbf0x8e);
    _0xdbf0x55['dataset']['last_id'] = _0xdbf0xa0;
    _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[3];
    _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = 'Выбор удара';
    _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
    _0xdbf0x96['style']['display'] = 'none';
    _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
    _0xdbf0x9c['value'] = '0';
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_apply')[0];
    _0xdbf0x9f['style']['display'] = 'none'
  }
}

function boss_manager_add_number_focus() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = ''
}

function boss_manager_add_number_blur() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  if (_0xdbf0x9c['value']['length'] == 0) {
    _0xdbf0x9c['value'] = '0'
  }
}

function boss_manager_add_number_input() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  var _0xdbf0x2c = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x9c['value']['length']; _0xdbf0x4++) {
    if (_0xdbf0x9c['value'][_0xdbf0x4] == '0' || _0xdbf0x9c['value'][_0xdbf0x4] == '1' || _0xdbf0x9c['value'][_0xdbf0x4] == '2' || _0xdbf0x9c['value'][_0xdbf0x4] == '3' || _0xdbf0x9c['value'][_0xdbf0x4] == '4' || _0xdbf0x9c['value'][_0xdbf0x4] == '5' || _0xdbf0x9c['value'][_0xdbf0x4] == '6' || _0xdbf0x9c['value'][_0xdbf0x4] == '7' || _0xdbf0x9c['value'][_0xdbf0x4] == '8' || _0xdbf0x9c['value'][_0xdbf0x4] == '9') {
      _0xdbf0x2c['push'](_0xdbf0x9c['value'][_0xdbf0x4])
    }
  };
  var _0xdbf0x75 = _0xdbf0x2c['join']('');
  if (_0xdbf0x75['length'] > 3) {
    var _0xdbf0x2c = _0xdbf0x75['substring'](0, 3)
  } else {
    var _0xdbf0x2c = _0xdbf0x75
  };
  _0xdbf0x9c['value'] = _0xdbf0x2c
}

function boss_manager_add_number2_focus() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = ''
}

function boss_manager_add_number2_blur() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  if (_0xdbf0x9c['value']['length'] == 0) {
    _0xdbf0x9c['value'] = '0'
  }
}

function boss_manager_add_number2_input() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  var _0xdbf0x2c = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x9c['value']['length']; _0xdbf0x4++) {
    if (_0xdbf0x9c['value'][_0xdbf0x4] == '0' || _0xdbf0x9c['value'][_0xdbf0x4] == '1' || _0xdbf0x9c['value'][_0xdbf0x4] == '2' || _0xdbf0x9c['value'][_0xdbf0x4] == '3' || _0xdbf0x9c['value'][_0xdbf0x4] == '4' || _0xdbf0x9c['value'][_0xdbf0x4] == '5' || _0xdbf0x9c['value'][_0xdbf0x4] == '6' || _0xdbf0x9c['value'][_0xdbf0x4] == '7' || _0xdbf0x9c['value'][_0xdbf0x4] == '8' || _0xdbf0x9c['value'][_0xdbf0x4] == '9') {
      _0xdbf0x2c['push'](_0xdbf0x9c['value'][_0xdbf0x4])
    }
  };
  var _0xdbf0x75 = _0xdbf0x2c['join']('');
  if (_0xdbf0x75['length'] > 4) {
    var _0xdbf0x2c = _0xdbf0x75['substring'](0, 4)
  } else {
    var _0xdbf0x2c = _0xdbf0x75
  };
  _0xdbf0x9c['value'] = _0xdbf0x2c;
  if (parseInt(_0xdbf0x2c) > 0) {
    _0xdbf0x36['getElementsByClassName']('subscription_add_boss_apply')[0]['style']['display'] = 'block'
  } else {
    _0xdbf0x36['getElementsByClassName']('subscription_add_boss_apply')[0]['style']['display'] = 'none'
  }
}

function boss_manager_add_number2_plus() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  var _0xdbf0x4f = parseInt(_0xdbf0x9c['value']);
  if (_0xdbf0x4f < 9999) {
    _0xdbf0x4f++;
    _0xdbf0x9c['value'] = _0xdbf0x4f;
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_apply')[0];
    _0xdbf0x9f['style']['display'] = 'block'
  }
}

function boss_manager_add_number2_minus() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  var _0xdbf0x4f = parseInt(_0xdbf0x9c['value']);
  if (_0xdbf0x4f > 0) {
    _0xdbf0x4f--;
    _0xdbf0x9c['value'] = _0xdbf0x4f;
    if (_0xdbf0x4f == 0) {
      var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_apply')[0];
      _0xdbf0x9f['style']['display'] = 'none'
    }
  }
}

function boss_manager_add_select_hit2(_0xdbf0x9e) {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[3];
  _0xdbf0x96['dataset']['wid'] = _0xdbf0x9e;
  if (_0xdbf0x9e < 3) {
    var _0xdbf0xbe = window['free_hits'][_0xdbf0x9e]['name']
  } else {
    var _0xdbf0xbe = window['weapons_damage'][_0xdbf0x9e - 3]['name']
  };
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = _0xdbf0xbe;
  _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[4];
  _0xdbf0x96['getElementsByTagName']('input')[0]['value'] = '0';
  if (_0xdbf0x9e < 3) {
    _0xdbf0x96['style']['display'] = 'none';
    _0xdbf0x36['getElementsByClassName']('subscription_add_boss_apply')[0]['style']['display'] = 'block'
  } else {
    _0xdbf0x96['style']['display'] = 'block';
    _0xdbf0x36['getElementsByClassName']('subscription_add_boss_apply')[0]['style']['display'] = 'none'
  };
  boss_manager_select_hit_deactive()
}

function boss_manager_add_select_hit(_0xdbf0x9d) {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[2];
  _0xdbf0x96['dataset']['fhid'] = _0xdbf0x9d;
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = window['free_hits'][_0xdbf0x9d]['name'];
  boss_manager_select_free_hit_deactive()
}

function boss_manager_add_select_boss(_0xdbf0x9b) {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[0];
  _0xdbf0x96['dataset']['bid'] = _0xdbf0x9b;
  _0xdbf0x96['getElementsByTagName']('label')[0]['innerHTML'] = window['bosses'][_0xdbf0x9b]['default_name'];
  boss_manager_select_boss_deactive()
}

function boss_manager_select_boss_deactive() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[0];
  _0xdbf0x96['onclick'] = boss_manager_select_boss_active;
  _0xdbf0x96['style']['zIndex'] = '1';
  _0xdbf0x96['getElementsByTagName']('ul')[0]['style']['display'] = 'none'
}

function boss_manager_select_free_hit_deactive() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[2];
  _0xdbf0x96['onclick'] = boss_manager_select_free_hit_active;
  _0xdbf0x96['style']['zIndex'] = '1';
  _0xdbf0x96['getElementsByTagName']('ul')[0]['style']['display'] = 'none'
}

function boss_manager_select_hit_deactive() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[3];
  _0xdbf0x96['onclick'] = boss_manager_select_hit_active;
  _0xdbf0x96['style']['zIndex'] = '1';
  _0xdbf0x96['getElementsByTagName']('ul')[0]['style']['display'] = 'none'
}

function boss_manager_add_number_plus() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  var _0xdbf0x4f = parseInt(_0xdbf0x9c['value']);
  if (_0xdbf0x4f < 999) {
    _0xdbf0x4f++;
    _0xdbf0x9c['value'] = _0xdbf0x4f
  }
}

function boss_manager_add_number_minus() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0];
  var _0xdbf0x96 = _0xdbf0x36['getElementsByClassName']('subscription_add_boss_select')[1];
  var _0xdbf0x9c = _0xdbf0x96['getElementsByTagName']('input')[0];
  var _0xdbf0x4f = parseInt(_0xdbf0x9c['value']);
  if (_0xdbf0x4f > 0) {
    _0xdbf0x4f--;
    _0xdbf0x9c['value'] = _0xdbf0x4f
  }
}

function hide_boss_manager_add() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementById']('modal');
  _0xdbf0x35['style']['display'] = 'none';
  _0xdbf0x35['getElementsByClassName']('subscription_add_boss')[0]['style']['display'] = 'none'
}

function boss_manager_update_list() {
  var _0xdbf0x36 = document['getElementsByClassName']('subscription_block')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_raid_list_scroll')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  if (window['player']['boss_manager'] && window['player']['boss_manager']['length'] > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boss_manager']['length']; _0xdbf0x4++) {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'subscription_raid_list_item';
      if (window['bm_active_slot'] > 0 && window['bm_active_slot'] == window['player']['boss_manager'][_0xdbf0x4]['rid']) {
        _0xdbf0x8e['classList']['add']('active')
      };
      var _0xdbf0xc8 = document['createElement']('div');
      _0xdbf0xc8['className'] = 'subscription_raid_list_item_image';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/' + window['player']['boss_manager'][_0xdbf0x4]['boss'] + '.jpg';
      _0xdbf0xc8['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0xc8);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['innerHTML'] = window['bosses'][window['player']['boss_manager'][_0xdbf0x4]['boss']]['default_name'];
      _0xdbf0x3d['className'] = 'subscription_raid_list_item_name';
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      var _0xdbf0xa8 = document['createElement']('div');
      _0xdbf0xa8['className'] = 'subscription_raid_list_item_weapons';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/w' + (window['player']['boss_manager'][_0xdbf0x4]['free_hit'] + 1) + '-small.png';
      _0xdbf0xa8['appendChild'](_0xdbf0x90);
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/subscription/weapons.png';
      if (window['player']['boss_manager'][_0xdbf0x4]['hits'] && window['player']['boss_manager'][_0xdbf0x4]['hits']['length'] > 0) {
        _0xdbf0x90['className'] = ''
      } else {
        _0xdbf0x90['className'] = 'hide'
      };
      _0xdbf0xa8['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0xa8);
      var _0xdbf0xc9 = document['createElement']('div');
      _0xdbf0xc9['className'] = 'subscription_raid_list_item_weakening';
      var _0xdbf0x9c = document['createElement']('input');
      _0xdbf0x9c['type'] = 'checkbox';
      _0xdbf0x9c['id'] = 'dbf_' + _0xdbf0x4;
      _0xdbf0x9c['disabled'] = true;
      if (window['player']['boss_manager'][_0xdbf0x4]['debuff']) {
        _0xdbf0x9c['checked'] = true
      } else {
        _0xdbf0x9c['checked'] = false
      };
      _0xdbf0xc9['appendChild'](_0xdbf0x9c);
      var _0xdbf0xca = document['createElement']('label');
      _0xdbf0xca['className'] = 'checkbox';
      _0xdbf0xca['htmlFor'] = 'dbf_' + _0xdbf0x4;
      _0xdbf0xc9['appendChild'](_0xdbf0xca);
      _0xdbf0x8e['appendChild'](_0xdbf0xc9);
      var _0xdbf0xcb = document['createElement']('div');
      _0xdbf0xcb['innerHTML'] = window['player']['boss_manager'][_0xdbf0x4]['done'] + '/' + window['player']['boss_manager'][_0xdbf0x4]['amount'];
      _0xdbf0xcb['className'] = 'subscription_raid_list_item_winner';
      _0xdbf0x8e['appendChild'](_0xdbf0xcb);
      var _0xdbf0xcc = document['createElement']('div');
      _0xdbf0xcc['dataset']['i'] = _0xdbf0x4;
      _0xdbf0xcc['onclick'] = function() {
        var _0xdbf0x4 = parseInt(event['target']['dataset']['i']);
        boss_manager_edit(_0xdbf0x4)
      };
      _0xdbf0xcc['className'] = 'subscription_raid_list_item_edit';
      _0xdbf0x8e['appendChild'](_0xdbf0xcc);
      var _0xdbf0xa3 = document['createElement']('div');
      _0xdbf0xa3['dataset']['i'] = _0xdbf0x4;
      _0xdbf0xa3['onclick'] = function() {
        var _0xdbf0x4 = parseInt(event['target']['dataset']['i']);
        boss_manager_delete(_0xdbf0x4)
      };
      _0xdbf0xa3['className'] = 'subscription_raid_list_item_delete';
      _0xdbf0x8e['appendChild'](_0xdbf0xa3);
      _0xdbf0x55['appendChild'](_0xdbf0x8e)
    }
  }
}

function boss_manager_delete(_0xdbf0x9a) {
  var _0xdbf0xab = window['player']['boss_manager'][_0xdbf0x9a]['rid'];
  window['player']['boss_manager']['splice'](_0xdbf0x9a, 1);
  server_action('boss_manager.delete', {
    "row": _0xdbf0xab
  });
  boss_manager_update_list()
}

function boss_manager_clear() {
  if (window['player']['boss_manager']['length'] > 0) {
    window['player']['boss_manager'] = [];
    server_action('boss_manager.clear', {});
    boss_manager_update_list()
  }
}

function boss_manager_change_mode(_0xdbf0x5d) {
  var _0xdbf0x36 = document['getElementsByClassName']('subscription_block')[0];
  if (_0xdbf0x5d == 0) {
    _0xdbf0x36['getElementsByClassName']('subscription_journal')[0]['style']['display'] = 'none';
    _0xdbf0x36['getElementsByClassName']('subscription_bosses')[0]['style']['display'] = 'block';
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_journal_button')[0];
    _0xdbf0x9f['innerHTML'] = 'Журнал действий';
    _0xdbf0x9f['onclick'] = function() {
      boss_manager_change_mode(1)
    }
  } else {
    _0xdbf0x36['getElementsByClassName']('subscription_bosses')[0]['style']['display'] = 'none';
    _0xdbf0x36['getElementsByClassName']('subscription_journal')[0]['style']['display'] = 'block';
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_journal_button')[0];
    _0xdbf0x9f['innerHTML'] = 'Очередь боссов';
    _0xdbf0x9f['onclick'] = function() {
      boss_manager_change_mode(0)
    }
  }
}

function show_status_subscription() {
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = 4;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_subscription_term')[0];
  _0xdbf0x36['style']['display'] = 'block';
  var _0xdbf0x75 = window['player']['subscription']['paid_time'] * 1000;
  var _0xdbf0x92 = new Date(_0xdbf0x75);
  var _0xdbf0xd1 = _0xdbf0x36['getElementsByClassName']('subscription_term_date')[0]['getElementsByTagName']('span');
  var _0xdbf0x2c = '';
  if (_0xdbf0x92['getDate']() < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x92['getDate']() + '.'
  } else {
    _0xdbf0x2c += _0xdbf0x92['getDate']() + '.'
  };
  var _0xdbf0xd2 = _0xdbf0x92['getMonth']();
  _0xdbf0xd2++;
  if (_0xdbf0xd2 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0xd2 + '.'
  } else {
    _0xdbf0x2c += _0xdbf0xd2 + '.'
  };
  _0xdbf0x2c += _0xdbf0x92['getFullYear']();
  _0xdbf0xd1[0]['innerHTML'] = _0xdbf0x2c;
  _0xdbf0x2c = '';
  if (_0xdbf0x92['getHours']() < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x92['getHours']() + ':'
  } else {
    _0xdbf0x2c += _0xdbf0x92['getHours']() + ':'
  };
  if (_0xdbf0x92['getMinutes']() < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x92['getMinutes']() + ':'
  } else {
    _0xdbf0x2c += _0xdbf0x92['getMinutes']() + ':'
  };
  if (_0xdbf0x92['getSeconds']() < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x92['getSeconds']()
  } else {
    _0xdbf0x2c += _0xdbf0x92['getSeconds']()
  };
  _0xdbf0xd1[1]['innerHTML'] = _0xdbf0x2c;
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_term_buttons_close')[0];
  _0xdbf0x9f['onclick'] = hide_status_subscription
}

function hide_status_subscription() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_subscription_term')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function work_boss_manager() {
  if (get_current_timestamp() < window['player']['subscription']['paid_time']) {
    var _0xdbf0x36 = document['getElementsByClassName']('subscription_block')[0];
    var _0xdbf0x76 = window['player']['subscription']['paid_time'] - get_current_timestamp();
    var _0xdbf0x6 = _0xdbf0x76 % 86400;
    var _0xdbf0x85 = (_0xdbf0x76 - _0xdbf0x6) / 86400;
    if (_0xdbf0x85 > 0) {
      if (_0xdbf0x6 > 0) {
        _0xdbf0x85++
      };
      var _0xdbf0x2c = word_form(_0xdbf0x85, 'день', 'дня', 'дней')
    } else {
      var _0xdbf0x86 = _0xdbf0x6 % 3600;
      var _0xdbf0x87 = (_0xdbf0x6 - _0xdbf0x86) / 3600;
      if (_0xdbf0x87 > 0) {
        if (_0xdbf0x86 > 0) {
          _0xdbf0x87++
        };
        var _0xdbf0x2c = word_form(_0xdbf0x87, 'час', 'часа', 'часов')
      } else {
        var _0xdbf0x88 = _0xdbf0x86 % 60;
        var _0xdbf0x89 = (_0xdbf0x86 - _0xdbf0x88) / 60;
        if (_0xdbf0x89 > 0) {
          if (_0xdbf0x88 > 0) {
            _0xdbf0x89++
          };
          var _0xdbf0x2c = word_form(_0xdbf0x89, 'минута', 'минуты', 'минут')
        } else {
          var _0xdbf0x88 = _0xdbf0x86 % 60;
          var _0xdbf0x2c = word_form(_0xdbf0x88, 'секунда', 'секунды', 'секунд')
        }
      }
    };
    var _0xdbf0x75 = _0xdbf0x36['getElementsByClassName']('subscription_status')[0]['getElementsByTagName']('span')[0];
    _0xdbf0x75['innerHTML'] = _0xdbf0x2c;
    _0xdbf0x75['style']['cursor'] = 'pointer';
    _0xdbf0x75['onclick'] = show_status_subscription;
    var _0xdbf0xa2 = _0xdbf0x36['getElementsByClassName']('subscription_boss_block')[0];
    var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['bosses_win'], 1, 86400);
    var _0xdbf0xd6 = window['limit_bosses'] + window['player']['static_resources']['boost_bosses_win'];
    _0xdbf0x36['getElementsByClassName']('subscription_boss_block_limit')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0xd5 + ' / ' + _0xdbf0xd6;
    var _0xdbf0xd7 = 0;
    if (typeof window['player']['raid']['boss'] !== 'undefined') {
      _0xdbf0xa2['classList']['remove']('no_boss');
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/subscription/boss_' + window['player']['raid']['boss'] + '.jpg';
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_status')[0]['innerHTML'] = 'Идёт бой';
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_name')[0]['innerHTML'] = window['bosses'][window['player']['raid']['boss']]['default_name'];
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_health')[0]['innerHTML'] = window['player']['raid']['health']['toLocaleString']() + ' / ' + window['bosses'][window['player']['raid']['boss']]['health']['toLocaleString']();
      var _0xdbf0x76 = window['player']['raid']['finish_time'] - get_current_timestamp();
      if (_0xdbf0x76 > 0) {
        var _0xdbf0x6 = _0xdbf0x76 % 3600;
        var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
        if (_0xdbf0x87 > 9) {
          var _0xdbf0x2c = _0xdbf0x87 + ':'
        } else {
          var _0xdbf0x2c = '0' + _0xdbf0x87 + ':'
        };
        var _0xdbf0x86 = _0xdbf0x6 % 60;
        var _0xdbf0x89 = (_0xdbf0x6 - _0xdbf0x86) / 60;
        if (_0xdbf0x89 > 9) {
          _0xdbf0x2c += _0xdbf0x89 + ':'
        } else {
          _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
        };
        if (_0xdbf0x86 > 9) {
          _0xdbf0x2c += _0xdbf0x86
        } else {
          _0xdbf0x2c += '0' + _0xdbf0x86
        }
      } else {
        var _0xdbf0x2c = '00:00:00'
      };
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_time')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0x2c;
      if (window['boss_manager'] == 1) {
        if (window['player']['raid']['health'] > 0) {
          if (get_current_timestamp() < window['player']['raid']['finish_time']) {
            if (window['ubt_i'] >= 3) {
              server_action_fast('raid.update_mini', {}, 'answer_server');
              window['ubt_i'] = 0
            } else {
              window['ubt_i']++
            }
          } else {
            _0xdbf0xd7 = 3
          }
        } else {
          _0xdbf0xd7 = 2
        }
      }
    } else {
      _0xdbf0xa2['classList']['add']('no_boss');
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/subscription/boss_default.jpg';
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_status')[0]['innerHTML'] = 'Нет битвы';
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_name')[0]['innerHTML'] = 'Имя босса';
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_health')[0]['innerHTML'] = '0 / 0';
      _0xdbf0xa2['getElementsByClassName']('subscription_boss_time')[0]['getElementsByTagName']('span')[0]['innerHTML'] = '00:00:00';
      if (window['boss_manager'] == 1) {
        _0xdbf0xd7 = 1
      }
    };
    if (_0xdbf0xd7 == 1) {
      var _0xdbf0xd8 = 0;
      var _0xdbf0x9b = -1;
      var _0xdbf0xa7 = -1;
      var _0xdbf0x38 = -1;
      var _0xdbf0xab = -1;
      var _0xdbf0xd9 = -1;
      var _0xdbf0x76 = get_current_timestamp();
      var _0xdbf0xda = 0;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boss_manager']['length']; _0xdbf0x4++) {
        if (_0xdbf0xd8 == 0) {
          if (_0xdbf0xd5 < _0xdbf0xd6) {
            if (window['player']['boss_manager'][_0xdbf0x4]['amount'] > window['player']['boss_manager'][_0xdbf0x4]['done']) {
              var _0xdbf0xd7 = 1;
              var _0xdbf0x75 = window['player']['boss_manager'][_0xdbf0x4]['boss'];
              if (_0xdbf0x75 <= 9) {
                var _0xdbf0xdb = window['bosses_requirements'][_0xdbf0x75];
                var _0xdbf0xdc = 0;
                for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xdb['length']; _0xdbf0xdd++) {
                  if (_0xdbf0xdb[_0xdbf0xdd]['mode'] == 'kill_boss') {
                    var _0xdbf0xde = _0xdbf0xdb[_0xdbf0xdd]['params'];
                    var _0xdbf0xdf = 0;
                    for (var _0xdbf0xe0 = 0; _0xdbf0xe0 < _0xdbf0xde['length']; _0xdbf0xe0++) {
                      if (window['player']['bosses'] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xe0]['boss']] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xe0]['boss']]['win_count'] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xe0]['boss']]['win_count'] >= _0xdbf0xde[_0xdbf0xe0]['amount']) {
                        _0xdbf0xdf++
                      }
                    };
                    if (_0xdbf0xdf == _0xdbf0xde['length']) {
                      _0xdbf0xdb[_0xdbf0xdd]['status'] = 1;
                      _0xdbf0xdc++
                    } else {
                      _0xdbf0xdb[_0xdbf0xdd]['status'] = 0
                    }
                  } else {
                    if (_0xdbf0xdb[_0xdbf0xdd]['mode'] == 'sut') {
                      if (window['player']['static_resources']['sut'] >= _0xdbf0xdb[_0xdbf0xdd]['params'][0]['amount']) {
                        _0xdbf0xdb[_0xdbf0xdd]['status'] = 1;
                        _0xdbf0xdc++
                      } else {
                        _0xdbf0xdb[_0xdbf0xdd]['status'] = 0
                      }
                    } else {
                      if (_0xdbf0xdb[_0xdbf0xdd]['mode'] == 'missions') {
                        var _0xdbf0xe1 = _0xdbf0xdb[_0xdbf0xdd]['params'];
                        var _0xdbf0xe2 = 0;
                        for (var _0xdbf0xe0 = 0; _0xdbf0xe0 < _0xdbf0xe1['length']; _0xdbf0xe0++) {
                          if (window['player']['missions'][_0xdbf0xe1[_0xdbf0xe0]['front']][_0xdbf0xe1[_0xdbf0xe0]['mission']]['win_count'] >= _0xdbf0xe1[_0xdbf0xe0]['amount']) {
                            _0xdbf0xe2++
                          }
                        };
                        if (_0xdbf0xe2 == _0xdbf0xe1['length']) {
                          _0xdbf0xdb[_0xdbf0xdd]['status'] = 1;
                          _0xdbf0xdc++
                        } else {
                          _0xdbf0xdb[_0xdbf0xdd]['status'] = 0
                        }
                      }
                    }
                  }
                };
                if (_0xdbf0xdc < _0xdbf0xdb['length']) {
                  _0xdbf0xd7 = 0
                }
              } else {
                if (_0xdbf0x75 == 14 || _0xdbf0x75 == 15) {
                  var _0xdbf0xe3 = -1;
                  var _0xdbf0xe4 = window['system']['time_resources']['new_day'] - 86401;
                  for (var _0xdbf0xe0 = 14; _0xdbf0xe0 <= 15; _0xdbf0xe0++) {
                    var _0xdbf0xe5 = window['bosses'][_0xdbf0xe0]['start_time'];
                    while (_0xdbf0xe5 < _0xdbf0xe4) {
                      _0xdbf0xe5 += 604800
                    };
                    if (get_current_timestamp() > _0xdbf0xe5 && get_current_timestamp() < (_0xdbf0xe5 + 86400)) {
                      _0xdbf0xe3 = _0xdbf0xe0
                    }
                  };
                  if (_0xdbf0xe3 != _0xdbf0x75) {
                    _0xdbf0xd7 = 0
                  }
                }
              };
              if (_0xdbf0xd7 == 1) {
                if (window['player']['boss_manager'][_0xdbf0x4]['debuff'] == 1) {
                  if (window['player']['static_resources']['coins'] >= window['bosses'][window['player']['boss_manager'][_0xdbf0x4]['boss']]['dbf']['price']) {
                    _0xdbf0x9b = window['player']['boss_manager'][_0xdbf0x4]['boss'];
                    _0xdbf0xa7 = window['player']['boss_manager'][_0xdbf0x4]['debuff'];
                    _0xdbf0x38 = _0xdbf0x4;
                    _0xdbf0xab = window['player']['boss_manager'][_0xdbf0x4]['rid'];
                    _0xdbf0xd9 = window['player']['boss_manager'][_0xdbf0x4]['free_hit'];
                    _0xdbf0xd8 = 1
                  } else {
                    window['player']['boss_manager'][_0xdbf0x4]['done'] = window['player']['boss_manager'][_0xdbf0x4]['amount'];
                    server_action('boss_manager.skip', {
                      "row": window['player']['boss_manager'][_0xdbf0x4]['rid']
                    });
                    server_action('boss_manager.add_log', {
                      "time": _0xdbf0x76,
                      "code": 10,
                      "info": window['player']['boss_manager'][_0xdbf0x4]['boss']
                    });
                    window['player']['boss_manager_journal']['push']({
                      "id": window['player']['static_resources']['bm_log_id']++,
                      "time": _0xdbf0x76,
                      "code": 10,
                      "info": window['player']['boss_manager'][_0xdbf0x4]['boss']
                    });
                    window['bm_active_slot'] = window['player']['boss_manager'][_0xdbf0x4]['rid'];
                    boss_manager_update_list()
                  }
                } else {
                  _0xdbf0x9b = window['player']['boss_manager'][_0xdbf0x4]['boss'];
                  _0xdbf0xa7 = window['player']['boss_manager'][_0xdbf0x4]['debuff'];
                  _0xdbf0x38 = _0xdbf0x4;
                  _0xdbf0xab = window['player']['boss_manager'][_0xdbf0x4]['rid'];
                  _0xdbf0xd9 = window['player']['boss_manager'][_0xdbf0x4]['free_hit'];
                  _0xdbf0xd8 = 1
                }
              } else {
                window['player']['boss_manager'][_0xdbf0x4]['done'] = window['player']['boss_manager'][_0xdbf0x4]['amount'];
                server_action('boss_manager.skip', {
                  "row": window['player']['boss_manager'][_0xdbf0x4]['rid']
                });
                server_action('boss_manager.add_log', {
                  "time": _0xdbf0x76,
                  "code": 8,
                  "info": window['player']['boss_manager'][_0xdbf0x4]['boss']
                });
                window['player']['boss_manager_journal']['push']({
                  "id": window['player']['static_resources']['bm_log_id']++,
                  "time": _0xdbf0x76,
                  "code": 8,
                  "info": window['player']['boss_manager'][_0xdbf0x4]['boss']
                });
                window['bm_active_slot'] = window['player']['boss_manager'][_0xdbf0x4]['rid'];
                boss_manager_update_list()
              }
            }
          } else {
            _0xdbf0xda = 1
          }
        }
      };
      if (_0xdbf0x9b > -1 && _0xdbf0xa7 > -1 && _0xdbf0x38 > -1 && _0xdbf0xab > -1 && _0xdbf0xd9 > -1) {
        window['player']['boss_manager'][_0xdbf0x38]['done']++;
        window['player']['raid']['boss'] = _0xdbf0x9b;
        var _0xdbf0xe6 = Math['min'](window['player']['static_resources']['sut'] - window['bosses'][_0xdbf0x9b]['dbf']['min_sut'], window['bosses'][_0xdbf0x9b]['dbf']['max_sut'] - window['bosses'][_0xdbf0x9b]['dbf']['min_sut']);
        if (_0xdbf0xa7 == 1) {
          var _0xdbf0xe7 = Math['round']((window['bosses'][_0xdbf0x9b]['health'] - window['bosses'][_0xdbf0x9b]['dbf']['start'] - window['bosses'][_0xdbf0x9b]['dbf']['remains']) / (window['bosses'][_0xdbf0x9b]['dbf']['max_sut'] - window['bosses'][_0xdbf0x9b]['dbf']['min_sut']));
          var _0xdbf0xe8 = window['bosses'][_0xdbf0x9b]['dbf']['start'] + _0xdbf0xe6 * _0xdbf0xe7;
          window['player']['static_resources']['coins'] -= window['bosses'][_0xdbf0x9b]['dbf']['price'];
          update_static_resources_coins()
        } else {
          var _0xdbf0xe8 = 0
        };
        var _0xdbf0xe9 = window['bosses'][_0xdbf0x9b]['health'] - _0xdbf0xe8;
        window['player']['raid']['top'] = [];
        window['player']['raid']['health'] = _0xdbf0xe9;
        window['player']['raid']['start_time'] = get_current_timestamp();
        window['player']['raid']['finish_time'] = get_current_timestamp() + 28800 + window['player']['static_resources']['boost_fight_time'];
        update_static_resources_coins();
        window['player']['static_resources']['used_free_hit_0'] = 0;
        window['player']['static_resources']['used_free_hit_1'] = 0;
        window['player']['static_resources']['used_free_hit_2'] = 0;
        server_action('raid.start', {
          "boss": _0xdbf0x9b,
          "debuff": _0xdbf0xa7
        });
        server_action('boss_manager.step', {
          "row": _0xdbf0xab
        });
        server_action('boss_manager.add_log', {
          "time": _0xdbf0x76,
          "code": 0,
          "info": _0xdbf0x9b
        });
        window['player']['boss_manager_journal']['push']({
          "id": window['player']['static_resources']['bm_log_id']++,
          "time": _0xdbf0x76,
          "code": 0,
          "info": _0xdbf0x9b
        });
        window['bm_active_slot'] = _0xdbf0xab;
        boss_manager_update_list();
        var _0xdbf0xd8 = 0;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boss_manager'][_0xdbf0x38]['hits']['length']; _0xdbf0x4++) {
          if (window['player']['boss_manager'][_0xdbf0x38]['hits'][_0xdbf0x4]['hit'] == 0 || window['player']['boss_manager'][_0xdbf0x38]['hits'][_0xdbf0x4]['hit'] == 1 || window['player']['boss_manager'][_0xdbf0x38]['hits'][_0xdbf0x4]['hit'] == 2) {
            _0xdbf0xd8 = 1
          }
        };
        if (_0xdbf0xd8 == 0) {
          server_action('weapons.free_hit', {
            "weapon": _0xdbf0xd9
          });
          var _0xdbf0xea = window['free_hits'][_0xdbf0xd9]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0xd9];
          window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
          window['player']['achievements']['total_damage'] += _0xdbf0xea;
          server_action('boss_manager.add_log', {
            "time": _0xdbf0x76,
            "code": 3,
            "info": _0xdbf0xd9,
            "subinfo": _0xdbf0xea
          });
          window['player']['boss_manager_journal']['push']({
            "id": window['player']['static_resources']['bm_log_id']++,
            "time": _0xdbf0x76,
            "code": 3,
            "info": _0xdbf0xd9,
            "subinfo": _0xdbf0xea
          });
          window['player']['time_resources']['free_hit'] = get_current_timestamp() + window['free_hits'][_0xdbf0xd9]['time'] - window['player']['static_resources']['boost_speed_recovery_free_weapon_' + _0xdbf0xd9];
          window['player']['static_resources']['used_free_hit_' + _0xdbf0xd9]++;
          for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
            if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'damage') {
              window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0xea;
              if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
                window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
              }
            }
          }
        };
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boss_manager'][_0xdbf0x38]['hits']['length']; _0xdbf0x4++) {
          var _0xdbf0xd9 = window['player']['boss_manager'][_0xdbf0x38]['hits'][_0xdbf0x4]['hit'];
          if (_0xdbf0xd9 <= 2) {
            if (window['player']['time_resources']['free_hit'] < get_current_timestamp()) {
              server_action('weapons.free_hit', {
                "weapon": _0xdbf0xd9
              });
              var _0xdbf0xea = window['free_hits'][_0xdbf0xd9]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0xd9];
              window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
              window['player']['achievements']['total_damage'] += _0xdbf0xea;
              server_action('boss_manager.add_log', {
                "time": _0xdbf0x76,
                "code": 3,
                "info": _0xdbf0xd9,
                "subinfo": _0xdbf0xea
              });
              window['player']['boss_manager_journal']['push']({
                "id": window['player']['static_resources']['bm_log_id']++,
                "time": _0xdbf0x76,
                "code": 3,
                "info": _0xdbf0xd9,
                "subinfo": _0xdbf0xea
              });
              window['player']['time_resources']['free_hit'] = get_current_timestamp() + window['free_hits'][_0xdbf0xd9]['time'] - window['player']['static_resources']['boost_speed_recovery_free_weapon_' + _0xdbf0xd9];
              window['player']['static_resources']['used_free_hit_' + _0xdbf0xd9]++;
              for (var _0xdbf0xdd = 0; _0xdbf0xdd < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0xdd++) {
                if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['type'] == 'damage') {
                  window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0xdd] += _0xdbf0xea;
                  if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0xdd] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['done'] != 1) {
                    window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['done'] = 1
                  }
                }
              }
            } else {
              var _0xdbf0xe5 = window['player']['time_resources']['free_hit'] - get_current_timestamp();
              var _0xdbf0x6 = _0xdbf0xe5 % 3600;
              var _0xdbf0x15 = (_0xdbf0xe5 - _0xdbf0x6) / 3600;
              if (_0xdbf0x6 > 0) {
                _0xdbf0x15++
              };
              if (window['player']['static_resources']['tokens'] >= _0xdbf0x15) {
                window['player']['static_resources']['tokens'] -= _0xdbf0x15;
                if (window['player']['settings']['resource'] == 0) {
                  change_resource('tokens', 0)
                } else {
                  change_resource('encryptions', 0)
                };
                server_action('weapons.refresh', {
                  "weapon": _0xdbf0xd9
                });
                var _0xdbf0xea = window['free_hits'][_0xdbf0xd9]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0xd9];
                window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
                window['player']['achievements']['total_damage'] += _0xdbf0xea;
                server_action('boss_manager.add_log', {
                  "time": _0xdbf0x76,
                  "code": 3,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['boss_manager_journal']['push']({
                  "id": window['player']['static_resources']['bm_log_id']++,
                  "time": _0xdbf0x76,
                  "code": 3,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['time_resources']['free_hit'] = get_current_timestamp() + window['free_hits'][_0xdbf0xd9]['time'] - window['player']['static_resources']['boost_speed_recovery_free_weapon_' + _0xdbf0xd9];
                window['player']['static_resources']['used_free_hit_' + _0xdbf0xd9]++;
                for (var _0xdbf0xdd = 0; _0xdbf0xdd < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0xdd++) {
                  if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['type'] == 'damage') {
                    window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0xdd] += _0xdbf0xea;
                    if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0xdd] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['done'] != 1) {
                      window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['done'] = 1
                    }
                  }
                }
              }
            }
          } else {
            _0xdbf0xd9 -= 3;
            var _0xdbf0xa6 = window['player']['boss_manager'][_0xdbf0x38]['hits'][_0xdbf0x4]['amount'];
            if (window['player']['static_resources']['weapon_' + _0xdbf0xd9] >= _0xdbf0xa6) {
              for (var _0xdbf0xdd = 0; _0xdbf0xdd < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0xdd++) {
                if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['type'] == 'weapons') {
                  if (_0xdbf0xd9 == window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['weapon']) {
                    window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0xdd] += _0xdbf0xa6;
                    if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0xdd] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['done'] != 1) {
                      window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0xdd];
                      window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['done'] = 1
                    }
                  }
                }
              };
              var _0xdbf0xea = (window['weapons_damage'][_0xdbf0xd9]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0xd9]) * _0xdbf0xa6;
              for (var _0xdbf0xdd = 0; _0xdbf0xdd < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0xdd++) {
                if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['type'] == 'damage') {
                  window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0xdd] += _0xdbf0xea;
                  if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0xdd] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['done'] != 1) {
                    window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0xdd]['done'] = 1
                  }
                }
              };
              var _0xdbf0xeb = 0;
              var _0xdbf0xec = 0;
              var _0xdbf0xed = 0;
              var _0xdbf0xee = 0;
              if (_0xdbf0xa6 >= 1000) {
                var _0xdbf0x6 = _0xdbf0xa6 % 1000;
                var _0xdbf0x75 = (_0xdbf0xa6 - _0xdbf0x6) / 1000;
                _0xdbf0xee = _0xdbf0x75;
                _0xdbf0xa6 = _0xdbf0x6
              };
              if (_0xdbf0xa6 >= 100) {
                var _0xdbf0x6 = _0xdbf0xa6 % 100;
                var _0xdbf0x75 = (_0xdbf0xa6 - _0xdbf0x6) / 100;
                _0xdbf0xed = _0xdbf0x75;
                _0xdbf0xa6 = _0xdbf0x6
              };
              if (_0xdbf0xa6 >= 10) {
                var _0xdbf0x6 = _0xdbf0xa6 % 10;
                var _0xdbf0x75 = (_0xdbf0xa6 - _0xdbf0x6) / 10;
                _0xdbf0xec = _0xdbf0x75;
                _0xdbf0xa6 = _0xdbf0x6
              };
              _0xdbf0xeb = _0xdbf0xa6;
              for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xee; _0xdbf0xdd++) {
                server_action('weapons.hit', {
                  "mode": 3,
                  "weapon": +_0xdbf0xd9
                });
                var _0xdbf0xea = (window['weapons_damage'][_0xdbf0xd9]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0xd9]) * 1000;
                window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
                window['player']['achievements']['total_damage'] += _0xdbf0xea;
                server_action('boss_manager.add_log', {
                  "time": _0xdbf0x76,
                  "code": 4,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['boss_manager_journal']['push']({
                  "id": window['player']['static_resources']['bm_log_id']++,
                  "time": _0xdbf0x76,
                  "code": 4,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['static_resources']['weapon_' + _0xdbf0xd9] -= 1000
              };
              for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xed; _0xdbf0xdd++) {
                server_action('weapons.hit', {
                  "mode": 2,
                  "weapon": +_0xdbf0xd9
                });
                var _0xdbf0xea = (window['weapons_damage'][_0xdbf0xd9]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0xd9]) * 100;
                window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
                window['player']['achievements']['total_damage'] += _0xdbf0xea;
                server_action('boss_manager.add_log', {
                  "time": _0xdbf0x76,
                  "code": 5,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['boss_manager_journal']['push']({
                  "id": window['player']['static_resources']['bm_log_id']++,
                  "time": _0xdbf0x76,
                  "code": 5,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['static_resources']['weapon_' + _0xdbf0xd9] -= 100
              };
              for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xec; _0xdbf0xdd++) {
                server_action('weapons.hit', {
                  "mode": 1,
                  "weapon": +_0xdbf0xd9
                });
                var _0xdbf0xea = (window['weapons_damage'][_0xdbf0xd9]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0xd9]) * 10;
                window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
                window['player']['achievements']['total_damage'] += _0xdbf0xea;
                server_action('boss_manager.add_log', {
                  "time": _0xdbf0x76,
                  "code": 6,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['boss_manager_journal']['push']({
                  "id": window['player']['static_resources']['bm_log_id']++,
                  "time": _0xdbf0x76,
                  "code": 6,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['static_resources']['weapon_' + _0xdbf0xd9] -= 10
              };
              for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xeb; _0xdbf0xdd++) {
                server_action('weapons.hit', {
                  "mode": 0,
                  "weapon": +_0xdbf0xd9
                });
                var _0xdbf0xea = window['weapons_damage'][_0xdbf0xd9]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0xd9];
                window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
                window['player']['achievements']['total_damage'] += _0xdbf0xea;
                server_action('boss_manager.add_log', {
                  "time": _0xdbf0x76,
                  "code": 7,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['boss_manager_journal']['push']({
                  "id": window['player']['static_resources']['bm_log_id']++,
                  "time": _0xdbf0x76,
                  "code": 7,
                  "info": _0xdbf0xd9,
                  "subinfo": _0xdbf0xea
                });
                window['player']['static_resources']['weapon_' + _0xdbf0xd9]--
              }
            } else {
              server_action('boss_manager.add_log', {
                "time": _0xdbf0x76,
                "code": 9,
                "info": _0xdbf0xd9
              });
              window['player']['boss_manager_journal']['push']({
                "id": window['player']['static_resources']['bm_log_id']++,
                "time": _0xdbf0x76,
                "code": 9,
                "info": _0xdbf0xd9
              })
            }
          }
        }
      } else {
        if (_0xdbf0xda == 1) {
          server_action('boss_manager.add_log', {
            "time": get_current_timestamp(),
            "code": 11
          });
          window['player']['boss_manager_journal']['push']({
            "id": window['player']['static_resources']['bm_log_id']++,
            "time": get_current_timestamp(),
            "code": 11
          });
          boss_manager_stop()
        }
      }
    } else {
      if (_0xdbf0xd7 == 2) {
        server_action('raid.finish', {});
        window['player']['time_resources']['free_hit'] = 0;
        var _0xdbf0x76 = get_current_timestamp() - window['player']['raid']['start_time'];
        server_action('boss_manager.add_log', {
          "time": get_current_timestamp(),
          "code": 1,
          "info": window['player']['raid']['boss'],
          "subinfo": _0xdbf0x76
        });
        window['player']['boss_manager_journal']['push']({
          "id": window['player']['static_resources']['bm_log_id']++,
          "time": get_current_timestamp(),
          "code": 1,
          "info": window['player']['raid']['boss'],
          "subinfo": _0xdbf0x76
        });
        window['player']['experiences']['experience']['amount'] += window['bosses'][window['player']['raid']['boss']]['reward']['experience'];
        update_level(0);
        window['player']['static_resources']['encryptions'] += window['bosses'][window['player']['raid']['boss']]['reward']['encryptions'];
        window['player']['achievements']['encryptions'] += window['bosses'][window['player']['raid']['boss']]['reward']['encryptions'];
        var _0xdbf0xef = 0;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['raid']['top']['length']; _0xdbf0x4++) {
          if (window['player']['raid']['top'][_0xdbf0x4][0] == window['game_login']) {
            _0xdbf0xef = window['player']['raid']['top'][_0xdbf0x4][1]
          }
        };
        if (window['player']['bosses'][window['player']['raid']['boss']]) {
          if (window['player']['bosses'][window['player']['raid']['boss']]['win_count']) {
            window['player']['bosses'][window['player']['raid']['boss']]['win_count']++
          } else {
            window['player']['bosses'][window['player']['raid']['boss']]['win_count'] = 1
          };
          if (window['player']['bosses'][window['player']['raid']['boss']]['win_in_top']) {
            window['player']['bosses'][window['player']['raid']['boss']]['win_in_top']++
          } else {
            window['player']['bosses'][window['player']['raid']['boss']]['win_in_top'] = 1
          };
          if (window['player']['bosses'][window['player']['raid']['boss']]['damage_in_top']) {
            window['player']['bosses'][window['player']['raid']['boss']]['damage_in_top'] += _0xdbf0xef
          } else {
            window['player']['bosses'][window['player']['raid']['boss']]['damage_in_top'] = _0xdbf0xef
          }
        } else {
          window['player']['bosses'][window['player']['raid']['boss']] = {
            win_count: 1,
            win_in_top: 1,
            damage_in_top: _0xdbf0xef
          }
        };
        window['player']['achievements']['win_boss_' + window['player']['raid']['boss']]++;
        if (window['player']['settings']['resource'] == 0) {
          change_resource('tokens', 0)
        } else {
          change_resource('encryptions', 0)
        };
        if (window['player']['raid']['boss'] == 14 || window['player']['raid']['boss'] == 15) {
          var _0xdbf0xf0 = window['player']['raid']['boss'] - 6
        } else {
          var _0xdbf0xf0 = 7
        };
        if (window['player']['boxes']['length'] < window['limit_boxes']) {
          window['player']['boxes']['push']({
            "id": window['player']['static_resources']['boxes_id']++,
            "open_time": get_current_timestamp(),
            "type": _0xdbf0xf0
          })
        };
        if (window['player']['boxes']['length'] < window['limit_boxes']) {
          var _0xdbf0xf1 = random(window['player']['randoms']['raid_box']++);
          if (_0xdbf0xf1 < (70 / 100)) {
            _0xdbf0xf0 = 2
          } else {
            if (_0xdbf0xf1 < (90 / 100)) {
              _0xdbf0xf0 = 3
            } else {
              _0xdbf0xf0 = 4
            }
          };
          window['player']['boxes']['push']({
            "id": window['player']['static_resources']['boxes_id']++,
            "open_time": 0,
            "type": _0xdbf0xf0
          })
        };
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'kill_boss') {
            if (window['player']['raid']['boss'] == window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['boss']) {
              window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4]++;
              if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
                window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
                window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
              }
            }
          }
        };
        var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['bosses_win'], 1, 86400);
        _0xdbf0xd5++;
        window['player']['expiring_resources']['bosses_win']['amount'] = _0xdbf0xd5;
        window['player']['expiring_resources']['bosses_win']['time'] = get_current_timestamp();
        window['player']['time_resources']['free_hit'] = 0;
        delete window['player']['raid']['boss'];
        delete window['player']['raid']['finish_time'];
        delete window['player']['raid']['health'];
        delete window['player']['raid']['top'];
        delete window['player']['raid']['paid_mode']
      } else {
        if (_0xdbf0xd7 == 3) {
          server_action('raid.finish', {});
          server_action('boss_manager.add_log', {
            "time": get_current_timestamp(),
            "code": 2,
            "info": window['player']['raid']['boss'],
            "subinfo": window['player']['raid']['health']
          });
          window['player']['boss_manager_journal']['push']({
            "id": window['player']['static_resources']['bm_log_id']++,
            "time": get_current_timestamp(),
            "code": 2,
            "info": window['player']['raid']['boss'],
            "subinfo": window['player']['raid']['health']
          });
          window['player']['time_resources']['free_hit'] = 0;
          delete window['player']['raid']['boss'];
          delete window['player']['raid']['finish_time'];
          delete window['player']['raid']['health'];
          delete window['player']['raid']['top'];
          delete window['player']['raid']['paid_mode']
        }
      }
    };
    boss_manager_update_journal()
  } else {
    clearTimeout(window['ubt']);
    hide_boss_manager();
    show_subscription_buy()
  }
}

function hide_boss_manager() {
  play_effect('click.mp3');
  window['loc_page'] = '';
  show_homeland()
}

function show_subscription_buy() {
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = 4;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('subscription_modal')[0];
  _0xdbf0x35['style']['display'] = 'block';
  _0xdbf0x35['getElementsByClassName']('modal_close')[0]['onclick'] = hide_subscription_buy;
  var _0xdbf0x55 = _0xdbf0x35['getElementsByClassName']('subscription_modal_function_menu')[0]['getElementsByTagName']('li');
  _0xdbf0x55[0]['onclick'] = subscription_buy_0;
  _0xdbf0x55[1]['onclick'] = subscription_buy_1;
  subscription_buy_1()
}

function subscription_buy_0() {
  var _0xdbf0x35 = document['getElementsByClassName']('subscription_modal')[0];
  var _0xdbf0x55 = _0xdbf0x35['getElementsByClassName']('subscription_modal_function_menu')[0]['getElementsByTagName']('li');
  _0xdbf0x55[1]['classList']['remove']('active');
  _0xdbf0x55[0]['classList']['add']('active');
  _0xdbf0x35['getElementsByClassName']('subscription_modal_function veteran')[0]['style']['display'] = 'none';
  _0xdbf0x35['getElementsByClassName']('subscription_modal_function recruit')[0]['style']['display'] = 'grid';
  var _0xdbf0x9f = _0xdbf0x35['getElementsByClassName']('subscription_modal_button')[0];
  _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_buy_count')[0]['innerHTML'] = window['subscription'][0]['price'];
  _0xdbf0x9f['onclick'] = function() {
    subscription_buy(0)
  }
}

function subscription_buy_1() {
  var _0xdbf0x35 = document['getElementsByClassName']('subscription_modal')[0];
  var _0xdbf0x55 = _0xdbf0x35['getElementsByClassName']('subscription_modal_function_menu')[0]['getElementsByTagName']('li');
  _0xdbf0x55[0]['classList']['remove']('active');
  _0xdbf0x55[1]['classList']['add']('active');
  _0xdbf0x35['getElementsByClassName']('subscription_modal_function recruit')[0]['style']['display'] = 'none';
  _0xdbf0x35['getElementsByClassName']('subscription_modal_function veteran')[0]['style']['display'] = 'grid';
  var _0xdbf0x9f = _0xdbf0x35['getElementsByClassName']('subscription_modal_button')[0];
  _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_buy_count')[0]['innerHTML'] = window['subscription'][1]['price'];
  _0xdbf0x9f['onclick'] = function() {
    subscription_buy(1)
  }
}

function subscription_buy(_0xdbf0xf7) {
  var _0xdbf0xf8 = window['subscription'][_0xdbf0xf7]['price'];
  if (window['player']['static_resources']['tickets'] >= _0xdbf0xf8) {
    window['player']['static_resources']['tickets'] -= _0xdbf0xf8;
    update_static_resources_tickets();
    window['player']['subscription'] = {
      tariff: _0xdbf0xf7,
      paid_time: get_current_timestamp() + 30 * 86400
    };
    hide_subscription_buy();
    if (_0xdbf0xf7 == 0) {
      show_subscription_functions()
    } else {
      if (_0xdbf0xf7 == 1) {
        show_boss_manager()
      }
    };
    server_action('subscription.buy', {
      "tariff": _0xdbf0xf7
    })
  } else {
    hide_subscription_buy();
    show_modal_no_tickets()
  }
}

function hide_subscription_buy() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('subscription_modal')[0]['style']['display'] = 'none'
}

function change_fullscreen_mode() {
  if (window['fullscreen'] == 0) {
    document['getElementById']('game')['requestFullscreen']();
    window['fullscreen'] = 1
  } else {
    document['exitFullscreen']();
    window['fullscreen'] = 0
  }
}

function show_edit_profile_name() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('modal_5')[0]['style']['display'] = 'block';
  var _0xdbf0x36 = document['getElementsByClassName']('modal_edit_profile')[0];
  _0xdbf0x36['style']['display'] = 'block';
  var _0xdbf0x9c = _0xdbf0x36['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '';
  _0xdbf0x9c['focus']();
  _0xdbf0x36['getElementsByClassName']('modal_edit_profile_save')[0]['onclick'] = save_edit_profile_name;
  _0xdbf0x36['getElementsByClassName']('modal_edit_profile_close')[0]['onclick'] = hide_edit_profile_name
}

function hide_edit_profile_name() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('modal_5')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('modal_edit_profile')[0]['style']['display'] = 'none'
}

function save_edit_profile_name() {
  var _0xdbf0x36 = document['getElementsByClassName']('modal_edit_profile')[0];
  var _0xdbf0x3d = _0xdbf0x36['getElementsByTagName']('input')[0]['value'];
  document['getElementById']('name_profile')['innerHTML'] = _0xdbf0x3d;
  hide_edit_profile_name();
  server_action('squad.rename', {
    "name": _0xdbf0x3d
  })
}

function play_effect_down_volume(_0xdbf0xff) {
  if (window['player']['settings']['sound'] == 1) {
    background_down_volume(_0xdbf0xff)
  }
}

function background_down_volume(_0xdbf0xff) {
  if (window['bg_music']['volume'] > 0.4) {
    var _0xdbf0x101 = window['bg_music']['volume'] - 0.02;
    window['bg_music']['volume'] = _0xdbf0x101['toFixed'](2);
    setTimeout(background_down_volume, 1, _0xdbf0xff)
  } else {
    play_effect_down(_0xdbf0xff)
  }
}

function background_up_volume() {
  if (window['bg_music']['volume'] < 1) {
    var _0xdbf0x101 = window['bg_music']['volume'] + 0.02;
    window['bg_music']['volume'] = _0xdbf0x101['toFixed'](2);
    setTimeout(background_up_volume, 1)
  }
}

function play_effect_down(_0xdbf0xff) {
  if (window['player']['settings']['sound'] == 1) {
    var _0xdbf0x104 = document['createElement']('audio');
    _0xdbf0x104['src'] = 'https://cdn.bravegames.space/regiment/sounds/' + _0xdbf0xff;
    _0xdbf0x104['onended'] = function() {
      setTimeout(background_up_volume, 15, 0.4)
    };
    _0xdbf0x104['play']()
  }
}

function play_effect(_0xdbf0xff) {
  if (window['player'] && window['player']['settings'] && window['player']['settings']['sound'] && window['player']['settings']['sound'] == 1) {
    var _0xdbf0x104 = document['createElement']('audio');
    _0xdbf0x104['src'] = 'https://cdn.bravegames.space/regiment/sounds/' + _0xdbf0xff;
    _0xdbf0x104['play']()
  }
}

function play_music(_0xdbf0xff) {
  if (window['bg_music'] === null) {
    window['bg_music'] = document['createElement']('audio');
    window['bg_music']['src'] = 'https://cdn.bravegames.space/regiment/sounds/' + _0xdbf0xff;
    window['bg_music']['loop'] = true
  } else {
    if (window['bg_music']['src']['indexOf']('sounds/' + _0xdbf0xff) == -1) {
      window['bg_music']['src'] = 'https://cdn.bravegames.space/regiment/sounds/' + _0xdbf0xff
    }
  };
  window['bg_music']['play']();
  check_music()
}

function invite_friends() {
  play_effect('click.mp3');
  if (window['player']['static_resources']['tutorial'] == 22) {
    document['getElementsByClassName']('add_friend')[0]['style']['pointerEvents'] = '';
    tutorial_arrow_stop()
  };
  window['player']['static_resources']['tutorial']++;
  VK['addCallback']('onWindowFocus', function(_0xdbf0x108) {
    if (window['player']['static_resources']['tutorial'] == 23) {
      window['player']['static_resources']['tutorial']++;
      show_tutorial(23)
    }
  });
  VK['callMethod']('showInviteBox')
}

function show_my_profile() {
  play_music('background.mp3');
  show_homeland();
  hide_boss_fight(0);
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'none';
  var _0xdbf0x36 = document['getElementsByClassName']('my_profile')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
    hide_my_profile(0)
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (window['friends'][_0xdbf0x4]['id'] == window['game_login']) {
      var _0xdbf0x10a = window['friends'][_0xdbf0x4]['profile']
    }
  };
  var _0xdbf0x3d = _0xdbf0x36['getElementsByClassName']('my_profile_name')[0];
  _0xdbf0x3d['getElementsByClassName']('my_profile_firstname')[0]['innerHTML'] = _0xdbf0x10a['first_name'];
  _0xdbf0x3d['getElementsByClassName']('my_profile_lastname')[0]['innerHTML'] = _0xdbf0x10a['last_name'];
  _0xdbf0x36['getElementsByClassName']('my_profile_avatar_img')[0]['getElementsByTagName']('img')[0]['src'] = _0xdbf0x10a['photo_50'];
  _0xdbf0x36['getElementsByClassName']('my_profile_sut')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['sut'];
  _0xdbf0x36['getElementsByClassName']('my_profile_level')[0]['innerHTML'] = window['player']['static_resources']['level'];
  _0xdbf0x36['getElementsByClassName']('my_profile_talents')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['used_talents'];
  var _0xdbf0x10b = _0xdbf0x36['getElementsByClassName']('my_profile_menu')[0];
  _0xdbf0x10b['getElementsByClassName']('my_profile_menu_gift')[0]['onclick'] = change_my_profile_menu_0;
  _0xdbf0x10b['getElementsByClassName']('my_profile_menu_events')[0]['onclick'] = change_my_profile_menu_1;
  _0xdbf0x10b['getElementsByClassName']('my_profile_menu_collection')[0]['onclick'] = change_my_profile_menu_2;
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_achievements_scroll')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['achievements']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'my_profile_achievements_item d-flex';
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'my_profile_achievements_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    if (window['achievements'][_0xdbf0x4]['type'] == 'boss') {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/boss_' + window['achievements'][_0xdbf0x4]['boss'] + '.png'
    } else {
      if (window['achievements'][_0xdbf0x4]['type'] == 'weapon') {
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/weapon_' + (window['achievements'][_0xdbf0x4]['weapon'] + 4) + '.png'
      } else {
        if (window['achievements'][_0xdbf0x4]['type'] == 'other') {
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/other_' + window['achievements'][_0xdbf0x4]['action'] + '.png'
        } else {
          if (window['achievements'][_0xdbf0x4]['type'] == 'mission') {
            _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/mission_' + window['achievements'][_0xdbf0x4]['front'] + '_' + window['achievements'][_0xdbf0x4]['mission'] + '.png'
          } else {
            if (window['achievements'][_0xdbf0x4]['type'] == 'resourse') {
              _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/resourse_' + window['achievements'][_0xdbf0x4]['resourse'] + '.png'
            } else {
              if (window['achievements'][_0xdbf0x4]['type'] == 'boxes') {
                _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/box_' + window['achievements'][_0xdbf0x4]['box'] + '.png'
              }
            }
          }
        }
      }
    };
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0x10c = document['createElement']('div');
    _0xdbf0x10c['className'] = 'my_profile_achievements_item_flag';
    _0xdbf0x8e['appendChild'](_0xdbf0x10c);
    var _0xdbf0x3d = document['createElement']('div');
    _0xdbf0x3d['innerHTML'] = window['achievements'][_0xdbf0x4]['title'];
    _0xdbf0x3d['className'] = 'my_profile_achievements_item_name';
    _0xdbf0x8e['appendChild'](_0xdbf0x3d);
    var _0xdbf0x10d = window['achievements'][_0xdbf0x4]['param'];
    var _0xdbf0xa6 = document['createElement']('div');
    _0xdbf0xa6['innerHTML'] = window['player']['achievements'][_0xdbf0x10d]['toLocaleString']();
    _0xdbf0xa6['className'] = 'my_profile_achievements_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0xa6);
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  change_my_profile_menu_0()
}

function hide_my_profile(_0xdbf0x10f) {
  if (_0xdbf0x10f != 1) {
    play_effect('click.mp3')
  };
  clearTimeout(window['cgt']);
  clearTimeout(window['unft']);
  document['getElementsByClassName']('my_profile')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'block'
}

function change_my_profile_menu_0() {
  change_my_profile_menu(0)
}

function change_my_profile_menu_1() {
  change_my_profile_menu(1)
}

function change_my_profile_menu_2() {
  change_my_profile_menu(2)
}

function change_page_collections_0() {
  change_page_collections(0)
}

function change_page_collections_1() {
  change_page_collections(1)
}

function change_page_collections_2() {
  change_page_collections(2)
}

function change_page_collections_3() {
  change_page_collections(3)
}

function change_page_collections_4() {
  change_page_collections(4)
}

function change_page_collections_5() {
  change_page_collections(5)
}

function change_status_wish() {
  play_effect('click.mp3');
  var _0xdbf0x9a = parseInt(this['dataset']['cid']);
  if (in_array(_0xdbf0x9a, window['player']['wish_list'])) {
    del_wish_list(_0xdbf0x9a);
    this['classList']['remove']('checked');
    var _0xdbf0x7d = window['player']['wish_list']['indexOf'](_0xdbf0x9a);
    window['player']['wish_list']['splice'](_0xdbf0x7d, 1)
  } else {
    if (window['player']['wish_list']['length'] < 12) {
      add_wish_list(_0xdbf0x9a);
      this['classList']['add']('checked');
      window['player']['wish_list']['push'](_0xdbf0x9a)
    } else {
      document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
      var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
      _0xdbf0x35['style']['display'] = 'block';
      var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('wishlist_limit')[0];
      _0xdbf0x36['style']['display'] = 'block';
      var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('wishlist_limit_button')[0];
      _0xdbf0x9f['onclick'] = hide_wishlist_limit
    }
  }
}

function hide_wishlist_limit() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('wishlist_limit')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function add_wish_list(_0xdbf0x9a) {
  server_action('wishlist.add', {
    "collection": _0xdbf0x9a
  })
}

function del_wish_list(_0xdbf0x9a) {
  server_action('wishlist.remove', {
    "collection": _0xdbf0x9a
  })
}

function exchange_collections() {
  var _0xdbf0x36 = document['getElementsByClassName']('my_profile_info_collection')[0];
  var _0xdbf0x11e = _0xdbf0x36['getElementsByClassName']('my_profile_info_header')[0];
  var _0xdbf0x11f = parseInt(_0xdbf0x11e['dataset']['page']);
  var _0xdbf0x75 = {
    0: 'coins',
    1: 'tokens',
    2: 'encryptions',
    3: 'supply',
    4: 'experience'
  };
  var _0xdbf0xa6 = calc_collections(_0xdbf0x75[_0xdbf0x11f]);
  if (_0xdbf0xa6 > 0) {
    server_action('collections.pack_exchange', {
      "page": _0xdbf0x11f
    });
    if (_0xdbf0x11f == 0) {
      window['player']['static_resources']['coins'] += _0xdbf0xa6;
      update_static_resources_coins();
      var _0xdbf0x8f = 'https://cdn.bravegames.space/regiment/images/profile/coin.png';
      window['player']['achievements']['coins'] += _0xdbf0xa6;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
        if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
          window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0xa6;
          if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
            window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
            window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
          }
        }
      }
    } else {
      if (_0xdbf0x11f == 1) {
        window['player']['static_resources']['tokens'] += _0xdbf0xa6;
        if (window['player']['settings']['resource'] == 0) {
          change_resource('tokens', 0)
        } else {
          change_resource('encryptions', 0)
        };
        var _0xdbf0x8f = 'https://cdn.bravegames.space/regiment/images/profile/token.png';
        window['player']['achievements']['tokens'] += _0xdbf0xa6;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_tokens') {
            window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0xa6;
            if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
              window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
              window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
            }
          }
        }
      } else {
        if (_0xdbf0x11f == 2) {
          window['player']['static_resources']['encryptions'] += _0xdbf0xa6;
          if (window['player']['settings']['resource'] == 0) {
            change_resource('tokens', 0)
          } else {
            change_resource('encryptions', 0)
          };
          var _0xdbf0x8f = 'https://cdn.bravegames.space/regiment/images/profile/encryption.png';
          window['player']['achievements']['encryptions'] += _0xdbf0xa6
        } else {
          if (_0xdbf0x11f == 3) {
            var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
            _0xdbf0x59 += _0xdbf0xa6;
            window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x59;
            window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
            update_renewable_resources_supply();
            var _0xdbf0x8f = 'https://cdn.bravegames.space/regiment/images/profile/supply.png'
          } else {
            if (_0xdbf0x11f == 4) {
              window['player']['experiences']['experience']['amount'] += _0xdbf0xa6;
              update_level(0);
              var _0xdbf0x8f = 'https://cdn.bravegames.space/regiment/images/profile/experience.png'
            }
          }
        }
      }
    };
    update_achievements();
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
    document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
    var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
    _0xdbf0x35['style']['display'] = 'block';
    var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('result_exchange_collection')[0];
    var _0xdbf0xa2 = _0xdbf0x36['getElementsByClassName']('result_exchange_collection_count')[0];
    _0xdbf0xa2['getElementsByTagName']('img')[0]['src'] = _0xdbf0x8f;
    _0xdbf0xa2['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0xa6['toLocaleString']();
    _0xdbf0x36['style']['display'] = 'block';
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('result_exchange_collection_button')[0];
    _0xdbf0x9f['onclick'] = hide_result_exchange_collection;
    change_page_collections(_0xdbf0x11f)
  } else {
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
    document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
    var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
    _0xdbf0x35['style']['display'] = 'block';
    var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('no_exchange_collection')[0];
    _0xdbf0x36['style']['display'] = 'block';
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('no_exchange_collection_button')[0];
    _0xdbf0x9f['onclick'] = hide_no_exchange_collection
  }
}

function hide_result_exchange_collection() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('result_exchange_collection')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function hide_no_exchange_collection() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('no_exchange_collection')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function calc_collections(_0xdbf0x68) {
  var _0xdbf0x123 = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['collections']['length']; _0xdbf0x4++) {
    if (window['collections'][_0xdbf0x4]['resource'] == _0xdbf0x68) {
      _0xdbf0x123['push'](_0xdbf0x4)
    }
  };
  var _0xdbf0x124 = 0;
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x123['length']; _0xdbf0x4++) {
    var _0xdbf0x9a = _0xdbf0x123[_0xdbf0x4];
    var _0xdbf0x8e = {
      amount: window['player']['collections'][_0xdbf0x9a]['amount'],
      level: window['player']['collections'][_0xdbf0x9a]['level']
    };
    while (_0xdbf0x8e['amount'] >= (5 + _0xdbf0x8e['level'])) {
      var _0xdbf0xa6 = window['collections'][_0xdbf0x9a]['amount_start'] + (window['collections'][_0xdbf0x9a]['amount_step'] * _0xdbf0x8e['level']);
      _0xdbf0x124 += _0xdbf0xa6;
      _0xdbf0x8e['amount'] -= 5 + _0xdbf0x8e['level'];
      window['player']['collections'][_0xdbf0x9a]['amount'] -= 5 + _0xdbf0x8e['level'];
      _0xdbf0x8e['level']++;
      window['player']['collections'][_0xdbf0x9a]['level']++;
      window['player']['achievements']['exchange_collections']++;
      _0xdbf0x15++
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'exchange_collection') {
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x15;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    }
  };
  return _0xdbf0x124
}

function hide_need_subscription2() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('need_subscription')[0];
  _0xdbf0x36['style']['display'] = 'none';
  hide_my_profile(0);
  show_subscription()
}

function check_subscription2() {
  if (window['player']['subscription'] && window['player']['subscription']['paid_time'] > get_current_timestamp()) {
    exchange_collections()
  } else {
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
    document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
    var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
    _0xdbf0x35['style']['display'] = 'block';
    var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('need_subscription')[0];
    _0xdbf0x36['style']['display'] = 'block';
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('need_subscription_button')[0];
    _0xdbf0x9f['onclick'] = hide_need_subscription2
  }
}

function change_page_collections(_0xdbf0x11f) {
  play_effect('click.mp3');
  if (_0xdbf0x11f == 5) {
    var _0xdbf0x36 = document['getElementsByClassName']('my_profile_info_collection')[0];
    _0xdbf0x36['getElementsByClassName']('my_profile_info_header')[0]['innerHTML'] = 'Моя просьба';
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_pagination')[0]['getElementsByTagName']('li');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < 5; _0xdbf0x4++) {
      if (_0xdbf0x4 != _0xdbf0x11f) {
        _0xdbf0x55[_0xdbf0x4]['className'] = ''
      }
    };
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_resourse_list')[0];
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    };
    var _0xdbf0x128 = {
      coins: 'coin_award_collection',
      tokens: 'tokens_award_collection',
      encryptions: 'encryptions_award_collection',
      supply: 'supply_award_collection',
      experience: 'experience_award_collection'
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['collections']['length']; _0xdbf0x4++) {
      if (in_array(_0xdbf0x4, window['player']['wish_list'])) {
        var _0xdbf0x8e = document['createElement']('div');
        var _0xdbf0x129 = 5 + window['player']['collections'][_0xdbf0x4]['level'];
        if (window['player']['collections'][_0xdbf0x4]['amount'] >= _0xdbf0x129) {
          _0xdbf0x8e['className'] = 'my_profile_info_collection_resourse_item available'
        } else {
          _0xdbf0x8e['className'] = 'my_profile_info_collection_resourse_item notavailable'
        };
        var _0xdbf0x12a = document['createElement']('div');
        if (in_array(_0xdbf0x4, window['player']['wish_list'])) {
          _0xdbf0x12a['className'] = 'my_profile_info_collection_resourse_item_request checked'
        } else {
          _0xdbf0x12a['className'] = 'my_profile_info_collection_resourse_item_request'
        };
        _0xdbf0x12a['dataset']['cid'] = _0xdbf0x4;
        _0xdbf0x12a['onclick'] = change_status_wish;
        _0xdbf0x8e['appendChild'](_0xdbf0x12a);
        var _0xdbf0xc8 = document['createElement']('div');
        _0xdbf0xc8['className'] = 'my_profile_info_collection_resourse_item_image';
        var _0xdbf0x8f = document['createElement']('div');
        _0xdbf0x8f['className'] = 'my_profile_info_collection_resourse_item_icon';
        var _0xdbf0x90 = document['createElement']('img');
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/collection/' + _0xdbf0x4 + '.png';
        _0xdbf0x8f['appendChild'](_0xdbf0x90);
        _0xdbf0xc8['appendChild'](_0xdbf0x8f);
        var _0xdbf0x15 = document['createElement']('div');
        _0xdbf0x15['innerHTML'] = window['player']['collections'][_0xdbf0x4]['amount'] + '/' + _0xdbf0x129;
        _0xdbf0x15['className'] = 'my_profile_info_collection_resourse_item_count';
        if (window['player']['collections'][_0xdbf0x4]['amount'] > 0) {
          _0xdbf0x8f['style']['filter'] = 'grayscale(0) opacity(1)';
          _0xdbf0x15['style']['filter'] = 'grayscale(0) opacity(1)'
        };
        _0xdbf0xc8['appendChild'](_0xdbf0x15);
        _0xdbf0x8e['appendChild'](_0xdbf0xc8);
        var _0xdbf0x52 = document['createElement']('div');
        _0xdbf0x52['className'] = 'my_profile_info_collection_resourse_item_award';
        var _0xdbf0xa6 = document['createElement']('div');
        var _0xdbf0x26 = window['collections'][_0xdbf0x4]['amount_start'] + (window['collections'][_0xdbf0x4]['amount_step'] * window['player']['collections'][_0xdbf0x4]['level']);
        _0xdbf0xa6['innerHTML'] = _0xdbf0x26;
        _0xdbf0xa6['className'] = 'my_profile_info_collection_resourse_item_award_amount';
        _0xdbf0x52['appendChild'](_0xdbf0xa6);
        var _0xdbf0x12b = document['createElement']('div');
        _0xdbf0x12b['className'] = 'my_profile_info_collection_resourse_item_award_icon';
        var _0xdbf0x12c = document['createElement']('img');
        _0xdbf0x12c['src'] = 'https://cdn.bravegames.space/regiment/images/profile/' + _0xdbf0x128[window['collections'][_0xdbf0x4]['resource']] + '.png';
        _0xdbf0x12b['appendChild'](_0xdbf0x12c);
        _0xdbf0x52['appendChild'](_0xdbf0x12b);
        _0xdbf0x8e['appendChild'](_0xdbf0x52);
        var _0xdbf0x9f = document['createElement']('div');
        if (window['player']['collections'][_0xdbf0x4]['amount'] >= _0xdbf0x129) {
          _0xdbf0x9f['innerHTML'] = 'Обменять';
          _0xdbf0x9f['className'] = 'my_profile_info_collection_button button button_green';
          _0xdbf0x9f['dataset']['cid'] = _0xdbf0x4;
          _0xdbf0x9f['onclick'] = collection_exchange
        } else {
          _0xdbf0x9f['innerHTML'] = 'Недоступно';
          _0xdbf0x9f['className'] = 'my_profile_info_collection_button button button_dark'
        };
        _0xdbf0x8e['appendChild'](_0xdbf0x9f);
        _0xdbf0x55['appendChild'](_0xdbf0x8e)
      }
    };
    _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_reward_potential_award')[0]['style']['display'] = 'none';
    _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_pagination')[0]['style']['display'] = 'none';
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('my_profile_info_my_request')[0];
    _0xdbf0x9f['onclick'] = change_page_collections_0;
    _0xdbf0x9f['innerHTML'] = 'Назад';
    _0xdbf0x9f['className'] = 'my_profile_info_my_request button button_red'
  } else {
    var _0xdbf0x75 = ['coins', 'tokens', 'encryptions', 'supply', 'experience'];
    var _0xdbf0x68 = _0xdbf0x75[_0xdbf0x11f];
    var _0xdbf0x36 = document['getElementsByClassName']('my_profile_info_collection')[0];
    var _0xdbf0x11e = _0xdbf0x36['getElementsByClassName']('my_profile_info_header')[0];
    _0xdbf0x11e['innerHTML'] = 'Мои коллекции';
    _0xdbf0x11e['dataset']['page'] = _0xdbf0x11f;
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_pagination')[0]['getElementsByTagName']('li');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < 5; _0xdbf0x4++) {
      if (_0xdbf0x4 != _0xdbf0x11f) {
        _0xdbf0x55[_0xdbf0x4]['className'] = ''
      }
    };
    _0xdbf0x55[_0xdbf0x11f]['className'] = 'active';
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_resourse_list')[0];
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    };
    var _0xdbf0x128 = {
      coins: 'coin_award_collection',
      tokens: 'tokens_award_collection',
      encryptions: 'encryptions_award_collection',
      supply: 'supply_award_collection',
      experience: 'experience_award_collection'
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['collections']['length']; _0xdbf0x4++) {
      if (window['collections'][_0xdbf0x4]['resource'] == _0xdbf0x68) {
        var _0xdbf0x8e = document['createElement']('div');
        var _0xdbf0x129 = 5 + window['player']['collections'][_0xdbf0x4]['level'];
        if (window['player']['collections'][_0xdbf0x4]['amount'] >= _0xdbf0x129) {
          _0xdbf0x8e['className'] = 'my_profile_info_collection_resourse_item available'
        } else {
          _0xdbf0x8e['className'] = 'my_profile_info_collection_resourse_item notavailable'
        };
        var _0xdbf0x12a = document['createElement']('div');
        if (in_array(_0xdbf0x4, window['player']['wish_list'])) {
          _0xdbf0x12a['className'] = 'my_profile_info_collection_resourse_item_request checked'
        } else {
          _0xdbf0x12a['className'] = 'my_profile_info_collection_resourse_item_request'
        };
        _0xdbf0x12a['dataset']['cid'] = _0xdbf0x4;
        _0xdbf0x12a['onclick'] = change_status_wish;
        _0xdbf0x8e['appendChild'](_0xdbf0x12a);
        var _0xdbf0xc8 = document['createElement']('div');
        _0xdbf0xc8['className'] = 'my_profile_info_collection_resourse_item_image';
        var _0xdbf0x8f = document['createElement']('div');
        _0xdbf0x8f['className'] = 'my_profile_info_collection_resourse_item_icon';
        var _0xdbf0x90 = document['createElement']('img');
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/collection/' + _0xdbf0x4 + '.png';
        _0xdbf0x8f['appendChild'](_0xdbf0x90);
        _0xdbf0xc8['appendChild'](_0xdbf0x8f);
        var _0xdbf0x15 = document['createElement']('div');
        _0xdbf0x15['innerHTML'] = window['player']['collections'][_0xdbf0x4]['amount'] + '/' + _0xdbf0x129;
        _0xdbf0x15['className'] = 'my_profile_info_collection_resourse_item_count';
        if (window['player']['collections'][_0xdbf0x4]['amount'] > 0) {
          _0xdbf0x8f['style']['filter'] = 'grayscale(0) opacity(1)';
          _0xdbf0x15['style']['filter'] = 'grayscale(0) opacity(1)'
        };
        _0xdbf0xc8['appendChild'](_0xdbf0x15);
        _0xdbf0x8e['appendChild'](_0xdbf0xc8);
        var _0xdbf0x52 = document['createElement']('div');
        _0xdbf0x52['className'] = 'my_profile_info_collection_resourse_item_award';
        var _0xdbf0xa6 = document['createElement']('div');
        var _0xdbf0x26 = window['collections'][_0xdbf0x4]['amount_start'] + (window['collections'][_0xdbf0x4]['amount_step'] * window['player']['collections'][_0xdbf0x4]['level']);
        _0xdbf0xa6['innerHTML'] = _0xdbf0x26;
        _0xdbf0xa6['className'] = 'my_profile_info_collection_resourse_item_award_amount';
        _0xdbf0x52['appendChild'](_0xdbf0xa6);
        var _0xdbf0x12b = document['createElement']('div');
        _0xdbf0x12b['className'] = 'my_profile_info_collection_resourse_item_award_icon';
        var _0xdbf0x12c = document['createElement']('img');
        _0xdbf0x12c['src'] = 'https://cdn.bravegames.space/regiment/images/profile/' + _0xdbf0x128[window['collections'][_0xdbf0x4]['resource']] + '.png';
        _0xdbf0x12b['appendChild'](_0xdbf0x12c);
        _0xdbf0x52['appendChild'](_0xdbf0x12b);
        _0xdbf0x8e['appendChild'](_0xdbf0x52);
        var _0xdbf0x9f = document['createElement']('div');
        if (window['player']['collections'][_0xdbf0x4]['amount'] >= _0xdbf0x129) {
          _0xdbf0x9f['innerHTML'] = 'Обменять';
          _0xdbf0x9f['className'] = 'my_profile_info_collection_button button button_green';
          _0xdbf0x9f['dataset']['cid'] = _0xdbf0x4;
          _0xdbf0x9f['onclick'] = collection_exchange
        } else {
          _0xdbf0x9f['innerHTML'] = 'Недоступно';
          _0xdbf0x9f['className'] = 'my_profile_info_collection_button button button_dark'
        };
        _0xdbf0x8e['appendChild'](_0xdbf0x9f);
        _0xdbf0x55['appendChild'](_0xdbf0x8e)
      }
    };
    calc_collections_resources(_0xdbf0x68);
    var _0xdbf0xa2 = _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_reward_potential_award')[0];
    _0xdbf0xa2['style']['display'] = 'flex';
    _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_pagination')[0]['style']['display'] = 'grid';
    _0xdbf0xa2['getElementsByClassName']('my_profile_info_subscription')[0]['onclick'] = check_subscription2;
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('my_profile_info_my_request')[0];
    _0xdbf0x9f['onclick'] = change_page_collections_5;
    _0xdbf0x9f['innerHTML'] = 'Моя просьба';
    _0xdbf0x9f['className'] = 'my_profile_info_my_request button button_orange'
  }
}

function calc_collections_resources(_0xdbf0x68) {
  var _0xdbf0x123 = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['collections']['length']; _0xdbf0x4++) {
    if (window['collections'][_0xdbf0x4]['resource'] == _0xdbf0x68) {
      _0xdbf0x123['push'](_0xdbf0x4)
    }
  };
  var _0xdbf0x124 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x123['length']; _0xdbf0x4++) {
    var _0xdbf0x9a = _0xdbf0x123[_0xdbf0x4];
    var _0xdbf0x8e = {
      amount: window['player']['collections'][_0xdbf0x9a]['amount'],
      level: window['player']['collections'][_0xdbf0x9a]['level']
    };
    var _0xdbf0x129 = 5 + window['player']['collections'][_0xdbf0x4]['level'];
    while (_0xdbf0x8e['amount'] >= (5 + _0xdbf0x8e['level'])) {
      var _0xdbf0xa6 = window['collections'][_0xdbf0x9a]['amount_start'] + (window['collections'][_0xdbf0x9a]['amount_step'] * _0xdbf0x8e['level']);
      _0xdbf0x124 += _0xdbf0xa6;
      _0xdbf0x8e['amount'] -= 5 + _0xdbf0x8e['level'];
      _0xdbf0x8e['level']++
    }
  };
  var _0xdbf0x36 = document['getElementsByClassName']('my_profile_info_collection')[0];
  var _0xdbf0xa2 = _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_reward')[0];
  _0xdbf0xa2['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0x124['toLocaleString']();
  var _0xdbf0x75 = {
    coins: 'coin',
    tokens: 'token',
    encryptions: 'encryption',
    supply: 'supply',
    experience: 'experience'
  };
  _0xdbf0xa2['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/profile/' + _0xdbf0x75[_0xdbf0x68] + '.png'
}

function update_achievements() {
  var _0xdbf0x36 = document['getElementsByClassName']('my_profile')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_achievements_scroll')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['achievements']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'my_profile_achievements_item d-flex';
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'my_profile_achievements_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    if (window['achievements'][_0xdbf0x4]['type'] == 'boss') {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/boss_' + window['achievements'][_0xdbf0x4]['boss'] + '.png'
    } else {
      if (window['achievements'][_0xdbf0x4]['type'] == 'weapon') {
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/weapon_' + (window['achievements'][_0xdbf0x4]['weapon'] + 4) + '.png'
      } else {
        if (window['achievements'][_0xdbf0x4]['type'] == 'other') {
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/other_' + window['achievements'][_0xdbf0x4]['action'] + '.png'
        } else {
          if (window['achievements'][_0xdbf0x4]['type'] == 'mission') {
            _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/mission_' + window['achievements'][_0xdbf0x4]['front'] + '_' + window['achievements'][_0xdbf0x4]['mission'] + '.png'
          } else {
            if (window['achievements'][_0xdbf0x4]['type'] == 'resourse') {
              _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/resourse_' + window['achievements'][_0xdbf0x4]['resourse'] + '.png'
            } else {
              if (window['achievements'][_0xdbf0x4]['type'] == 'boxes') {
                _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/box_' + window['achievements'][_0xdbf0x4]['box'] + '.png'
              }
            }
          }
        }
      }
    };
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0x10c = document['createElement']('div');
    _0xdbf0x10c['className'] = 'my_profile_achievements_item_flag';
    _0xdbf0x8e['appendChild'](_0xdbf0x10c);
    var _0xdbf0x3d = document['createElement']('div');
    _0xdbf0x3d['innerHTML'] = window['achievements'][_0xdbf0x4]['title'];
    _0xdbf0x3d['className'] = 'my_profile_achievements_item_name';
    _0xdbf0x8e['appendChild'](_0xdbf0x3d);
    var _0xdbf0x10d = window['achievements'][_0xdbf0x4]['param'];
    var _0xdbf0xa6 = document['createElement']('div');
    _0xdbf0xa6['innerHTML'] = window['player']['achievements'][_0xdbf0x10d]['toLocaleString']();
    _0xdbf0xa6['className'] = 'my_profile_achievements_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0xa6);
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  }
}

function collection_exchange() {
  var _0xdbf0x8e = this['parentNode'];
  var _0xdbf0x9a = parseInt(this['dataset']['cid']);
  var _0xdbf0x129 = 5 + window['player']['collections'][_0xdbf0x9a]['level'];
  if (window['player']['collections'][_0xdbf0x9a]['amount'] >= _0xdbf0x129) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'exchange_collection') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4]++;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    };
    play_effect('click.mp3');
    update_calendar_current_day();
    server_action('collections.exchange', {
      "collection": _0xdbf0x9a
    });
    var _0xdbf0xa6 = window['collections'][_0xdbf0x9a]['amount_start'] + (window['collections'][_0xdbf0x9a]['amount_step'] * window['player']['collections'][_0xdbf0x9a]['level']);
    window['player']['collections'][_0xdbf0x9a]['amount'] -= _0xdbf0x129;
    window['player']['collections'][_0xdbf0x9a]['level']++;
    window['player']['achievements']['exchange_collections']++;
    var _0xdbf0x129 = 5 + window['player']['collections'][_0xdbf0x9a]['level'];
    if (window['player']['collections'][_0xdbf0x9a]['amount'] >= _0xdbf0x129) {
      _0xdbf0x8e['className'] = 'my_profile_info_collection_resourse_item available'
    } else {
      _0xdbf0x8e['className'] = 'my_profile_info_collection_resourse_item notavailable'
    };
    _0xdbf0x8e['getElementsByClassName']('my_profile_info_collection_resourse_item_count')[0]['innerHTML'] = window['player']['collections'][_0xdbf0x9a]['amount'] + '/' + _0xdbf0x129;
    var _0xdbf0x26 = window['collections'][_0xdbf0x9a]['amount_start'] + (window['collections'][_0xdbf0x9a]['amount_step'] * window['player']['collections'][_0xdbf0x9a]['level']);
    _0xdbf0x8e['getElementsByClassName']('my_profile_info_collection_resourse_item_award_amount')[0]['innerHTML'] = _0xdbf0x26;
    if (window['player']['collections'][_0xdbf0x9a]['amount'] < _0xdbf0x129) {
      var _0xdbf0x9f = _0xdbf0x8e['getElementsByClassName']('my_profile_info_collection_button')[0];
      _0xdbf0x9f['innerHTML'] = 'Недоступно';
      _0xdbf0x9f['className'] = 'my_profile_info_collection_button button button_dark'
    };
    switch (window['collections'][_0xdbf0x9a]['resource']) {
      case 'coins':
        window['player']['static_resources']['coins'] += _0xdbf0xa6;
        update_static_resources_coins();
        window['player']['achievements']['coins'] += _0xdbf0xa6;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
            window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0xa6;
            if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
              window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
              window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
            }
          }
        };
        break;
      case 'tokens':
        window['player']['static_resources']['tokens'] += _0xdbf0xa6;
        if (window['player']['settings']['resource'] == 0) {
          change_resource('tokens', 0)
        } else {
          change_resource('encryptions', 0)
        };
        window['player']['achievements']['tokens'] += _0xdbf0xa6;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_tokens') {
            window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0xa6;
            if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
              window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
              window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
            }
          }
        };
        break;
      case 'encryptions':
        window['player']['static_resources']['encryptions'] += _0xdbf0xa6;
        if (window['player']['settings']['resource'] == 0) {
          change_resource('tokens', 0)
        } else {
          change_resource('encryptions', 0)
        };
        window['player']['achievements']['encryptions'] += _0xdbf0xa6;
        break;
      case 'supply':
        var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
        _0xdbf0x78 += _0xdbf0xa6;
        window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
        window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
        update_renewable_resources_supply();
        break;
      case 'experience':
        window['player']['experiences']['experience']['amount'] += _0xdbf0xa6;
        update_level(0);
        break
    };
    update_achievements()
  };
  calc_collections_resources(window['collections'][_0xdbf0x9a]['resource'])
}

function change_my_profile_menu(_0xdbf0x9a) {
  var _0xdbf0x36 = document['getElementsByClassName']('my_profile')[0];
  var _0xdbf0x10b = _0xdbf0x36['getElementsByClassName']('my_profile_menu')[0];
  var _0xdbf0x131 = _0xdbf0x36['getElementsByClassName']('my_profile_info')[0];
  clearTimeout(window['cgt']);
  clearTimeout(window['unft']);
  if (_0xdbf0x9a == 0) {
    play_effect('click.mp3');
    my_profile_gifts(1);
    _0xdbf0x10b['getElementsByClassName']('my_profile_menu_gift')[0]['className'] = 'my_profile_menu_gift active';
    _0xdbf0x10b['getElementsByClassName']('my_profile_menu_events')[0]['className'] = 'my_profile_menu_events';
    _0xdbf0x10b['getElementsByClassName']('my_profile_menu_collection')[0]['className'] = 'my_profile_menu_collection';
    _0xdbf0x131['getElementsByClassName']('my_profile_info_events')[0]['style']['display'] = 'none';
    _0xdbf0x131['getElementsByClassName']('my_profile_info_collection')[0]['style']['display'] = 'none';
    _0xdbf0x131['getElementsByClassName']('my_profile_info_gift')[0]['style']['display'] = 'block'
  } else {
    if (_0xdbf0x9a == 1) {
      play_effect('click.mp3');
      my_profile_newsfeed();
      _0xdbf0x10b['getElementsByClassName']('my_profile_menu_gift')[0]['className'] = 'my_profile_menu_gift';
      _0xdbf0x10b['getElementsByClassName']('my_profile_menu_events')[0]['className'] = 'my_profile_menu_events active';
      _0xdbf0x10b['getElementsByClassName']('my_profile_menu_collection')[0]['className'] = 'my_profile_menu_collection';
      _0xdbf0x131['getElementsByClassName']('my_profile_info_events')[0]['style']['display'] = 'block';
      _0xdbf0x131['getElementsByClassName']('my_profile_info_collection')[0]['style']['display'] = 'none';
      _0xdbf0x131['getElementsByClassName']('my_profile_info_gift')[0]['style']['display'] = 'none'
    } else {
      if (_0xdbf0x9a == 2) {
        _0xdbf0x10b['getElementsByClassName']('my_profile_menu_gift')[0]['className'] = 'my_profile_menu_gift';
        _0xdbf0x10b['getElementsByClassName']('my_profile_menu_events')[0]['className'] = 'my_profile_menu_events';
        _0xdbf0x10b['getElementsByClassName']('my_profile_menu_collection')[0]['className'] = 'my_profile_menu_collection active';
        _0xdbf0x131['getElementsByClassName']('my_profile_info_events')[0]['style']['display'] = 'none';
        _0xdbf0x131['getElementsByClassName']('my_profile_info_collection')[0]['style']['display'] = 'block';
        _0xdbf0x131['getElementsByClassName']('my_profile_info_gift')[0]['style']['display'] = 'none';
        var _0xdbf0x36 = _0xdbf0x131['getElementsByClassName']('my_profile_info_collection')[0];
        var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_info_collection_pagination')[0]['getElementsByTagName']('li');
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < 5; _0xdbf0x4++) {
          _0xdbf0x55[_0xdbf0x4]['onclick'] = window['change_page_collections_' + _0xdbf0x4]
        };
        _0xdbf0x55[0]['onclick']();
        _0xdbf0x36['getElementsByClassName']('my_profile_info_my_request')[0]['onclick'] = change_page_collections_5
      }
    }
  }
}

function my_profile_newsfeed() {
  var _0xdbf0x36 = document['getElementsByClassName']('my_profile')[0];
  var _0xdbf0x55 = document['getElementsByClassName']('my_profile_info_events_limits')[0]['getElementsByClassName']('my_profile_info_events_limits_item');
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['geted_airstrike'], 1, 86400);
  _0xdbf0x55[0]['getElementsByClassName']('my_profile_info_events_limits_item_count')[0]['innerHTML'] = _0xdbf0xd5 + '/' + (window['limit_get_help'] + window['player']['static_resources']['boost_get_help']);
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['geted_ammunition'], 1, 86400);
  _0xdbf0x55[1]['getElementsByClassName']('my_profile_info_events_limits_item_count')[0]['innerHTML'] = _0xdbf0xd5 + '/' + (window['limit_get_help'] + window['player']['static_resources']['boost_get_help']);
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['geted_collection'], 1, 86400);
  _0xdbf0x55[2]['getElementsByClassName']('my_profile_info_events_limits_item_count')[0]['innerHTML'] = _0xdbf0xd5 + '/' + window['limit_get_collection'];
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['sended_help'], 1, 43200);
  _0xdbf0x55[3]['getElementsByClassName']('my_profile_info_events_limits_item_count')[0]['innerHTML'] = _0xdbf0xd5 + '/' + window['limit_send_help_general'];
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['sended_collection'], 1, 86400);
  _0xdbf0x55[4]['getElementsByClassName']('my_profile_info_events_limits_item_count')[0]['innerHTML'] = _0xdbf0xd5 + '/' + window['limit_send_collection_general'];
  if (window['player']['newsfeed']['length'] > 0) {
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_info_events_list')[0];
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    };
    var _0xdbf0x133 = ['отправил коллекцию', 'отправил артобстрел', 'отправил боезапас', 'отправил ресурсы'];
    var _0xdbf0x134 = ['отправила коллекцию', 'отправила артобстрел', 'отправила боезапас', 'отправила ресурсы'];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['newsfeed']['length']; _0xdbf0x4++) {
      var _0xdbf0x10a = null;
      var _0xdbf0x135 = 0;
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['friends']['length']; _0xdbf0x38++) {
        if (window['friends'][_0xdbf0x38]['id'] == window['player']['newsfeed'][_0xdbf0x4]['sender']) {
          if (window['friends'][_0xdbf0x38]['profile']) {
            _0xdbf0x10a = window['friends'][_0xdbf0x38]['profile'];
            _0xdbf0x135 = 1
          }
        }
      };
      if (_0xdbf0x135 == 0) {
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['other_friends']['length']; _0xdbf0x38++) {
          if (window['other_friends'][_0xdbf0x38]['id'] == window['player']['newsfeed'][_0xdbf0x4]['sender']) {
            if (window['other_friends'][_0xdbf0x38]['profile']) {
              _0xdbf0x10a = window['other_friends'][_0xdbf0x38]['profile'];
              _0xdbf0x135 = 1
            }
          }
        }
      };
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'my_profile_info_events_list_item d-flex';
      var _0xdbf0x136 = document['createElement']('div');
      _0xdbf0x136['className'] = 'my_profile_info_events_list_item_avatar';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = _0xdbf0x10a['photo_50'];
      _0xdbf0x136['appendChild'](_0xdbf0x90);
      _0xdbf0x136['dataset']['fid'] = window['player']['newsfeed'][_0xdbf0x4]['sender'];
      _0xdbf0x136['onclick'] = my_profile_friends_click;
      _0xdbf0x8e['appendChild'](_0xdbf0x136);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['className'] = 'my_profile_info_events_list_item_name';
      var _0xdbf0x137 = document['createElement']('span');
      _0xdbf0x137['innerHTML'] = _0xdbf0x10a['first_name'] + ' ' + _0xdbf0x10a['last_name'];
      _0xdbf0x137['dataset']['fid'] = window['player']['newsfeed'][_0xdbf0x4]['sender'];
      _0xdbf0x137['onclick'] = my_profile_friends_click;
      _0xdbf0x3d['appendChild'](_0xdbf0x137);
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      var _0xdbf0x76 = document['createElement']('div');
      _0xdbf0x76['className'] = 'my_profile_info_events_list_item_time';
      _0xdbf0x76['dataset']['time'] = window['player']['newsfeed'][_0xdbf0x4]['time'];
      _0xdbf0x8e['appendChild'](_0xdbf0x76);
      var _0xdbf0x138 = document['createElement']('div');
      if (_0xdbf0x10a['sex'] == 1) {
        _0xdbf0x138['innerHTML'] = _0xdbf0x134[window['player']['newsfeed'][_0xdbf0x4]['type']]
      } else {
        _0xdbf0x138['innerHTML'] = _0xdbf0x133[window['player']['newsfeed'][_0xdbf0x4]['type']]
      };
      _0xdbf0x138['className'] = 'my_profile_info_events_list_item_desc';
      _0xdbf0x8e['appendChild'](_0xdbf0x138);
      _0xdbf0x55['appendChild'](_0xdbf0x8e)
    };
    update_newsfeed_time();
    window['unft'] = setInterval(update_newsfeed_time, 1000)
  } else {
    _0xdbf0x36['getElementsByClassName']('my_profile_info_events_list')[0]['style']['display'] = 'none';
    _0xdbf0x36['getElementsByClassName']('my_profile_info_events_no_list')[0]['style']['display'] = 'flex'
  }
}

function update_newsfeed_time() {
  var _0xdbf0x36 = document['getElementsByClassName']('my_profile')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_info_events_list')[0];
  var _0xdbf0x56 = _0xdbf0x55['getElementsByClassName']('my_profile_info_events_list_item_time');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x56['length']; _0xdbf0x4++) {
    var _0xdbf0x2c = '';
    var _0xdbf0x76 = get_current_timestamp() - parseInt(_0xdbf0x56[_0xdbf0x4]['dataset']['time']);
    var _0xdbf0x6 = _0xdbf0x76 % 86400;
    var _0xdbf0x85 = (_0xdbf0x76 - _0xdbf0x6) / 86400;
    if (_0xdbf0x85 > 0) {
      if (_0xdbf0x85 == 1) {
        _0xdbf0x2c = 'вчера'
      } else {
        if (_0xdbf0x85 == 2) {
          _0xdbf0x2c = 'позавчера'
        } else {
          _0xdbf0x2c = word_form(_0xdbf0x85, 'день', 'дня', 'дней') + ' назад'
        }
      }
    } else {
      var _0xdbf0x86 = _0xdbf0x6 % 3600;
      var _0xdbf0x87 = (_0xdbf0x6 - _0xdbf0x86) / 3600;
      if (_0xdbf0x87 > 0) {
        _0xdbf0x2c = word_form(_0xdbf0x87, 'час', 'часа', 'часов') + ' назад'
      } else {
        var _0xdbf0x13a = _0xdbf0x86 % 60;
        var _0xdbf0x89 = (_0xdbf0x13a - _0xdbf0x86) / 60;
        if (_0xdbf0x89 > 0) {
          _0xdbf0x2c = word_form(_0xdbf0x89, 'минуту', 'минуты', 'минут') + ' назад'
        } else {
          _0xdbf0x2c = 'менее минуты назад'
        }
      }
    };
    _0xdbf0x56[_0xdbf0x4]['innerHTML'] = _0xdbf0x2c
  }
}

function my_profile_gifts(_0xdbf0x13c) {
  var _0xdbf0x36 = document['getElementsByClassName']('my_profile')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_info_gift_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x7d in window['player']['gifts']) {
    if (get_current_timestamp() < (window['player']['gifts'][_0xdbf0x7d]['time'] + 86400)) {
      var _0xdbf0x10a = null;
      var _0xdbf0x135 = 0;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
        if (window['friends'][_0xdbf0x4]['id'] == window['player']['gifts'][_0xdbf0x7d]['sender']) {
          if (window['friends'][_0xdbf0x4]['profile']) {
            _0xdbf0x10a = window['friends'][_0xdbf0x4]['profile'];
            _0xdbf0x135 = 1
          }
        }
      };
      if (_0xdbf0x135 == 0) {
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
          if (window['other_friends'][_0xdbf0x4]['id'] == window['player']['gifts'][_0xdbf0x7d]['sender']) {
            if (window['other_friends'][_0xdbf0x4]['profile']) {
              _0xdbf0x10a = window['other_friends'][_0xdbf0x4]['profile'];
              _0xdbf0x135 = 1
            }
          }
        }
      };
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'my_profile_info_gift_item';
      var _0xdbf0x13d = document['createElement']('div');
      _0xdbf0x13d['className'] = 'my_profile_info_gift_item_sender';
      var _0xdbf0x137 = document['createElement']('span');
      _0xdbf0x137['innerHTML'] = _0xdbf0x10a['first_name'] + ' ' + _0xdbf0x10a['last_name'];
      _0xdbf0x137['dataset']['fid'] = window['player']['gifts'][_0xdbf0x7d]['sender'];
      _0xdbf0x137['onclick'] = my_profile_friends_click;
      _0xdbf0x13d['appendChild'](_0xdbf0x137);
      _0xdbf0x8e['appendChild'](_0xdbf0x13d);
      var _0xdbf0x8f = document['createElement']('div');
      _0xdbf0x8f['className'] = 'my_profile_info_gift_item_icon';
      var _0xdbf0x90 = document['createElement']('img');
      if (window['player']['gifts'][_0xdbf0x7d]['type'] == 0) {
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/collection/' + window['player']['gifts'][_0xdbf0x7d]['collection'] + '.png'
      } else {
        if (window['player']['gifts'][_0xdbf0x7d]['type'] == 1 || window['player']['gifts'][_0xdbf0x7d]['type'] == 2) {
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/profile/help_icon_' + window['player']['gifts'][_0xdbf0x7d]['type'] + '.jpg'
        } else {
          if (window['player']['gifts'][_0xdbf0x7d]['type'] == 3) {
            for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['material_help']['length']; _0xdbf0x4++) {
              if (window['material_help'][_0xdbf0x4]['resource'] == 'supply' && window['material_help'][_0xdbf0x4]['amount'] == window['player']['gifts'][_0xdbf0x7d]['amount']) {
                var _0xdbf0xb = _0xdbf0x4
              }
            };
            _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/supply_' + _0xdbf0xb + '.png'
          } else {
            if (window['player']['gifts'][_0xdbf0x7d]['type'] == 4) {
              for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['material_help']['length']; _0xdbf0x4++) {
                if (window['material_help'][_0xdbf0x4]['resource'] == 'tokens' && window['material_help'][_0xdbf0x4]['amount'] == window['player']['gifts'][_0xdbf0x7d]['amount']) {
                  var _0xdbf0xb = _0xdbf0x4
                }
              };
              _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/tokens_' + (_0xdbf0xb - 5) + '.png'
            } else {
              if (window['player']['gifts'][_0xdbf0x7d]['type'] == 5) {
                for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['material_help']['length']; _0xdbf0x4++) {
                  if (window['material_help'][_0xdbf0x4]['resource'] == 'coins' && window['material_help'][_0xdbf0x4]['amount'] == window['player']['gifts'][_0xdbf0x7d]['amount']) {
                    var _0xdbf0xb = _0xdbf0x4
                  }
                };
                _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/coin_' + (_0xdbf0xb - 10) + '.png'
              } else {
                if (window['player']['gifts'][_0xdbf0x7d]['type'] == 6) {
                  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['material_help']['length']; _0xdbf0x4++) {
                    if (window['material_help'][_0xdbf0x4]['resource'] == 'encryptions' && window['material_help'][_0xdbf0x4]['amount'] == window['player']['gifts'][_0xdbf0x7d]['amount']) {
                      var _0xdbf0xb = _0xdbf0x4
                    }
                  };
                  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/encryptions_' + (_0xdbf0xb - 15) + '.png'
                } else {
                  if (window['player']['gifts'][_0xdbf0x7d]['type'] == 7) {
                    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['material_help']['length']; _0xdbf0x4++) {
                      if (window['material_help'][_0xdbf0x4]['resource'] == 'weapon_6' && window['material_help'][_0xdbf0x4]['amount'] == window['player']['gifts'][_0xdbf0x7d]['amount']) {
                        var _0xdbf0xb = _0xdbf0x4
                      }
                    };
                    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w10-' + (_0xdbf0xb - 20) + '.png'
                  } else {
                    if (window['player']['gifts'][_0xdbf0x7d]['type'] == 8) {
                      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['material_help']['length']; _0xdbf0x4++) {
                        if (window['material_help'][_0xdbf0x4]['resource'] == 'weapon_5' && window['material_help'][_0xdbf0x4]['amount'] == window['player']['gifts'][_0xdbf0x7d]['amount']) {
                          var _0xdbf0xb = _0xdbf0x4
                        }
                      };
                      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w9-' + (_0xdbf0xb - 25) + '.png'
                    } else {
                      if (window['player']['gifts'][_0xdbf0x7d]['type'] == 9) {
                        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['material_help']['length']; _0xdbf0x4++) {
                          if (window['material_help'][_0xdbf0x4]['resource'] == 'weapon_4' && window['material_help'][_0xdbf0x4]['amount'] == window['player']['gifts'][_0xdbf0x7d]['amount']) {
                            var _0xdbf0xb = _0xdbf0x4
                          }
                        };
                        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w8-' + (_0xdbf0xb - 30) + '.png'
                      } else {
                        if (window['player']['gifts'][_0xdbf0x7d]['type'] == 10) {
                          for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['material_help']['length']; _0xdbf0x4++) {
                            if (window['material_help'][_0xdbf0x4]['resource'] == 'weapon_3' && window['material_help'][_0xdbf0x4]['amount'] == window['player']['gifts'][_0xdbf0x7d]['amount']) {
                              var _0xdbf0xb = _0xdbf0x4
                            }
                          };
                          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w7-' + (_0xdbf0xb - 35) + '.png'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
      _0xdbf0x8f['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x8f);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = 'x' + window['player']['gifts'][_0xdbf0x7d]['amount'];
      _0xdbf0x15['className'] = 'my_profile_info_gift_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      var _0xdbf0x9f = document['createElement']('div');
      _0xdbf0x9f['innerHTML'] = 'Получить';
      _0xdbf0x9f['dataset']['gid'] = _0xdbf0x7d;
      _0xdbf0x9f['className'] = 'my_profile_info_gift_item_button button button_orange';
      _0xdbf0x9f['onclick'] = get_gift;
      _0xdbf0x8e['appendChild'](_0xdbf0x9f);
      _0xdbf0x8e['dataset']['time'] = window['player']['gifts'][_0xdbf0x7d]['time'];
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      _0xdbf0x15++
    }
  };
  if (_0xdbf0x15 == 0) {
    _0xdbf0x36['getElementsByClassName']('my_profile_info_gift_no_scroll')[0]['style']['display'] = 'grid';
    _0xdbf0x36['getElementsByClassName']('my_profile_info_gift_scroll')[0]['style']['display'] = 'none'
  } else {
    _0xdbf0x36['getElementsByClassName']('my_profile_info_gift_no_scroll')[0]['style']['display'] = 'none';
    _0xdbf0x36['getElementsByClassName']('my_profile_info_gift_scroll')[0]['style']['display'] = 'grid'
  };
  if (_0xdbf0x13c == 1) {
    window['cgt'] = setInterval(check_gift_time, 1000)
  }
}

function check_gift_time() {
  var _0xdbf0x36 = document['getElementsByClassName']('my_profile')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('my_profile_info_gift_list')[0];
  var _0xdbf0x56 = _0xdbf0x55['getElementsByClassName']('my_profile_info_gift_item');
  var _0xdbf0x13f = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x56['length']; _0xdbf0x4++) {
    if (get_current_timestamp() >= (parseInt(_0xdbf0x56[_0xdbf0x4]['dataset']['time']) + 86400)) {
      _0xdbf0x13f = 1
    }
  };
  if (_0xdbf0x13f == 1) {
    my_profile_gifts(0)
  }
}

function get_gift() {
  play_effect('click.mp3');
  var _0xdbf0x9a = parseInt(this['dataset']['gid']);
  var _0xdbf0x141 = window['player']['gifts'][_0xdbf0x9a];
  if (_0xdbf0x141['type'] == 0) {
    var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['geted_collection'], 1, 86400);
    if (_0xdbf0xd5 < window['limit_get_collection']) {
      server_action('gifts.get', {
        "gift": +_0xdbf0x9a
      });
      window['player']['collections'][_0xdbf0x141['collection']]['amount']++;
      window['player']['expiring_resources']['geted_collection']['amount'] = _0xdbf0xd5 + 1;
      window['player']['expiring_resources']['geted_collection']['time'] = get_current_timestamp();
      delete window['player']['gifts'][_0xdbf0x9a];
      animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
    } else {
      document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
      var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
      _0xdbf0x35['style']['display'] = 'block';
      var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('geted_collection_limit')[0];
      _0xdbf0x36['style']['display'] = 'block';
      var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('geted_collection_limit_button')[0];
      _0xdbf0x9f['onclick'] = hide_geted_collection_limit
    }
  } else {
    if (_0xdbf0x141['type'] == 1) {
      var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['geted_airstrike'], 1, 86400);
      if (_0xdbf0xd5 < (window['limit_get_help'] + window['player']['static_resources']['boost_get_help'])) {
        if (window['player']['static_resources']['airstrike'] < 10) {
          server_action('gifts.get', {
            "gift": +_0xdbf0x9a
          });
          window['player']['static_resources']['airstrike']++;
          window['player']['expiring_resources']['geted_airstrike']['amount'] = _0xdbf0xd5 + 1;
          window['player']['expiring_resources']['geted_airstrike']['time'] = get_current_timestamp();
          delete window['player']['gifts'][_0xdbf0x9a];
          animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
        } else {
          document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
          var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
          _0xdbf0x35['style']['display'] = 'block';
          var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('full_airstrike_limit')[0];
          _0xdbf0x36['style']['display'] = 'block';
          var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('full_airstrike_limit_button')[0];
          _0xdbf0x9f['onclick'] = hide_full_airstrike_limit
        }
      } else {
        document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
        var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
        _0xdbf0x35['style']['display'] = 'block';
        var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('geted_airstrike_limit')[0];
        _0xdbf0x36['style']['display'] = 'block';
        var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('geted_airstrike_limit_button')[0];
        _0xdbf0x9f['onclick'] = hide_geted_airstrike_limit
      }
    } else {
      if (_0xdbf0x141['type'] == 2) {
        var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['geted_ammunition'], 1, 86400);
        if (_0xdbf0xd5 < (window['limit_get_help'] + window['player']['static_resources']['boost_get_help'])) {
          if (window['player']['static_resources']['ammunition'] < 10) {
            server_action('gifts.get', {
              "gift": +_0xdbf0x9a
            });
            window['player']['static_resources']['ammunition']++;
            window['player']['expiring_resources']['geted_ammunition']['amount'] = _0xdbf0xd5 + 1;
            window['player']['expiring_resources']['geted_ammunition']['time'] = get_current_timestamp();
            delete window['player']['gifts'][_0xdbf0x9a];
            animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
          } else {
            document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
            var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
            _0xdbf0x35['style']['display'] = 'block';
            var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('full_ammunition_limit')[0];
            _0xdbf0x36['style']['display'] = 'block';
            var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('full_ammunition_limit_button')[0];
            _0xdbf0x9f['onclick'] = hide_full_ammunition_limit
          }
        } else {
          document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
          var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
          _0xdbf0x35['style']['display'] = 'block';
          var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('geted_ammunition_limit')[0];
          _0xdbf0x36['style']['display'] = 'block';
          var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('geted_ammunition_limit_button')[0];
          _0xdbf0x9f['onclick'] = hide_geted_ammunition_limit
        }
      } else {
        if (_0xdbf0x141['type'] == 3) {
          server_action('gifts.get', {
            "gift": +_0xdbf0x9a
          });
          var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
          _0xdbf0x78 += _0xdbf0x141['amount'];
          window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
          window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
          update_renewable_resources_supply();
          delete window['player']['gifts'][_0xdbf0x9a];
          animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
        } else {
          if (_0xdbf0x141['type'] == 4) {
            server_action('gifts.get', {
              "gift": +_0xdbf0x9a
            });
            window['player']['static_resources']['tokens'] += _0xdbf0x141['amount'];
            window['player']['achievements']['tokens'] += _0xdbf0x141['amount'];
            if (window['player']['settings']['resource'] == 0) {
              change_resource('tokens', 0)
            } else {
              change_resource('encryptions', 0)
            };
            delete window['player']['gifts'][_0xdbf0x9a];
            animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
          } else {
            if (_0xdbf0x141['type'] == 5) {
              server_action('gifts.get', {
                "gift": +_0xdbf0x9a
              });
              window['player']['static_resources']['coins'] += _0xdbf0x141['amount'];
              window['player']['achievements']['coins'] += _0xdbf0x141['amount'];
              update_static_resources_coins();
              delete window['player']['gifts'][_0xdbf0x9a];
              animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
            } else {
              if (_0xdbf0x141['type'] == 6) {
                server_action('gifts.get', {
                  "gift": +_0xdbf0x9a
                });
                window['player']['static_resources']['encryptions'] += _0xdbf0x141['amount'];
                window['player']['achievements']['encryptions'] += _0xdbf0x141['amount'];
                if (window['player']['settings']['resource'] == 0) {
                  change_resource('tokens', 0)
                } else {
                  change_resource('encryptions', 0)
                };
                delete window['player']['gifts'][_0xdbf0x9a];
                animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
              } else {
                if (_0xdbf0x141['type'] == 7) {
                  server_action('gifts.get', {
                    "gift": +_0xdbf0x9a
                  });
                  window['player']['static_resources']['weapon_6'] += _0xdbf0x141['amount'];
                  window['player']['achievements']['weapon_6'] += _0xdbf0x141['amount'];
                  delete window['player']['gifts'][_0xdbf0x9a];
                  animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
                } else {
                  if (_0xdbf0x141['type'] == 8) {
                    server_action('gifts.get', {
                      "gift": +_0xdbf0x9a
                    });
                    window['player']['static_resources']['weapon_5'] += _0xdbf0x141['amount'];
                    window['player']['achievements']['weapon_5'] += _0xdbf0x141['amount'];
                    delete window['player']['gifts'][_0xdbf0x9a];
                    animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
                  } else {
                    if (_0xdbf0x141['type'] == 9) {
                      server_action('gifts.get', {
                        "gift": +_0xdbf0x9a
                      });
                      window['player']['static_resources']['weapon_4'] += _0xdbf0x141['amount'];
                      window['player']['achievements']['weapon_4'] += _0xdbf0x141['amount'];
                      delete window['player']['gifts'][_0xdbf0x9a];
                      animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
                    } else {
                      if (_0xdbf0x141['type'] == 10) {
                        server_action('gifts.get', {
                          "gift": +_0xdbf0x9a
                        });
                        window['player']['static_resources']['weapon_3'] += _0xdbf0x141['amount'];
                        window['player']['achievements']['weapon_3'] += _0xdbf0x141['amount'];
                        delete window['player']['gifts'][_0xdbf0x9a];
                        animation(this['parentNode'], 'left', 0, 600, 1, 200, 'get_bnt_return')
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

function get_bnt_return2() {
  my_profile_gifts(0)
}

function get_bnt_return(_0xdbf0xa2) {
  _0xdbf0xa2['style']['display'] = 'none';
  my_profile_gifts(0)
}

function hide_full_ammunition_limit() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('full_ammunition_limit')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function hide_full_airstrike_limit() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('full_airstrike_limit')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function hide_geted_ammunition_limit() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('geted_ammunition_limit')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function hide_geted_airstrike_limit() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('geted_airstrike_limit')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function hide_geted_collection_limit() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('geted_collection_limit')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function my_profile_friends_click() {
  hide_my_profile(1);
  var _0xdbf0x9a = parseInt(this['dataset']['fid']);
  if (_0xdbf0x9a != window['game_login']) {
    show_friend_help(_0xdbf0x9a)
  } else {
    show_my_profile()
  }
}

function boxes_timer(_0xdbf0x76) {
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  var _0xdbf0x2c = _0xdbf0x87 + ':';
  var _0xdbf0x88 = _0xdbf0x6 % 60;
  var _0xdbf0x89 = (_0xdbf0x6 - _0xdbf0x88) / 60;
  if (_0xdbf0x89 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
  } else {
    _0xdbf0x2c += _0xdbf0x89 + ':'
  };
  if (_0xdbf0x88 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x88
  } else {
    _0xdbf0x2c += _0xdbf0x88
  };
  return _0xdbf0x2c
}

function show_boxes_block() {
  play_music('background.mp3');
  out_boxes(0, 0)
}

function boxes_subscription_param_0() {
  var _0xdbf0x75 = document['getElementById']('open_box_2')['checked'];
  if (_0xdbf0x75) {
    var _0xdbf0x14d = 1
  } else {
    var _0xdbf0x14d = 0
  };
  window['player']['static_resources']['subscription_open_box_2'] = _0xdbf0x14d;
  server_action('boxes_subscription.set_param', {
    "property": 0,
    "value": _0xdbf0x14d
  })
}

function boxes_subscription_param_1() {
  var _0xdbf0x75 = document['getElementById']('open_box_tech')['checked'];
  if (_0xdbf0x75) {
    var _0xdbf0x14d = 1
  } else {
    var _0xdbf0x14d = 0
  };
  window['player']['static_resources']['subscription_open_box_tech'] = _0xdbf0x14d;
  server_action('boxes_subscription.set_param', {
    "property": 1,
    "value": _0xdbf0x14d
  })
}

function work_subscription_boxes() {
  if (window['player']['static_resources']['subscription_open_box_2'] == 1) {
    var _0xdbf0x38 = -1;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
      if (window['player']['boxes'][_0xdbf0x4]['type'] == 0) {
        _0xdbf0x38 = _0xdbf0x4
      }
    };
    if (_0xdbf0x38 > -1) {
      var _0xdbf0x5d = 0;
      if (window['player']['boxes'][_0xdbf0x38]['open_time'] == 0) {
        _0xdbf0x5d = 1
      } else {
        if (window['player']['boxes'][_0xdbf0x38]['open_time'] <= get_current_timestamp()) {
          _0xdbf0x5d = 2
        }
      };
      var _0xdbf0x76 = get_current_timestamp();
      if (_0xdbf0x5d == 1) {
        server_action('boxes.hack', {
          "box": window['player']['boxes'][_0xdbf0x38]['id']
        });
        window['player']['boxes'][_0xdbf0x38]['open_time'] = _0xdbf0x76 + window['boxes'][0]['time'];
        window['player']['boxes_subscription_journal']['push']({
          "id": window['player']['static_resources']['boxes_subscription_journal_row_id']++,
          "time": _0xdbf0x76,
          "code": 0,
          "info": 0
        });
        server_action('boxes_subscription.add_log', {
          "time": _0xdbf0x76,
          "code": 0,
          "info": 0
        })
      } else {
        if (_0xdbf0x5d == 2) {
          window['player']['achievements']['open_boxes']++;
          server_action_fast('boxes.open', {
            "box": window['player']['boxes'][_0xdbf0x38]['id']
          }, 'bxs_opened_box');
          window['player']['boxes']['splice'](_0xdbf0x38, 1);
          window['player']['boxes']['push']({
            "id": window['player']['static_resources']['boxes_id']++,
            "open_time": 0,
            "type": 0
          })
        }
      }
    }
  };
  var _0xdbf0x150 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    if (window['player']['boxes'][_0xdbf0x4]['type'] != 0) {
      if (window['player']['boxes'][_0xdbf0x4]['open_time'] > 0) {
        if (window['player']['boxes'][_0xdbf0x4]['open_time'] > get_current_timestamp()) {
          _0xdbf0x150 = 1
        }
      }
    }
  };
  if (_0xdbf0x150 == 0 && window['player']['boxes_subscription']['length'] > 0) {
    var _0xdbf0x9b = -1;
    var _0xdbf0xab = -1;
    var _0xdbf0x151 = -1;
    var _0xdbf0x152 = -1;
    var _0xdbf0xd8 = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription']['length']; _0xdbf0x4++) {
      if (_0xdbf0xd8 == 0) {
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['player']['boxes']['length']; _0xdbf0x38++) {
          if (window['player']['boxes'][_0xdbf0x38]['type'] == window['player']['boxes_subscription'][_0xdbf0x4]['type']) {
            if (window['player']['boxes'][_0xdbf0x38]['open_time'] == 0) {
              _0xdbf0xab = window['player']['boxes_subscription'][_0xdbf0x4]['id'];
              _0xdbf0x9b = window['player']['boxes'][_0xdbf0x38]['id'];
              _0xdbf0x151 = _0xdbf0x38;
              _0xdbf0x152 = window['player']['boxes'][_0xdbf0x38]['type'];
              _0xdbf0xd8 = 1
            }
          }
        }
      }
    };
    if (_0xdbf0x9b > -1 && _0xdbf0x151 > -1 && _0xdbf0x152 > -1) {
      var _0xdbf0x76 = get_current_timestamp();
      server_action('boxes.hack', {
        "box": _0xdbf0x9b
      });
      window['player']['boxes'][_0xdbf0x151]['open_time'] = _0xdbf0x76 + window['boxes'][_0xdbf0x152]['time'] - window['player']['static_resources']['boost_speed_hack_boxes'];
      window['player']['boxes_subscription_journal']['push']({
        "id": window['player']['static_resources']['boxes_subscription_journal_row_id']++,
        "time": _0xdbf0x76,
        "code": 0,
        "info": _0xdbf0x152
      });
      server_action('boxes_subscription.add_log', {
        "time": _0xdbf0x76,
        "code": 0,
        "info": _0xdbf0x152
      })
    };
    if (_0xdbf0xab > -1) {
      server_action('boxes_subscription.delete', {
        "row": _0xdbf0xab
      });
      var _0xdbf0x153 = [];
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription']['length']; _0xdbf0x4++) {
        if (window['player']['boxes_subscription'][_0xdbf0x4]['id'] != _0xdbf0xab) {
          _0xdbf0x153['push'](window['player']['boxes_subscription'][_0xdbf0x4])
        }
      };
      window['player']['boxes_subscription'] = _0xdbf0x153;
      if (window['bs_input'] == 1) {
        show_boxes_subscription()
      }
    }
  };
  if (window['player']['static_resources']['subscription_open_box_tech'] == 1) {
    var _0xdbf0xd8 = 0;
    var _0xdbf0x9b = -1;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
      if (_0xdbf0xd8 == 0) {
        if (window['player']['boxes'][_0xdbf0x4]['type'] == 7 || window['player']['boxes'][_0xdbf0x4]['type'] == 8 || window['player']['boxes'][_0xdbf0x4]['type'] == 9) {
          _0xdbf0x9b = window['player']['boxes'][_0xdbf0x4]['id'];
          _0xdbf0xd8 = 1
        }
      }
    };
    if (_0xdbf0x9b > -1) {
      if ((window['player']['static_resources']['encryptions'] - window['tmp_encryptions']) >= window['boxes_open_price']) {
        window['tmp_encryptions'] += window['boxes_open_price'];
        server_action_fast('boxes.open', {
          "box": _0xdbf0x9b
        }, 'bxs_opened_box2');
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
          if (window['player']['boxes'][_0xdbf0x4]['id'] == _0xdbf0x9b) {
            key = _0xdbf0x4
          }
        };
        window['player']['boxes']['splice'](key, 1)
      }
    }
  }
}

function bxs_opened_box(_0xdbf0x12) {
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  window['player']['achievements']['open_boxes']++;
  window['player']['achievements']['open_box_' + _0xdbf0x12['open_box_type']]++;
  var _0xdbf0x155 = 0;
  var _0xdbf0x156 = 0;
  var _0xdbf0x157 = 0;
  var _0xdbf0x158 = 0;
  var _0xdbf0x159 = 0;
  var _0xdbf0x15a = 0;
  var _0xdbf0x15b = 0;
  var _0xdbf0x15c = 0;
  var _0xdbf0x15d = 0;
  var _0xdbf0x15e = 0;
  var _0xdbf0x15f = 0;
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d == 'coins' || _0xdbf0x7d == 'experience' || _0xdbf0x7d == 'tokens' || _0xdbf0x7d == 'supply' || _0xdbf0x7d == 'weapon_0' || _0xdbf0x7d == 'weapon_1' || _0xdbf0x7d == 'weapon_2' || _0xdbf0x7d == 'weapon_3' || _0xdbf0x7d == 'weapon_4' || _0xdbf0x7d == 'weapon_5' || _0xdbf0x7d == 'weapon_6') {
      if (_0xdbf0x7d == 'coins') {
        _0xdbf0x156 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
        window['player']['static_resources']['coins'] += _0xdbf0x156;
        window['player']['achievements']['coins'] += _0xdbf0x156
      } else {
        if (_0xdbf0x7d == 'experience') {
          _0xdbf0x157 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
          window['player']['experiences']['experience']['amount'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
        } else {
          if (_0xdbf0x7d == 'tokens') {
            _0xdbf0x155 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
            window['player']['static_resources']['tokens'] += _0xdbf0x155;
            window['player']['achievements']['tokens'] += _0xdbf0x155
          } else {
            if (_0xdbf0x7d == 'supply') {
              var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
              _0xdbf0x78 += _0xdbf0x12['box_reward'][_0xdbf0x7d];
              window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
              window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
              _0xdbf0x158 = _0xdbf0x12['box_reward'][_0xdbf0x7d]
            } else {
              if (_0xdbf0x7d == 'weapon_0') {
                window['player']['static_resources']['weapon_0'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                window['player']['achievements']['weapon_0'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                _0xdbf0x159 = _0xdbf0x12['box_reward'][_0xdbf0x7d]
              } else {
                if (_0xdbf0x7d == 'weapon_1') {
                  window['player']['static_resources']['weapon_1'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                  window['player']['achievements']['weapon_1'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                  _0xdbf0x15a = _0xdbf0x12['box_reward'][_0xdbf0x7d]
                } else {
                  if (_0xdbf0x7d == 'weapon_2') {
                    window['player']['static_resources']['weapon_2'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                    window['player']['achievements']['weapon_2'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                    _0xdbf0x15b = _0xdbf0x12['box_reward'][_0xdbf0x7d]
                  } else {
                    if (_0xdbf0x7d == 'weapon_3') {
                      window['player']['static_resources']['weapon_3'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                      window['player']['achievements']['weapon_3'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                      _0xdbf0x15c = _0xdbf0x12['box_reward'][_0xdbf0x7d]
                    } else {
                      if (_0xdbf0x7d == 'weapon_4') {
                        window['player']['static_resources']['weapon_4'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                        window['player']['achievements']['weapon_4'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                        _0xdbf0x15d = _0xdbf0x12['box_reward'][_0xdbf0x7d]
                      } else {
                        if (_0xdbf0x7d == 'weapon_5') {
                          window['player']['static_resources']['weapon_5'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                          window['player']['achievements']['weapon_5'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                          _0xdbf0x15e = _0xdbf0x12['box_reward'][_0xdbf0x7d]
                        } else {
                          if (_0xdbf0x7d == 'weapon_6') {
                            window['player']['static_resources']['weapon_6'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                            window['player']['achievements']['weapon_6'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                            _0xdbf0x15f = _0xdbf0x12['box_reward'][_0xdbf0x7d]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  if (_0xdbf0x155 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_tokens') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x155;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  if (_0xdbf0x156 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x156;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d != 'coins' && _0xdbf0x7d != 'experience' && _0xdbf0x7d != 'tokens' && _0xdbf0x7d != 'supply' && _0xdbf0x7d != 'weapon_0' && _0xdbf0x7d != 'weapon_1' && _0xdbf0x7d != 'weapon_2' && _0xdbf0x7d != 'weapon_3' && _0xdbf0x7d != 'weapon_4' && _0xdbf0x7d != 'weapon_5' && _0xdbf0x7d != 'weapon_6') {
      var _0xdbf0x42 = _0xdbf0x7d['split']('_');
      if (window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]) {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]['count'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
      } else {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]] = {
          "count": _0xdbf0x12['box_reward'][_0xdbf0x7d],
          "get_time": get_current_timestamp(),
          "last_get_time": get_current_timestamp(),
          "level": 0
        };
        window['player']['static_resources']['sut'] += 1;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_sut']['length']; _0xdbf0x4++) {
          if (window['top_sut'][_0xdbf0x4]['id'] == window['game_login']) {
            window['top_sut'][_0xdbf0x4]['static_resources']['sut']++
          }
        };
        if (window['friends_mode'] == 2) {
          window['friends_mode'] = 0;
          change_friends_mode(2)
        };
        window['player']['static_resources']['boost_free_hit_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w0'];
        window['player']['static_resources']['boost_free_hit_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w1'];
        window['player']['static_resources']['boost_free_hit_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w2'];
        window['player']['static_resources']['boost_weapon_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w3'];
        window['player']['static_resources']['boost_weapon_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w4'];
        window['player']['static_resources']['boost_weapon_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w5'];
        window['player']['static_resources']['boost_weapon_3'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w6'];
        window['player']['static_resources']['boost_weapon_4'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w7'];
        window['player']['static_resources']['boost_weapon_5'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w8'];
        window['player']['static_resources']['boost_weapon_6'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w9']
      }
    }
  };
  document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_weapons_list')[0]['getElementsByClassName']('hangar_weapons_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
    _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
  };
  for (var _0xdbf0x4 = 3, _0xdbf0x38 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0xea = window['weapons_damage'][_0xdbf0x38]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x38];
    _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
  };
  if (_0xdbf0x158 > 0) {
    update_renewable_resources_supply()
  };
  if (_0xdbf0x156 > 0) {
    update_static_resources_coins()
  };
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'open_box') {
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += 1;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    }
  };
  if (_0xdbf0x157 > 0) {
    update_level(0)
  };
  var _0xdbf0x76 = get_current_timestamp();
  window['player']['boxes_subscription_journal']['push']({
    "id": window['player']['static_resources']['boxes_subscription_journal_row_id']++,
    "time": _0xdbf0x76,
    "code": 1,
    "info": _0xdbf0x12['open_box_type'],
    "coins": _0xdbf0x156,
    "experience": _0xdbf0x157,
    "tokens": _0xdbf0x155,
    "supply": _0xdbf0x158,
    "weapon_0": _0xdbf0x159,
    "weapon_1": _0xdbf0x15a,
    "weapon_2": _0xdbf0x15b,
    "weapon_3": _0xdbf0x15c,
    "weapon_4": _0xdbf0x15d,
    "weapon_4": _0xdbf0x15d,
    "weapon_5": _0xdbf0x15e,
    "weapon_6": _0xdbf0x15f
  });
  server_action('boxes_subscription.add_log', {
    "time": _0xdbf0x76,
    "code": 1,
    "info": _0xdbf0x12['open_box_type'],
    "coins": _0xdbf0x156,
    "experience": _0xdbf0x157,
    "tokens": _0xdbf0x155,
    "supply": _0xdbf0x158,
    "weapon_0": _0xdbf0x159,
    "weapon_1": _0xdbf0x15a,
    "weapon_2": _0xdbf0x15b,
    "weapon_3": _0xdbf0x15c,
    "weapon_4": _0xdbf0x15d,
    "weapon_4": _0xdbf0x15d,
    "weapon_5": _0xdbf0x15e,
    "weapon_6": _0xdbf0x15f
  })
}

function bxs_opened_box2(_0xdbf0x12) {
  window['player']['static_resources']['encryptions'] -= window['boxes_open_price'];
  window['tmp_encryptions'] -= window['boxes_open_price'];
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  window['player']['achievements']['open_boxes']++;
  window['player']['achievements']['open_box_' + _0xdbf0x12['open_box_type']]++;
  var _0xdbf0x155 = 0;
  var _0xdbf0x156 = 0;
  var _0xdbf0x157 = 0;
  var _0xdbf0x158 = 0;
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d == 'coins' || _0xdbf0x7d == 'experience' || _0xdbf0x7d == 'tokens' || _0xdbf0x7d == 'supply' || _0xdbf0x7d == 'weapon_0' || _0xdbf0x7d == 'weapon_1' || _0xdbf0x7d == 'weapon_2' || _0xdbf0x7d == 'weapon_3' || _0xdbf0x7d == 'weapon_4' || _0xdbf0x7d == 'weapon_5' || _0xdbf0x7d == 'weapon_6') {
      if (_0xdbf0x7d == 'coins') {
        _0xdbf0x156 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
        window['player']['static_resources']['coins'] += _0xdbf0x156;
        window['player']['achievements']['coins'] += _0xdbf0x156
      } else {
        if (_0xdbf0x7d == 'experience') {
          _0xdbf0x157 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
          window['player']['experiences']['experience']['amount'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
        } else {
          if (_0xdbf0x7d == 'tokens') {
            _0xdbf0x155 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
            window['player']['static_resources']['tokens'] += _0xdbf0x155;
            window['player']['achievements']['tokens'] += _0xdbf0x155
          } else {
            if (_0xdbf0x7d == 'supply') {
              var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
              _0xdbf0x78 += _0xdbf0x12['box_reward'][_0xdbf0x7d];
              window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
              window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
              _0xdbf0x158 = _0xdbf0x12['box_reward'][_0xdbf0x7d]
            } else {
              if (_0xdbf0x7d == 'weapon_0') {
                window['player']['static_resources']['weapon_0'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                window['player']['achievements']['weapon_0'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
              } else {
                if (_0xdbf0x7d == 'weapon_1') {
                  window['player']['static_resources']['weapon_1'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                  window['player']['achievements']['weapon_1'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                } else {
                  if (_0xdbf0x7d == 'weapon_2') {
                    window['player']['static_resources']['weapon_2'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                    window['player']['achievements']['weapon_2'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                  } else {
                    if (_0xdbf0x7d == 'weapon_3') {
                      window['player']['static_resources']['weapon_3'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                      window['player']['achievements']['weapon_3'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                    } else {
                      if (_0xdbf0x7d == 'weapon_4') {
                        window['player']['static_resources']['weapon_4'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                        window['player']['achievements']['weapon_4'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                      } else {
                        if (_0xdbf0x7d == 'weapon_5') {
                          window['player']['static_resources']['weapon_5'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                          window['player']['achievements']['weapon_5'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                        } else {
                          if (_0xdbf0x7d == 'weapon_6') {
                            window['player']['static_resources']['weapon_6'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                            window['player']['achievements']['weapon_6'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  if (_0xdbf0x155 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_tokens') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x155;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  if (_0xdbf0x156 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x156;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d != 'coins' && _0xdbf0x7d != 'experience' && _0xdbf0x7d != 'tokens' && _0xdbf0x7d != 'supply' && _0xdbf0x7d != 'weapon_0' && _0xdbf0x7d != 'weapon_1' && _0xdbf0x7d != 'weapon_2' && _0xdbf0x7d != 'weapon_3' && _0xdbf0x7d != 'weapon_4' && _0xdbf0x7d != 'weapon_5' && _0xdbf0x7d != 'weapon_6') {
      var _0xdbf0x42 = _0xdbf0x7d['split']('_');
      if (window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]) {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]['count'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
      } else {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]] = {
          "count": _0xdbf0x12['box_reward'][_0xdbf0x7d],
          "get_time": get_current_timestamp(),
          "last_get_time": get_current_timestamp(),
          "level": 0
        };
        window['player']['static_resources']['sut'] += 1;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_sut']['length']; _0xdbf0x4++) {
          if (window['top_sut'][_0xdbf0x4]['id'] == window['game_login']) {
            window['top_sut'][_0xdbf0x4]['static_resources']['sut']++
          }
        };
        if (window['friends_mode'] == 2) {
          window['friends_mode'] = 0;
          change_friends_mode(2)
        };
        window['player']['static_resources']['boost_free_hit_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w0'];
        window['player']['static_resources']['boost_free_hit_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w1'];
        window['player']['static_resources']['boost_free_hit_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w2'];
        window['player']['static_resources']['boost_weapon_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w3'];
        window['player']['static_resources']['boost_weapon_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w4'];
        window['player']['static_resources']['boost_weapon_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w5'];
        window['player']['static_resources']['boost_weapon_3'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w6'];
        window['player']['static_resources']['boost_weapon_4'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w7'];
        window['player']['static_resources']['boost_weapon_5'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w8'];
        window['player']['static_resources']['boost_weapon_6'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w9']
      }
    }
  };
  document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_weapons_list')[0]['getElementsByClassName']('hangar_weapons_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
    _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
  };
  for (var _0xdbf0x4 = 3, _0xdbf0x38 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0xea = window['weapons_damage'][_0xdbf0x38]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x38];
    _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
  };
  if (_0xdbf0x158 > 0) {
    update_renewable_resources_supply()
  };
  if (_0xdbf0x156 > 0) {
    update_static_resources_coins()
  };
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'open_box') {
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += 1;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    }
  };
  if (_0xdbf0x157 > 0) {
    update_level(0)
  };
  var _0xdbf0x76 = get_current_timestamp();
  window['player']['boxes_subscription_journal']['push']({
    "id": window['player']['static_resources']['boxes_subscription_journal_row_id']++,
    "time": _0xdbf0x76,
    "code": 1,
    "info": _0xdbf0x12['open_box_type'],
    "coins": _0xdbf0x156,
    "experience": _0xdbf0x157,
    "tokens": _0xdbf0x155,
    "supply": _0xdbf0x158
  });
  server_action('boxes_subscription.add_log', {
    "time": _0xdbf0x76,
    "code": 1,
    "info": _0xdbf0x12['open_box_type'],
    "coins": _0xdbf0x156,
    "experience": _0xdbf0x157,
    "tokens": _0xdbf0x155,
    "supply": _0xdbf0x158
  })
}

function show_boxes_subscription() {
  var _0xdbf0xa6 = {};
  var _0xdbf0xaa = {};
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 15; _0xdbf0x4++) {
    _0xdbf0xa6['box_' + _0xdbf0x4] = 0;
    _0xdbf0xaa['box_' + _0xdbf0x4] = 0
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    _0xdbf0xa6['box_' + window['player']['boxes'][_0xdbf0x4]['type']]++
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription']['length']; _0xdbf0x4++) {
    _0xdbf0xaa['box_' + window['player']['boxes_subscription'][_0xdbf0x4]['type']]++
  };
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_boxes')[0];
  _0xdbf0x36['getElementsByClassName']('subscription_boxes_setting')[0]['style']['display'] = 'flex';
  _0xdbf0x36['getElementsByClassName']('subscription_boxes_journal')[0]['style']['display'] = 'none';
  var _0xdbf0x75 = document['getElementById']('open_box_2');
  if (window['player']['static_resources']['subscription_open_box_2'] == 1) {
    _0xdbf0x75['checked'] = true
  } else {
    _0xdbf0x75['checked'] = false
  };
  _0xdbf0x75['onchange'] = boxes_subscription_param_0;
  var _0xdbf0x6b = document['getElementById']('open_box_tech');
  if (window['player']['static_resources']['subscription_open_box_tech'] == 1) {
    _0xdbf0x6b['checked'] = true
  } else {
    _0xdbf0x6b['checked'] = false
  };
  _0xdbf0x6b['onchange'] = boxes_subscription_param_1;
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_boxes_journal_button')[0];
  _0xdbf0x9f['innerHTML'] = 'Журнал';
  _0xdbf0x9f['onclick'] = show_boxes_subscription_journal;
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_boxes_item');
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 2; _0xdbf0x4 < 8; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0x8e = _0xdbf0x55[_0xdbf0x4];
    var _0xdbf0x15 = _0xdbf0xa6['box_' + _0xdbf0x38];
    _0xdbf0x8e['getElementsByClassName']('subscription_boxes_item_count')[0]['innerHTML'] = _0xdbf0x15;
    if (_0xdbf0x4 < 4 && _0xdbf0x15 > 0 && _0xdbf0x15 > _0xdbf0xaa['box_' + _0xdbf0x38]) {
      var _0xdbf0x9f = _0xdbf0x8e['getElementsByClassName']('subscription_boxes_item_add')[0];
      _0xdbf0x9f['style']['display'] = 'block';
      _0xdbf0x9f['dataset']['box_type'] = _0xdbf0x38;
      _0xdbf0x9f['onclick'] = boxes_subscription_add
    } else {
      var _0xdbf0x9f = _0xdbf0x8e['getElementsByClassName']('subscription_boxes_item_add')[0];
      _0xdbf0x9f['style']['display'] = 'none'
    }
  };
  _0xdbf0x55 = _0xdbf0x35['getElementsByClassName']('subscription_boxes_turn_scroll')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  window['player']['boxes_subscription']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
    if (_0xdbf0x8c['id'] < _0xdbf0x8d['id']) {
      return -1
    } else {
      if (_0xdbf0x8c['id'] > _0xdbf0x8d['id']) {
        return 1
      } else {
        return 0
      }
    }
  });
  var _0xdbf0xa6 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['dataset']['rid'] = window['player']['boxes_subscription'][_0xdbf0x4]['id'];
    _0xdbf0x8e['className'] = 'subscription_boxes_turn_item';
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'subscription_boxes_turn_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + window['player']['boxes_subscription'][_0xdbf0x4]['type'] + '-little.png';
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0x3d = document['createElement']('div');
    _0xdbf0x3d['innerHTML'] = window['boxes'][window['player']['boxes_subscription'][_0xdbf0x4]['type']]['name'];
    _0xdbf0x3d['className'] = 'subscription_boxes_turn_item_name';
    _0xdbf0x8e['appendChild'](_0xdbf0x3d);
    var _0xdbf0xa3 = document['createElement']('div');
    _0xdbf0xa3['className'] = 'subscription_boxes_turn_item_delete';
    _0xdbf0xa3['onclick'] = boxes_subscription_delete;
    _0xdbf0x8e['appendChild'](_0xdbf0xa3);
    _0xdbf0x55['appendChild'](_0xdbf0x8e);
    _0xdbf0xa6++
  };
  _0xdbf0x35['getElementsByClassName']('subscription_boxes_turn_count')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0xa6;
  show_modal('subscription_boxes', 450);
  document['getElementById']('modal_close')['onclick'] = function() {
    hide_modal('subscription_boxes');
    window['bs_input'] = 0
  }
}

function show_reward_boxes_subscription() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_boxes')[0];
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_boxes_journal_button')[0];
  _0xdbf0x9f['style']['display'] = 'none';
  _0xdbf0x36['getElementsByClassName']('subscription_boxes_journal_scroll')[0]['style']['pointerEvents'] = 'none';
  var _0xdbf0x163 = parseInt(this['dataset']['jid']);
  var _0xdbf0x164 = {};
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription_journal']['length']; _0xdbf0x4++) {
    if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['id'] == _0xdbf0x163) {
      _0xdbf0x164 = window['player']['boxes_subscription_journal'][_0xdbf0x4]
    }
  };
  var _0xdbf0x35 = document['getElementById']('modal');
  _0xdbf0x35['getElementsByClassName']('modal_close')[0]['style']['display'] = 'none';
  var _0xdbf0xa2 = _0xdbf0x35['getElementsByClassName']('subscription_boxes')[0];
  var _0xdbf0x36 = _0xdbf0xa2['getElementsByClassName']('subscription_simple_box_award')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('subscription_simple_box_award_item_count');
  var _0xdbf0x165 = _0xdbf0x36['getElementsByClassName']('subscription_simple_box_award_item_icon');
  if (_0xdbf0x164['coins'] > 0) {
    _0xdbf0x55[0]['innerHTML'] = '+' + _0xdbf0x164['coins']
  } else {
    _0xdbf0x55[0]['innerHTML'] = '-'
  };
  if (_0xdbf0x164['weapon_0'] > 0) {
    _0xdbf0x165[1]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w4-1.png';
    _0xdbf0x55[1]['innerHTML'] = '+' + _0xdbf0x164['weapon_0']
  } else {
    if (_0xdbf0x164['weapon_1'] > 0) {
      _0xdbf0x165[1]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w5-1.png';
      _0xdbf0x55[1]['innerHTML'] = '+' + _0xdbf0x164['weapon_1']
    } else {
      if (_0xdbf0x164['weapon_2'] > 0) {
        _0xdbf0x165[1]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w6-1.png';
        _0xdbf0x55[1]['innerHTML'] = '+' + _0xdbf0x164['weapon_2']
      } else {
        if (_0xdbf0x164['weapon_3'] > 0) {
          _0xdbf0x165[1]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w7-1.png';
          _0xdbf0x55[1]['innerHTML'] = '+' + _0xdbf0x164['weapon_3']
        } else {
          if (_0xdbf0x164['weapon_4'] > 0) {
            _0xdbf0x165[1]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w8-1.png';
            _0xdbf0x55[1]['innerHTML'] = '+' + _0xdbf0x164['weapon_4']
          } else {
            if (_0xdbf0x164['weapon_5'] > 0) {
              _0xdbf0x165[1]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w9-1.png';
              _0xdbf0x55[1]['innerHTML'] = '+' + _0xdbf0x164['weapon_5']
            } else {
              if (_0xdbf0x164['weapon_6'] > 0) {
                _0xdbf0x165[1]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w10-1.png';
                _0xdbf0x55[1]['innerHTML'] = '+' + _0xdbf0x164['weapon_6']
              } else {
                _0xdbf0x165[1]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/icons/experience_2.png';
                _0xdbf0x55[1]['innerHTML'] = '-'
              }
            }
          }
        }
      }
    }
  };
  if (_0xdbf0x164['tokens'] > 0) {
    _0xdbf0x55[2]['innerHTML'] = '+' + _0xdbf0x164['tokens']
  } else {
    _0xdbf0x55[2]['innerHTML'] = '-'
  };
  if (_0xdbf0x164['supply'] > 0) {
    _0xdbf0x55[3]['innerHTML'] = '+' + _0xdbf0x164['supply']
  } else {
    _0xdbf0x55[3]['innerHTML'] = '-'
  };
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('modal_close')[0]['onclick'] = hide_reward_boxes_subscription
}

function hide_reward_boxes_subscription() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0xa2 = _0xdbf0x35['getElementsByClassName']('subscription_boxes')[0];
  var _0xdbf0x36 = _0xdbf0xa2['getElementsByClassName']('subscription_simple_box_award')[0];
  _0xdbf0x36['style']['display'] = 'none';
  _0xdbf0x35['getElementsByClassName']('modal_close')[0]['style']['display'] = '';
  var _0xdbf0x9f = _0xdbf0xa2['getElementsByClassName']('subscription_boxes_journal_button')[0];
  _0xdbf0x9f['style']['display'] = '';
  _0xdbf0xa2['getElementsByClassName']('subscription_boxes_journal_scroll')[0]['style']['pointerEvents'] = ''
}

function show_boxes_subscription_journal() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('subscription_boxes')[0];
  _0xdbf0x36['getElementsByClassName']('subscription_boxes_setting')[0]['style']['display'] = 'none';
  var _0xdbf0x71 = _0xdbf0x36['getElementsByClassName']('subscription_boxes_journal')[0];
  _0xdbf0x71['style']['display'] = 'block';
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('subscription_boxes_journal_button')[0];
  _0xdbf0x9f['innerHTML'] = 'Настройки';
  _0xdbf0x9f['onclick'] = show_boxes_subscription;
  var _0xdbf0x55 = _0xdbf0x71['getElementsByClassName']('subscription_boxes_journal_scroll')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  window['player']['boxes_subscription_journal']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
    if (_0xdbf0x8c['id'] < _0xdbf0x8d['id']) {
      return 1
    } else {
      if (_0xdbf0x8c['id'] > _0xdbf0x8d['id']) {
        return -1
      } else {
        return 0
      }
    }
  });
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription_journal']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'subscription_boxes_journal_item';
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'subscription_boxes_journal_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] + '-little.png';
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0x168 = document['createElement']('div');
    if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['code'] == 0) {
      var _0xdbf0x2c = 'Начался взлом ';
      if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 0) {
        _0xdbf0x2c += 'простого '
      } else {
        if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 2) {
          _0xdbf0x2c += 'лёгкого '
        } else {
          if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 3) {
            _0xdbf0x2c += 'среднего '
          } else {
            if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 4) {
              _0xdbf0x2c += 'большого '
            } else {
              if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 5) {
                _0xdbf0x2c += 'легендарного '
              }
            }
          }
        }
      };
      _0xdbf0x2c += 'ящика';
      _0xdbf0x168['innerHTML'] = _0xdbf0x2c
    } else {
      if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['code'] == 1) {
        var _0xdbf0x169 = document['createTextNode']('Открыли ');
        _0xdbf0x168['appendChild'](_0xdbf0x169);
        var _0xdbf0x137 = document['createElement']('span');
        _0xdbf0x137['dataset']['jid'] = window['player']['boxes_subscription_journal'][_0xdbf0x4]['id'];
        if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 0) {
          _0xdbf0x137['onclick'] = show_reward_boxes_subscription;
          var _0xdbf0x16a = document['createTextNode']('простой ');
          _0xdbf0x137['appendChild'](_0xdbf0x16a)
        };
        var _0xdbf0x16b = document['createTextNode']('ящик');
        _0xdbf0x137['appendChild'](_0xdbf0x16b);
        if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 7) {
          var _0xdbf0x16c = document['createTextNode'](' с танками');
          _0xdbf0x137['appendChild'](_0xdbf0x16c)
        } else {
          if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 8) {
            var _0xdbf0x16c = document['createTextNode'](' с артиллерией');
            _0xdbf0x137['appendChild'](_0xdbf0x16c)
          } else {
            if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 9) {
              var _0xdbf0x16c = document['createTextNode'](' с авиацией');
              _0xdbf0x137['appendChild'](_0xdbf0x16c)
            }
          }
        };
        if (window['player']['boxes_subscription_journal'][_0xdbf0x4]['info'] == 0) {
          var _0xdbf0x16d = document['createElement']('div');
          _0xdbf0x16d['className'] = 'subscription_boxes_journal_item_award_open';
          _0xdbf0x137['appendChild'](_0xdbf0x16d);
          _0xdbf0x137['style']['cursor'] = 'pointer'
        };
        _0xdbf0x168['appendChild'](_0xdbf0x137)
      }
    };
    _0xdbf0x168['className'] = 'subscription_boxes_journal_item_text';
    _0xdbf0x8e['appendChild'](_0xdbf0x168);
    var _0xdbf0x76 = document['createElement']('div');
    var _0xdbf0x2c = '';
    var _0xdbf0x75 = window['player']['boxes_subscription_journal'][_0xdbf0x4]['time'] * 1000;
    var _0xdbf0x92 = new Date(_0xdbf0x75);
    var _0xdbf0x87 = _0xdbf0x92['getHours']();
    if (_0xdbf0x87 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x87 + ':'
    } else {
      _0xdbf0x2c += _0xdbf0x87 + ':'
    };
    var _0xdbf0x89 = _0xdbf0x92['getMinutes']();
    if (_0xdbf0x89 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
    } else {
      _0xdbf0x2c += _0xdbf0x89 + ':'
    };
    var _0xdbf0x88 = _0xdbf0x92['getSeconds']();
    if (_0xdbf0x88 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x88
    } else {
      _0xdbf0x2c += _0xdbf0x88
    };
    _0xdbf0x76['innerHTML'] = _0xdbf0x2c;
    _0xdbf0x76['className'] = 'subscription_boxes_journal_item_time';
    _0xdbf0x8e['appendChild'](_0xdbf0x76);
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  }
}

function boxes_subscription_delete() {
  var _0xdbf0xab = parseInt(event['target']['parentNode']['dataset']['rid']);
  server_action('boxes_subscription.delete', {
    "row": _0xdbf0xab
  });
  var _0xdbf0x153 = [];
  var _0xdbf0x16f = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription']['length']; _0xdbf0x4++) {
    if (window['player']['boxes_subscription'][_0xdbf0x4]['id'] == _0xdbf0xab) {
      _0xdbf0x16f = window['player']['boxes_subscription'][_0xdbf0x4]['type']
    } else {
      _0xdbf0x153['push'](window['player']['boxes_subscription'][_0xdbf0x4])
    }
  };
  window['player']['boxes_subscription'] = _0xdbf0x153;
  upd_subscription_list();
  if (_0xdbf0x16f > -1) {
    var _0xdbf0xa6 = {};
    var _0xdbf0xaa = {};
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < 15; _0xdbf0x4++) {
      _0xdbf0xa6['box_' + _0xdbf0x4] = 0;
      _0xdbf0xaa['box_' + _0xdbf0x4] = 0
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
      _0xdbf0xa6['box_' + window['player']['boxes'][_0xdbf0x4]['type']]++
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription']['length']; _0xdbf0x4++) {
      _0xdbf0xaa['box_' + window['player']['boxes_subscription'][_0xdbf0x4]['type']]++
    };
    var _0xdbf0x6 = _0xdbf0xa6['box_' + _0xdbf0x16f] - _0xdbf0xaa['box_' + _0xdbf0x16f];
    if (_0xdbf0x6 > 0) {
      var _0xdbf0x35 = document['getElementById']('modal');
      var _0xdbf0x55 = _0xdbf0x35['getElementsByClassName']('subscription_boxes_item');
      var _0xdbf0x9f = _0xdbf0x55[_0xdbf0x16f - 2]['getElementsByClassName']('subscription_boxes_item_add')[0];
      _0xdbf0x9f['style']['display'] = 'block'
    }
  }
}

function upd_subscription_list() {
  var _0xdbf0x35 = document['getElementById']('modal');
  var _0xdbf0x55 = _0xdbf0x35['getElementsByClassName']('subscription_boxes_turn_scroll')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  window['player']['boxes_subscription']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
    if (_0xdbf0x8c['id'] < _0xdbf0x8d['id']) {
      return -1
    } else {
      if (_0xdbf0x8c['id'] > _0xdbf0x8d['id']) {
        return 1
      } else {
        return 0
      }
    }
  });
  var _0xdbf0xa6 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['dataset']['rid'] = window['player']['boxes_subscription'][_0xdbf0x4]['id'];
    _0xdbf0x8e['className'] = 'subscription_boxes_turn_item';
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'subscription_boxes_turn_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + window['player']['boxes_subscription'][_0xdbf0x4]['type'] + '-little.png';
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0x3d = document['createElement']('div');
    _0xdbf0x3d['innerHTML'] = window['boxes'][window['player']['boxes_subscription'][_0xdbf0x4]['type']]['name'];
    _0xdbf0x3d['className'] = 'subscription_boxes_turn_item_name';
    _0xdbf0x8e['appendChild'](_0xdbf0x3d);
    var _0xdbf0xa3 = document['createElement']('div');
    _0xdbf0xa3['className'] = 'subscription_boxes_turn_item_delete';
    _0xdbf0xa3['onclick'] = boxes_subscription_delete;
    _0xdbf0x8e['appendChild'](_0xdbf0xa3);
    _0xdbf0x55['appendChild'](_0xdbf0x8e);
    _0xdbf0xa6++
  };
  _0xdbf0x35['getElementsByClassName']('subscription_boxes_turn_count')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0xa6
}

function boxes_subscription_add() {
  var _0xdbf0xf0 = parseInt(this['dataset']['box_type']);
  var _0xdbf0xa6 = {};
  var _0xdbf0xaa = {};
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 15; _0xdbf0x4++) {
    _0xdbf0xa6['box_' + _0xdbf0x4] = 0;
    _0xdbf0xaa['box_' + _0xdbf0x4] = 0
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    _0xdbf0xa6['box_' + window['player']['boxes'][_0xdbf0x4]['type']]++
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes_subscription']['length']; _0xdbf0x4++) {
    _0xdbf0xaa['box_' + window['player']['boxes_subscription'][_0xdbf0x4]['type']]++
  };
  if (_0xdbf0xa6['box_' + _0xdbf0xf0] > _0xdbf0xaa['box_' + _0xdbf0xf0]) {
    window['player']['boxes_subscription']['push']({
      "id": window['player']['static_resources']['boxes_subscription_row_id']++,
      "type": _0xdbf0xf0
    });
    server_action('boxes_subscription.add', {
      "type": _0xdbf0xf0
    });
    upd_subscription_list()
  };
  var _0xdbf0x6 = _0xdbf0xa6['box_' + _0xdbf0xf0] - _0xdbf0xaa['box_' + _0xdbf0xf0] - 1;
  if (_0xdbf0x6 <= 0) {
    var _0xdbf0x35 = document['getElementById']('modal');
    var _0xdbf0x55 = _0xdbf0x35['getElementsByClassName']('subscription_boxes_item');
    var _0xdbf0x9f = _0xdbf0x55[_0xdbf0xf0 - 2]['getElementsByClassName']('subscription_boxes_item_add')[0];
    _0xdbf0x9f['style']['display'] = 'none'
  }
}

function out_boxes(_0xdbf0x5d, _0xdbf0x173) {
  if (window['player']['static_resources']['tutorial'] == 11) {
    window['player']['static_resources']['tutorial']++;
    tutorial_arrow_stop();
    document['getElementsByClassName']('boxes_block')[0]['getElementsByClassName']('modal_close')[0]['style']['display'] = 'none'
  };
  if (window['player']['static_resources']['tutorial'] == 12) {
    show_tutorial(12)
  };
  window['loc_page'] = 'boxes';
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = '5';
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('bosses_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('missions_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('sector_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('shop_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('package_block')[0]['style']['display'] = 'none';
  var _0xdbf0x36 = document['getElementsByClassName']('boxes_block')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
    window['loc_page'] = '';
    play_effect('click.mp3');
    show_homeland()
  };
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('main')[0]['className'] = 'main boxes';
  boxes_mode_1();
  _0xdbf0x36['getElementsByClassName']('boxes_left')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['boxes']['length'] + '/' + window['limit_boxes'];
  document['getElementsByClassName']('boxes_offers_button')[0]['onclick'] = function() {
    play_effect('click.mp3');
    boxes_mode_0()
  };
  if (window['player']['settings']['boxes_sort_by'] == 0) {
    document['getElementById']('sort')['className'] = 'sort_up'
  } else {
    if (window['player']['settings']['boxes_sort_by'] == 1) {
      document['getElementById']('sort')['className'] = 'sort_down'
    }
  };
  change_boxes_sort(window['player']['settings']['boxes_sort_type'], 0, 0);
  document['getElementById']('sort')['onclick'] = boxes_sort;
  var _0xdbf0x55 = document['getElementsByClassName']('boxes_grid_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  if (window['player']['boxes']['length'] > 8) {
    _0xdbf0x55['parentNode']['style']['overflowY'] = 'auto'
  } else {
    _0xdbf0x55['parentNode']['style']['overflowY'] = 'hidden'
  };
  var _0xdbf0x174 = -1;
  var _0xdbf0x175 = -1;
  var _0xdbf0x23 = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    if (window['player']['boxes'][_0xdbf0x4]['open_time'] > 0) {
      if (window['player']['boxes'][_0xdbf0x4]['open_time'] > get_current_timestamp()) {
        _0xdbf0x8e['className'] = 'boxes_grid_list_item open'
      } else {
        _0xdbf0x8e['className'] = 'boxes_grid_list_item hacked'
      }
    } else {
      _0xdbf0x8e['className'] = 'boxes_grid_list_item'
    };
    var _0xdbf0x176 = document['createElement']('div');
    _0xdbf0x176['className'] = 'boxes_grid_list_item_image';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + window['player']['boxes'][_0xdbf0x4]['type'] + '.png';
    _0xdbf0x176['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x176);
    var _0xdbf0x177 = document['createElement']('div');
    _0xdbf0x177['className'] = 'boxes_grid_list_item_timer_icon';
    var _0xdbf0x178 = document['createElement']('img');
    _0xdbf0x178['src'] = 'https://cdn.bravegames.space/regiment/images/icons/timer.png';
    _0xdbf0x177['appendChild'](_0xdbf0x178);
    _0xdbf0x8e['appendChild'](_0xdbf0x177);
    var _0xdbf0x179 = document['createElement']('div');
    _0xdbf0x179['className'] = 'boxes_grid_list_item_name';
    var _0xdbf0x3d = document['createTextNode'](window['boxes'][window['player']['boxes'][_0xdbf0x4]['type']]['name']);
    _0xdbf0x179['appendChild'](_0xdbf0x3d);
    _0xdbf0x8e['appendChild'](_0xdbf0x179);
    var _0xdbf0x17a = document['createElement']('div');
    _0xdbf0x17a['className'] = 'boxes_grid_list_item_time';
    if (window['player']['boxes'][_0xdbf0x4]['open_time'] > 0 && window['player']['boxes'][_0xdbf0x4]['open_time'] < get_current_timestamp()) {
      var _0xdbf0x17b = document['createTextNode']('Можно открыть');
      _0xdbf0x17a['appendChild'](_0xdbf0x17b)
    } else {
      var _0xdbf0x12c = document['createElement']('img');
      _0xdbf0x12c['src'] = 'https://cdn.bravegames.space/regiment/images/icons/timer-small.png';
      _0xdbf0x17a['appendChild'](_0xdbf0x12c);
      if (window['player']['boxes'][_0xdbf0x4]['open_time'] > 0) {
        if (window['player']['boxes'][_0xdbf0x4]['open_time'] > get_current_timestamp()) {
          window['box_is_hack'] = window['player']['boxes'][_0xdbf0x4]['id'];
          window['ubst'] = setInterval(update_boxes_timer, 1000, window['player']['boxes'][_0xdbf0x4]['id']);
          var _0xdbf0x76 = window['player']['boxes'][_0xdbf0x4]['open_time'] - get_current_timestamp()
        } else {
          var _0xdbf0x76 = 0
        }
      } else {
        var _0xdbf0x76 = window['boxes'][window['player']['boxes'][_0xdbf0x4]['type']]['time'];
        if (window['player']['boxes'][_0xdbf0x4]['type'] != 0) {
          _0xdbf0x76 -= window['player']['static_resources']['boost_speed_hack_boxes']
        }
      };
      var _0xdbf0x17c = document['createElement']('span');
      _0xdbf0x17c['innerHTML'] = boxes_timer(_0xdbf0x76);
      _0xdbf0x17a['appendChild'](_0xdbf0x17c)
    };
    _0xdbf0x8e['appendChild'](_0xdbf0x17a);
    _0xdbf0x55['appendChild'](_0xdbf0x8e);
    _0xdbf0x8e['dataset']['bid'] = window['player']['boxes'][_0xdbf0x4]['id'];
    _0xdbf0x8e['onclick'] = change_active_box;
    if (window['player']['boxes'][_0xdbf0x4]['id'] > _0xdbf0x23) {
      _0xdbf0x23 = window['player']['boxes'][_0xdbf0x4]['id'];
      _0xdbf0x174 = _0xdbf0x8e
    };
    if (_0xdbf0x4 == _0xdbf0x173) {
      _0xdbf0x175 = _0xdbf0x8e
    }
  };
  if (_0xdbf0x5d == 0) {
    _0xdbf0x174['onclick']()
  } else {
    _0xdbf0x175['onclick']()
  };
  var _0xdbf0x55 = document['getElementsByClassName']('boxes_sort_select')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['onclick'] = window['change_boxes_sort_' + _0xdbf0x4]
  }
}

function change_boxes_sort_0() {
  change_boxes_sort(0, 1, 1)
}

function change_boxes_sort_1() {
  change_boxes_sort(1, 1, 1)
}

function boxes_sort() {
  var _0xdbf0x137 = document['getElementById']('sort');
  if (_0xdbf0x137['className'] == 'sort_up') {
    _0xdbf0x137['className'] = 'sort_down'
  } else {
    if (_0xdbf0x137['className'] == 'sort_down') {
      _0xdbf0x137['className'] = 'sort_up'
    }
  };
  var _0xdbf0x55 = document['getElementsByClassName']('boxes_sort_select')[0]['getElementsByTagName']('li');
  var _0xdbf0x9a = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['className'] == 'active') {
      _0xdbf0x9a = _0xdbf0x4
    }
  };
  change_boxes_sort(_0xdbf0x9a, 1, 1)
}

function change_boxes_sort(_0xdbf0x9a, _0xdbf0x181, _0xdbf0x182) {
  var _0xdbf0x36 = document['getElementsByClassName']('boxes_sort_select')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = ''
  };
  _0xdbf0x55[_0xdbf0x9a]['className'] = 'active';
  if (_0xdbf0x9a == 0) {
    _0xdbf0x36['getElementsByTagName']('label')[0]['innerHTML'] = 'Сортировка по времени'
  } else {
    if (_0xdbf0x9a == 1) {
      _0xdbf0x36['getElementsByTagName']('label')[0]['innerHTML'] = 'Сортировка по типу'
    }
  };
  var _0xdbf0x137 = document['getElementById']('sort');
  if (_0xdbf0x137['className'] == 'sort_up') {
    var _0xdbf0x183 = 0
  } else {
    if (_0xdbf0x137['className'] == 'sort_down') {
      var _0xdbf0x183 = 1
    }
  };
  if (_0xdbf0x182 == 1) {
    server_action('settings.boxes_sort', {
      "sort_type": _0xdbf0x9a,
      "sort_by": _0xdbf0x183
    })
  };
  window['player']['settings']['boxes_sort_type'] = _0xdbf0x9a;
  window['player']['settings']['boxes_sort_by'] = _0xdbf0x183;
  if (_0xdbf0x9a == 0) {
    if (_0xdbf0x183 == 0) {
      var _0xdbf0x184 = -1;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
        if (window['player']['boxes'][_0xdbf0x4]['type'] == 0) {
          _0xdbf0x184 = window['player']['boxes'][_0xdbf0x4]['id'];
          window['player']['boxes'][_0xdbf0x4]['id'] = 9999999
        }
      };
      window['player']['boxes']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
        if (_0xdbf0x8c['id'] < _0xdbf0x8d['id']) {
          return 1
        } else {
          if (_0xdbf0x8c['id'] > _0xdbf0x8d['id']) {
            return -1
          } else {
            return 0
          }
        }
      });
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
        if (window['player']['boxes'][_0xdbf0x4]['type'] == 0) {
          window['player']['boxes'][_0xdbf0x4]['id'] = _0xdbf0x184
        }
      }
    } else {
      if (_0xdbf0x183 == 1) {
        var _0xdbf0x184 = -1;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
          if (window['player']['boxes'][_0xdbf0x4]['type'] == 0) {
            _0xdbf0x184 = window['player']['boxes'][_0xdbf0x4]['id'];
            window['player']['boxes'][_0xdbf0x4]['id'] = 0
          }
        };
        window['player']['boxes']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
          if (_0xdbf0x8c['id'] < _0xdbf0x8d['id']) {
            return -1
          } else {
            if (_0xdbf0x8c['id'] > _0xdbf0x8d['id']) {
              return 1
            } else {
              return 0
            }
          }
        });
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
          if (window['player']['boxes'][_0xdbf0x4]['type'] == 0) {
            window['player']['boxes'][_0xdbf0x4]['id'] = _0xdbf0x184
          }
        }
      }
    }
  } else {
    if (_0xdbf0x9a == 1) {
      if (_0xdbf0x183 == 0) {
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
          if (window['player']['boxes'][_0xdbf0x4]['type'] == 0) {
            window['player']['boxes'][_0xdbf0x4]['type'] = 9999999
          }
        };
        window['player']['boxes']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
          if (_0xdbf0x8c['type'] < _0xdbf0x8d['type']) {
            return 1
          } else {
            if (_0xdbf0x8c['type'] > _0xdbf0x8d['type']) {
              return -1
            } else {
              return 0
            }
          }
        });
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
          if (window['player']['boxes'][_0xdbf0x4]['type'] == 9999999) {
            window['player']['boxes'][_0xdbf0x4]['type'] = 0
          }
        }
      } else {
        if (_0xdbf0x183 == 1) {
          window['player']['boxes']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
            if (_0xdbf0x8c['type'] < _0xdbf0x8d['type']) {
              return -1
            } else {
              if (_0xdbf0x8c['type'] > _0xdbf0x8d['type']) {
                return 1
              } else {
                return 0
              }
            }
          })
        }
      }
    }
  };
  if (_0xdbf0x181 == 1) {
    clearTimeout(window['ubst']);
    show_boxes_block()
  }
}

function update_boxes_timer(_0xdbf0x9a) {
  var _0xdbf0x55 = document['getElementsByClassName']('boxes_grid_list')[0];
  var _0xdbf0x165 = _0xdbf0x55['getElementsByClassName']('boxes_grid_list_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x165['length']; _0xdbf0x4++) {
    if (_0xdbf0x165[_0xdbf0x4]['dataset']['bid'] == _0xdbf0x9a) {
      var _0xdbf0x38 = _0xdbf0x4;
      var _0xdbf0x36 = _0xdbf0x165[_0xdbf0x4]
    }
  };
  if (window['player']['boxes'][_0xdbf0x38]['open_time'] > get_current_timestamp()) {
    var _0xdbf0x76 = window['player']['boxes'][_0xdbf0x38]['open_time'] - get_current_timestamp();
    update_btn_price(_0xdbf0x9a)
  } else {
    setTimeout(update_btn_boxes, 300, _0xdbf0x9a);
    var _0xdbf0x76 = 0;
    clearTimeout(window['ubst'])
  };
  _0xdbf0x36['getElementsByClassName']('boxes_grid_list_item_time')[0]['getElementsByTagName']('span')[0]['innerHTML'] = boxes_timer(_0xdbf0x76);
  var _0xdbf0x186 = document['getElementsByClassName']('boxes_desc_frame')[0];
  var _0xdbf0x9a = parseInt(_0xdbf0x186['dataset']['bid']);
  if (_0xdbf0x9a == window['player']['boxes'][_0xdbf0x38]['id']) {
    _0xdbf0x186['getElementsByClassName']('boxes_desc_frame_timer')[0]['innerHTML'] = boxes_timer(_0xdbf0x76)
  }
}

function update_btn_price(_0xdbf0x9a) {
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    if (window['player']['boxes'][_0xdbf0x4]['id'] == _0xdbf0x9a) {
      var _0xdbf0x188 = window['player']['boxes'][_0xdbf0x4]
    }
  };
  var _0xdbf0x186 = document['getElementsByClassName']('boxes_desc_frame')[0];
  if (window['boxes'][_0xdbf0x188['type']]['can_paid_open'] && parseInt(_0xdbf0x186['dataset']['bid']) == _0xdbf0x9a) {
    var _0xdbf0x76 = _0xdbf0x188['open_time'] - get_current_timestamp();
    var _0xdbf0x6 = _0xdbf0x76 % 3600;
    var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
    if (_0xdbf0x6 > 0) {
      _0xdbf0x87++
    };
    var _0xdbf0xf8 = _0xdbf0x87 * window['boxes_paid_open_price_1h'];
    _0xdbf0x186['getElementsByClassName']('boxes_desc_frame_button_buy_count')[0]['innerHTML'] = _0xdbf0xf8
  }
}

function update_btn_boxes(_0xdbf0x9a) {
  var _0xdbf0x55 = document['getElementsByClassName']('boxes_grid_list')[0]['getElementsByClassName']('boxes_grid_list_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['dataset']['bid'] == _0xdbf0x9a) {
      var _0xdbf0x36 = _0xdbf0x55[_0xdbf0x4]
    }
  };
  _0xdbf0x36['getElementsByClassName']('boxes_grid_list_item_time')[0]['innerHTML'] = 'Можно открыть';
  _0xdbf0x36['getElementsByClassName']('boxes_grid_list_item_timer_icon')[0]['style']['display'] = 'none';
  var _0xdbf0x186 = document['getElementsByClassName']('boxes_desc_frame')[0];
  if (_0xdbf0x186['dataset']['bid'] == _0xdbf0x36['dataset']['bid']) {
    var _0xdbf0x9a = parseInt(_0xdbf0x186['dataset']['bid']);
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
      if (window['player']['boxes'][_0xdbf0x4]['id'] == _0xdbf0x9a) {
        var _0xdbf0x16f = window['player']['boxes'][_0xdbf0x4]['type']
      }
    };
    if (_0xdbf0x16f == 0) {
      _0xdbf0x186['getElementsByClassName']('boxes_desc_frame_button_buy')[0]['style']['display'] = 'none';
      var _0xdbf0x9f = _0xdbf0x186['getElementsByClassName']('boxes_desc_frame_button')[0];
      _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_text')[0]['innerHTML'] = 'Открыть ящик';
      _0xdbf0x9f['style']['display'] = 'flex';
      _0xdbf0x9f['style']['filter'] = 'grayscale(0)';
      _0xdbf0x9f['style']['cursor'] = 'pointer';
      _0xdbf0x9f['onclick'] = function() {
        boxes_open_box(_0xdbf0x9a)
      }
    } else {
      _0xdbf0x186['getElementsByClassName']('boxes_desc_frame_button')[0]['style']['display'] = 'none';
      var _0xdbf0x9f = _0xdbf0x186['getElementsByClassName']('boxes_desc_frame_button_buy')[0];
      _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_buy_count')[0]['innerHTML'] = window['boxes_open_price'];
      _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_buy_icon')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/encryptions_interface.png';
      _0xdbf0x9f['style']['display'] = 'flex';
      _0xdbf0x9f['onclick'] = function() {
        boxes_open_box(_0xdbf0x9a)
      }
    }
  }
}

function tutorial_arrow_change_box() {
  if (window['tutorial_arrow_stoped'] == 2) {
    var _0xdbf0x36 = document['getElementsByClassName']('boxes_block')[0];
    _0xdbf0x36['getElementsByClassName']('boxes_grid_list')[0]['getElementsByClassName']('boxes_grid_list_item')[2]['style']['pointerEvents'] = '';
    _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button_buy')[0]['style']['pointerEvents'] = 'auto';
    tutorial_arrow(705, 645, 'right', 524, 0)
  } else {
    setTimeout(tutorial_arrow_change_box, 50)
  }
}

function get_current_timestamp() {
  return window['current_time']
}

function change_active_box() {
  play_effect('click.mp3');
  var _0xdbf0x9a = parseInt(this['dataset']['bid']);
  var _0xdbf0x188 = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    if (window['player']['boxes'][_0xdbf0x4]['id'] == _0xdbf0x9a) {
      _0xdbf0x188 = window['player']['boxes'][_0xdbf0x4]
    }
  };
  if (window['player']['static_resources']['tutorial'] == 13) {
    window['player']['static_resources']['tutorial']++;
    tutorial_arrow_stop();
    setTimeout(tutorial_arrow_change_box, 50)
  };
  if (_0xdbf0x188 != -1) {
    var _0xdbf0x36 = document['getElementsByClassName']('boxes_desc_frame')[0];
    _0xdbf0x36['dataset']['bid'] = _0xdbf0x188['id'];
    _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_name')[0]['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['name'];
    _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + _0xdbf0x188['type'] + '.png';
    if (_0xdbf0x188['open_time'] > 0) {
      if (_0xdbf0x188['open_time'] > get_current_timestamp()) {
        var _0xdbf0x76 = _0xdbf0x188['open_time'] - get_current_timestamp()
      } else {
        var _0xdbf0x76 = 0
      };
      _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_timer')[0]['innerHTML'] = boxes_timer(_0xdbf0x76)
    } else {
      var _0xdbf0x75 = window['boxes'][_0xdbf0x188['type']]['time'];
      if (_0xdbf0x188['type'] != 0) {
        _0xdbf0x75 -= window['player']['static_resources']['boost_speed_hack_boxes']
      };
      _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_timer')[0]['innerHTML'] = boxes_timer(_0xdbf0x75)
    };
    _0xdbf0x36['getElementsByClassName']('boxes_cards')[0]['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['cards'];
    if (window['boxes'][_0xdbf0x188['type']]['reward']['coins']['min'] == window['boxes'][_0xdbf0x188['type']]['reward']['coins']['max']) {
      _0xdbf0x36['getElementsByClassName']('boxes_coins')[0]['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['coins']['max']
    } else {
      _0xdbf0x36['getElementsByClassName']('boxes_coins')[0]['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['coins']['min'] + '-' + window['boxes'][_0xdbf0x188['type']]['reward']['coins']['max']
    };
    if (_0xdbf0x188['type'] == 6 || _0xdbf0x188['type'] == 0) {
      var _0xdbf0x18d = _0xdbf0x36['getElementsByClassName']('boxes_experience')[0];
      _0xdbf0x18d['parentNode']['style']['display'] = 'none';
      var _0xdbf0x18d = _0xdbf0x36['getElementsByClassName']('boxes_weapons')[0];
      _0xdbf0x18d['parentNode']['style']['display'] = 'flex';
      if (window['boxes'][_0xdbf0x188['type']]['reward']['weapons']['min'] == window['boxes'][_0xdbf0x188['type']]['reward']['weapons']['max']) {
        _0xdbf0x18d['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['weapons']['max']
      } else {
        _0xdbf0x18d['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['weapons']['min'] + '-' + window['boxes'][_0xdbf0x188['type']]['reward']['weapons']['max']
      }
    } else {
      var _0xdbf0x18d = _0xdbf0x36['getElementsByClassName']('boxes_weapons')[0];
      _0xdbf0x18d['parentNode']['style']['display'] = 'none';
      var _0xdbf0x18d = _0xdbf0x36['getElementsByClassName']('boxes_experience')[0];
      _0xdbf0x18d['parentNode']['style']['display'] = 'flex';
      if (window['boxes'][_0xdbf0x188['type']]['reward']['experience']['min'] == window['boxes'][_0xdbf0x188['type']]['reward']['experience']['max']) {
        _0xdbf0x18d['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['experience']['max']
      } else {
        _0xdbf0x18d['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['experience']['min'] + '-' + window['boxes'][_0xdbf0x188['type']]['reward']['experience']['max']
      }
    };
    if (window['boxes'][_0xdbf0x188['type']]['reward']['tokens']['min'] == window['boxes'][_0xdbf0x188['type']]['reward']['tokens']['max']) {
      _0xdbf0x36['getElementsByClassName']('boxes_tokens')[0]['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['tokens']['max']
    } else {
      _0xdbf0x36['getElementsByClassName']('boxes_tokens')[0]['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['tokens']['min'] + '-' + window['boxes'][_0xdbf0x188['type']]['reward']['tokens']['max']
    };
    if (window['boxes'][_0xdbf0x188['type']]['reward']['supply']['min'] == window['boxes'][_0xdbf0x188['type']]['reward']['supply']['max']) {
      _0xdbf0x36['getElementsByClassName']('boxes_supply')[0]['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['supply']['max']
    } else {
      _0xdbf0x36['getElementsByClassName']('boxes_supply')[0]['innerHTML'] = window['boxes'][_0xdbf0x188['type']]['reward']['supply']['min'] + '-' + window['boxes'][_0xdbf0x188['type']]['reward']['supply']['max']
    };
    var _0xdbf0x18e = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
      if (window['player']['boxes'][_0xdbf0x4]['open_time'] > 0 && window['player']['boxes'][_0xdbf0x4]['open_time'] > get_current_timestamp() && window['player']['boxes'][_0xdbf0x4]['type'] != 0) {
        _0xdbf0x18e++
      }
    };
    if (_0xdbf0x188['type'] == 0) {
      if (_0xdbf0x188['open_time'] == 0) {
        _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button_buy')[0]['style']['display'] = 'none';
        var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button')[0];
        _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_text')[0]['innerHTML'] = 'Взломать ящик';
        _0xdbf0x9f['style']['display'] = 'flex';
        _0xdbf0x9f['style']['filter'] = 'grayscale(0)';
        _0xdbf0x9f['style']['cursor'] = 'pointer';
        _0xdbf0x9f['onclick'] = function() {
          boxes_start_hack(_0xdbf0x9a)
        }
      } else {
        if (_0xdbf0x188['open_time'] > get_current_timestamp()) {
          _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button_buy')[0]['style']['display'] = 'none';
          var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button')[0];
          _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_text')[0]['innerHTML'] = 'Открыть ящик';
          _0xdbf0x9f['style']['display'] = 'flex';
          _0xdbf0x9f['style']['filter'] = 'grayscale(1)';
          _0xdbf0x9f['style']['cursor'] = 'default';
          _0xdbf0x9f['onclick'] = ''
        } else {
          _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button_buy')[0]['style']['display'] = 'none';
          var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button')[0];
          _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_text')[0]['innerHTML'] = 'Открыть ящик';
          _0xdbf0x9f['style']['display'] = 'flex';
          _0xdbf0x9f['style']['filter'] = 'grayscale(0)';
          _0xdbf0x9f['style']['cursor'] = 'pointer';
          _0xdbf0x9f['onclick'] = function() {
            boxes_open_box(_0xdbf0x9a)
          }
        }
      }
    } else {
      if (_0xdbf0x188['open_time'] > 0 && _0xdbf0x188['open_time'] < get_current_timestamp()) {
        _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button')[0]['style']['display'] = 'none';
        var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button_buy')[0];
        _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_buy_count')[0]['innerHTML'] = window['boxes_open_price'];
        _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_buy_icon')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/encryptions_interface.png';
        _0xdbf0x9f['style']['display'] = 'flex';
        _0xdbf0x9f['onclick'] = function() {
          boxes_open_box(_0xdbf0x9a)
        }
      } else {
        if (_0xdbf0x18e == 0) {
          _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button_buy')[0]['style']['display'] = 'none';
          var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button')[0];
          _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_text')[0]['innerHTML'] = 'Взломать ящик';
          _0xdbf0x9f['style']['display'] = 'flex';
          _0xdbf0x9f['style']['filter'] = 'grayscale(0)';
          _0xdbf0x9f['style']['cursor'] = 'pointer';
          _0xdbf0x9f['onclick'] = function() {
            boxes_start_hack(_0xdbf0x9a)
          }
        } else {
          if (_0xdbf0x188['open_time'] == 0) {
            var _0xdbf0x76 = window['boxes'][_0xdbf0x188['type']]['time'];
            if (_0xdbf0x188['type'] != 0) {
              _0xdbf0x76 -= window['player']['static_resources']['boost_speed_hack_boxes']
            }
          } else {
            var _0xdbf0x76 = _0xdbf0x188['open_time'] - get_current_timestamp()
          };
          var _0xdbf0x6 = _0xdbf0x76 % 3600;
          var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
          if (_0xdbf0x6 > 0) {
            _0xdbf0x87++
          };
          var _0xdbf0xf8 = _0xdbf0x87 * window['boxes_paid_open_price_1h'];
          _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button')[0]['style']['display'] = 'none';
          var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_button_buy')[0];
          _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_buy_count')[0]['innerHTML'] = _0xdbf0xf8;
          _0xdbf0x9f['getElementsByClassName']('boxes_desc_frame_button_buy_icon')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/tickets_interface.png';
          _0xdbf0x9f['style']['display'] = 'flex';
          _0xdbf0x9f['onclick'] = function() {
            boxes_paid_open_box(_0xdbf0x9a)
          }
        }
      }
    };
    var _0xdbf0x55 = document['getElementsByClassName']('boxes_grid_list')[0]['getElementsByClassName']('boxes_grid_list_item');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      if (_0xdbf0x55[_0xdbf0x4]['dataset']['bid'] == _0xdbf0x9a) {
        _0xdbf0x55[_0xdbf0x4]['className'] = 'boxes_grid_list_item active';
        if (window['player']['boxes'][_0xdbf0x4]['open_time'] > 0 && window['player']['boxes'][_0xdbf0x4]['open_time'] > get_current_timestamp()) {
          _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boxes_grid_list_item_timer_icon')[0]['style']['display'] = 'block'
        } else {
          _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boxes_grid_list_item_timer_icon')[0]['style']['display'] = 'none'
        }
      } else {
        if (window['player']['boxes'][_0xdbf0x4]['open_time'] > 0) {
          if (window['player']['boxes'][_0xdbf0x4]['open_time'] > get_current_timestamp()) {
            _0xdbf0x55[_0xdbf0x4]['className'] = 'boxes_grid_list_item hacked'
          } else {
            _0xdbf0x55[_0xdbf0x4]['className'] = 'boxes_grid_list_item open'
          }
        } else {
          _0xdbf0x55[_0xdbf0x4]['className'] = 'boxes_grid_list_item'
        }
      }
    }
  }
}

function boxes_paid_open_box(_0xdbf0x9a) {
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    if (window['player']['boxes'][_0xdbf0x4]['id'] == _0xdbf0x9a) {
      var _0xdbf0x188 = window['player']['boxes'][_0xdbf0x4]
    }
  };
  if (_0xdbf0x188['open_time'] == 0) {
    var _0xdbf0x76 = window['boxes'][_0xdbf0x188['type']]['time'];
    if (_0xdbf0x188['type'] != 0) {
      _0xdbf0x76 -= window['player']['static_resources']['boost_speed_hack_boxes']
    }
  } else {
    var _0xdbf0x76 = _0xdbf0x188['open_time'] - get_current_timestamp()
  };
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  if (_0xdbf0x6 > 0) {
    _0xdbf0x87++
  };
  var _0xdbf0xf8 = _0xdbf0x87 * window['boxes_paid_open_price_1h'];
  if (window['player']['static_resources']['tickets'] >= _0xdbf0xf8) {
    window['player']['static_resources']['tickets'] -= _0xdbf0xf8;
    update_static_resources_tickets();
    if (_0xdbf0x9a == window['box_is_hack']) {
      clearTimeout(window['ubst'])
    };
    show_loader();
    window['player']['achievements']['open_boxes']++;
    server_action_fast('boxes.paid_open', {
      "box": _0xdbf0x9a
    }, 'opened_box')
  } else {
    show_modal_no_tickets()
  }
}

function boxes_open_box(_0xdbf0x9a) {
  var _0xdbf0xf8 = window['boxes_open_price'];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    if (window['player']['boxes'][_0xdbf0x4]['id'] == _0xdbf0x9a) {
      if (window['player']['boxes'][_0xdbf0x4]['type'] == 0) {
        _0xdbf0xf8 = 0;
        window['player']['boxes']['push']({
          "id": window['player']['static_resources']['boxes_id']++,
          "open_time": 0,
          "type": 0
        })
      }
    }
  };
  if (window['player']['static_resources']['encryptions'] >= _0xdbf0xf8) {
    window['player']['static_resources']['encryptions'] -= _0xdbf0xf8;
    if (window['player']['static_resources']['tutorial'] == 14) {
      window['player']['static_resources']['tutorial']++;
      tutorial_arrow_stop();
      document['getElementsByClassName']('boxes_grid_scroll')[0]['getElementsByClassName']('boxes_grid_list_item')[2]['style']['pointerEvents'] = ''
    };
    show_loader();
    window['player']['achievements']['open_boxes']++;
    server_action_fast('boxes.open', {
      "box": _0xdbf0x9a
    }, 'opened_box')
  } else {
    show_modal_no_encryptions()
  }
}

function opened_box(_0xdbf0x12) {
  play_effect('open_box.mp3');
  hide_loader();
  var check_level = 0;
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
  var _0xdbf0x36 = document['getElementsByClassName']('open_box')[0];
  window['player']['achievements']['open_box_' + _0xdbf0x12['open_box_type']]++;
  _0xdbf0x36['getElementsByClassName']('modal_header')[0]['innerHTML'] = window['boxes'][_0xdbf0x12['open_box_type']]['name'];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('boxes_awards_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x192 = {
    "coins": 'Монеты',
    "experience": 'Опыт',
    "tokens": 'Жетоны',
    "supply": 'Снабжение',
    "weapon_0": 'Трассирующие',
    "weapon_1": 'Осколочные',
    "weapon_2": 'Разрывные',
    "weapon_3": 'Зажигательные',
    "weapon_4": 'Фугасные',
    "weapon_5": 'Бронебойные',
    "weapon_6": 'Кумулятивные'
  };
  var _0xdbf0x155 = 0;
  var _0xdbf0x156 = 0;
  var _0xdbf0x193 = 0;
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d == 'coins' || _0xdbf0x7d == 'experience' || _0xdbf0x7d == 'tokens' || _0xdbf0x7d == 'supply' || _0xdbf0x7d == 'weapon_0' || _0xdbf0x7d == 'weapon_1' || _0xdbf0x7d == 'weapon_2' || _0xdbf0x7d == 'weapon_3' || _0xdbf0x7d == 'weapon_4' || _0xdbf0x7d == 'weapon_5' || _0xdbf0x7d == 'weapon_6') {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'boxes_awards_item boxes_awards_type_res';
      var _0xdbf0x8f = document['createElement']('div');
      _0xdbf0x8f['className'] = 'boxes_awards_item_icon';
      var _0xdbf0x90 = document['createElement']('img');
      if (_0xdbf0x7d == 'weapon_0' || _0xdbf0x7d == 'weapon_1' || _0xdbf0x7d == 'weapon_2' || _0xdbf0x7d == 'weapon_3' || _0xdbf0x7d == 'weapon_4' || _0xdbf0x7d == 'weapon_5' || _0xdbf0x7d == 'weapon_6') {
        var _0xdbf0x42 = _0xdbf0x7d['split']('_');
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w' + (parseInt(_0xdbf0x42[1]) + 4) + '-3.png'
      } else {
        if (_0xdbf0x7d == 'coins') {
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/coin_3.png'
        } else {
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/' + _0xdbf0x7d + '_2.png'
        }
      };
      _0xdbf0x8f['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x8f);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = '+' + _0xdbf0x12['box_reward'][_0xdbf0x7d];
      _0xdbf0x15['className'] = 'boxes_awards_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['innerHTML'] = _0xdbf0x192[_0xdbf0x7d];
      _0xdbf0x3d['className'] = 'boxes_awards_item_name';
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      if (_0xdbf0x7d == 'coins') {
        _0xdbf0x156 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
        window['player']['static_resources']['coins'] += _0xdbf0x156;
        window['player']['achievements']['coins'] += _0xdbf0x156
      } else {
        if (_0xdbf0x7d == 'experience') {
          window['player']['experiences']['experience']['amount'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
          check_level = 1
        } else {
          if (_0xdbf0x7d == 'tokens') {
            _0xdbf0x155 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
            window['player']['static_resources']['tokens'] += _0xdbf0x155;
            window['player']['achievements']['tokens'] += _0xdbf0x155
          } else {
            if (_0xdbf0x7d == 'supply') {
              var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
              _0xdbf0x78 += _0xdbf0x12['box_reward'][_0xdbf0x7d];
              window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
              window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
              _0xdbf0x193 = 1
            } else {
              if (_0xdbf0x7d == 'weapon_0') {
                window['player']['static_resources']['weapon_0'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                window['player']['achievements']['weapon_0'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
              } else {
                if (_0xdbf0x7d == 'weapon_1') {
                  window['player']['static_resources']['weapon_1'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                  window['player']['achievements']['weapon_1'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                } else {
                  if (_0xdbf0x7d == 'weapon_2') {
                    window['player']['static_resources']['weapon_2'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                    window['player']['achievements']['weapon_2'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                  } else {
                    if (_0xdbf0x7d == 'weapon_3') {
                      window['player']['static_resources']['weapon_3'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                      window['player']['achievements']['weapon_3'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                    } else {
                      if (_0xdbf0x7d == 'weapon_4') {
                        window['player']['static_resources']['weapon_4'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                        window['player']['achievements']['weapon_4'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                      } else {
                        if (_0xdbf0x7d == 'weapon_5') {
                          window['player']['static_resources']['weapon_5'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                          window['player']['achievements']['weapon_5'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                        } else {
                          if (_0xdbf0x7d == 'weapon_6') {
                            window['player']['static_resources']['weapon_6'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                            window['player']['achievements']['weapon_6'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  if (_0xdbf0x155 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_tokens') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x155;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  if (_0xdbf0x156 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x156;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  var _0xdbf0x194 = 0;
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d != 'coins' && _0xdbf0x7d != 'experience' && _0xdbf0x7d != 'tokens' && _0xdbf0x7d != 'supply' && _0xdbf0x7d != 'weapon_0' && _0xdbf0x7d != 'weapon_1' && _0xdbf0x7d != 'weapon_2' && _0xdbf0x7d != 'weapon_3' && _0xdbf0x7d != 'weapon_4' && _0xdbf0x7d != 'weapon_5' && _0xdbf0x7d != 'weapon_6') {
      var _0xdbf0x42 = _0xdbf0x7d['split']('_');
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'boxes_awards_item boxes_awards_type_' + _0xdbf0x42[1];
      var _0xdbf0x8f = document['createElement']('div');
      _0xdbf0x8f['className'] = 'boxes_awards_item_icon';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/' + _0xdbf0x42[1] + '/' + _0xdbf0x42[2] + '.png';
      _0xdbf0x8f['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x8f);
      var _0xdbf0x16f = document['createElement']('div');
      _0xdbf0x16f['className'] = 'boxes_awards_item_type';
      var _0xdbf0x195 = document['createElement']('img');
      _0xdbf0x195['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/type_' + _0xdbf0x42[1] + '.png';
      _0xdbf0x16f['appendChild'](_0xdbf0x195);
      _0xdbf0x8e['appendChild'](_0xdbf0x16f);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = '+' + _0xdbf0x12['box_reward'][_0xdbf0x7d];
      _0xdbf0x15['className'] = 'boxes_awards_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['innerHTML'] = window['cards'][_0xdbf0x42[1]][_0xdbf0x42[2]]['name'];
      _0xdbf0x3d['className'] = 'boxes_awards_item_name';
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      if (window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]) {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]['count'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
      } else {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]] = {
          "count": _0xdbf0x12['box_reward'][_0xdbf0x7d],
          "get_time": get_current_timestamp(),
          "last_get_time": get_current_timestamp(),
          "level": 0
        };
        window['player']['static_resources']['sut'] += 1;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_sut']['length']; _0xdbf0x4++) {
          if (window['top_sut'][_0xdbf0x4]['id'] == window['game_login']) {
            window['top_sut'][_0xdbf0x4]['static_resources']['sut']++
          }
        };
        if (window['friends_mode'] == 2) {
          window['friends_mode'] = 0;
          change_friends_mode(2)
        };
        document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
        window['player']['static_resources']['boost_free_hit_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w0'];
        window['player']['static_resources']['boost_free_hit_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w1'];
        window['player']['static_resources']['boost_free_hit_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w2'];
        window['player']['static_resources']['boost_weapon_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w3'];
        window['player']['static_resources']['boost_weapon_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w4'];
        window['player']['static_resources']['boost_weapon_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w5'];
        window['player']['static_resources']['boost_weapon_3'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w6'];
        window['player']['static_resources']['boost_weapon_4'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w7'];
        window['player']['static_resources']['boost_weapon_5'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w8'];
        window['player']['static_resources']['boost_weapon_6'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w9']
      }
    };
    _0xdbf0x194++
  };
  document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
  if (_0xdbf0x194 <= 8) {
    show_modal('open_box', 454)
  } else {
    if (_0xdbf0x194 == 9 || _0xdbf0x194 == 10) {
      show_modal('open_box', 563)
    } else {
      if (_0xdbf0x194 == 11 || _0xdbf0x194 == 12) {
        show_modal('open_box', 671)
      } else {
        if (_0xdbf0x194 == 13 || _0xdbf0x194 == 14) {
          show_modal('open_box', 778)
        } else {
          if (_0xdbf0x194 == 15 || _0xdbf0x194 == 16) {
            show_modal('open_box', 886)
          }
        }
      }
    }
  };
  document['getElementById']('modal_close')['onclick'] = function() {
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '5';
    close_open_box(_0xdbf0x12['open_box_id'])
  };
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boxes_awards_button')[0];
  if (window['player']['static_resources']['tutorial'] == 15) {
    _0xdbf0x9f['style']['pointerEvents'] = 'auto'
  };
  _0xdbf0x9f['onclick'] = function() {
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '5';
    close_open_box(_0xdbf0x12['open_box_id'])
  };
  if (_0xdbf0x193 == 1) {
    update_renewable_resources_supply()
  };
  if (_0xdbf0x156 > 0) {
    update_static_resources_coins()
  };
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  update_static_resources_tickets();
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'open_box') {
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += 1;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    }
  };
  if (check_level == 1) {
    update_level(0)
  }
}

function close_open_box(_0xdbf0x9b) {
  if (window['player']['static_resources']['tutorial'] == 15) {
    window['player']['static_resources']['tutorial']++;
    show_tutorial(16)
  };
  hide_modal('open_box');
  var _0xdbf0x7d = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    if (window['player']['boxes'][_0xdbf0x4]['id'] == _0xdbf0x9b) {
      _0xdbf0x7d = _0xdbf0x4
    }
  };
  window['player']['boxes']['splice'](_0xdbf0x7d, 1);
  if (_0xdbf0x7d == window['player']['boxes']['length']) {
    _0xdbf0x7d--
  };
  out_boxes(1, _0xdbf0x7d)
}

function show_modal_no_encryptions() {
  var _0xdbf0x34 = ['supply', 'weapons'];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x34['length']; _0xdbf0x4++) {
    hide_modal(_0xdbf0x34[_0xdbf0x4] + '_block')
  };
  hide_modal2(0);
  window['view_modal'] = 1;
  document['getElementsByClassName']('boss_info')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_encryptions')[0];
  document['getElementById']('btn_buy_encryptions')['onclick'] = function() {
    hide_modal_no_encryptions();
    show_homeland();
    show_shop(0);
    shop_menu('encryptions', 1)
  };
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x35['getElementsByClassName']('modal_close')[0]['onclick'] = hide_modal_no_encryptions
}

function hide_modal_no_encryptions() {
  window['view_modal'] = 0;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_encryptions')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function boxes_start_hack(_0xdbf0x9a) {
  server_action('boxes.hack', {
    "box": _0xdbf0x9a
  });
  started_hack_box(_0xdbf0x9a)
}

function started_hack_box(_0xdbf0x9a) {
  if (_0xdbf0x9a > -1) {
    var _0xdbf0x38 = -1;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
      if (window['player']['boxes'][_0xdbf0x4]['id'] == _0xdbf0x9a) {
        window['player']['boxes'][_0xdbf0x4]['open_time'] = get_current_timestamp() + window['boxes'][window['player']['boxes'][_0xdbf0x4]['type']]['time'];
        if (window['player']['boxes'][_0xdbf0x4]['type'] != 0) {
          window['player']['boxes'][_0xdbf0x4]['open_time'] -= window['player']['static_resources']['boost_speed_hack_boxes']
        };
        _0xdbf0x38 = _0xdbf0x4
      }
    };
    if (_0xdbf0x38 > -1) {
      window['box_is_hack'] = window['player']['boxes'][_0xdbf0x38]['id'];
      window['ubst'] = setInterval(update_boxes_timer, 1000, window['player']['boxes'][_0xdbf0x38]['id']);
      var _0xdbf0x55 = document['getElementsByClassName']('boxes_grid_list')[0]['getElementsByClassName']('boxes_grid_list_item');
      _0xdbf0x55[_0xdbf0x38]['onclick']()
    }
  }
}

function boxes_mode_0() {
  var _0xdbf0x55 = document['getElementsByClassName']('boxes_offers_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['boxes']['length']; _0xdbf0x4++) {
    if (window['boxes'][_0xdbf0x4]['can_buy']) {
      var _0xdbf0x186 = document['createElement']('div');
      _0xdbf0x186['className'] = 'boxes_offers_frame ' + window['boxes'][_0xdbf0x4]['buy_class'];
      _0xdbf0x186['dataset']['btype'] = _0xdbf0x4;
      var _0xdbf0x19c = document['createElement']('div');
      _0xdbf0x19c['innerHTML'] = window['boxes'][_0xdbf0x4]['name'];
      _0xdbf0x19c['className'] = 'boxes_offers_frame_name';
      _0xdbf0x186['appendChild'](_0xdbf0x19c);
      var _0xdbf0x19d = document['createElement']('div');
      _0xdbf0x19d['className'] = 'boxes_offers_frame_line_head';
      var _0xdbf0x19e = document['createElement']('img');
      _0xdbf0x19e['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/boxes_head_line.png';
      _0xdbf0x19d['appendChild'](_0xdbf0x19e);
      _0xdbf0x186['appendChild'](_0xdbf0x19d);
      var _0xdbf0x19f = document['createElement']('div');
      _0xdbf0x19f['className'] = 'boxes_offers_frame_image';
      var _0xdbf0x1a0 = document['createElement']('img');
      _0xdbf0x1a0['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + _0xdbf0x4 + '.png';
      _0xdbf0x19f['appendChild'](_0xdbf0x1a0);
      _0xdbf0x186['appendChild'](_0xdbf0x19f);
      var _0xdbf0x52 = document['createElement']('div');
      _0xdbf0x52['className'] = 'boxes_offers_frame_list';
      var _0xdbf0x1a1 = document['createElement']('div');
      _0xdbf0x1a1['className'] = 'boxes_offers_frame_list_item d-flex';
      var _0xdbf0x1a2 = document['createElement']('div');
      _0xdbf0x1a2['innerHTML'] = 'Карточки';
      _0xdbf0x1a2['className'] = 'boxes_offers_frame_list_label';
      _0xdbf0x1a1['appendChild'](_0xdbf0x1a2);
      var _0xdbf0x1a3 = document['createElement']('div');
      _0xdbf0x1a3['innerHTML'] = window['boxes'][_0xdbf0x4]['reward']['cards'];
      _0xdbf0x1a3['className'] = 'boxes_offers_frame_list_count';
      _0xdbf0x1a1['appendChild'](_0xdbf0x1a3);
      _0xdbf0x52['appendChild'](_0xdbf0x1a1);
      var _0xdbf0x1a4 = document['createElement']('div');
      _0xdbf0x1a4['className'] = 'boxes_offers_frame_list_item d-flex';
      var _0xdbf0x1a5 = document['createElement']('div');
      _0xdbf0x1a5['innerHTML'] = 'Монеты';
      _0xdbf0x1a5['className'] = 'boxes_offers_frame_list_label';
      _0xdbf0x1a4['appendChild'](_0xdbf0x1a5);
      var _0xdbf0x1a6 = document['createElement']('div');
      _0xdbf0x1a6['innerHTML'] = window['boxes'][_0xdbf0x4]['reward']['coins']['min'] + '-' + window['boxes'][_0xdbf0x4]['reward']['coins']['max'];
      _0xdbf0x1a6['className'] = 'boxes_offers_frame_list_count';
      _0xdbf0x1a4['appendChild'](_0xdbf0x1a6);
      _0xdbf0x52['appendChild'](_0xdbf0x1a4);
      var _0xdbf0x1a7 = document['createElement']('div');
      _0xdbf0x1a7['className'] = 'boxes_offers_frame_list_item d-flex';
      var _0xdbf0x1a8 = document['createElement']('div');
      _0xdbf0x1a8['innerHTML'] = 'Опыт';
      _0xdbf0x1a8['className'] = 'boxes_offers_frame_list_label';
      _0xdbf0x1a7['appendChild'](_0xdbf0x1a8);
      var _0xdbf0x1a9 = document['createElement']('div');
      _0xdbf0x1a9['innerHTML'] = window['boxes'][_0xdbf0x4]['reward']['experience']['min'] + '-' + window['boxes'][_0xdbf0x4]['reward']['experience']['max'];
      _0xdbf0x1a9['className'] = 'boxes_offers_frame_list_count';
      _0xdbf0x1a7['appendChild'](_0xdbf0x1a9);
      _0xdbf0x52['appendChild'](_0xdbf0x1a7);
      var _0xdbf0x1aa = document['createElement']('div');
      _0xdbf0x1aa['className'] = 'boxes_offers_frame_list_item d-flex';
      var _0xdbf0x1ab = document['createElement']('div');
      _0xdbf0x1ab['innerHTML'] = 'Жетоны';
      _0xdbf0x1ab['className'] = 'boxes_offers_frame_list_label';
      _0xdbf0x1aa['appendChild'](_0xdbf0x1ab);
      var _0xdbf0x1ac = document['createElement']('div');
      _0xdbf0x1ac['innerHTML'] = window['boxes'][_0xdbf0x4]['reward']['tokens']['min'] + '-' + window['boxes'][_0xdbf0x4]['reward']['tokens']['max'];
      _0xdbf0x1ac['className'] = 'boxes_offers_frame_list_count';
      _0xdbf0x1aa['appendChild'](_0xdbf0x1ac);
      _0xdbf0x52['appendChild'](_0xdbf0x1aa);
      var _0xdbf0x1ad = document['createElement']('div');
      _0xdbf0x1ad['className'] = 'boxes_offers_frame_list_item d-flex';
      var _0xdbf0x1ae = document['createElement']('div');
      _0xdbf0x1ae['innerHTML'] = 'Снабжение';
      _0xdbf0x1ae['className'] = 'boxes_offers_frame_list_label';
      _0xdbf0x1ad['appendChild'](_0xdbf0x1ae);
      var _0xdbf0x1af = document['createElement']('div');
      _0xdbf0x1af['innerHTML'] = window['boxes'][_0xdbf0x4]['reward']['supply']['min'] + '-' + window['boxes'][_0xdbf0x4]['reward']['supply']['max'];
      _0xdbf0x1af['className'] = 'boxes_offers_frame_list_count';
      _0xdbf0x1ad['appendChild'](_0xdbf0x1af);
      _0xdbf0x52['appendChild'](_0xdbf0x1ad);
      _0xdbf0x186['appendChild'](_0xdbf0x52);
      var _0xdbf0x9f = document['createElement']('div');
      _0xdbf0x9f['className'] = 'boxes_offers_frame_button d-flex';
      var _0xdbf0x1b0 = document['createElement']('div');
      _0xdbf0x1b0['innerHTML'] = window['boxes'][_0xdbf0x4]['buy_price'];
      _0xdbf0x1b0['className'] = 'boxes_offers_frame_button_count';
      _0xdbf0x9f['appendChild'](_0xdbf0x1b0);
      var _0xdbf0x1b1 = document['createElement']('div');
      _0xdbf0x1b1['className'] = 'boxes_offers_frame_button_icon';
      var _0xdbf0x1b2 = document['createElement']('img');
      _0xdbf0x1b2['src'] = 'https://cdn.bravegames.space/regiment/images/tickets_interface.png';
      _0xdbf0x1b1['appendChild'](_0xdbf0x1b2);
      _0xdbf0x9f['appendChild'](_0xdbf0x1b1);
      var _0xdbf0x1b3 = document['createElement']('div');
      _0xdbf0x1b3['innerHTML'] = 'Открыть';
      _0xdbf0x1b3['className'] = 'boxes_offers_frame_button_text';
      _0xdbf0x9f['appendChild'](_0xdbf0x1b3);
      _0xdbf0x9f['onclick'] = window['buy_boxes_' + _0xdbf0x4];
      _0xdbf0x186['appendChild'](_0xdbf0x9f);
      _0xdbf0x55['appendChild'](_0xdbf0x186)
    }
  };
  document['getElementsByClassName']('boxes_karkass')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('boxes_offers')[0]['style']['display'] = 'flex';
  document['getElementsByClassName']('boxes_sort_select sort_card')[0]['style']['display'] = 'none';
  var _0xdbf0x9f = document['getElementsByClassName']('boxes_offers_button')[0];
  _0xdbf0x9f['innerHTML'] = 'К ящикам';
  _0xdbf0x9f['className'] = 'boxes_offers_button boxes_offers_back';
  _0xdbf0x9f['onclick'] = function() {
    play_effect('click.mp3');
    boxes_mode_1()
  }
}

function buy_boxes_0() {
  buy_boxes(0)
}

function buy_boxes_1() {
  buy_boxes(1)
}

function buy_boxes_2() {
  buy_boxes(2)
}

function buy_boxes_3() {
  buy_boxes(3)
}

function buy_boxes_4() {
  buy_boxes(4)
}

function buy_boxes_5() {
  buy_boxes(5)
}

function buy_boxes6() {
  buy_boxes(6)
}

function buy_boxes_7() {
  buy_boxes(7)
}

function buy_boxes_8() {
  buy_boxes(8)
}

function buy_boxes_9() {
  buy_boxes(9)
}

function buy_boxes_10() {
  buy_boxes(10)
}

function buy_boxes_11() {
  buy_boxes(11)
}

function buy_boxes_12() {
  buy_boxes(12)
}

function buy_boxes_13() {
  buy_boxes(13)
}

function buy_boxes_14() {
  buy_boxes(14)
}

function boxes_mode_1() {
  document['getElementsByClassName']('boxes_karkass')[0]['style']['display'] = 'flex';
  document['getElementsByClassName']('boxes_offers')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('boxes_sort_select sort_card')[0]['style']['display'] = 'block';
  var _0xdbf0x9f = document['getElementsByClassName']('boxes_offers_button')[0];
  _0xdbf0x9f['innerHTML'] = 'Купить ящики';
  _0xdbf0x9f['className'] = 'boxes_offers_button boxes_offers_buy';
  _0xdbf0x9f['onclick'] = function() {
    play_effect('click.mp3');
    boxes_mode_0()
  }
}

function buy_boxes(_0xdbf0x16f) {
  play_effect('click.mp3');
  if (window['player']['static_resources']['tickets'] >= window['boxes'][_0xdbf0x16f]['buy_price']) {
    window['player']['static_resources']['tickets'] -= window['boxes'][_0xdbf0x16f]['buy_price'];
    show_loader();
    window['player']['achievements']['open_boxes']++;
    server_action_fast('boxes.buy', {
      "type": _0xdbf0x16f
    }, 'purchased_box')
  } else {
    show_modal_no_tickets()
  }
}

function purchased_box(_0xdbf0x12) {
  play_effect('open_box.mp3');
  hide_loader();
  window['player']['static_resources']['boxes_id']++;
  var check_level = 0;
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
  var _0xdbf0x36 = document['getElementsByClassName']('open_box')[0];
  window['player']['achievements']['open_box_' + _0xdbf0x12['open_box_type']]++;
  _0xdbf0x36['getElementsByClassName']('modal_header')[0]['innerHTML'] = window['boxes'][_0xdbf0x12['open_box_type']]['name'];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('boxes_awards_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x192 = {
    "coins": 'Монеты',
    "experience": 'Опыт',
    "tokens": 'Жетоны',
    "supply": 'Снабжение'
  };
  var _0xdbf0x155 = 0;
  var _0xdbf0x156 = 0;
  var _0xdbf0x193 = 0;
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d == 'coins' || _0xdbf0x7d == 'experience' || _0xdbf0x7d == 'tokens' || _0xdbf0x7d == 'supply') {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'boxes_awards_item boxes_awards_type_res';
      var _0xdbf0x8f = document['createElement']('div');
      _0xdbf0x8f['className'] = 'boxes_awards_item_icon';
      var _0xdbf0x90 = document['createElement']('img');
      if (_0xdbf0x7d == 'coins') {
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/coin_3.png'
      } else {
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/' + _0xdbf0x7d + '_2.png'
      };
      _0xdbf0x8f['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x8f);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = '+' + _0xdbf0x12['box_reward'][_0xdbf0x7d];
      _0xdbf0x15['className'] = 'boxes_awards_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['innerHTML'] = _0xdbf0x192[_0xdbf0x7d];
      _0xdbf0x3d['className'] = 'boxes_awards_item_name';
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      if (_0xdbf0x7d == 'coins') {
        _0xdbf0x156 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
        window['player']['static_resources']['coins'] += _0xdbf0x156;
        window['player']['achievements']['coins'] += _0xdbf0x156
      } else {
        if (_0xdbf0x7d == 'experience') {
          window['player']['experiences']['experience']['amount'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
          check_level = 1
        } else {
          if (_0xdbf0x7d == 'tokens') {
            _0xdbf0x155 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
            window['player']['static_resources']['tokens'] += _0xdbf0x155;
            window['player']['achievements']['tokens'] += _0xdbf0x155
          } else {
            if (_0xdbf0x7d == 'supply') {
              var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
              _0xdbf0x78 += _0xdbf0x12['box_reward'][_0xdbf0x7d];
              window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
              window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
              _0xdbf0x193 = 1
            }
          }
        }
      }
    }
  };
  if (_0xdbf0x155 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_tokens') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x155;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  if (_0xdbf0x156 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x156;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  var _0xdbf0x194 = 0;
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d != 'coins' && _0xdbf0x7d != 'experience' && _0xdbf0x7d != 'tokens' && _0xdbf0x7d != 'supply') {
      var _0xdbf0x42 = _0xdbf0x7d['split']('_');
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'boxes_awards_item boxes_awards_type_' + _0xdbf0x42[1];
      var _0xdbf0x8f = document['createElement']('div');
      _0xdbf0x8f['className'] = 'boxes_awards_item_icon';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/' + _0xdbf0x42[1] + '/' + _0xdbf0x42[2] + '.png';
      _0xdbf0x8f['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x8f);
      var _0xdbf0x16f = document['createElement']('div');
      _0xdbf0x16f['className'] = 'boxes_awards_item_type';
      var _0xdbf0x195 = document['createElement']('img');
      _0xdbf0x195['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/type_' + _0xdbf0x42[1] + '.png';
      _0xdbf0x16f['appendChild'](_0xdbf0x195);
      _0xdbf0x8e['appendChild'](_0xdbf0x16f);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = '+' + _0xdbf0x12['box_reward'][_0xdbf0x7d];
      _0xdbf0x15['className'] = 'boxes_awards_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['innerHTML'] = window['cards'][_0xdbf0x42[1]][_0xdbf0x42[2]]['name'];
      _0xdbf0x3d['className'] = 'boxes_awards_item_name';
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      if (window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]) {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]['count'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
      } else {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]] = {
          "count": _0xdbf0x12['box_reward'][_0xdbf0x7d],
          "get_time": get_current_timestamp(),
          "last_get_time": get_current_timestamp(),
          "level": 0
        };
        window['player']['static_resources']['sut'] += 1;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_sut']['length']; _0xdbf0x4++) {
          if (window['top_sut'][_0xdbf0x4]['id'] == window['game_login']) {
            window['top_sut'][_0xdbf0x4]['static_resources']['sut']++
          }
        };
        if (window['friends_mode'] == 2) {
          window['friends_mode'] = 0;
          change_friends_mode(2)
        };
        document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
        window['player']['static_resources']['boost_free_hit_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w0'];
        window['player']['static_resources']['boost_free_hit_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w1'];
        window['player']['static_resources']['boost_free_hit_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w2'];
        window['player']['static_resources']['boost_weapon_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w3'];
        window['player']['static_resources']['boost_weapon_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w4'];
        window['player']['static_resources']['boost_weapon_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w5'];
        window['player']['static_resources']['boost_weapon_3'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w6'];
        window['player']['static_resources']['boost_weapon_4'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w7'];
        window['player']['static_resources']['boost_weapon_5'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w8'];
        window['player']['static_resources']['boost_weapon_6'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w9']
      }
    };
    _0xdbf0x194++
  };
  if (_0xdbf0x194 <= 8) {
    show_modal('open_box', 454)
  } else {
    if (_0xdbf0x194 == 9 || _0xdbf0x194 == 10) {
      show_modal('open_box', 563)
    } else {
      if (_0xdbf0x194 == 11 || _0xdbf0x194 == 12) {
        show_modal('open_box', 671)
      } else {
        if (_0xdbf0x194 == 13 || _0xdbf0x194 == 14) {
          show_modal('open_box', 778)
        } else {
          if (_0xdbf0x194 == 15 || _0xdbf0x194 == 16) {
            show_modal('open_box', 886)
          }
        }
      }
    }
  };
  document['getElementById']('modal_close')['onclick'] = function() {
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '5';
    hide_modal('open_box');
    out_boxes(0, 0);
    boxes_mode_0()
  };
  _0xdbf0x36['getElementsByClassName']('boxes_awards_button')[0]['onclick'] = function() {
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '5';
    hide_modal('open_box');
    out_boxes(0, 0);
    boxes_mode_0()
  };
  if (_0xdbf0x193 == 1) {
    update_renewable_resources_supply()
  };
  if (_0xdbf0x156 > 0) {
    update_static_resources_coins()
  };
  if (_0xdbf0x155 > 0) {
    if (window['player']['settings']['resource'] == 0) {
      change_resource('tokens', 0)
    } else {
      change_resource('encryptions', 0)
    }
  };
  update_static_resources_tickets();
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'open_box') {
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += 1;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    }
  };
  if (check_level == 1) {
    update_level(0)
  }
}

function show_buy_weapons_0() {
  show_buy_weapons(0)
}

function show_buy_weapons_1() {
  show_buy_weapons(1)
}

function show_buy_weapons_2() {
  show_buy_weapons(2)
}

function show_buy_weapons_3() {
  show_buy_weapons(3)
}

function show_buy_weapons_4() {
  show_buy_weapons(4)
}

function show_buy_weapons_5() {
  show_buy_weapons(5)
}

function show_buy_weapons_6() {
  show_buy_weapons(6)
}

function show_buy_weapons(_0xdbf0x1ce) {
  play_effect('click.mp3');
  hide_modal('weapons_block');
  var _0xdbf0x36 = document['getElementsByClassName']('weapons_buy_block')[0];
  _0xdbf0x36['getElementsByClassName']('shop_header')[0]['innerHTML'] = window['buy_weapons'][_0xdbf0x1ce]['name'];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('shop_resourse_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  for (var _0xdbf0x4 = window['buy_weapons'][_0xdbf0x1ce]['lots']['length'] - 1; _0xdbf0x4 >= 0; _0xdbf0x4--) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'shop_resourse_item';
    var _0xdbf0x1cf = document['createElement']('div');
    _0xdbf0x1cf['className'] = 'shop_resourse_item_sale';
    var _0xdbf0x1d0 = document['createElement']('img');
    _0xdbf0x1d0['src'] = 'https://cdn.bravegames.space/regiment/images/shop_sale.png';
    _0xdbf0x1cf['appendChild'](_0xdbf0x1d0);
    _0xdbf0x8e['appendChild'](_0xdbf0x1cf);
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'shop_resourse_item_icon';
    var _0xdbf0x1d1 = document['createElement']('img');
    _0xdbf0x1d1['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w' + (_0xdbf0x1ce + 4) + '-' + _0xdbf0x4 + '.png';
    _0xdbf0x8f['appendChild'](_0xdbf0x1d1);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0x15 = document['createElement']('div');
    _0xdbf0x15['className'] = 'shop_resourse_item_count';
    _0xdbf0x15['innerHTML'] = '+' + window['buy_weapons'][_0xdbf0x1ce]['lots'][_0xdbf0x4]['count'];
    _0xdbf0x8e['appendChild'](_0xdbf0x15);
    var _0xdbf0xf8 = document['createElement']('div');
    _0xdbf0xf8['className'] = 'shop_resourse_item_price';
    _0xdbf0xf8['innerHTML'] = word_form(window['buy_weapons'][_0xdbf0x1ce]['lots'][_0xdbf0x4]['price'], 'жетон', 'жетона', 'жетонов');
    _0xdbf0x8e['appendChild'](_0xdbf0xf8);
    _0xdbf0x8e['dataset']['weapon'] = _0xdbf0x1ce;
    _0xdbf0x8e['dataset']['mode'] = _0xdbf0x4;
    _0xdbf0x8e['onclick'] = buy_weapons_act;
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  show_modal('weapons_buy_block', 460);
  document['getElementById']('modal_close')['onclick'] = function() {
    hide_modal('weapons_buy_block');
    show_weapons()
  }
}

function buy_weapons_act() {
  var _0xdbf0x1ce = parseInt(this['dataset']['weapon']);
  var _0xdbf0x5d = parseInt(this['dataset']['mode']);
  var _0xdbf0x71 = document['getElementsByClassName']('weapons_buy_block')[0];
  var _0xdbf0x36 = document['createElement']('div');
  _0xdbf0x36['className'] = 'weapons_buy_block_animation position_' + _0xdbf0x5d;
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w' + (_0xdbf0x1ce + 4) + '-' + _0xdbf0x5d + '.png';
  _0xdbf0x36['appendChild'](_0xdbf0x90);
  _0xdbf0x71['appendChild'](_0xdbf0x36);
  animation(_0xdbf0x36, 'opacity', 0, 1, 0, 500, 'buy_weapons_animation');
  if (window['player']['static_resources']['tokens'] >= window['buy_weapons'][_0xdbf0x1ce]['lots'][_0xdbf0x5d]['price']) {
    window['player']['static_resources']['weapon_' + _0xdbf0x1ce] += window['buy_weapons'][_0xdbf0x1ce]['lots'][_0xdbf0x5d]['count'];
    window['player']['static_resources']['tokens'] -= window['buy_weapons'][_0xdbf0x1ce]['lots'][_0xdbf0x5d]['price'];
    window['player']['achievements']['weapon_' + _0xdbf0x1ce] += window['buy_weapons'][_0xdbf0x1ce]['lots'][_0xdbf0x5d]['count'];
    if (window['player']['settings']['resource'] == 0) {
      change_resource('tokens', 0)
    } else {
      change_resource('encryptions', 0)
    };
    play_effect('shop_buy_2.mp3');
    server_action('weapons.buy', {
      "weapon": _0xdbf0x1ce,
      "mode": _0xdbf0x5d
    })
  } else {
    hide_modal('weapons_buy_block');
    show_modal_no_tokens()
  }
}

function buy_weapons_animation(_0xdbf0xa2) {
  var _0xdbf0x1d4 = _0xdbf0xa2['className']['split'](' ');
  if (_0xdbf0x1d4[1] == 'position_0') {
    animation(_0xdbf0xa2, 'top', 228, 510, 1, 1000, '');
    animation(_0xdbf0xa2, 'left', 347, 182, 1, 1000, 'buy_weapons_clear_animation')
  } else {
    if (_0xdbf0x1d4[1] == 'position_1') {
      animation(_0xdbf0xa2, 'top', 228, 510, 1, 1000, '');
      animation(_0xdbf0xa2, 'left', 237, 182, 1, 1000, 'buy_weapons_clear_animation')
    } else {
      if (_0xdbf0x1d4[1] == 'position_2') {
        animation(_0xdbf0xa2, 'top', 228, 510, 1, 1000, '');
        animation(_0xdbf0xa2, 'left', 127, 182, 1, 1000, 'buy_weapons_clear_animation')
      } else {
        if (_0xdbf0x1d4[1] == 'position_3') {
          animation(_0xdbf0xa2, 'top', 228, 510, 1, 1000, '');
          animation(_0xdbf0xa2, 'left', 17, 182, 1, 1000, 'buy_weapons_clear_animation')
        } else {
          if (_0xdbf0x1d4[1] == 'position_4') {
            animation(_0xdbf0xa2, 'top', 82, 510, 1, 1000, '');
            animation(_0xdbf0xa2, 'left', 347, 182, 1, 1000, 'buy_weapons_clear_animation')
          } else {
            if (_0xdbf0x1d4[1] == 'position_5') {
              animation(_0xdbf0xa2, 'top', 82, 510, 1, 1000, '');
              animation(_0xdbf0xa2, 'left', 237, 182, 1, 1000, 'buy_weapons_clear_animation')
            } else {
              if (_0xdbf0x1d4[1] == 'position_6') {
                animation(_0xdbf0xa2, 'top', 82, 510, 1, 1000, '');
                animation(_0xdbf0xa2, 'left', 127, 182, 1, 1000, 'buy_weapons_clear_animation')
              } else {
                if (_0xdbf0x1d4[1] == 'position_7') {
                  animation(_0xdbf0xa2, 'top', 82, 510, 1, 1000, '');
                  animation(_0xdbf0xa2, 'left', 17, 182, 1, 1000, 'buy_weapons_clear_animation')
                }
              }
            }
          }
        }
      }
    }
  }
}

function buy_weapons_clear_animation(_0xdbf0xa2) {
  _0xdbf0xa2['parentNode']['removeChild'](_0xdbf0xa2)
}

function show_shop(_0xdbf0x10f) {
  if (_0xdbf0x10f != 1) {
    play_effect('click.mp3')
  };
  play_music('background.mp3');
  window['loc_page'] = '';
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('bosses_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('missions_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('sector_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('hangar_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('boxes_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('package_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('calendar')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('boss_fight')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer_hangar')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer_boss_fight')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('friend_profile')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('my_profile')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('talents')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('subscription_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('shop_block')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('friends_block')[0]['style']['display'] = 'block';
  var _0xdbf0x36 = document['getElementsByClassName']('main')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['className'] = 'main shop';
  document['getElementsByClassName']('shop_block')[0]['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
    play_effect('click.mp3');
    show_homeland()
  };
  document['getElementsByClassName']('supply_buy')[0]['onclick'] = function() {
    shop_menu('supply', 0)
  };
  document['getElementsByClassName']('tokens_buy')[0]['onclick'] = function() {
    shop_menu('tokens', 0)
  };
  document['getElementsByClassName']('encryptions_buy')[0]['onclick'] = function() {
    shop_menu('encryptions', 0)
  };
  document['getElementsByClassName']('coins_buy')[0]['onclick'] = function() {
    shop_menu('coins', 0)
  };
  document['getElementsByClassName']('tickets_buy')[0]['onclick'] = function() {
    shop_menu('tickets', 0)
  };
  document['getElementsByClassName']('package_buy')[0]['onclick'] = show_package;
  var _0xdbf0x55 = document['getElementsByClassName']('shop_menu')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['onclick'] = change_tab_shop
  }
}

function change_tab_shop() {
  var _0xdbf0x10b = ['coins', 'supply', 'encryptions', 'tokens', 'tickets'];
  shop_menu(_0xdbf0x10b[this['dataset']['iid']], 0)
}

function show_package() {
  play_effect('click.mp3');
  document['getElementsByClassName']('shop_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('package_block')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('main')[0]['className'] = 'main package';
  var _0xdbf0x36 = document['getElementsByClassName']('package_block')[0];
  _0xdbf0x36['getElementsByClassName']('modal_close')[0]['onclick'] = hide_package;
  document['getElementById']('package_box_button')['onclick'] = get_package_slow;
  var _0xdbf0x188 = document['getElementsByClassName']('package_box')[0];
  _0xdbf0x188['className'] = 'package_box';
  var _0xdbf0x16d = _0xdbf0x36['getElementsByClassName']('package_box_award')[0];
  while (_0xdbf0x16d['firstChild']) {
    _0xdbf0x16d['removeChild'](_0xdbf0x16d['firstChild'])
  };
  var _0xdbf0x1d9 = _0xdbf0x36['getElementsByClassName']('package_rays_block')[0];
  _0xdbf0x1d9['style']['height'] = '0px';
  _0xdbf0x1d9['style']['opacity'] = '0'
}

function get_package_slow() {
  if (get_package_slow['clicked']) {
    return
  } else {
    get_package_slow['clicked'] = true;
    get_package();
    setTimeout(() => {
      get_package_slow['clicked'] = false
    }, 300)
  }
}

function get_package() {
  play_effect('open_package.mp3');
  if (window['player']['static_resources']['encryptions'] >= window['package_price']) {
    show_loader_no_shadow();
    window['player']['achievements']['open_package']++;
    server_action_fast('package.open', {}, 'package_opened');
    window['player']['static_resources']['encryptions'] -= window['package_price'];
    if (window['player']['settings']['resource'] == 0) {
      change_resource('tokens', 0)
    } else {
      change_resource('encryptions', 0)
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'parcel') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4]++;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  } else {
    show_modal_no_encryptions()
  }
}

function package_opened(_0xdbf0x12) {
  hide_loader();
  var _0xdbf0x36 = document['getElementsByClassName']('package_block')[0];
  var _0xdbf0x16d = _0xdbf0x36['getElementsByClassName']('package_box_award')[0];
  while (_0xdbf0x16d['firstChild']) {
    _0xdbf0x16d['removeChild'](_0xdbf0x16d['firstChild'])
  };
  if (_0xdbf0x12['package_reward']['coins'] && _0xdbf0x12['package_reward']['coins'] > 0) {
    var _0xdbf0x54 = document['createElement']('div');
    _0xdbf0x54['className'] = 'package_box_coin';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/coin_interface.png';
    _0xdbf0x54['appendChild'](_0xdbf0x90);
    var _0xdbf0x137 = document['createElement']('span');
    _0xdbf0x137['innerHTML'] = _0xdbf0x12['package_reward']['coins'];
    _0xdbf0x54['appendChild'](_0xdbf0x137);
    _0xdbf0x16d['appendChild'](_0xdbf0x54);
    window['player']['static_resources']['coins'] += _0xdbf0x12['package_reward']['coins'];
    update_static_resources_coins()
  };
  if (_0xdbf0x12['package_reward']['experience'] && _0xdbf0x12['package_reward']['experience'] > 0) {
    var _0xdbf0x1dd = document['createElement']('div');
    _0xdbf0x1dd['className'] = 'package_box_exp';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/experience_2.png';
    _0xdbf0x1dd['appendChild'](_0xdbf0x90);
    var _0xdbf0x137 = document['createElement']('span');
    _0xdbf0x137['innerHTML'] = _0xdbf0x12['package_reward']['experience'];
    _0xdbf0x1dd['appendChild'](_0xdbf0x137);
    _0xdbf0x16d['appendChild'](_0xdbf0x1dd);
    window['player']['experiences']['experience']['amount'] += _0xdbf0x12['package_reward']['experience'];
    update_level(0)
  };
  var _0xdbf0x1de = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 7; _0xdbf0x4++) {
    if (_0xdbf0x12['package_reward']['weapon_' + _0xdbf0x4] && _0xdbf0x12['package_reward']['weapon_' + _0xdbf0x4] > 0) {
      var _0xdbf0x1ce = document['createElement']('div');
      _0xdbf0x1ce['className'] = 'package_box_weapon';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/w' + (_0xdbf0x4 + 4) + '-medium.png';
      _0xdbf0x1ce['appendChild'](_0xdbf0x90);
      var _0xdbf0x137 = document['createElement']('span');
      _0xdbf0x137['innerHTML'] = _0xdbf0x12['package_reward']['weapon_' + _0xdbf0x4];
      _0xdbf0x1ce['appendChild'](_0xdbf0x137);
      _0xdbf0x16d['appendChild'](_0xdbf0x1ce);
      window['player']['static_resources']['weapon_' + _0xdbf0x4] += _0xdbf0x12['package_reward']['weapon_' + _0xdbf0x4];
      window['player']['achievements']['weapon_' + _0xdbf0x4] += _0xdbf0x12['package_reward']['weapon_' + _0xdbf0x4];
      _0xdbf0x1de = 1
    }
  };
  if (_0xdbf0x12['package_reward']['supply'] && _0xdbf0x12['package_reward']['supply'] > 0) {
    var _0xdbf0x59 = document['createElement']('div');
    _0xdbf0x59['className'] = 'package_box_supply';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/supply_interface.png';
    _0xdbf0x59['appendChild'](_0xdbf0x90);
    var _0xdbf0x137 = document['createElement']('span');
    _0xdbf0x137['innerHTML'] = _0xdbf0x12['package_reward']['supply'];
    _0xdbf0x59['appendChild'](_0xdbf0x137);
    _0xdbf0x16d['appendChild'](_0xdbf0x59);
    var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
    _0xdbf0x78 += _0xdbf0x12['package_reward']['supply'];
    window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
    window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
    update_renewable_resources_supply();
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x12['package_reward']['supply'];
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  var _0xdbf0x123 = {};
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 0; _0xdbf0x4 < 60; _0xdbf0x4++) {
    if (_0xdbf0x12['package_reward']['collection_' + _0xdbf0x4] && _0xdbf0x12['package_reward']['collection_' + _0xdbf0x4] > 0) {
      var _0xdbf0x1df = document['createElement']('div');
      _0xdbf0x1df['className'] = 'package_box_col_' + _0xdbf0x38;
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/collection/' + _0xdbf0x4 + '.png';
      _0xdbf0x90['style']['width'] = '65px';
      _0xdbf0x1df['appendChild'](_0xdbf0x90);
      _0xdbf0x16d['appendChild'](_0xdbf0x1df);
      _0xdbf0x123[_0xdbf0x38] = _0xdbf0x1df;
      _0xdbf0x38++;
      window['player']['collections'][_0xdbf0x4]['amount']++
    }
  };
  var _0xdbf0x1e0 = {};
  var _0xdbf0x1e1 = 0;
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 0; _0xdbf0x4 < 375; _0xdbf0x4++) {
    if (_0xdbf0x12['package_reward']['card_1_' + _0xdbf0x4] && _0xdbf0x12['package_reward']['card_1_' + _0xdbf0x4] > 0) {
      var _0xdbf0x1e2 = document['createElement']('div');
      _0xdbf0x1e2['className'] = 'package_box_card package_box_card_' + _0xdbf0x38 + ' package_card_type_1';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/1/' + _0xdbf0x4 + '.png';
      _0xdbf0x1e2['appendChild'](_0xdbf0x90);
      var _0xdbf0x137 = document['createElement']('span');
      _0xdbf0x137['innerHTML'] = _0xdbf0x12['package_reward']['card_1_' + _0xdbf0x4];
      _0xdbf0x1e2['appendChild'](_0xdbf0x137);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['className'] = 'package_box_card_name';
      _0xdbf0x3d['innerHTML'] = window['cards'][1][_0xdbf0x4]['name'];
      _0xdbf0x1e2['appendChild'](_0xdbf0x3d);
      _0xdbf0x16d['appendChild'](_0xdbf0x1e2);
      _0xdbf0x1e0[_0xdbf0x38] = _0xdbf0x1e2;
      _0xdbf0x38++;
      if (window['player']['hangar'][1][_0xdbf0x4]) {
        window['player']['hangar'][1][_0xdbf0x4]['count'] += _0xdbf0x12['package_reward']['card_1_' + _0xdbf0x4]
      } else {
        window['player']['hangar'][1][_0xdbf0x4] = {
          "count": _0xdbf0x12['package_reward']['card_1_' + _0xdbf0x4],
          "get_time": get_current_timestamp(),
          "last_get_time": get_current_timestamp(),
          "level": 0
        };
        window['player']['static_resources']['sut'] += 1;
        for (var _0xdbf0xdd = 0; _0xdbf0xdd < window['top_sut']['length']; _0xdbf0xdd++) {
          if (window['top_sut'][_0xdbf0xdd]['id'] == window['game_login']) {
            window['top_sut'][_0xdbf0xdd]['static_resources']['sut']++
          }
        };
        if (window['friends_mode'] == 2) {
          window['friends_mode'] = 0;
          change_friends_mode(2)
        };
        document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
        window['player']['static_resources']['boost_free_hit_0'] += window['cards_upgrade'][1][0]['w0'];
        window['player']['static_resources']['boost_free_hit_1'] += window['cards_upgrade'][1][0]['w1'];
        window['player']['static_resources']['boost_free_hit_2'] += window['cards_upgrade'][1][0]['w2'];
        window['player']['static_resources']['boost_weapon_0'] += window['cards_upgrade'][1][0]['w3'];
        window['player']['static_resources']['boost_weapon_1'] += window['cards_upgrade'][1][0]['w4'];
        window['player']['static_resources']['boost_weapon_2'] += window['cards_upgrade'][1][0]['w5'];
        window['player']['static_resources']['boost_weapon_3'] += window['cards_upgrade'][1][0]['w6'];
        window['player']['static_resources']['boost_weapon_4'] += window['cards_upgrade'][1][0]['w7'];
        window['player']['static_resources']['boost_weapon_5'] += window['cards_upgrade'][1][0]['w8'];
        window['player']['static_resources']['boost_weapon_6'] += window['cards_upgrade'][1][0]['w9'];
        _0xdbf0x1e1++
      }
    }
  };
  var _0xdbf0x188 = _0xdbf0x36['getElementsByClassName']('package_box')[0];
  var _0xdbf0x1d9 = _0xdbf0x36['getElementsByClassName']('package_rays_block')[0];
  var _0xdbf0x1e3 = _0xdbf0x36['getElementsByClassName']('package_box_cover')[0];
  if (_0xdbf0x188['className'] == 'package_box') {
    animation(_0xdbf0x1e3, 'top', 109, -240, 1, 400, '');
    animation(_0xdbf0x1d9, 'height', 0, 266, 1, 10, '');
    animation(_0xdbf0x1d9, 'opacity', 0, 0.8, 0, 500, '');
    _0xdbf0x188['className'] = 'package_box open_package_box'
  };
  animation(_0xdbf0x54, 'top', 226, 166, 1, 500, '');
  animation(_0xdbf0x54, 'left', 380, 490, 1, 500, '');
  animation(_0xdbf0x54, 'opacity', 0, 1, 0, 800, '');
  animation(_0xdbf0x1dd, 'top', 176, 66, 1, 500, '');
  animation(_0xdbf0x1dd, 'left', 355, 430, 1, 500, '');
  animation(_0xdbf0x1dd, 'opacity', 0, 1, 0, 800, '');
  if (_0xdbf0x1de == 1) {
    animation(_0xdbf0x1ce, 'top', 213, 130, 1, 500, '');
    animation(_0xdbf0x1ce, 'left', 370, 260, 1, 500, '');
    animation(_0xdbf0x1ce, 'opacity', 0, 1, 0, 800, '')
  };
  animation(_0xdbf0x59, 'top', 226, 38, 1, 500, '');
  animation(_0xdbf0x59, 'left', 374, 242, 1, 500, '');
  animation(_0xdbf0x59, 'opacity', 0, 1, 0, 800, '');
  if (_0xdbf0x123[0]) {
    animation(_0xdbf0x123[0], 'top', 202, 130, 1, 500, '');
    animation(_0xdbf0x123[0], 'left', 374, 360, 1, 500, '');
    animation(_0xdbf0x123[0], 'opacity', 0, 1, 0, 800, '')
  };
  if (_0xdbf0x123[1]) {
    animation(_0xdbf0x123[1], 'top', 202, 10, 1, 500, '');
    animation(_0xdbf0x123[1], 'left', 374, 370, 1, 500, '');
    animation(_0xdbf0x123[1], 'opacity', 0, 1, 0, 800, '')
  };
  if (_0xdbf0x123[2]) {
    animation(_0xdbf0x123[2], 'top', 202, 70, 1, 500, '');
    animation(_0xdbf0x123[2], 'left', 374, 329, 1, 500, '');
    animation(_0xdbf0x123[2], 'opacity', 0, 1, 0, 800, '')
  };
  if (_0xdbf0x123[3]) {
    animation(_0xdbf0x123[3], 'top', 202, 10, 1, 500, '');
    animation(_0xdbf0x123[3], 'left', 374, 460, 1, 500, '');
    animation(_0xdbf0x123[3], 'opacity', 0, 1, 0, 800, '')
  };
  if (_0xdbf0x123[4]) {
    animation(_0xdbf0x123[4], 'top', 202, 30, 1, 500, '');
    animation(_0xdbf0x123[4], 'left', 374, 540, 1, 500, '');
    animation(_0xdbf0x123[4], 'opacity', 0, 1, 0, 800, '')
  };
  if (_0xdbf0x1e0[0]) {
    animation(_0xdbf0x1e0[0], 'opacity', 0, 1, 0, 400, '')
  };
  if (_0xdbf0x1e0[1]) {
    animation(_0xdbf0x1e0[1], 'opacity', 0, 1, 0, 400, '')
  };
  if (_0xdbf0x1e0[2]) {
    animation(_0xdbf0x1e0[2], 'opacity', 0, 1, 0, 400, '')
  };
  if (_0xdbf0x1e0[3]) {
    animation(_0xdbf0x1e0[3], 'opacity', 0, 1, 0, 400, '')
  }
}

function hide_package() {
  play_effect('click.mp3');
  document['getElementsByClassName']('shop_block')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('package_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('main')[0]['className'] = 'main shop'
}

function shop_menu(_0xdbf0x8e, _0xdbf0x10f) {
  if (_0xdbf0x10f != 1) {
    play_effect('click.mp3')
  };
  show_modal('shop_buy_block', 460);
  var _0xdbf0x55 = document['getElementsByClassName']('shop_buy_block_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['style']['display'] = 'none'
  };
  var _0xdbf0x36 = document['getElementsByClassName'](_0xdbf0x8e + '_buy_block')[0];
  _0xdbf0x36['style']['display'] = 'block';
  var _0xdbf0x55 = document['getElementsByClassName']('shop_menu')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = ''
  };
  var _0xdbf0x10b = {
    "coins": 0,
    "supply": 1,
    "encryptions": 2,
    "tokens": 3,
    "tickets": 4
  };
  _0xdbf0x55[_0xdbf0x10b[_0xdbf0x8e]]['className'] = 'active';
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('shop_resourse_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  for (var _0xdbf0x4 = window['shop_resources'][_0xdbf0x8e]['length'] - 1; _0xdbf0x4 >= 0; _0xdbf0x4--) {
    var _0xdbf0xa2 = document['createElement']('div');
    _0xdbf0xa2['className'] = 'shop_resourse_item';
    var _0xdbf0x1cf = document['createElement']('div');
    _0xdbf0x1cf['className'] = 'shop_resourse_item_sale';
    var _0xdbf0x1e6 = document['createElement']('img');
    _0xdbf0x1e6['src'] = 'https://cdn.bravegames.space/regiment/images/shop_sale.png';
    _0xdbf0x1cf['appendChild'](_0xdbf0x1e6);
    _0xdbf0xa2['appendChild'](_0xdbf0x1cf);
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'shop_resourse_item_icon';
    var _0xdbf0x1e7 = document['createElement']('img');
    if (_0xdbf0x8e == 'coins') {
      var _0xdbf0xb = 'coin'
    } else {
      var _0xdbf0xb = _0xdbf0x8e
    };
    _0xdbf0x1e7['src'] = 'https://cdn.bravegames.space/regiment/images/icons/' + _0xdbf0xb + '_' + _0xdbf0x4 + '.png';
    _0xdbf0x8f['appendChild'](_0xdbf0x1e7);
    _0xdbf0xa2['appendChild'](_0xdbf0x8f);
    var _0xdbf0xa6 = document['createElement']('div');
    _0xdbf0xa6['innerHTML'] = '+' + window['shop_resources'][_0xdbf0x8e][_0xdbf0x4]['amount']['toLocaleString']();
    _0xdbf0xa6['className'] = 'shop_resourse_item_count';
    _0xdbf0xa2['appendChild'](_0xdbf0xa6);
    var _0xdbf0xf8 = document['createElement']('div');
    _0xdbf0xf8['innerHTML'] = word_form(window['shop_resources'][_0xdbf0x8e][_0xdbf0x4]['price'], 'голос', 'голоса', 'голосов');
    _0xdbf0xf8['className'] = 'shop_resourse_item_price';
    _0xdbf0xa2['appendChild'](_0xdbf0xf8);
    _0xdbf0xa2['dataset']['item'] = _0xdbf0x8e + '_' + _0xdbf0x4;
    _0xdbf0xa2['onclick'] = shop_buy;
    _0xdbf0x55['appendChild'](_0xdbf0xa2)
  }
}

function shop_buy() {
  buy_item(this['dataset']['item'])
}

function buy_item(_0xdbf0x8e) {
  var _0xdbf0x46 = {
    "type": 'item',
    "item": _0xdbf0x8e
  };
  VK['callMethod']('showOrderBox', _0xdbf0x46);
  VK['addCallback']('onOrderSuccess', function(_0xdbf0x1ea) {
    play_effect('shop_buy.mp3');
    var _0xdbf0x12 = _0xdbf0x8e['split']('_');
    switch (_0xdbf0x12[0]) {
      case 'coins':
        window['player']['static_resources']['coins'] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
        update_static_resources_coins();
        window['player']['achievements']['coins'] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
            window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
            if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
              window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
              window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
            }
          }
        };
        break;
      case 'supply':
        var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
        _0xdbf0x78 += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
        window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
        window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
        update_renewable_resources_supply();
        break;
      case 'encryptions':
        window['player']['static_resources']['encryptions'] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
        if (window['player']['settings']['resource'] == 0) {
          change_resource('tokens', 0)
        } else {
          change_resource('encryptions', 0)
        };
        window['player']['achievements']['encryptions'] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
        break;
      case 'tokens':
        window['player']['static_resources']['tokens'] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
        if (window['player']['settings']['resource'] == 0) {
          change_resource('tokens', 0)
        } else {
          change_resource('encryptions', 0)
        };
        window['player']['achievements']['tokens'] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_tokens') {
            window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
            if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
              window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
              window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
            }
          }
        };
        break;
      case 'tickets':
        window['player']['static_resources']['tickets'] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
        update_static_resources_tickets();
        window['player']['achievements']['tickets'] += window['shop_resources'][_0xdbf0x12[0]][_0xdbf0x12[1]]['amount'];
        break
    };
    server_action('shop.buy', {
      "order": _0xdbf0x1ea
    })
  })
}

function show_hangar() {
  play_effect('click.mp3');
  play_music('background.mp3');
  window['loc_page'] = '';
  if (window['player']['static_resources']['tutorial'] == 17) {
    tutorial_arrow_stop();
    document['getElementsByClassName']('hangar_block')[0]['getElementsByClassName']('modal_close')[0]['style']['display'] = 'none';
    window['player']['static_resources']['tutorial']++;
    show_tutorial(18)
  };
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('bosses_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('hangar_block')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer_hangar')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('friends_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('main')[0]['className'] = 'main hangar';
  document['getElementsByClassName']('hangar_block')[0]['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
    play_effect('click.mp3');
    show_homeland()
  };
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_sort_select sort_type')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = '';
    _0xdbf0x55[_0xdbf0x4]['onclick'] = window['set_type_hangar_' + _0xdbf0x4]
  };
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_sort_select sort_country')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = '';
    _0xdbf0x55[_0xdbf0x4]['onclick'] = window['set_country_hangar_' + _0xdbf0x4]
  };
  var _0xdbf0x36 = document['getElementsByClassName']('hangar_sort_select sort_card')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = '';
    _0xdbf0x55[_0xdbf0x4]['onclick'] = window['sort_hangar_' + _0xdbf0x4]
  };
  _0xdbf0x55[0]['className'] = 'active';
  _0xdbf0x36['getElementsByTagName']('label')[0]['innerHTML'] = 'Сортировка по времени';
  var _0xdbf0x9f = document['getElementById']('sort_hangar');
  _0xdbf0x9f['onclick'] = hangar_btn_sort_type;
  var _0xdbf0x9c = document['getElementsByClassName']('hangar_sort_select search_card')[0]['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '';
  _0xdbf0x9c['oninput'] = hangar_search_input;
  document['getElementsByClassName']('clear')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('hangar_sorting_block')[0]['getElementsByClassName']('button_wide')[0]['onclick'] = check_subscription;
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_weapons_list')[0]['getElementsByClassName']('hangar_weapons_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
    _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
  };
  for (var _0xdbf0x4 = 3, _0xdbf0x38 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0xea = window['weapons_damage'][_0xdbf0x38]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x38];
    _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
  };
  window['hangar_next'] = 0;
  out_hangar_card(1, 0, 1, -1)
}

function check_subscription() {
  if (window['player']['subscription'] && window['player']['subscription']['paid_time'] > get_current_timestamp()) {
    show_upgrade_all()
  } else {
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
    document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
    var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
    _0xdbf0x35['style']['display'] = 'block';
    var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('need_subscription')[0];
    _0xdbf0x36['style']['display'] = 'block';
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('need_subscription_button')[0];
    _0xdbf0x9f['onclick'] = hide_need_subscription
  }
}

function hide_need_subscription() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('need_subscription')[0];
  _0xdbf0x36['style']['display'] = 'none';
  show_homeland();
  show_subscription()
}

function show_upgrade_all() {
  play_effect('click.mp3');
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0];
  _0xdbf0x36['style']['display'] = 'block';
  var _0xdbf0x5d = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_select')[0];
  var _0xdbf0x1ef = _0xdbf0x5d['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1ef['length']; _0xdbf0x4++) {
    _0xdbf0x1ef[_0xdbf0x4]['onclick'] = window['set_mode_hangar_upgrade_all_' + _0xdbf0x4]
  };
  _0xdbf0x1ef[0]['onclick']();
  var _0xdbf0x1f0 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_level_first')[0];
  var _0xdbf0x9c = _0xdbf0x1f0['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '1';
  _0xdbf0x9c['oninput'] = level_oninput;
  var _0xdbf0x1f0 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_level_last')[0];
  var _0xdbf0x9c = _0xdbf0x1f0['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '200';
  _0xdbf0x9c['oninput'] = level_oninput;
  _0xdbf0x36['getElementsByClassName']('level_first_minus')[0]['onclick'] = level_first_minus;
  _0xdbf0x36['getElementsByClassName']('level_first_plus')[0]['onclick'] = level_first_plus;
  _0xdbf0x36['getElementsByClassName']('level_last_minus')[0]['onclick'] = level_last_minus;
  _0xdbf0x36['getElementsByClassName']('level_last_plus')[0]['onclick'] = level_last_plus;
  var _0xdbf0x1f1 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_buttons')[0]['getElementsByClassName']('button');
  _0xdbf0x1f1[0]['style']['display'] = 'block';
  _0xdbf0x1f1[0]['onclick'] = start_hangar_upgrade_all;
  _0xdbf0x1f1[1]['onclick'] = hide_upgrade_all;
  _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_block')[0]['style']['display'] = 'flex';
  _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_result')[0]['style']['display'] = 'none'
}

function level_oninput() {
  var _0xdbf0x2c = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < this['value']['length']; _0xdbf0x4++) {
    if (this['value'][_0xdbf0x4] == '0' || this['value'][_0xdbf0x4] == '1' || this['value'][_0xdbf0x4] == '2' || this['value'][_0xdbf0x4] == '3' || this['value'][_0xdbf0x4] == '4' || this['value'][_0xdbf0x4] == '5' || this['value'][_0xdbf0x4] == '6' || this['value'][_0xdbf0x4] == '7' || this['value'][_0xdbf0x4] == '8' || this['value'][_0xdbf0x4] == '9') {
      _0xdbf0x2c['push'](this['value'][_0xdbf0x4])
    }
  };
  this['value'] = _0xdbf0x2c['join']('');
  if (this['value']['length'] > 3) {
    this['value'] = this['value']['slice'](0, 3)
  };
  var _0xdbf0x75 = parseInt(this['value']);
  if (_0xdbf0x75 > 200) {
    this['value'] = 200
  }
}

function level_first_minus() {
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0];
  var _0xdbf0x1f0 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_level_first')[0];
  var _0xdbf0x9c = _0xdbf0x1f0['getElementsByTagName']('input')[0];
  var _0xdbf0x4f = parseInt(_0xdbf0x9c['value']);
  _0xdbf0x4f--;
  if (_0xdbf0x4f < 1) {
    _0xdbf0x4f = 1
  };
  _0xdbf0x9c['value'] = _0xdbf0x4f
}

function level_first_plus() {
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0];
  var _0xdbf0x1f0 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_level_first')[0];
  var _0xdbf0x9c = _0xdbf0x1f0['getElementsByTagName']('input')[0];
  var _0xdbf0x4f = parseInt(_0xdbf0x9c['value']);
  _0xdbf0x4f++;
  if (_0xdbf0x4f > 200) {
    _0xdbf0x4f = 200
  };
  _0xdbf0x9c['value'] = _0xdbf0x4f
}

function level_last_minus() {
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0];
  var _0xdbf0x1f0 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_level_last')[0];
  var _0xdbf0x9c = _0xdbf0x1f0['getElementsByTagName']('input')[0];
  var _0xdbf0x4f = parseInt(_0xdbf0x9c['value']);
  _0xdbf0x4f--;
  if (_0xdbf0x4f < 1) {
    _0xdbf0x4f = 1
  };
  _0xdbf0x9c['value'] = _0xdbf0x4f
}

function level_last_plus() {
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0];
  var _0xdbf0x1f0 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_level_last')[0];
  var _0xdbf0x9c = _0xdbf0x1f0['getElementsByTagName']('input')[0];
  var _0xdbf0x4f = parseInt(_0xdbf0x9c['value']);
  _0xdbf0x4f++;
  if (_0xdbf0x4f > 200) {
    _0xdbf0x4f = 200
  };
  _0xdbf0x9c['value'] = _0xdbf0x4f
}

function hide_upgrade_all() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0]['style']['display'] = 'none'
}

function set_mode_hangar_upgrade_all_0() {
  set_mode_hangar_upgrade_all(0)
}

function set_mode_hangar_upgrade_all_1() {
  set_mode_hangar_upgrade_all(1)
}

function set_mode_hangar_upgrade_all(_0xdbf0x26) {
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0];
  var _0xdbf0x5d = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_select')[0];
  var _0xdbf0x1ef = _0xdbf0x36['getElementsByTagName']('li');
  if (_0xdbf0x26 == 0) {
    _0xdbf0x5d['getElementsByTagName']('label')[0]['innerHTML'] = 'Равномерно';
    _0xdbf0x1ef[0]['className'] = 'active';
    _0xdbf0x1ef[1]['className'] = ''
  } else {
    if (_0xdbf0x26 == 1) {
      _0xdbf0x5d['getElementsByTagName']('label')[0]['innerHTML'] = 'До максимума';
      _0xdbf0x1ef[0]['className'] = '';
      _0xdbf0x1ef[1]['className'] = 'active'
    }
  }
}

function start_hangar_upgrade_all() {
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0];
  var _0xdbf0x1fc = _0xdbf0x36['getElementsByTagName']('input');
  var _0xdbf0x1fd = -1;
  if (_0xdbf0x1fc[0]['checked']) {
    _0xdbf0x1fd = 1
  } else {
    if (_0xdbf0x1fc[1]['checked']) {
      _0xdbf0x1fd = 2
    } else {
      if (_0xdbf0x1fc[2]['checked']) {
        _0xdbf0x1fd = 3
      }
    }
  };
  var _0xdbf0x1ef = _0xdbf0x36['getElementsByTagName']('li');
  if (_0xdbf0x1ef[0]['className'] == 'active') {
    var _0xdbf0x5d = 0
  } else {
    if (_0xdbf0x1ef[1]['className'] == 'active') {
      var _0xdbf0x5d = 1
    }
  };
  var _0xdbf0x1fc = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_level')[0]['getElementsByTagName']('input');
  var _0xdbf0x1fe = parseInt(_0xdbf0x1fc[0]['value']) - 1;
  var _0xdbf0x1ff = parseInt(_0xdbf0x1fc[1]['value']) - 1;
  var _0xdbf0x1e0 = [];
  for (var _0xdbf0x7d in window['player']['hangar'][_0xdbf0x1fd]) {
    if (window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x7d]['level'] >= _0xdbf0x1fe && window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x7d]['level'] <= _0xdbf0x1ff) {
      if (window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x7d]['level'] + 1 < window['card_max_level'] && window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x7d]['count'] >= window['cards_upgrade'][_0xdbf0x1fd][window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x7d]['level'] + 1]['cards']) {
        var _0xdbf0x1e2 = {
          "id": parseInt(_0xdbf0x7d),
          "count": window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x7d]['count'],
          "level": window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x7d]['level']
        };
        _0xdbf0x1e0['push'](_0xdbf0x1e2)
      }
    }
  };
  var _0xdbf0x2c = [];
  var _0xdbf0x54 = window['player']['static_resources']['coins'];
  var _0xdbf0x200 = 0;
  var _0xdbf0x201 = 0;
  if (_0xdbf0x5d == 0) {
    var _0xdbf0xd8 = 0;
    while (_0xdbf0xd8 == 0) {
      var _0xdbf0x1fe = 999999;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
        if (_0xdbf0x1e0[_0xdbf0x4]['level'] + 1 < window['card_max_level'] && _0xdbf0x1e0[_0xdbf0x4]['level'] <= _0xdbf0x1fe && _0xdbf0x1e0[_0xdbf0x4]['count'] >= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['cards'] && _0xdbf0x54 >= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['coins']) {
          _0xdbf0x1fe = _0xdbf0x1e0[_0xdbf0x4]['level']
        }
      };
      var _0xdbf0x202 = _0xdbf0x1fe + 1;
      var _0xdbf0x5e = 0;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
        if (_0xdbf0x1e0[_0xdbf0x4]['level'] < _0xdbf0x202 && _0xdbf0x1e0[_0xdbf0x4]['level'] + 1 <= _0xdbf0x1ff) {
          if (_0xdbf0x1e0[_0xdbf0x4]['level'] + 1 < window['card_max_level'] && _0xdbf0x1e0[_0xdbf0x4]['count'] >= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['cards'] && _0xdbf0x54 >= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['coins']) {
            _0xdbf0x54 -= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['coins'];
            _0xdbf0x201 += window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['coins'];
            _0xdbf0x1e0[_0xdbf0x4]['count'] -= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['cards'];
            _0xdbf0x1e0[_0xdbf0x4]['level']++;
            _0xdbf0x200++;
            _0xdbf0x2c['push'](_0xdbf0x1e0[_0xdbf0x4]['id']);
            _0xdbf0x5e = 1
          }
        }
      };
      if (_0xdbf0x5e == 0) {
        _0xdbf0xd8 = 1
      }
    }
  } else {
    if (_0xdbf0x5d == 1) {
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
        if (_0xdbf0x1e0[_0xdbf0x4]['count'] >= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['cards'] && _0xdbf0x54 >= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['coins'] && _0xdbf0x1e0[_0xdbf0x4]['level'] + 1 <= _0xdbf0x1ff) {
          _0xdbf0x54 -= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['coins'];
          _0xdbf0x201 += window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['coins'];
          _0xdbf0x1e0[_0xdbf0x4]['count'] -= window['cards_upgrade'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['cards'];
          _0xdbf0x1e0[_0xdbf0x4]['level']++;
          _0xdbf0x200++;
          _0xdbf0x2c['push'](_0xdbf0x1e0[_0xdbf0x4]['id']);
          _0xdbf0x4--
        }
      }
    }
  };
  if (_0xdbf0x2c['length'] > 0) {
    show_upgraded_all(_0xdbf0x1fd, _0xdbf0x2c, _0xdbf0x200, _0xdbf0x201);
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_sut']['length']; _0xdbf0x4++) {
      if (window['top_sut'][_0xdbf0x4]['id'] == window['game_login']) {
        window['top_sut'][_0xdbf0x4]['static_resources']['sut'] += _0xdbf0x200
      }
    };
    if (window['friends_mode'] == 2) {
      window['friends_mode'] = 0;
      change_friends_mode(2)
    };
    server_action('hangar.pack_upgrade', {
      "type": _0xdbf0x1fd,
      "cards": _0xdbf0x2c['join'](',')
    })
  } else {
    show_no_upgrade_all()
  }
}

function show_upgraded_all(_0xdbf0x1fd, _0xdbf0x1e0, _0xdbf0xe6, _0xdbf0x54) {
  var _0xdbf0x204 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
    window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]]['count'] -= window['cards_upgrade'][_0xdbf0x1fd][window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]]['level'] + 1]['cards'];
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < 10; _0xdbf0x38++) {
      _0xdbf0x204[_0xdbf0x38] -= window['cards_upgrade'][_0xdbf0x1fd][window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]]['level']]['w' + _0xdbf0x38];
      _0xdbf0x204[_0xdbf0x38] += window['cards_upgrade'][_0xdbf0x1fd][window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]]['level'] + 1]['w' + _0xdbf0x38]
    };
    window['player']['hangar'][_0xdbf0x1fd][_0xdbf0x1e0[_0xdbf0x4]]['level']++
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4] += _0xdbf0x204[_0xdbf0x4]
  };
  for (var _0xdbf0x4 = 3, _0xdbf0x38 = 0; _0xdbf0x4 < 10; _0xdbf0x4++, _0xdbf0x38++) {
    window['player']['static_resources']['boost_weapon_' + _0xdbf0x38] += _0xdbf0x204[_0xdbf0x4]
  };
  window['player']['static_resources']['coins'] -= _0xdbf0x54;
  window['player']['static_resources']['sut'] += _0xdbf0xe6;
  window['player']['achievements']['sut'] += _0xdbf0xe6;
  document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_weapons_list')[0]['getElementsByClassName']('hangar_weapons_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
    _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
  };
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 3; _0xdbf0x4 < 7; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0xea = window['weapons_damage'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x4];
    _0xdbf0x55[_0xdbf0x38]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
  };
  update_static_resources_coins();
  var _0xdbf0x56 = document['getElementsByClassName']('hangar_list_scroll')[0]['getElementsByClassName']('hangar_item');
  out_hangar_card(0, 0, 1, _0xdbf0x56['length'] + 1);
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0];
  var _0xdbf0x32 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_result')[0];
  while (_0xdbf0x32['firstChild']) {
    _0xdbf0x32['removeChild'](_0xdbf0x32['firstChild'])
  };
  var _0xdbf0x205 = document['createElement']('h3');
  _0xdbf0x205['innerHTML'] = 'Модернизация прошла успешно';
  _0xdbf0x205['style']['paddingTop'] = '';
  _0xdbf0x32['appendChild'](_0xdbf0x205);
  var _0xdbf0x206 = document['createElement']('div');
  _0xdbf0x206['className'] = 'upgrade_all_decks_result_rise';
  var _0xdbf0x1a1 = document['createElement']('div');
  _0xdbf0x1a1['className'] = 'upgrade_all_decks_result_text';
  var _0xdbf0x207 = document['createElement']('img');
  _0xdbf0x207['src'] = 'https://cdn.bravegames.space/regiment/images/sut_interface.png';
  _0xdbf0x1a1['appendChild'](_0xdbf0x207);
  var _0xdbf0x208 = document['createElement']('span');
  _0xdbf0x208['innerHTML'] = '+ ' + _0xdbf0xe6;
  _0xdbf0x1a1['appendChild'](_0xdbf0x208);
  _0xdbf0x206['appendChild'](_0xdbf0x1a1);
  var _0xdbf0x1a4 = document['createElement']('div');
  _0xdbf0x1a4['className'] = 'upgrade_all_decks_result_text';
  var _0xdbf0x209 = document['createElement']('img');
  _0xdbf0x209['src'] = 'https://cdn.bravegames.space/regiment/images/icons/coin.png';
  _0xdbf0x1a4['appendChild'](_0xdbf0x209);
  var _0xdbf0x20a = document['createElement']('span');
  _0xdbf0x20a['innerHTML'] = '- ' + _0xdbf0x54['toLocaleString']();
  _0xdbf0x1a4['appendChild'](_0xdbf0x20a);
  _0xdbf0x206['appendChild'](_0xdbf0x1a4);
  _0xdbf0x32['appendChild'](_0xdbf0x206);
  var _0xdbf0x1f1 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_buttons')[0]['getElementsByClassName']('button');
  _0xdbf0x1f1[0]['style']['display'] = 'none';
  _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_block')[0]['style']['display'] = 'none';
  _0xdbf0x32['style']['display'] = 'block';
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'upgrade_decks') {
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0xe6;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    }
  }
}

function show_no_upgrade_all() {
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('upgrade_all_decks')[0];
  var _0xdbf0x32 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_result')[0];
  while (_0xdbf0x32['firstChild']) {
    _0xdbf0x32['removeChild'](_0xdbf0x32['firstChild'])
  };
  var _0xdbf0x205 = document['createElement']('h3');
  _0xdbf0x205['innerHTML'] = 'Модернизация невозможна';
  _0xdbf0x205['style']['paddingTop'] = '24px';
  _0xdbf0x32['appendChild'](_0xdbf0x205);
  var _0xdbf0x1f1 = _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_buttons')[0]['getElementsByClassName']('button');
  _0xdbf0x1f1[0]['style']['display'] = 'none';
  _0xdbf0x36['getElementsByClassName']('upgrade_all_decks_block')[0]['style']['display'] = 'none';
  _0xdbf0x32['style']['display'] = 'block'
}

function hangar_btn_sort_type() {
  play_effect('click.mp3');
  var _0xdbf0x9f = document['getElementById']('sort_hangar');
  if (_0xdbf0x9f['className'] == 'sort_up') {
    _0xdbf0x9f['className'] = 'sort_down'
  } else {
    if (_0xdbf0x9f['className'] == 'sort_down') {
      _0xdbf0x9f['className'] = 'sort_up'
    }
  };
  window['hangar_next'] = 0;
  out_hangar_card(1, 0, 1, -1)
}

function hangar_search_input() {
  var _0xdbf0x36 = document['getElementsByClassName']('hangar_sort_select search_card')[0];
  var _0xdbf0x9c = _0xdbf0x36['getElementsByTagName']('input')[0];
  if (_0xdbf0x9c['value']['length'] > 0) {
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('clear')[0];
    _0xdbf0x9f['style']['display'] = 'inline';
    _0xdbf0x9f['onclick'] = clear_search_input
  } else {
    _0xdbf0x36['getElementsByClassName']('clear')[0]['style']['display'] = 'none'
  };
  window['hangar_next'] = 0;
  out_hangar_card(1, 0, 1, -1)
}

function clear_search_input() {
  play_effect('click.mp3');
  var _0xdbf0x9c = document['getElementsByClassName']('hangar_sort_select search_card')[0]['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '';
  hangar_search_input()
}

function sort_hangar_0() {
  sort_hangar(0)
}

function sort_hangar_1() {
  sort_hangar(1)
}

function sort_hangar_2() {
  sort_hangar(2)
}

function sort_hangar_3() {
  sort_hangar(3)
}

function sort_hangar_4() {
  sort_hangar(4)
}

function tutorial_arrow_hangar_sort2() {
  if (window['tutorial_arrow_stoped'] == 2) {
    window['player']['static_resources']['tutorial']++;
    tutorial_arrow(150, 180, 'left', 190, 0);
    document['getElementsByClassName']('hangar_list_scroll')[0]['getElementsByClassName']('hangar_item')[0]['style']['pointerEvents'] = 'auto'
  } else {
    setTimeout(tutorial_arrow_hangar_sort2, 50)
  }
}

function sort_hangar(_0xdbf0x5d) {
  play_effect('click.mp3');
  if (window['player']['static_resources']['tutorial'] == 19) {
    tutorial_arrow_stop();
    var _0xdbf0x42 = document['getElementsByClassName']('hangar_sort_select sort_card')[0];
    _0xdbf0x42['style']['pointerEvents'] = '';
    var _0xdbf0x216 = _0xdbf0x42['getElementsByTagName']('ul')[0];
    _0xdbf0x216['style']['display'] = '';
    _0xdbf0x216['style']['cursor'] = '';
    var _0xdbf0x55 = _0xdbf0x216['getElementsByTagName']('li');
    _0xdbf0x55[0]['style']['pointerEvents'] = '';
    _0xdbf0x55[1]['style']['pointerEvents'] = '';
    _0xdbf0x55[2]['style']['pointerEvents'] = '';
    _0xdbf0x55[3]['style']['pointerEvents'] = '';
    setTimeout(tutorial_arrow_hangar_sort2, 50)
  };
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_sort_select sort_card')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = ''
  };
  _0xdbf0x55[_0xdbf0x5d]['className'] = 'active';
  var _0xdbf0xca = document['getElementsByClassName']('hangar_sort_select sort_card')[0]['getElementsByTagName']('label')[0];
  if (_0xdbf0x5d == 0) {
    _0xdbf0xca['innerHTML'] = 'Сортировка по времени'
  } else {
    if (_0xdbf0x5d == 1) {
      _0xdbf0xca['innerHTML'] = 'Сортировка по уровню'
    } else {
      if (_0xdbf0x5d == 2) {
        _0xdbf0xca['innerHTML'] = 'Сортировка по названию'
      } else {
        if (_0xdbf0x5d == 3) {
          _0xdbf0xca['innerHTML'] = 'Сортировка по количеству'
        } else {
          if (_0xdbf0x5d == 4) {
            _0xdbf0xca['innerHTML'] = 'Сортировка по доступности'
          }
        }
      }
    }
  };
  window['hangar_next'] = 0;
  out_hangar_card(1, 0, 1, -1)
}

function set_country_hangar_0() {
  set_country_hangar(0)
}

function set_country_hangar_1() {
  set_country_hangar(1)
}

function set_country_hangar_2() {
  set_country_hangar(2)
}

function set_country_hangar_3() {
  set_country_hangar(3)
}

function set_country_hangar_4() {
  set_country_hangar(4)
}

function set_country_hangar_5() {
  set_country_hangar(5)
}

function set_country_hangar_6() {
  set_country_hangar(6)
}

function set_country_hangar_7() {
  set_country_hangar(7)
}

function set_country_hangar_8() {
  set_country_hangar(8)
}

function set_country_hangar_9() {
  set_country_hangar(9)
}

function set_country_hangar_10() {
  set_country_hangar(10)
}

function set_country_hangar_11() {
  set_country_hangar(11)
}

function set_country_hangar_12() {
  set_country_hangar(12)
}

function set_country_hangar(_0xdbf0x9a) {
  play_effect('click.mp3');
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_sort_select sort_country')[0]['getElementsByTagName']('li');
  if (_0xdbf0x55[_0xdbf0x9a]['className'] == '') {
    _0xdbf0x55[_0xdbf0x9a]['className'] = 'active'
  } else {
    _0xdbf0x55[_0xdbf0x9a]['className'] = ''
  };
  window['hangar_next'] = 0;
  out_hangar_card(1, 0, 1, -1)
}

function set_type_hangar_0() {
  set_type_hangar(0)
}

function set_type_hangar_1() {
  set_type_hangar(1)
}

function set_type_hangar_2() {
  set_type_hangar(2)
}

function set_type_hangar(_0xdbf0x9a) {
  play_effect('click.mp3');
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_sort_select sort_type')[0]['getElementsByTagName']('li');
  if (_0xdbf0x55[_0xdbf0x9a]['className'] == '') {
    _0xdbf0x55[_0xdbf0x9a]['className'] = 'active'
  } else {
    _0xdbf0x55[_0xdbf0x9a]['className'] = ''
  };
  window['hangar_next'] = 0;
  out_hangar_card(1, 0, 1, -1)
}

function out_hangar_card(_0xdbf0x22a, _0xdbf0x22b, _0xdbf0x22c, _0xdbf0x22d) {
  var _0xdbf0x1e0 = [];
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_sort_select sort_type')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 1; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    if (_0xdbf0x55[_0xdbf0x4]['className'] == 'active') {
      for (var _0xdbf0x7d in window['player']['hangar'][_0xdbf0x38]) {
        var _0xdbf0x1e2 = window['player']['hangar'][_0xdbf0x38][_0xdbf0x7d];
        _0xdbf0x1e2['type'] = _0xdbf0x38;
        _0xdbf0x1e2['id'] = _0xdbf0x7d;
        _0xdbf0x1e2['name'] = window['cards'][_0xdbf0x38][_0xdbf0x7d]['name'];
        _0xdbf0x1e2['country'] = window['cards'][_0xdbf0x38][_0xdbf0x7d]['country'];
        _0xdbf0x1e2['need_cards'] = window['cards_upgrade'][_0xdbf0x38][_0xdbf0x1e2['level'] + 1]['cards'];
        _0xdbf0x1e0['push'](_0xdbf0x1e2)
      }
    }
  };
  if (_0xdbf0x1e0['length'] == 0) {
    for (var _0xdbf0x4 = 1; _0xdbf0x4 <= 3; _0xdbf0x4++) {
      for (var _0xdbf0x7d in window['player']['hangar'][_0xdbf0x4]) {
        var _0xdbf0x1e2 = window['player']['hangar'][_0xdbf0x4][_0xdbf0x7d];
        _0xdbf0x1e2['type'] = _0xdbf0x4;
        _0xdbf0x1e2['id'] = _0xdbf0x7d;
        _0xdbf0x1e2['name'] = window['cards'][_0xdbf0x4][_0xdbf0x7d]['name'];
        _0xdbf0x1e2['country'] = window['cards'][_0xdbf0x4][_0xdbf0x7d]['country'];
        _0xdbf0x1e2['need_cards'] = window['cards_upgrade'][_0xdbf0x38][_0xdbf0x1e2['level'] + 1]['cards'];
        _0xdbf0x1e0['push'](_0xdbf0x1e2)
      }
    }
  };
  var _0xdbf0x22e = [];
  var _0xdbf0x192 = ['ussr', 'germany', 'usa', 'china', 'france', 'britain', 'japan', 'czech', 'sweden', 'poland', 'italy', 'other'];
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_sort_select sort_country')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['className'] == 'active') {
      _0xdbf0x22e['push'](_0xdbf0x192[_0xdbf0x4])
    }
  };
  if (_0xdbf0x22e['length'] > 0) {
    var _0xdbf0x22f = [];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
      if (in_array(_0xdbf0x1e0[_0xdbf0x4]['country'], _0xdbf0x22e)) {
        _0xdbf0x22f['push'](_0xdbf0x1e0[_0xdbf0x4])
      }
    };
    _0xdbf0x1e0 = _0xdbf0x22f
  };
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_sort_select sort_card')[0]['getElementsByTagName']('li');
  var _0xdbf0x183 = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['className'] == 'active') {
      _0xdbf0x183 = _0xdbf0x4
    }
  };
  var _0xdbf0x9f = document['getElementById']('sort_hangar');
  if (_0xdbf0x9f['className'] == 'sort_up') {
    var _0xdbf0x230 = 0
  } else {
    var _0xdbf0x230 = 1
  };
  if (_0xdbf0x183 == 0) {
    if (_0xdbf0x230 == 0) {
      _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
        if (_0xdbf0x8c['last_get_time'] < _0xdbf0x8d['last_get_time']) {
          return 1
        } else {
          if (_0xdbf0x8c['last_get_time'] > _0xdbf0x8d['last_get_time']) {
            return -1
          } else {
            return 0
          }
        }
      })
    } else {
      if (_0xdbf0x230 == 1) {
        _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
          if (_0xdbf0x8c['last_get_time'] < _0xdbf0x8d['last_get_time']) {
            return -1
          } else {
            if (_0xdbf0x8c['last_get_time'] > _0xdbf0x8d['last_get_time']) {
              return 1
            } else {
              return 0
            }
          }
        })
      }
    }
  } else {
    if (_0xdbf0x183 == 1) {
      if (_0xdbf0x230 == 0) {
        _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
          if (_0xdbf0x8c['level'] < _0xdbf0x8d['level']) {
            return 1
          } else {
            if (_0xdbf0x8c['level'] > _0xdbf0x8d['level']) {
              return -1
            } else {
              return 0
            }
          }
        })
      } else {
        if (_0xdbf0x230 == 1) {
          _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
            if (_0xdbf0x8c['level'] < _0xdbf0x8d['level']) {
              return -1
            } else {
              if (_0xdbf0x8c['level'] > _0xdbf0x8d['level']) {
                return 1
              } else {
                return 0
              }
            }
          })
        }
      }
    } else {
      if (_0xdbf0x183 == 2) {
        if (_0xdbf0x230 == 0) {
          _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
            if (_0xdbf0x8c['name'] < _0xdbf0x8d['name']) {
              return 1
            } else {
              if (_0xdbf0x8c['name'] > _0xdbf0x8d['name']) {
                return -1
              } else {
                return 0
              }
            }
          })
        } else {
          if (_0xdbf0x230 == 1) {
            _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
              if (_0xdbf0x8c['name'] < _0xdbf0x8d['name']) {
                return -1
              } else {
                if (_0xdbf0x8c['name'] > _0xdbf0x8d['name']) {
                  return 1
                } else {
                  return 0
                }
              }
            })
          }
        }
      } else {
        if (_0xdbf0x183 == 3) {
          if (_0xdbf0x230 == 0) {
            _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
              if (_0xdbf0x8c['count'] < _0xdbf0x8d['count']) {
                return 1
              } else {
                if (_0xdbf0x8c['count'] > _0xdbf0x8d['count']) {
                  return -1
                } else {
                  return 0
                }
              }
            })
          } else {
            if (_0xdbf0x230 == 1) {
              _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
                if (_0xdbf0x8c['count'] < _0xdbf0x8d['count']) {
                  return -1
                } else {
                  if (_0xdbf0x8c['count'] > _0xdbf0x8d['count']) {
                    return 1
                  } else {
                    return 0
                  }
                }
              })
            }
          }
        } else {
          if (_0xdbf0x183 == 4) {
            if (_0xdbf0x230 == 0) {
              _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
                var _0xdbf0x231 = _0xdbf0x8c['count'] - _0xdbf0x8c['need_cards'];
                var _0xdbf0x232 = _0xdbf0x8d['count'] - _0xdbf0x8d['need_cards'];
                if (_0xdbf0x231 < _0xdbf0x232) {
                  return 1
                } else {
                  if (_0xdbf0x231 > _0xdbf0x232) {
                    return -1
                  } else {
                    return 0
                  }
                }
              })
            } else {
              if (_0xdbf0x230 == 1) {
                _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
                  var _0xdbf0x231 = _0xdbf0x8c['count'] - _0xdbf0x8c['need_cards'];
                  var _0xdbf0x232 = _0xdbf0x8d['count'] - _0xdbf0x8d['need_cards'];
                  if (_0xdbf0x231 < _0xdbf0x232) {
                    return -1
                  } else {
                    if (_0xdbf0x231 > _0xdbf0x232) {
                      return 1
                    } else {
                      return 0
                    }
                  }
                })
              }
            }
          }
        }
      }
    }
  };
  var _0xdbf0x9c = document['getElementsByClassName']('hangar_sort_select search_card')[0]['getElementsByTagName']('input')[0];
  if (_0xdbf0x9c['value']['length'] > 0) {
    var _0xdbf0x22f = [];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
      if (_0xdbf0x1e0[_0xdbf0x4]['name']['toLocaleUpperCase']()['indexOf'](_0xdbf0x9c['value']['toLocaleUpperCase']()) > -1) {
        _0xdbf0x22f['push'](_0xdbf0x1e0[_0xdbf0x4])
      }
    };
    _0xdbf0x1e0 = _0xdbf0x22f
  };
  if (_0xdbf0x1e0['length'] > 0) {
    document['getElementsByClassName']('hangar_list_scroll')[0]['style']['display'] = 'grid';
    document['getElementsByClassName']('hangar_no_list')[0]['style']['display'] = 'none'
  } else {
    document['getElementsByClassName']('hangar_list_scroll')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('hangar_no_list')[0]['style']['display'] = 'flex'
  };
  document['getElementsByClassName']('hangar_count_card')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0x1e0['length'];
  var _0xdbf0x233 = _0xdbf0x1e0;
  if (_0xdbf0x22d == -1) {
    var _0xdbf0x234 = _0xdbf0x22b + 23 + window['hangar_next'];
    window['hangar_next'] = 1
  } else {
    var _0xdbf0x234 = _0xdbf0x22d - 1
  };
  _0xdbf0x1e0 = _0xdbf0x1e0['slice'](_0xdbf0x22b, _0xdbf0x234);
  var _0xdbf0x55 = document['getElementsByClassName']('hangar_list_scroll')[0];
  if (_0xdbf0x22c == 1) {
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'hangar_item hangar_decks_type_' + _0xdbf0x1e0[_0xdbf0x4]['type'];
    var _0xdbf0x235 = document['createElement']('div');
    _0xdbf0x235['className'] = 'hangar_item_desc';
    if (_0xdbf0x1e0[_0xdbf0x4]['type'] == 1) {
      _0xdbf0x235['innerHTML'] = 'Танки'
    } else {
      if (_0xdbf0x1e0[_0xdbf0x4]['type'] == 2) {
        _0xdbf0x235['innerHTML'] = 'Артиллерия'
      } else {
        if (_0xdbf0x1e0[_0xdbf0x4]['type'] == 3) {
          _0xdbf0x235['innerHTML'] = 'Авиация'
        } else {
          if (_0xdbf0x1e0[_0xdbf0x4]['type'] == 4) {
            _0xdbf0x235['innerHTML'] = 'Флот'
          }
        }
      }
    };
    _0xdbf0x8e['appendChild'](_0xdbf0x235);
    var _0xdbf0x236 = document['createElement']('div');
    _0xdbf0x236['className'] = 'hangar_item_image flag_' + window['cards'][_0xdbf0x1e0[_0xdbf0x4]['type']][_0xdbf0x1e0[_0xdbf0x4]['id']]['country'];
    var _0xdbf0x237 = document['createElement']('div');
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/' + _0xdbf0x1e0[_0xdbf0x4]['type'] + '/' + _0xdbf0x1e0[_0xdbf0x4]['id'] + '.png';
    _0xdbf0x237['appendChild'](_0xdbf0x90);
    _0xdbf0x236['appendChild'](_0xdbf0x237);
    _0xdbf0x8e['appendChild'](_0xdbf0x236);
    var _0xdbf0x238 = document['createElement']('div');
    _0xdbf0x238['className'] = 'hangar_item_top';
    var _0xdbf0x239 = document['createElement']('div');
    _0xdbf0x239['className'] = 'hangar_item_level';
    _0xdbf0x239['innerHTML'] = _0xdbf0x1e0[_0xdbf0x4]['level'] + 1;
    _0xdbf0x238['appendChild'](_0xdbf0x239);
    var _0xdbf0x23a = document['createElement']('div');
    _0xdbf0x23a['className'] = 'hangar_item_type';
    var _0xdbf0x195 = document['createElement']('img');
    _0xdbf0x195['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/type_' + _0xdbf0x1e0[_0xdbf0x4]['type'] + '.png';
    _0xdbf0x23a['appendChild'](_0xdbf0x195);
    _0xdbf0x238['appendChild'](_0xdbf0x23a);
    _0xdbf0x8e['appendChild'](_0xdbf0x238);
    var _0xdbf0x179 = document['createElement']('div');
    _0xdbf0x179['className'] = 'hangar_item_name';
    _0xdbf0x179['innerHTML'] = window['cards'][_0xdbf0x1e0[_0xdbf0x4]['type']][_0xdbf0x1e0[_0xdbf0x4]['id']]['name'];
    _0xdbf0x8e['appendChild'](_0xdbf0x179);
    if (_0xdbf0x1e0[_0xdbf0x4]['level'] + 1 < window['card_max_level']) {
      var _0xdbf0x23b = window['cards_upgrade'][_0xdbf0x1e0[_0xdbf0x4]['type']][_0xdbf0x1e0[_0xdbf0x4]['level'] + 1]['cards']
    } else {
      var _0xdbf0x23b = 9999999
    };
    var _0xdbf0x23c = document['createElement']('div');
    _0xdbf0x23c['className'] = 'hangar_item_upgrade';
    if (_0xdbf0x1e0[_0xdbf0x4]['count'] >= _0xdbf0x23b) {
      _0xdbf0x23c['style']['background'] = 'rgba(82, 159, 76, 1.0) linear-gradient(to bottom, rgba(82, 159, 76, 1.0), rgba(48, 94, 45, 1.0))'
    };
    var _0xdbf0x23d = document['createElement']('div');
    _0xdbf0x23d['className'] = 'hangar_item_count';
    _0xdbf0x23d['innerHTML'] = _0xdbf0x1e0[_0xdbf0x4]['count']['toLocaleString']() + ' / ' + _0xdbf0x23b['toLocaleString']();
    var _0xdbf0x4b = _0xdbf0x23b / 100;
    var _0xdbf0xcb = Math['round'](_0xdbf0x1e0[_0xdbf0x4]['count'] / _0xdbf0x4b);
    if (_0xdbf0xcb > 100) {
      _0xdbf0xcb = 100
    };
    _0xdbf0x23c['appendChild'](_0xdbf0x23d);
    if (_0xdbf0x1e0[_0xdbf0x4]['count'] >= _0xdbf0x23b) {
      _0xdbf0x23d['style']['display'] = 'none';
      var _0xdbf0x23e = document['createElement']('div');
      _0xdbf0x23e['className'] = 'hangar_item_available';
      _0xdbf0x23e['innerHTML'] = 'Улучшить';
      _0xdbf0x23c['appendChild'](_0xdbf0x23e)
    } else {
      _0xdbf0x23d['style']['display'] = 'block';
      var _0xdbf0x23f = document['createElement']('div');
      _0xdbf0x23f['className'] = 'hangar_item_progress';
      var _0xdbf0x240 = document['createElement']('div');
      _0xdbf0x240['className'] = 'hangar_item_progress_active';
      _0xdbf0x240['style']['width'] = _0xdbf0xcb + '%';
      _0xdbf0x23f['appendChild'](_0xdbf0x240);
      _0xdbf0x23c['appendChild'](_0xdbf0x23f)
    };
    _0xdbf0x8e['appendChild'](_0xdbf0x23c);
    _0xdbf0x55['appendChild'](_0xdbf0x8e);
    _0xdbf0x8e['dataset']['ttype'] = _0xdbf0x1e0[_0xdbf0x4]['type'];
    _0xdbf0x8e['dataset']['tid'] = _0xdbf0x1e0[_0xdbf0x4]['id'];
    _0xdbf0x8e['onclick'] = show_hangar_tech_info;
    if (_0xdbf0x22a == 1 && _0xdbf0x4 == 0) {
      _0xdbf0x8e['scrollTo']()
    }
  };
  var _0xdbf0x56 = document['getElementsByClassName']('hangar_list_scroll')[0]['getElementsByClassName']('hangar_item');
  if (_0xdbf0x233['length'] > _0xdbf0x56['length']) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['innerHTML'] = 'Показать еще';
    _0xdbf0x8e['className'] = 'hangar_item_add';
    _0xdbf0x8e['onclick'] = function() {
      play_effect('click.mp3');
      out_hangar_card(0, _0xdbf0x22b + _0xdbf0x1e0['length'], 0, -1);
      var _0xdbf0x1f0 = event['target'];
      _0xdbf0x1f0['parentNode']['removeChild'](_0xdbf0x1f0)
    };
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  }
}

function show_hangar_tech_info() {
  play_effect('click.mp3');
  var _0xdbf0x16f = parseInt(this['dataset']['ttype']);
  var _0xdbf0x9a = parseInt(this['dataset']['tid']);
  hangar_tech_info(_0xdbf0x16f, _0xdbf0x9a)
}

function hangar_tech_info(_0xdbf0x16f, _0xdbf0x9a) {
  var _0xdbf0x36 = document['getElementsByClassName']('leveling_decks_block')[0];
  if (window['player']['static_resources']['tutorial'] == 20) {
    document['getElementsByClassName']('hangar_list_scroll')[0]['getElementsByClassName']('hangar_item')[0]['style']['pointerEvents'] = '';
    tutorial_arrow_stop();
    show_tutorial(20)
  };
  _0xdbf0x36['dataset']['type'] = _0xdbf0x16f;
  _0xdbf0x36['dataset']['id'] = _0xdbf0x9a;
  var _0xdbf0x138 = _0xdbf0x36['getElementsByClassName']('hangar_item_desc')[0];
  if (_0xdbf0x16f == 1) {
    _0xdbf0x138['innerHTML'] = 'Танки'
  } else {
    if (_0xdbf0x16f == 2) {
      _0xdbf0x138['innerHTML'] = 'Артиллерия'
    } else {
      if (_0xdbf0x16f == 3) {
        _0xdbf0x138['innerHTML'] = 'Авиация'
      } else {
        if (_0xdbf0x16f == 4) {
          _0xdbf0x138['innerHTML'] = 'Флот'
        }
      }
    }
  };
  var _0xdbf0xc8 = _0xdbf0x36['getElementsByClassName']('hangar_item_image')[0];
  _0xdbf0xc8['className'] = 'hangar_item_image flag_' + window['cards'][_0xdbf0x16f][_0xdbf0x9a]['country'];
  var _0xdbf0x90 = _0xdbf0xc8['getElementsByTagName']('img')[0];
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/' + _0xdbf0x16f + '/' + _0xdbf0x9a + '.png';
  var _0xdbf0x90 = _0xdbf0x36['getElementsByClassName']('hangar_item_type')[0]['getElementsByTagName']('img')[0];
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/type_' + _0xdbf0x16f + '.png';
  _0xdbf0x36['getElementsByClassName']('hangar_item_level')[0]['innerHTML'] = (window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1);
  _0xdbf0x36['getElementsByClassName']('hangar_item_name')[0]['innerHTML'] = window['cards'][_0xdbf0x16f][_0xdbf0x9a]['name'];
  var _0xdbf0x23b = window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1]['cards'];
  _0xdbf0x36['getElementsByClassName']('hangar_item_count')[0]['innerHTML'] = window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['count']['toLocaleString']() + ' / ' + _0xdbf0x23b['toLocaleString']();
  var _0xdbf0x4b = _0xdbf0x23b / 100;
  var _0xdbf0xcb = Math['round'](window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['count'] / _0xdbf0x4b);
  if (_0xdbf0xcb > 100) {
    _0xdbf0xcb = 100
  };
  _0xdbf0x36['getElementsByClassName']('hangar_item_progress_active')[0]['style']['width'] = _0xdbf0xcb + '%';
  var _0xdbf0x55 = document['getElementsByClassName']('leveling_decks_weapons_list')[0]['getElementsByClassName']('leveling_decks_weapons_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    var _0xdbf0xd1 = _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('leveling_decks_weapons_count')[0]['getElementsByTagName']('span');
    _0xdbf0xd1[0]['innerHTML'] = window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level']]['w' + _0xdbf0x4];
    _0xdbf0xd1[1]['innerHTML'] = '+' + (window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1]['w' + _0xdbf0x4] - window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level']]['w' + _0xdbf0x4])
  };
  _0xdbf0x36['getElementsByClassName']('leveling_decks_price')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1]['coins']['toLocaleString']();
  var _0xdbf0x9f = document['getElementById']('btn_upgrade');
  if (window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['count'] >= _0xdbf0x23b) {
    _0xdbf0x9f['className'] = 'button button_orange';
    _0xdbf0x9f['style']['cursor'] = 'pointer';
    _0xdbf0x9f['onclick'] = function() {
      play_effect('upgrade_tech.mp3');
      upgrade_card_hangar(_0xdbf0x16f, _0xdbf0x9a)
    };
    _0xdbf0x9f['onmouseover'] = btn_upgrade_mouseover;
    _0xdbf0x9f['onmouseout'] = btn_upgrade_mouseout
  } else {
    _0xdbf0x9f['className'] = 'button button_dark';
    _0xdbf0x9f['style']['cursor'] = 'default';
    _0xdbf0x9f['onclick'] = '';
    _0xdbf0x9f['onmouseover'] = btn_upgrade_mouseover;
    _0xdbf0x9f['onmouseout'] = btn_upgrade_mouseout
  };
  document['getElementById']('modal')['className'] = 'modal_update_decks';
  show_modal('leveling_decks_block', 450);
  var _0xdbf0x9f = document['getElementById']('modal_close');
  _0xdbf0x9f['onclick'] = function() {
    close_modal_upgrade(0)
  };
  var _0xdbf0x9f = document['getElementById']('btn_close');
  if (window['player']['static_resources']['tutorial'] == 20) {
    _0xdbf0x9f['classList']['remove']('button_red');
    _0xdbf0x9f['classList']['add']('button_dark')
  };
  _0xdbf0x9f['onclick'] = function() {
    close_modal_upgrade(0)
  }
}

function close_modal_upgrade(_0xdbf0x10f) {
  if (_0xdbf0x10f != 1) {
    play_effect('click.mp3')
  };
  document['getElementById']('modal')['className'] = 'modal';
  hide_modal('leveling_decks_block')
}

function btn_upgrade_mouseover() {
  var _0xdbf0x55 = document['getElementsByClassName']('leveling_decks_weapons_list')[0]['getElementsByClassName']('leveling_decks_weapons_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    var _0xdbf0xd1 = _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('leveling_decks_weapons_count')[0]['getElementsByTagName']('span');
    _0xdbf0xd1[1]['style']['display'] = 'inline'
  }
}

function btn_upgrade_mouseout() {
  var _0xdbf0x55 = document['getElementsByClassName']('leveling_decks_weapons_list')[0]['getElementsByClassName']('leveling_decks_weapons_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    var _0xdbf0xd1 = _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('leveling_decks_weapons_count')[0]['getElementsByTagName']('span');
    _0xdbf0xd1[1]['style']['display'] = 'none'
  }
}

function cancel_scale_upgrade_hangar() {
  var _0xdbf0x36 = document['getElementsByClassName']('leveling_decks_left')[0]['getElementsByClassName']('hangar_item')[0];
  _0xdbf0x36['style']['transform'] = 'scale(1)'
}

function upgrade_card_hangar(_0xdbf0x16f, _0xdbf0x9a) {
  if (window['player']['static_resources']['coins'] >= window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1]['coins']) {
    play_effect('click.mp3');
    if (window['player']['static_resources']['tutorial'] == 20) {
      window['player']['static_resources']['tutorial']++;
      tutorial_arrow_stop()
    };
    var _0xdbf0x36 = document['getElementsByClassName']('leveling_decks_left')[0]['getElementsByClassName']('hangar_item')[0];
    _0xdbf0x36['style']['transform'] = 'scale(1.1)';
    setTimeout(cancel_scale_upgrade_hangar, 50);
    window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['count'] -= window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1]['cards'];
    window['player']['static_resources']['sut'] += 1;
    window['player']['achievements']['sut']++;
    document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
      window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4] -= window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level']]['w' + _0xdbf0x4];
      window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4] += window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1]['w' + _0xdbf0x4]
    };
    for (var _0xdbf0x4 = 0, _0xdbf0x38 = 3; _0xdbf0x4 < 7; _0xdbf0x4++, _0xdbf0x38++) {
      window['player']['static_resources']['boost_weapon_' + _0xdbf0x4] -= window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level']]['w' + _0xdbf0x38];
      window['player']['static_resources']['boost_weapon_' + _0xdbf0x4] += window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1]['w' + _0xdbf0x38]
    };
    window['player']['static_resources']['coins'] -= window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1]['coins'];
    window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] += 1;
    var _0xdbf0x55 = document['getElementsByClassName']('hangar_weapons_list')[0]['getElementsByClassName']('hangar_weapons_item');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
      var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
    };
    for (var _0xdbf0x4 = 0, _0xdbf0x38 = 3; _0xdbf0x4 < 7; _0xdbf0x4++, _0xdbf0x38++) {
      var _0xdbf0xea = window['weapons_damage'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x38]['getElementsByClassName']('hangar_weapons_count')[0]['innerHTML'] = _0xdbf0xea['toLocaleString']()
    };
    update_static_resources_coins();
    if (window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['count'] < window['cards_upgrade'][_0xdbf0x16f][window['player']['hangar'][_0xdbf0x16f][_0xdbf0x9a]['level'] + 1]['cards']) {
      document['getElementById']('btn_upgrade')['onclick'] = ''
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'upgrade_decks') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += 1;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_sut']['length']; _0xdbf0x4++) {
      if (window['top_sut'][_0xdbf0x4]['id'] == window['game_login']) {
        window['top_sut'][_0xdbf0x4]['static_resources']['sut']++
      }
    };
    if (window['friends_mode'] == 2) {
      window['friends_mode'] = 0;
      change_friends_mode(2)
    };
    upgraded_card_hangar();
    server_action('hangar.upgrade', {
      "type": _0xdbf0x16f,
      "card": _0xdbf0x9a
    })
  } else {
    document['getElementById']('modal')['className'] = 'modal';
    show_modal_no_coins()
  }
}

function upgraded_card_hangar() {
  var _0xdbf0x56 = document['getElementsByClassName']('hangar_list_scroll')[0]['getElementsByClassName']('hangar_item');
  out_hangar_card(0, 0, 1, _0xdbf0x56['length'] + 1);
  var _0xdbf0x36 = document['getElementsByClassName']('leveling_decks_block')[0];
  hangar_tech_info(_0xdbf0x36['dataset']['type'], _0xdbf0x36['dataset']['id']);
  if (window['player']['static_resources']['tutorial'] == 21) {
    close_modal_upgrade(1);
    show_tutorial(21)
  }
}

function top_damage_friend() {
  hide_top_damage();
  show_homeland();
  var _0xdbf0x9a = parseInt(this['dataset']['fid']);
  if (_0xdbf0x9a != window['game_login']) {
    show_friend_help(_0xdbf0x9a)
  } else {
    show_my_profile()
  }
}

function out_top_damage_0() {
  out_top_damage(0)
}

function out_top_damage_1() {
  out_top_damage(1)
}

function out_top_damage(_0xdbf0x24d) {
  play_effect('click.mp3');
  if (_0xdbf0x24d == 0) {
    var _0xdbf0x24e = window['top_damage']
  } else {
    var _0xdbf0x24e = window['top_damage_old']
  };
  var _0xdbf0x24f = 0;
  var _0xdbf0x55 = document['getElementsByClassName']('top_damage_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  if (window['player']['static_resources']['damage_in_top'] > 0 && _0xdbf0x24d == 0) {
    var in_array = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x24e['length']; _0xdbf0x4++) {
      if (_0xdbf0x24e[_0xdbf0x4][0] == window['game_login']) {
        in_array = 1
      }
    };
    if (in_array == 0) {
      _0xdbf0x24e['push']([window['game_login'], window['player']['static_resources']['damage_in_top']])
    }
  };
  _0xdbf0x24e['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
    if (_0xdbf0x8c[1] < _0xdbf0x8d[1]) {
      return 1
    } else {
      if (_0xdbf0x8c[1] > _0xdbf0x8d[1]) {
        return -1
      } else {
        return 0
      }
    }
  });
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x24e['length']; _0xdbf0x4++) {
    var _0xdbf0x250 = 0;
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['friends']['length']; _0xdbf0x38++) {
      if (window['friends'][_0xdbf0x38]['id'] == _0xdbf0x24e[_0xdbf0x4][0] && window['friends'][_0xdbf0x38]['profile']) {
        var _0xdbf0x36 = document['createElement']('div');
        _0xdbf0x36['className'] = 'top_damage_item d-flex';
        var _0xdbf0x251 = document['createElement']('div');
        _0xdbf0x251['className'] = 'top_damage_num';
        _0xdbf0x251['innerHTML'] = (_0xdbf0x4 + 1) + '.';
        _0xdbf0x36['appendChild'](_0xdbf0x251);
        var _0xdbf0x252 = document['createElement']('div');
        _0xdbf0x252['className'] = 'top_damage_avatar';
        var _0xdbf0x253 = document['createElement']('img');
        _0xdbf0x253['src'] = window['friends'][_0xdbf0x38]['profile']['photo_50'];
        _0xdbf0x252['appendChild'](_0xdbf0x253);
        _0xdbf0x252['dataset']['fid'] = window['friends'][_0xdbf0x38]['id'];
        _0xdbf0x252['onclick'] = top_damage_friend;
        _0xdbf0x36['appendChild'](_0xdbf0x252);
        var _0xdbf0x254 = document['createElement']('div');
        _0xdbf0x254['className'] = 'top_damage_name';
        var _0xdbf0x137 = document['createElement']('span');
        _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x38]['profile']['last_name'];
        _0xdbf0x137['dataset']['fid'] = window['friends'][_0xdbf0x38]['id'];
        _0xdbf0x137['onclick'] = top_damage_friend;
        _0xdbf0x254['appendChild'](_0xdbf0x137);
        _0xdbf0x36['appendChild'](_0xdbf0x254);
        var _0xdbf0x255 = document['createElement']('div');
        _0xdbf0x255['className'] = 'top_damage_icon';
        var _0xdbf0x1e7 = document['createElement']('img');
        _0xdbf0x1e7['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_kill_icon.png';
        _0xdbf0x255['appendChild'](_0xdbf0x1e7);
        _0xdbf0x36['appendChild'](_0xdbf0x255);
        var _0xdbf0x256 = document['createElement']('div');
        _0xdbf0x256['className'] = 'top_damage_count';
        if (_0xdbf0x24d == 0 && window['friends'][_0xdbf0x38]['id'] == window['game_login']) {
          _0xdbf0x256['innerHTML'] = window['player']['static_resources']['damage_in_top']['toLocaleString']()
        } else {
          _0xdbf0x256['innerHTML'] = _0xdbf0x24e[_0xdbf0x4][1]['toLocaleString']()
        };
        _0xdbf0x36['appendChild'](_0xdbf0x256);
        _0xdbf0x55['appendChild'](_0xdbf0x36);
        _0xdbf0x250 = 1;
        if (window['friends'][_0xdbf0x38]['id'] == window['game_login']) {
          _0xdbf0x24f = 1;
          var _0xdbf0x75 = document['getElementsByClassName']('top_damage_my d-flex')[0];
          while (_0xdbf0x75['firstChild']) {
            _0xdbf0x75['removeChild'](_0xdbf0x75['firstChild'])
          };
          var _0xdbf0x251 = document['createElement']('div');
          _0xdbf0x251['className'] = 'top_damage_num';
          _0xdbf0x251['innerHTML'] = (_0xdbf0x4 + 1) + '.';
          _0xdbf0x75['appendChild'](_0xdbf0x251);
          var _0xdbf0x252 = document['createElement']('div');
          _0xdbf0x252['className'] = 'top_damage_avatar';
          var _0xdbf0x253 = document['createElement']('img');
          _0xdbf0x253['src'] = window['friends'][_0xdbf0x38]['profile']['photo_50'];
          _0xdbf0x252['dataset']['fid'] = window['friends'][_0xdbf0x38]['id'];
          _0xdbf0x252['onclick'] = top_damage_friend;
          _0xdbf0x252['appendChild'](_0xdbf0x253);
          _0xdbf0x75['appendChild'](_0xdbf0x252);
          var _0xdbf0x254 = document['createElement']('div');
          _0xdbf0x254['className'] = 'top_damage_name';
          var _0xdbf0x137 = document['createElement']('span');
          _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x38]['profile']['last_name'];
          _0xdbf0x137['dataset']['fid'] = window['friends'][_0xdbf0x38]['id'];
          _0xdbf0x137['onclick'] = top_damage_friend;
          _0xdbf0x254['appendChild'](_0xdbf0x137);
          _0xdbf0x75['appendChild'](_0xdbf0x254);
          var _0xdbf0x255 = document['createElement']('div');
          _0xdbf0x255['className'] = 'top_damage_icon';
          var _0xdbf0x1e7 = document['createElement']('img');
          _0xdbf0x1e7['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_kill_icon.png';
          _0xdbf0x255['appendChild'](_0xdbf0x1e7);
          _0xdbf0x75['appendChild'](_0xdbf0x255);
          var _0xdbf0x256 = document['createElement']('div');
          _0xdbf0x256['className'] = 'top_damage_count';
          if (_0xdbf0x24d == 0) {
            _0xdbf0x256['innerHTML'] = window['player']['static_resources']['damage_in_top']['toLocaleString']()
          } else {
            _0xdbf0x256['innerHTML'] = window['player']['static_resources']['damage_in_top_old']['toLocaleString']()
          };
          _0xdbf0x75['appendChild'](_0xdbf0x256)
        }
      }
    };
    if (_0xdbf0x250 == 0) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['other_friends']['length']; _0xdbf0x38++) {
        if (window['other_friends'][_0xdbf0x38]['id'] == _0xdbf0x24e[_0xdbf0x4][0] && window['other_friends'][_0xdbf0x38]['profile']) {
          var _0xdbf0x36 = document['createElement']('div');
          _0xdbf0x36['className'] = 'top_damage_item d-flex';
          var _0xdbf0x251 = document['createElement']('div');
          _0xdbf0x251['className'] = 'top_damage_num';
          _0xdbf0x251['innerHTML'] = (_0xdbf0x4 + 1) + '.';
          _0xdbf0x36['appendChild'](_0xdbf0x251);
          var _0xdbf0x252 = document['createElement']('div');
          _0xdbf0x252['className'] = 'top_damage_avatar';
          var _0xdbf0x253 = document['createElement']('img');
          _0xdbf0x253['src'] = window['other_friends'][_0xdbf0x38]['profile']['photo_50'];
          _0xdbf0x252['appendChild'](_0xdbf0x253);
          _0xdbf0x252['dataset']['fid'] = window['other_friends'][_0xdbf0x38]['id'];
          _0xdbf0x252['onclick'] = top_damage_friend;
          _0xdbf0x36['appendChild'](_0xdbf0x252);
          var _0xdbf0x254 = document['createElement']('div');
          _0xdbf0x254['className'] = 'top_damage_name';
          var _0xdbf0x137 = document['createElement']('span');
          _0xdbf0x137['innerHTML'] = window['other_friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['other_friends'][_0xdbf0x38]['profile']['last_name'];
          _0xdbf0x137['dataset']['fid'] = window['other_friends'][_0xdbf0x38]['id'];
          _0xdbf0x137['onclick'] = top_damage_friend;
          _0xdbf0x254['appendChild'](_0xdbf0x137);
          _0xdbf0x36['appendChild'](_0xdbf0x254);
          var _0xdbf0x255 = document['createElement']('div');
          _0xdbf0x255['className'] = 'top_damage_icon';
          var _0xdbf0x1e7 = document['createElement']('img');
          _0xdbf0x1e7['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_kill_icon.png';
          _0xdbf0x255['appendChild'](_0xdbf0x1e7);
          _0xdbf0x36['appendChild'](_0xdbf0x255);
          var _0xdbf0x256 = document['createElement']('div');
          _0xdbf0x256['className'] = 'top_damage_count';
          if (window['other_friends'][_0xdbf0x38]['id'] == window['game_login']) {
            _0xdbf0x256['innerHTML'] = window['player']['static_resources']['damage_in_top']['toLocaleString']()
          } else {
            _0xdbf0x256['innerHTML'] = _0xdbf0x24e[_0xdbf0x4][1]['toLocaleString']()
          };
          _0xdbf0x36['appendChild'](_0xdbf0x256);
          _0xdbf0x55['appendChild'](_0xdbf0x36);
          if (window['other_friends'][_0xdbf0x38]['id'] == window['game_login']) {
            _0xdbf0x24f = 1;
            var _0xdbf0x75 = document['getElementsByClassName']('top_damage_my d-flex')[0];
            while (_0xdbf0x75['firstChild']) {
              _0xdbf0x75['removeChild'](_0xdbf0x75['firstChild'])
            };
            var _0xdbf0x251 = document['createElement']('div');
            _0xdbf0x251['className'] = 'top_damage_num';
            _0xdbf0x251['innerHTML'] = (_0xdbf0x4 + 1) + '.';
            _0xdbf0x75['appendChild'](_0xdbf0x251);
            var _0xdbf0x252 = document['createElement']('div');
            _0xdbf0x252['className'] = 'top_damage_avatar';
            var _0xdbf0x253 = document['createElement']('img');
            _0xdbf0x253['src'] = window['other_friends'][_0xdbf0x38]['profile']['photo_50'];
            _0xdbf0x252['appendChild'](_0xdbf0x253);
            _0xdbf0x75['appendChild'](_0xdbf0x252);
            var _0xdbf0x254 = document['createElement']('div');
            _0xdbf0x254['className'] = 'top_damage_name';
            var _0xdbf0x137 = document['createElement']('span');
            _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x38]['profile']['last_name'];
            _0xdbf0x137['dataset']['fid'] = window['friends'][_0xdbf0x38]['id'];
            _0xdbf0x137['onclick'] = top_damage_friend;
            _0xdbf0x254['appendChild'](_0xdbf0x137);
            _0xdbf0x75['appendChild'](_0xdbf0x254);
            var _0xdbf0x255 = document['createElement']('div');
            _0xdbf0x255['className'] = 'top_damage_icon';
            var _0xdbf0x1e7 = document['createElement']('img');
            _0xdbf0x1e7['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_kill_icon.png';
            _0xdbf0x255['appendChild'](_0xdbf0x1e7);
            _0xdbf0x75['appendChild'](_0xdbf0x255);
            var _0xdbf0x256 = document['createElement']('div');
            _0xdbf0x256['className'] = 'top_damage_count';
            if (_0xdbf0x24d == 0) {
              _0xdbf0x256['innerHTML'] = window['player']['static_resources']['damage_in_top']['toLocaleString']()
            } else {
              _0xdbf0x256['innerHTML'] = window['player']['static_resources']['damage_in_top_old']['toLocaleString']()
            };
            _0xdbf0x75['appendChild'](_0xdbf0x256)
          }
        }
      }
    }
  };
  if (_0xdbf0x24f == 0) {
    var _0xdbf0x26 = -1;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      if (window['friends'][_0xdbf0x4]['id'] == window['game_login']) {
        _0xdbf0x26 = _0xdbf0x4
      }
    };
    if (_0xdbf0x26 > -1) {
      var _0xdbf0x75 = document['getElementsByClassName']('top_damage_my d-flex')[0];
      while (_0xdbf0x75['firstChild']) {
        _0xdbf0x75['removeChild'](_0xdbf0x75['firstChild'])
      };
      var _0xdbf0x251 = document['createElement']('div');
      _0xdbf0x251['className'] = 'top_damage_num';
      _0xdbf0x251['innerHTML'] = '-';
      _0xdbf0x75['appendChild'](_0xdbf0x251);
      var _0xdbf0x252 = document['createElement']('div');
      _0xdbf0x252['className'] = 'top_damage_avatar';
      var _0xdbf0x253 = document['createElement']('img');
      _0xdbf0x253['src'] = window['friends'][_0xdbf0x26]['profile']['photo_50'];
      _0xdbf0x252['appendChild'](_0xdbf0x253);
      _0xdbf0x75['appendChild'](_0xdbf0x252);
      var _0xdbf0x254 = document['createElement']('div');
      _0xdbf0x254['className'] = 'top_damage_name';
      var _0xdbf0x137 = document['createElement']('span');
      _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x26]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x26]['profile']['last_name'];
      _0xdbf0x137['dataset']['fid'] = window['friends'][_0xdbf0x26]['id'];
      _0xdbf0x137['onclick'] = top_damage_friend;
      _0xdbf0x254['appendChild'](_0xdbf0x137);
      _0xdbf0x75['appendChild'](_0xdbf0x254);
      var _0xdbf0x255 = document['createElement']('div');
      _0xdbf0x255['className'] = 'top_damage_icon';
      var _0xdbf0x1e7 = document['createElement']('img');
      _0xdbf0x1e7['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_kill_icon.png';
      _0xdbf0x255['appendChild'](_0xdbf0x1e7);
      _0xdbf0x75['appendChild'](_0xdbf0x255);
      var _0xdbf0x256 = document['createElement']('div');
      _0xdbf0x256['className'] = 'top_damage_count';
      if (_0xdbf0x24d == 0) {
        _0xdbf0x256['innerHTML'] = window['player']['static_resources']['damage_in_top']['toLocaleString']()
      } else {
        _0xdbf0x256['innerHTML'] = window['player']['static_resources']['damage_in_top_old']['toLocaleString']()
      };
      _0xdbf0x75['appendChild'](_0xdbf0x256)
    }
  };
  if (_0xdbf0x24d == 0) {
    var _0xdbf0x9f = document['getElementsByClassName']('old_top_damage')[0];
    _0xdbf0x9f['innerHTML'] = 'Предыдущий ТОП';
    _0xdbf0x9f['onclick'] = out_top_damage_1;
    _0xdbf0x9f['className'] = 'old_top_damage button_wide button_wide_orange';
    var _0xdbf0x36 = document['getElementsByClassName']('top_damage_timer')[0];
    while (_0xdbf0x36['firstChild']) {
      _0xdbf0x36['removeChild'](_0xdbf0x36['firstChild'])
    };
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/timer.png';
    _0xdbf0x36['appendChild'](_0xdbf0x90);
    var _0xdbf0x137 = document['createElement']('span');
    _0xdbf0x36['appendChild'](_0xdbf0x137);
    update_top_damage_popup_timer();
    window['utdpt'] = setInterval(update_top_damage_popup_timer, 1000)
  } else {
    clearTimeout(window['utdpt']);
    var _0xdbf0x9f = document['getElementsByClassName']('old_top_damage')[0];
    _0xdbf0x9f['innerHTML'] = 'Текущий ТОП';
    _0xdbf0x9f['onclick'] = out_top_damage_0;
    _0xdbf0x9f['className'] = 'old_top_damage button_wide button_wide_red';
    document['getElementsByClassName']('top_damage_timer')[0]['innerHTML'] = 'Результаты прошлого ТОПа'
  };
  mode_top_damage_0()
}

function show_top_damage() {
  out_top_damage(0);
  document['getElementsByClassName']('old_top_damage')[0]['onclick'] = out_top_damage_1;
  document['getElementsByClassName']('top_damage_reward')[0]['onclick'] = mode_top_damage_1;
  show_modal('top_damage_block', 450);
  document['getElementById']('modal_close')['onclick'] = hide_top_damage
}

function hide_top_damage() {
  play_effect('click.mp3');
  clearTimeout(window['utdpt']);
  hide_modal('top_damage_block')
}

function mode_top_damage_0() {
  change_mode_top_damage(0)
}

function mode_top_damage_1() {
  play_effect('click.mp3');
  change_mode_top_damage(1)
}

function change_mode_top_damage(_0xdbf0x5d) {
  var _0xdbf0x36 = document['getElementsByClassName']('top_damage_scroll')[0];
  var _0xdbf0x9f = document['getElementsByClassName']('top_damage_reward')[0];
  var _0xdbf0x25c = document['getElementsByClassName']('top_damage_my')[0];
  if (_0xdbf0x5d == 0) {
    document['getElementsByClassName']('top_damage_timer')[0]['style']['display'] = 'block';
    _0xdbf0x36['className'] = 'top_damage_scroll';
    _0xdbf0x36['getElementsByClassName']('top_damage_list')[0]['style']['display'] = 'block';
    _0xdbf0x36['getElementsByClassName']('top_reward_list')[0]['style']['display'] = 'none';
    _0xdbf0x9f['innerHTML'] = 'Награды';
    _0xdbf0x9f['onclick'] = mode_top_damage_1;
    _0xdbf0x25c['style']['opacity'] = '1'
  } else {
    if (_0xdbf0x5d == 1) {
      document['getElementsByClassName']('top_damage_timer')[0]['style']['display'] = 'none';
      _0xdbf0x36['className'] = 'top_damage_scroll top_reward_scroll';
      _0xdbf0x36['getElementsByClassName']('top_damage_list')[0]['style']['display'] = 'none';
      _0xdbf0x36['getElementsByClassName']('top_reward_list')[0]['style']['display'] = 'block';
      _0xdbf0x9f['innerHTML'] = 'В топ';
      _0xdbf0x9f['onclick'] = function() {
        play_effect('click.mp3');
        mode_top_damage_0()
      };
      _0xdbf0x25c['style']['opacity'] = '0';
      var _0xdbf0x55 = document['getElementsByClassName']('top_reward_list')[0];
      while (_0xdbf0x55['firstChild']) {
        _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
      };
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['tops_reward']['damage']['length']; _0xdbf0x4++) {
        var _0xdbf0x8e = document['createElement']('div');
        _0xdbf0x8e['className'] = 'top_reward_item d-flex';
        var _0xdbf0x26 = document['createElement']('div');
        _0xdbf0x26['innerHTML'] = window['tops_reward']['damage'][_0xdbf0x4]['title'];
        _0xdbf0x26['className'] = 'top_reward_num';
        _0xdbf0x8e['appendChild'](_0xdbf0x26);
        var _0xdbf0x25d = document['createElement']('div');
        _0xdbf0x25d['className'] = 'top_reward_tokens';
        var _0xdbf0x25e = document['createElement']('img');
        _0xdbf0x25e['src'] = 'https://cdn.bravegames.space/regiment/images/tokens_interface.png';
        _0xdbf0x25d['appendChild'](_0xdbf0x25e);
        var _0xdbf0x25f = document['createElement']('span');
        _0xdbf0x25f['innerHTML'] = '+' + window['tops_reward']['damage'][_0xdbf0x4]['reward']['tokens'];
        _0xdbf0x25d['appendChild'](_0xdbf0x25f);
        _0xdbf0x8e['appendChild'](_0xdbf0x25d);
        var _0xdbf0x188 = document['createElement']('div');
        _0xdbf0x188['className'] = 'top_reward_box';
        var _0xdbf0x260 = document['createElement']('img');
        _0xdbf0x260['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + window['tops_reward']['damage'][_0xdbf0x4]['reward']['box_type'] + '-middle.png';
        _0xdbf0x188['appendChild'](_0xdbf0x260);
        var _0xdbf0x261 = document['createElement']('span');
        _0xdbf0x261['innerHTML'] = '+' + window['tops_reward']['damage'][_0xdbf0x4]['reward']['box_count'];
        _0xdbf0x188['appendChild'](_0xdbf0x261);
        _0xdbf0x8e['appendChild'](_0xdbf0x188);
        _0xdbf0x55['appendChild'](_0xdbf0x8e)
      }
    }
  }
}

function rte_mouseover() {
  if (window['loc_page'] == 'boss_map') {
    document['getElementsByClassName']('game_block')[0]['style']['zIndex'] = '2'
  }
}

function update_top_damage_popup_timer() {
  var _0xdbf0x76 = window['system']['time_resources']['top_damage'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 86400;
  var _0xdbf0x85 = (_0xdbf0x76 - _0xdbf0x6) / 86400;
  var _0xdbf0x86 = _0xdbf0x6 % 3600;
  var _0xdbf0x87 = (_0xdbf0x6 - _0xdbf0x86) / 3600;
  var _0xdbf0x88 = _0xdbf0x86 % 60;
  var _0xdbf0x89 = (_0xdbf0x86 - _0xdbf0x88) / 60;
  var _0xdbf0x137 = document['getElementsByClassName']('top_damage_timer')[0]['getElementsByTagName']('span')[0];
  if (_0xdbf0x85 > 0) {
    _0xdbf0x137['innerHTML'] = word_form(_0xdbf0x85, 'день', 'дня', 'дней')
  } else {
    var _0xdbf0x2c = _0xdbf0x87 + ':';
    if (_0xdbf0x89 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
    } else {
      _0xdbf0x2c += _0xdbf0x89 + ':'
    };
    if (_0xdbf0x88 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x88
    } else {
      _0xdbf0x2c += _0xdbf0x88
    };
    _0xdbf0x137['innerHTML'] = _0xdbf0x2c
  }
}

function rte_mouseout() {
  if (window['loc_page'] == 'boss_map') {
    document['getElementsByClassName']('game_block')[0]['style']['zIndex'] = '3'
  }
}

function show_not_level() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_not_level')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('talents_not_level_button')[0]['onclick'] = hide_not_level
}

function hide_not_level() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_not_level')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function show_talents() {
  if (window['player']['static_resources']['level'] >= 10) {
    play_music('background.mp3');
    document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('missions_map')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('sector_map')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('bosses_map')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('footer')[0]['style']['display'] = 'none';
    var _0xdbf0x36 = document['getElementsByClassName']('talents')[0];
    _0xdbf0x36['style']['display'] = 'block';
    _0xdbf0x36['getElementsByClassName']('boss_wiki_icon')[0]['onclick'] = tutorial_talents;
    _0xdbf0x36['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
      clearTimeout(window['ubt']);
      hide_talents(0)
    };
    _0xdbf0x36['getElementsByClassName']('talents_new')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['new_talents'];
    _0xdbf0x36['getElementsByClassName']('talents_used')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['used_talents'];
    _0xdbf0x36['getElementsByClassName']('talents_boss_health_count')[0]['innerHTML'] = window['bosses'][17]['health'][window['player']['static_resources']['boss_17_level']]['toLocaleString']();
    _0xdbf0x36['getElementsByClassName']('talents_desc_name')[0]['innerHTML'] = window['bosses'][17]['short_name'];
    var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['boss_17_win'], 1, 86400);
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('talents_desc_button')[0];
    _0xdbf0x9f['getElementsByClassName']('talents_desc_button_count')[0]['innerHTML'] = _0xdbf0xd5 + '/10';
    talents_rang(0);
    timer_talents();
    window['ubt'] = setInterval(timer_talents, 1000);
    if (window['player']['static_resources']['tutorial_talents'] == 0) {
      tutorial_talents()
    }
  } else {
    show_not_level()
  }
}

function timer_talents() {
  var _0xdbf0xe4 = window['system']['time_resources']['new_day'] - 86401;
  var _0xdbf0x76 = window['bosses'][17]['start_time'];
  while (_0xdbf0x76 < _0xdbf0xe4) {
    _0xdbf0x76 += 604800
  };
  var _0xdbf0x269 = 0;
  var _0xdbf0x26a = _0xdbf0x76 + 86400;
  var _0xdbf0x75 = get_current_timestamp();
  if (_0xdbf0x75 > _0xdbf0x76 && _0xdbf0x75 < _0xdbf0x26a) {
    _0xdbf0x269 = 1
  };
  var _0xdbf0x36 = document['getElementsByClassName']('talents')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('talents_desc_timer')[0]['getElementsByTagName']('span');
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('talents_desc_button')[0];
  if (_0xdbf0x269 == 0) {
    _0xdbf0x36['getElementsByClassName']('talents_boss')[0]['classList']['remove']('active');
    _0xdbf0x9f['style']['filter'] = 'grayscale(1)';
    _0xdbf0x9f['style']['cursor'] = 'default';
    _0xdbf0x9f['onclick'] = show_boss_disabled;
    _0xdbf0x55[0]['innerHTML'] = 'Через';
    var _0xdbf0x76 = _0xdbf0x26a - _0xdbf0x75 - 86400;
    var _0xdbf0x6 = _0xdbf0x76 % 86400;
    var _0xdbf0x26b = (_0xdbf0x76 - _0xdbf0x6) / 86400;
    if (_0xdbf0x26b > 0 && _0xdbf0x6 > 0) {
      _0xdbf0x26b++
    };
    if (_0xdbf0x26b > 0) {
      var _0xdbf0x2c = word_form(_0xdbf0x26b, 'день', 'дня', 'дней')
    } else {
      var _0xdbf0x86 = _0xdbf0x6 % 3600;
      var _0xdbf0x87 = (_0xdbf0x6 - _0xdbf0x86) / 3600;
      if (_0xdbf0x87 == 0) {
        var _0xdbf0x2c = '00:'
      } else {
        if (_0xdbf0x87 >= 1 && _0xdbf0x87 <= 9) {
          var _0xdbf0x2c = '0' + _0xdbf0x87 + ':'
        } else {
          if (_0xdbf0x87 >= 10 && _0xdbf0x87 <= 23) {
            var _0xdbf0x2c = _0xdbf0x87 + ':'
          }
        }
      };
      var _0xdbf0x88 = _0xdbf0x86 % 60;
      var _0xdbf0x89 = (_0xdbf0x86 - _0xdbf0x88) / 60;
      if (_0xdbf0x89 < 10) {
        _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
      } else {
        _0xdbf0x2c += _0xdbf0x89 + ':'
      };
      if (_0xdbf0x88 < 10) {
        _0xdbf0x2c += '0' + _0xdbf0x88
      } else {
        _0xdbf0x2c += _0xdbf0x88
      }
    };
    _0xdbf0x55[1]['innerHTML'] = _0xdbf0x2c
  } else {
    if (_0xdbf0x269 == 1) {
      _0xdbf0x36['getElementsByClassName']('talents_boss')[0]['classList']['add']('active');
      _0xdbf0x9f['style']['filter'] = '';
      _0xdbf0x9f['style']['cursor'] = 'pointer';
      _0xdbf0x9f['onclick'] = raid_talent;
      _0xdbf0x55[0]['innerHTML'] = 'Осталось: ';
      var _0xdbf0x76 = _0xdbf0x26a - _0xdbf0x75;
      var _0xdbf0x6 = _0xdbf0x76 % 3600;
      var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
      if (_0xdbf0x87 == 0) {
        var _0xdbf0x2c = '00:'
      } else {
        if (_0xdbf0x87 >= 1 && _0xdbf0x87 <= 9) {
          var _0xdbf0x2c = '0' + _0xdbf0x87 + ':'
        } else {
          if (_0xdbf0x87 >= 10 && _0xdbf0x87 <= 23) {
            var _0xdbf0x2c = _0xdbf0x87 + ':'
          }
        }
      };
      var _0xdbf0x88 = _0xdbf0x6 % 60;
      var _0xdbf0x89 = (_0xdbf0x6 - _0xdbf0x88) / 60;
      if (_0xdbf0x89 < 10) {
        _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
      } else {
        _0xdbf0x2c += _0xdbf0x89 + ':'
      };
      if (_0xdbf0x88 < 10) {
        _0xdbf0x2c += '0' + _0xdbf0x88
      } else {
        _0xdbf0x2c += _0xdbf0x88
      };
      _0xdbf0x55[1]['innerHTML'] = _0xdbf0x2c
    }
  }
}

function hide_talents(_0xdbf0x10f) {
  if (_0xdbf0x10f == 0) {
    play_effect('click.mp3')
  };
  show_homeland()
}

function tutorial_talents() {
  var _0xdbf0x36 = document['getElementsByClassName']('header')[0];
  _0xdbf0x36['style']['pointerEvents'] = 'none';
  _0xdbf0x36['getElementsByClassName']('music_interface')[0]['style']['pointerEvents'] = 'auto';
  _0xdbf0x36['getElementsByClassName']('sound_interface')[0]['style']['pointerEvents'] = 'auto';
  show_tutorial(33)
}

function raid_talent() {
  var _0xdbf0x26f = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['talents']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['talents'][_0xdbf0x4]['length']; _0xdbf0x38++) {
      _0xdbf0x26f += window['talents'][_0xdbf0x4][_0xdbf0x38]['amount']
    }
  };
  var _0xdbf0x270 = window['player']['static_resources']['used_talents'] + window['player']['static_resources']['new_talents'];
  if (_0xdbf0x270 >= _0xdbf0x26f) {
    show_talents_full()
  } else {
    if (window['player']['raid']['health'] !== undefined) {
      play_effect('click.mp3');
      show_raid_process()
    } else {
      var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['boss_17_win'], 1, 86400);
      if (_0xdbf0xd5 < 10) {
        start_raid_talent(0)
      } else {
        if (_0xdbf0xd5 < 20) {
          play_effect('click.mp3');
          show_paid_raid_talent()
        } else {
          show_limit_raid_talent()
        }
      }
    }
  }
}

function show_boss_disabled() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_boss_disabled')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('talents_boss_disabled_button')[0]['onclick'] = hide_boss_disabled
}

function hide_boss_disabled() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_boss_disabled')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function show_talents_full() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_full')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('talents_full_button')[0]['onclick'] = hide_talents_full
}

function hide_talents_full() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_full')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function start_raid_talent(_0xdbf0x5d) {
  clearTimeout(window['ubt']);
  hide_talents(1);
  window['count_weapons'] = 0;
  window['player']['raid']['boss'] = 17;
  window['player']['static_resources']['used_free_hit_0'] = 0;
  window['player']['static_resources']['used_free_hit_1'] = 0;
  window['player']['static_resources']['used_free_hit_2'] = 0;
  if (_0xdbf0x5d == 0) {
    window['player']['raid']['paid_mode'] = 0;
    var _0xdbf0xe9 = window['bosses'][17]['health'][window['player']['static_resources']['boss_17_level']];
    server_action('talents.start', {})
  } else {
    if (_0xdbf0x5d == 1) {
      window['player']['static_resources']['tickets'] -= window['talents_price_paid_fight'];
      update_static_resources_tickets();
      window['player']['raid']['paid_mode'] = 1;
      var _0xdbf0xe9 = 3 * window['bosses'][17]['health'][window['player']['static_resources']['boss_17_level']];
      server_action('talents.paid_start', {})
    }
  };
  window['player']['raid']['health'] = _0xdbf0xe9;
  window['player']['raid']['start_time'] = get_current_timestamp();
  window['player']['raid']['finish_time'] = get_current_timestamp() + 28800 + window['player']['static_resources']['boost_fight_time'];
  show_boss_fight()
}

function show_limit_raid_talent() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_boss_limit')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('talents_boss_limit_button')[0]['onclick'] = hide_limit_raid_talent
}

function hide_limit_raid_talent() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_boss_limit')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function show_paid_raid_talent() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('paid_battles')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('paid_battles_price')[0]['getElementsByTagName']('span')[0]['innerHTML'] = word_form(window['talents_price_paid_fight'], 'талон', 'талона', 'талонов');
  _0xdbf0x36['getElementsByClassName']('paid_battles_button_yes')[0]['onclick'] = function() {
    if (window['player']['static_resources']['tickets'] >= window['talents_price_paid_fight']) {
      hide_paid_raid_talent(1);
      start_raid_talent(1)
    } else {
      hide_paid_raid_talent(0);
      show_modal_no_tickets()
    }
  };
  _0xdbf0x36['getElementsByClassName']('paid_battles_button_no')[0]['onclick'] = function() {
    hide_paid_raid_talent(0)
  }
}

function hide_paid_raid_talent(_0xdbf0x10f) {
  if (_0xdbf0x10f == 0) {
    play_effect('click.mp3')
  };
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('paid_battles')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function show_raid_process() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('battle_begun')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('battle_begun_button')[0]['onclick'] = function() {
    clearTimeout(window['ubt']);
    hide_raid_process();
    hide_talents(1);
    show_raids()
  }
}

function hide_raid_process() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('battle_begun')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function talents_use() {
  if (window['player']['static_resources']['new_talents'] >= 1) {
    this['style']['transform'] = 'scale(1.1)';
    setTimeout(cancale_scale_talent, 50, this);
    var _0xdbf0x9a = parseInt(this['dataset']['tid']);
    var _0xdbf0xab = parseInt(this['dataset']['trid']);
    var _0xdbf0x36 = document['getElementsByClassName']('talents')[0];
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('talents_list')[0];
    rang = parseInt(_0xdbf0x55['dataset']['rang']);
    server_action('talents.use', {
      "talent": _0xdbf0x9a
    });
    if (window['player']['static_resources']['boost_' + window['talents'][rang][_0xdbf0xab]['boost']]) {
      window['player']['static_resources']['boost_' + window['talents'][rang][_0xdbf0xab]['boost']] += window['talents'][rang][_0xdbf0xab]['step']
    } else {
      window['player']['static_resources']['boost_' + window['talents'][rang][_0xdbf0xab]['boost']] = window['talents'][rang][_0xdbf0xab]['step']
    };
    if (window['player']['talents'][_0xdbf0x9a]) {
      window['player']['talents'][_0xdbf0x9a]++
    } else {
      window['player']['talents'][_0xdbf0x9a] = 1
    };
    window['player']['static_resources']['new_talents']--;
    window['player']['static_resources']['used_talents']++;
    var _0xdbf0x36 = document['getElementsByClassName']('talents')[0];
    _0xdbf0x36['getElementsByClassName']('talents_new')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['new_talents'];
    _0xdbf0x36['getElementsByClassName']('talents_used')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['used_talents'];
    setTimeout(talents_rang, 50, rang)
  } else {
    show_talents_no_points()
  }
}

function cancale_scale_talent(_0xdbf0xa2) {
  _0xdbf0xa2['style']['transform'] = 'scale(1)'
}

function show_talents_no_points() {
  play_effect('click.mp3');
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_no_points')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('talents_no_points_button')[0]['onclick'] = hide_talents_no_points
}

function hide_talents_no_points() {
  play_effect('click.mp3');
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = '5';
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('talents_no_points')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function talents_rang(_0xdbf0x281) {
  play_effect('click.mp3');
  var _0xdbf0x36 = document['getElementsByClassName']('talents')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('talents_list')[0];
  _0xdbf0x55['dataset']['rang'] = _0xdbf0x281;
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  if (_0xdbf0x281 == 0) {
    var _0xdbf0x38 = 0
  };
  var _0xdbf0x282 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 6; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0x26 = 0;
    if (window['player']['talents'] && window['player']['talents'][_0xdbf0x38]) {
      var _0xdbf0x26 = window['player']['talents'][_0xdbf0x38]
    };
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['dataset']['tid'] = _0xdbf0x38;
    _0xdbf0x8e['dataset']['trid'] = _0xdbf0x4;
    _0xdbf0x8e['className'] = 'talents_item';
    var _0xdbf0x283 = 1;
    if (_0xdbf0x26 > 0) {
      _0xdbf0x8e['className'] = 'talents_item active';
      if (_0xdbf0x26 < window['talents'][_0xdbf0x281][_0xdbf0x4]['amount']) {
        _0xdbf0x8e['onclick'] = talents_use;
        _0xdbf0x8e['style']['cursor'] = 'pointer';
        _0xdbf0x282 = 1
      } else {
        _0xdbf0x8e['onclick'] = '';
        _0xdbf0x8e['style']['cursor'] = 'default'
      };
      _0xdbf0x283 = 0
    } else {
      if (_0xdbf0x26 == 0 && _0xdbf0x282 == 0) {
        _0xdbf0x8e['className'] = 'talents_item active';
        _0xdbf0x8e['onclick'] = talents_use;
        _0xdbf0x8e['style']['cursor'] = 'pointer';
        _0xdbf0x282 = 1;
        _0xdbf0x283 = 0
      }
    };
    var _0xdbf0xc8 = document['createElement']('div');
    _0xdbf0xc8['className'] = 'talents_item_image';
    var _0xdbf0x90 = document['createElement']('img');
    if (_0xdbf0x283 == 1) {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/talents/default.jpg'
    } else {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/talents/talent_' + (_0xdbf0x4 + 1) + '.jpg'
    };
    _0xdbf0xc8['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0xc8);
    var _0xdbf0x186 = document['createElement']('div');
    _0xdbf0x186['className'] = 'talents_item_frame';
    _0xdbf0x8e['appendChild'](_0xdbf0x186);
    var _0xdbf0x15 = document['createElement']('div');
    if (_0xdbf0x283 == 1) {
      _0xdbf0x15['innerHTML'] = '-/-'
    } else {
      _0xdbf0x15['innerHTML'] = _0xdbf0x26 + '/' + window['talents'][_0xdbf0x281][_0xdbf0x4]['amount']
    };
    _0xdbf0x15['className'] = 'talents_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0x15);
    if (_0xdbf0x283 == 0) {
      var _0xdbf0x284 = document['createElement']('div');
      _0xdbf0x284['className'] = 'talents_tooltip';
      var _0xdbf0xbe = document['createElement']('h5');
      _0xdbf0xbe['innerHTML'] = window['talents'][_0xdbf0x281][_0xdbf0x4]['title'];
      _0xdbf0x284['appendChild'](_0xdbf0xbe);
      var _0xdbf0x285 = document['createElement']('p');
      _0xdbf0x285['innerHTML'] = window['talents'][_0xdbf0x281][_0xdbf0x4]['descr'];
      _0xdbf0x284['appendChild'](_0xdbf0x285);
      _0xdbf0x8e['appendChild'](_0xdbf0x284)
    };
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  _0xdbf0x4 += 5;
  _0xdbf0x38 += 5;
  for (; _0xdbf0x4 >= 6; _0xdbf0x4--, _0xdbf0x38--) {
    var _0xdbf0x26 = 0;
    if (window['player']['talents'] && window['player']['talents'][_0xdbf0x38]) {
      var _0xdbf0x26 = window['player']['talents'][_0xdbf0x38]
    };
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['dataset']['tid'] = _0xdbf0x38;
    _0xdbf0x8e['dataset']['trid'] = _0xdbf0x4;
    _0xdbf0x8e['className'] = 'talents_item';
    var _0xdbf0x283 = 1;
    if (_0xdbf0x26 > 0) {
      _0xdbf0x8e['className'] = 'talents_item active';
      if (_0xdbf0x26 < window['talents'][_0xdbf0x281][_0xdbf0x4]['amount']) {
        _0xdbf0x8e['onclick'] = talents_use;
        _0xdbf0x8e['style']['cursor'] = 'pointer';
        _0xdbf0x282 = 1
      } else {
        _0xdbf0x8e['onclick'] = '';
        _0xdbf0x8e['style']['cursor'] = 'default'
      };
      _0xdbf0x283 = 0
    } else {
      if (_0xdbf0x26 == 0 && _0xdbf0x282 == 0) {
        if (window['player']['talents'][_0xdbf0x38 - 1] == window['talents'][_0xdbf0x281][_0xdbf0x4 - 1]['amount']) {
          _0xdbf0x8e['className'] = 'talents_item active';
          _0xdbf0x8e['onclick'] = talents_use;
          _0xdbf0x8e['style']['cursor'] = 'pointer';
          _0xdbf0x282 = 1;
          _0xdbf0x283 = 0
        }
      }
    };
    var _0xdbf0xc8 = document['createElement']('div');
    _0xdbf0xc8['className'] = 'talents_item_image';
    var _0xdbf0x90 = document['createElement']('img');
    if (_0xdbf0x283 == 1) {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/talents/default.jpg'
    } else {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/talents/talent_' + (_0xdbf0x4 + 1) + '.jpg'
    };
    _0xdbf0xc8['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0xc8);
    var _0xdbf0x186 = document['createElement']('div');
    _0xdbf0x186['className'] = 'talents_item_frame';
    _0xdbf0x8e['appendChild'](_0xdbf0x186);
    var _0xdbf0x15 = document['createElement']('div');
    if (_0xdbf0x283 == 1) {
      _0xdbf0x15['innerHTML'] = '-/-'
    } else {
      _0xdbf0x15['innerHTML'] = _0xdbf0x26 + '/' + window['talents'][_0xdbf0x281][_0xdbf0x4]['amount']
    };
    _0xdbf0x15['className'] = 'talents_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0x15);
    if (_0xdbf0x283 == 0) {
      var _0xdbf0x284 = document['createElement']('div');
      _0xdbf0x284['className'] = 'talents_tooltip';
      var _0xdbf0xbe = document['createElement']('h5');
      _0xdbf0xbe['innerHTML'] = window['talents'][_0xdbf0x281][_0xdbf0x4]['title'];
      _0xdbf0x284['appendChild'](_0xdbf0xbe);
      var _0xdbf0x285 = document['createElement']('p');
      _0xdbf0x285['innerHTML'] = window['talents'][_0xdbf0x281][_0xdbf0x4]['descr'];
      _0xdbf0x284['appendChild'](_0xdbf0x285);
      _0xdbf0x8e['appendChild'](_0xdbf0x284)
    };
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  _0xdbf0x4 += 7;
  _0xdbf0x38 += 7;
  for (; _0xdbf0x4 < 18; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0x26 = 0;
    if (window['player']['talents'] && window['player']['talents'][_0xdbf0x38]) {
      var _0xdbf0x26 = window['player']['talents'][_0xdbf0x38]
    };
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['dataset']['tid'] = _0xdbf0x38;
    _0xdbf0x8e['dataset']['trid'] = _0xdbf0x4;
    _0xdbf0x8e['className'] = 'talents_item';
    var _0xdbf0x283 = 1;
    if (_0xdbf0x26 > 0) {
      _0xdbf0x8e['className'] = 'talents_item active';
      if (_0xdbf0x26 < window['talents'][_0xdbf0x281][_0xdbf0x4]['amount']) {
        _0xdbf0x8e['onclick'] = talents_use;
        _0xdbf0x8e['style']['cursor'] = 'pointer';
        _0xdbf0x282 = 1
      } else {
        _0xdbf0x8e['onclick'] = '';
        _0xdbf0x8e['style']['cursor'] = 'default'
      };
      _0xdbf0x283 = 0
    } else {
      if (_0xdbf0x26 == 0 && _0xdbf0x282 == 0) {
        _0xdbf0x8e['className'] = 'talents_item active';
        _0xdbf0x8e['onclick'] = talents_use;
        _0xdbf0x8e['style']['cursor'] = 'pointer';
        _0xdbf0x282 = 1;
        _0xdbf0x283 = 0
      }
    };
    var _0xdbf0xc8 = document['createElement']('div');
    _0xdbf0xc8['className'] = 'talents_item_image';
    var _0xdbf0x90 = document['createElement']('img');
    if (_0xdbf0x283 == 1) {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/talents/default.jpg'
    } else {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/talents/talent_' + (_0xdbf0x4 + 1) + '.jpg'
    };
    _0xdbf0xc8['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0xc8);
    var _0xdbf0x186 = document['createElement']('div');
    _0xdbf0x186['className'] = 'talents_item_frame';
    _0xdbf0x8e['appendChild'](_0xdbf0x186);
    var _0xdbf0x15 = document['createElement']('div');
    if (_0xdbf0x283 == 1) {
      _0xdbf0x15['innerHTML'] = '-/-'
    } else {
      _0xdbf0x15['innerHTML'] = _0xdbf0x26 + '/' + window['talents'][_0xdbf0x281][_0xdbf0x4]['amount']
    };
    _0xdbf0x15['className'] = 'talents_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0x15);
    if (_0xdbf0x283 == 0) {
      var _0xdbf0x284 = document['createElement']('div');
      _0xdbf0x284['className'] = 'talents_tooltip';
      var _0xdbf0xbe = document['createElement']('h5');
      _0xdbf0xbe['innerHTML'] = window['talents'][_0xdbf0x281][_0xdbf0x4]['title'];
      _0xdbf0x284['appendChild'](_0xdbf0xbe);
      var _0xdbf0x285 = document['createElement']('p');
      _0xdbf0x285['innerHTML'] = window['talents'][_0xdbf0x281][_0xdbf0x4]['descr'];
      _0xdbf0x284['appendChild'](_0xdbf0x285);
      _0xdbf0x8e['appendChild'](_0xdbf0x284)
    };
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  _0xdbf0x4 += 5;
  _0xdbf0x38 += 5;
  for (; _0xdbf0x4 >= 18; _0xdbf0x4--, _0xdbf0x38--) {
    var _0xdbf0x26 = 0;
    if (window['player']['talents'] && window['player']['talents'][_0xdbf0x38]) {
      var _0xdbf0x26 = window['player']['talents'][_0xdbf0x38]
    };
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['dataset']['tid'] = _0xdbf0x38;
    _0xdbf0x8e['dataset']['trid'] = _0xdbf0x4;
    _0xdbf0x8e['className'] = 'talents_item';
    var _0xdbf0x283 = 1;
    if (_0xdbf0x26 > 0) {
      _0xdbf0x8e['className'] = 'talents_item active';
      if (_0xdbf0x26 < window['talents'][_0xdbf0x281][_0xdbf0x4]['amount']) {
        _0xdbf0x8e['onclick'] = talents_use;
        _0xdbf0x8e['style']['cursor'] = 'pointer';
        _0xdbf0x282 = 1
      } else {
        _0xdbf0x8e['onclick'] = '';
        _0xdbf0x8e['style']['cursor'] = 'default'
      };
      _0xdbf0x283 = 0
    } else {
      if (_0xdbf0x26 == 0 && _0xdbf0x282 == 0) {
        if (window['player']['talents'][_0xdbf0x38 - 1] == window['talents'][_0xdbf0x281][_0xdbf0x4 - 1]['amount']) {
          _0xdbf0x8e['className'] = 'talents_item active';
          _0xdbf0x8e['onclick'] = talents_use;
          _0xdbf0x8e['style']['cursor'] = 'pointer';
          _0xdbf0x282 = 1;
          _0xdbf0x283 = 0
        }
      }
    };
    var _0xdbf0xc8 = document['createElement']('div');
    _0xdbf0xc8['className'] = 'talents_item_image';
    var _0xdbf0x90 = document['createElement']('img');
    if (_0xdbf0x283 == 1) {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/talents/default.jpg'
    } else {
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/talents/talent_' + (_0xdbf0x4 + 1) + '.jpg'
    };
    _0xdbf0xc8['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0xc8);
    var _0xdbf0x186 = document['createElement']('div');
    _0xdbf0x186['className'] = 'talents_item_frame';
    _0xdbf0x8e['appendChild'](_0xdbf0x186);
    var _0xdbf0x15 = document['createElement']('div');
    if (_0xdbf0x283 == 1) {
      _0xdbf0x15['innerHTML'] = '-/-'
    } else {
      _0xdbf0x15['innerHTML'] = _0xdbf0x26 + '/' + window['talents'][_0xdbf0x281][_0xdbf0x4]['amount']
    };
    _0xdbf0x15['className'] = 'talents_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0x15);
    var _0xdbf0x284 = document['createElement']('div');
    _0xdbf0x284['className'] = 'talents_tooltip';
    if (_0xdbf0x283 == 0) {
      var _0xdbf0xbe = document['createElement']('h5');
      _0xdbf0xbe['innerHTML'] = window['talents'][_0xdbf0x281][_0xdbf0x4]['title'];
      _0xdbf0x284['appendChild'](_0xdbf0xbe);
      var _0xdbf0x285 = document['createElement']('p');
      _0xdbf0x285['innerHTML'] = window['talents'][_0xdbf0x281][_0xdbf0x4]['descr'];
      _0xdbf0x284['appendChild'](_0xdbf0x285);
      _0xdbf0x8e['appendChild'](_0xdbf0x284)
    };
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  }
}

function show_weapons() {
  play_effect('click.mp3');
  var _0xdbf0x55 = document['getElementsByClassName']('weapon_left')[0]['getElementsByClassName']('weapon_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
    var _0xdbf0x8e = _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('weapon_item_time')[0];
    _0xdbf0x8e['setAttribute']('tooltipmission', window['free_hits'][_0xdbf0x4]['name'] + '\x0AУрон: ' + number_format(_0xdbf0xea))
  };
  for (var _0xdbf0x4 = 3, _0xdbf0x38 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0xea = window['weapons_damage'][_0xdbf0x38]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x38];
    var _0xdbf0x8e = _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('weapon_item_count')[0];
    _0xdbf0x8e['setAttribute']('tooltipmission', window['weapons_damage'][_0xdbf0x38]['name'] + '\x0AУрон: ' + number_format(_0xdbf0xea));
    _0xdbf0x8e['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['weapon_' + _0xdbf0x38];
    _0xdbf0x8e['getElementsByTagName']('i')[0]['onclick'] = window['show_buy_weapons_' + _0xdbf0x38]
  };
  var _0xdbf0x55 = document['getElementsByClassName']('weapon_right')[0]['getElementsByClassName']('weapon_item');
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 2; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0xea = window['weapons_damage'][_0xdbf0x38]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x38];
    var _0xdbf0x8e = _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('weapon_item_count')[0];
    _0xdbf0x8e['setAttribute']('tooltipmission', window['weapons_damage'][_0xdbf0x38]['name'] + '\x0AУрон: ' + number_format(_0xdbf0xea));
    _0xdbf0x8e['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['weapon_' + _0xdbf0x38];
    _0xdbf0x8e['getElementsByTagName']('i')[0]['onclick'] = window['show_buy_weapons_' + _0xdbf0x38]
  };
  show_modal('weapons_block', 420)
}

function top_damage_final_friends_click() {
  window['fire_work_stop'] = 1;
  hide_modal('boss_result_fight');
  hide_boss_fight(0);
  var _0xdbf0x9a = parseInt(this['dataset']['fid']);
  if (_0xdbf0x9a != window['game_login']) {
    show_friend_help(_0xdbf0x9a)
  } else {
    show_my_profile()
  }
}

function top_damage_final_generate(_0xdbf0x9a, _0xdbf0xea, _0xdbf0x289) {
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'boss_result_top_item';
  if (_0xdbf0x9a == window['game_login']) {
    _0xdbf0x8e['classList']['add']('my_top_background')
  };
  if (_0xdbf0x289 == 1) {
    _0xdbf0x8e['classList']['add']('my_top_position')
  };
  var _0xdbf0x136 = document['createElement']('div');
  _0xdbf0x136['className'] = 'boss_result_top_item_avatar';
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/add_friend.png';
  _0xdbf0x136['appendChild'](_0xdbf0x90);
  _0xdbf0x136['dataset']['fid'] = _0xdbf0x9a;
  _0xdbf0x8e['appendChild'](_0xdbf0x136);
  var _0xdbf0x3d = document['createElement']('div');
  _0xdbf0x3d['className'] = 'boss_result_top_item_name';
  var _0xdbf0x137 = document['createElement']('span');
  _0xdbf0x137['innerHTML'] = 'Загрузка...';
  _0xdbf0x137['style']['cursor'] = 'default';
  _0xdbf0x137['dataset']['fid'] = _0xdbf0x9a;
  _0xdbf0x3d['appendChild'](_0xdbf0x137);
  _0xdbf0x8e['appendChild'](_0xdbf0x3d);
  var _0xdbf0x15 = document['createElement']('div');
  _0xdbf0x15['innerHTML'] = _0xdbf0xea['toLocaleString']();
  _0xdbf0x15['className'] = 'boss_result_top_item_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x15);
  return _0xdbf0x8e
}

function update_top_damage_final() {
  var _0xdbf0x55 = document['getElementsByClassName']('boss_result_top')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var in_array = 0;
  var _0xdbf0x56 = [];
  var _0xdbf0x22 = 4;
  if (window['player']['raid']['top']['length'] < 4) {
    _0xdbf0x22 = window['player']['raid']['top']['length']
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x22; _0xdbf0x4++) {
    var _0xdbf0x8e = top_damage_final_generate(window['player']['raid']['top'][_0xdbf0x4][0], window['player']['raid']['top'][_0xdbf0x4][1], 0);
    _0xdbf0x55['appendChild'](_0xdbf0x8e);
    if (window['player']['raid']['top'][_0xdbf0x4][0] == window['game_login']) {
      in_array = 1
    };
    _0xdbf0x56['push'](window['player']['raid']['top'][_0xdbf0x4][0])
  };
  if (in_array == 0) {
    var _0xdbf0x5e = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['raid']['top']['length']; _0xdbf0x4++) {
      if (window['player']['raid']['top'][_0xdbf0x4][0] == window['game_login']) {
        var _0xdbf0x8e = top_damage_final_generate(window['player']['raid']['top'][_0xdbf0x4][0], window['player']['raid']['top'][_0xdbf0x4][1], 1);
        _0xdbf0x55['appendChild'](_0xdbf0x8e);
        _0xdbf0x56['push'](window['player']['raid']['top'][_0xdbf0x4][0]);
        _0xdbf0x5e = 1
      }
    };
    if (_0xdbf0x5e == 0) {
      if (window['player']['raid']['top']['length'] >= 5) {
        var _0xdbf0x8e = top_damage_final_generate(window['player']['raid']['top'][4][0], window['player']['raid']['top'][4][1], 0);
        _0xdbf0x55['appendChild'](_0xdbf0x8e);
        _0xdbf0x56['push'](window['player']['raid']['top'][4][0])
      }
    }
  } else {
    if (window['player']['raid']['top']['length'] >= 5) {
      var _0xdbf0x8e = top_damage_final_generate(window['player']['raid']['top'][4][0], window['player']['raid']['top'][4][1], 0);
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      _0xdbf0x56['push'](window['player']['raid']['top'][4][0])
    }
  };
  var _0xdbf0x28b = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x56['length']; _0xdbf0x38++) {
      if (_0xdbf0x56[_0xdbf0x38] != -1 && _0xdbf0x56[_0xdbf0x38] == window['friends'][_0xdbf0x4]['id']) {
        if (window['friends'][_0xdbf0x4]['profile']) {
          _0xdbf0x56[_0xdbf0x38] = -1;
          var _0xdbf0x8e = _0xdbf0x55['getElementsByClassName']('boss_result_top_item')[_0xdbf0x38];
          var _0xdbf0x136 = _0xdbf0x8e['getElementsByClassName']('boss_result_top_item_avatar')[0];
          _0xdbf0x136['getElementsByTagName']('img')[0]['src'] = window['friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x136['style']['cursor'] = 'pointer';
          _0xdbf0x136['onclick'] = top_damage_final_friends_click;
          var _0xdbf0x3d = _0xdbf0x8e['getElementsByClassName']('boss_result_top_item_name')[0];
          var _0xdbf0x137 = _0xdbf0x3d['getElementsByTagName']('span')[0];
          _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['style']['cursor'] = 'pointer';
          _0xdbf0x137['onclick'] = top_damage_final_friends_click
        } else {
          _0xdbf0x28b = 1
        }
      }
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x56['length']; _0xdbf0x38++) {
      if (_0xdbf0x56[_0xdbf0x38] != -1 && _0xdbf0x56[_0xdbf0x38] == window['other_friends'][_0xdbf0x4]['id']) {
        if (window['other_friends'][_0xdbf0x4]['profile']) {
          _0xdbf0x56[_0xdbf0x38] = -1;
          var _0xdbf0x8e = _0xdbf0x55['getElementsByClassName']('boss_result_top_item')[_0xdbf0x38];
          var _0xdbf0x136 = _0xdbf0x8e['getElementsByClassName']('boss_result_top_item_avatar')[0];
          _0xdbf0x136['getElementsByTagName']('img')[0]['src'] = window['other_friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x136['style']['cursor'] = 'pointer';
          _0xdbf0x136['onclick'] = top_damage_final_friends_click;
          var _0xdbf0x3d = _0xdbf0x8e['getElementsByClassName']('boss_result_top_item_name')[0];
          var _0xdbf0x137 = _0xdbf0x3d['getElementsByTagName']('span')[0];
          _0xdbf0x137['innerHTML'] = window['other_friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['other_friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['style']['cursor'] = 'pointer';
          _0xdbf0x137['onclick'] = top_damage_final_friends_click
        } else {
          _0xdbf0x28b = 1
        }
      }
    }
  };
  if (_0xdbf0x28b == 1) {
    window['top_damage_final_items'] = _0xdbf0x56;
    setTimeout(update_top_damage_final_repeat, 100)
  } else {
    if (window['player']['static_resources']['tutorial'] == 9) {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'boss_result_top_item';
      var _0xdbf0x136 = document['createElement']('div');
      _0xdbf0x136['className'] = 'boss_result_top_item_avatar';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/epihin.jpg';
      _0xdbf0x136['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x136);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['className'] = 'boss_result_top_item_name';
      var _0xdbf0x137 = document['createElement']('span');
      _0xdbf0x137['innerHTML'] = 'Поддержка из штаба';
      _0xdbf0x137['style']['cursor'] = 'default';
      _0xdbf0x3d['appendChild'](_0xdbf0x137);
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = window['bosses'][0]['health']['toLocaleString']();
      _0xdbf0x15['className'] = 'boss_result_top_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      _0xdbf0x55['appendChild'](_0xdbf0x8e)
    }
  }
}

function update_top_damage_final_repeat() {
  var _0xdbf0x55 = document['getElementsByClassName']('boss_result_top')[0];
  var _0xdbf0x28b = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_damage_final_items']['length']; _0xdbf0x38++) {
      if (window['top_damage_final_items'][_0xdbf0x38] != -1 && window['top_damage_final_items'][_0xdbf0x38] == window['friends'][_0xdbf0x4]['id']) {
        if (window['friends'][_0xdbf0x4]['profile']) {
          window['top_damage_final_items'][_0xdbf0x38] = -1;
          var _0xdbf0x8e = _0xdbf0x55['getElementsByClassName']('boss_result_top_item')[_0xdbf0x38];
          var _0xdbf0x136 = _0xdbf0x8e['getElementsByClassName']('boss_result_top_item_avatar')[0];
          _0xdbf0x136['getElementsByTagName']('img')[0]['src'] = window['friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x136['style']['cursor'] = 'pointer';
          _0xdbf0x136['onclick'] = top_damage_final_friends_click;
          var _0xdbf0x3d = _0xdbf0x8e['getElementsByClassName']('boss_result_top_item_name')[0];
          var _0xdbf0x137 = _0xdbf0x3d['getElementsByTagName']('span')[0];
          _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['style']['cursor'] = 'pointer';
          _0xdbf0x137['onclick'] = top_damage_final_friends_click
        } else {
          _0xdbf0x28b = 1
        }
      }
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_damage_final_items']['length']; _0xdbf0x38++) {
      if (window['top_damage_final_items'][_0xdbf0x38] != -1 && window['top_damage_final_items'][_0xdbf0x38] == window['other_friends'][_0xdbf0x4]['id']) {
        if (window['other_friends'][_0xdbf0x4]['profile']) {
          window['top_damage_final_items'][_0xdbf0x38] = -1;
          var _0xdbf0x8e = _0xdbf0x55['getElementsByClassName']('boss_result_top_item')[_0xdbf0x38];
          var _0xdbf0x136 = _0xdbf0x8e['getElementsByClassName']('boss_result_top_item_avatar')[0];
          _0xdbf0x136['getElementsByTagName']('img')[0]['src'] = window['other_friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x136['style']['cursor'] = 'pointer';
          _0xdbf0x136['onclick'] = top_damage_final_friends_click;
          var _0xdbf0x3d = _0xdbf0x8e['getElementsByClassName']('boss_result_top_item_name')[0];
          var _0xdbf0x137 = _0xdbf0x3d['getElementsByTagName']('span')[0];
          _0xdbf0x137['innerHTML'] = window['other_friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['other_friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['style']['cursor'] = 'pointer';
          _0xdbf0x137['onclick'] = top_damage_final_friends_click
        } else {
          _0xdbf0x28b = 1
        }
      }
    }
  };
  if (_0xdbf0x28b == 1) {
    setTimeout(update_top_damage_final_repeat, 100)
  } else {
    if (window['player']['static_resources']['tutorial'] == 9) {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'boss_result_top_item';
      var _0xdbf0x136 = document['createElement']('div');
      _0xdbf0x136['className'] = 'boss_result_top_item_avatar';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/epihin.jpg';
      _0xdbf0x136['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x136);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['className'] = 'boss_result_top_item_name';
      var _0xdbf0x137 = document['createElement']('span');
      _0xdbf0x137['innerHTML'] = 'Поддержка из штаба';
      _0xdbf0x137['style']['cursor'] = 'default';
      _0xdbf0x3d['appendChild'](_0xdbf0x137);
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = window['bosses'][0]['health']['toLocaleString']();
      _0xdbf0x15['className'] = 'boss_result_top_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      _0xdbf0x55['appendChild'](_0xdbf0x8e)
    }
  }
}

function hide_calendar() {
  play_effect('click.mp3');
  clearTimeout(window['timer']);
  document['getElementsByClassName']('calendar')[0]['style']['display'] = 'none';
  update_calendar_current_day();
  document['getElementsByClassName']('main')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'block'
}

function show_calendar() {
  play_music('background.mp3');
  var _0xdbf0x28f = document['getElementsByClassName']('calendar')[0];
  _0xdbf0x28f['style']['display'] = 'block';
  document['getElementsByClassName']('main')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'none';
  _0xdbf0x28f['getElementsByClassName']('modal_close')[0]['onclick'] = hide_calendar;
  _0xdbf0x28f['getElementsByClassName']('calendar_header')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['calendar_months'][window['system']['moth']]['name'];
  var _0xdbf0xcb = _0xdbf0x28f['getElementsByClassName']('calendar_cups_amount')[0];
  _0xdbf0xcb['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['stamp'];
  var _0xdbf0x290 = window['calendar_months'][window['system']['moth']]['count_days'] * 25;
  _0xdbf0xcb['getElementsByTagName']('span')[1]['innerHTML'] = _0xdbf0x290;
  time_calendar();
  window['timer'] = setInterval(time_calendar, 1000);
  var _0xdbf0x55 = _0xdbf0x28f['getElementsByClassName']('calendar_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x291 = 0;
  for (var _0xdbf0x4 = window['calendar_old_moth']['min']; _0xdbf0x4 <= window['calendar_old_moth']['max']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'calendar_item none';
    _0xdbf0x8e['style']['cursor'] = 'default';
    var _0xdbf0x26b = document['createElement']('div');
    _0xdbf0x26b['innerHTML'] = _0xdbf0x4;
    _0xdbf0x26b['className'] = 'calendar_item_day';
    _0xdbf0x8e['appendChild'](_0xdbf0x26b);
    _0xdbf0x55['append'](_0xdbf0x8e);
    _0xdbf0x291++
  };
  var _0xdbf0x292 = null;
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 1; _0xdbf0x4 < window['calendar_months'][window['system']['moth']]['count_days']; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0x8e = document['createElement']('div');
    var _0xdbf0x293 = 0;
    for (var _0xdbf0xdd = 0; _0xdbf0xdd < 3; _0xdbf0xdd++) {
      if (window['player']['calendar'][window['system']['moth']][_0xdbf0x4][_0xdbf0xdd] >= window['calendar_tasks'][window['system']['moth']][_0xdbf0x4][_0xdbf0xdd]['count']) {
        _0xdbf0x293++
      }
    };
    if (_0xdbf0x4 == window['system']['day']) {
      _0xdbf0x292 = _0xdbf0x8e;
      _0xdbf0x8e['className'] = 'calendar_item current'
    } else {
      if (_0xdbf0x4 < window['system']['day']) {
        if (_0xdbf0x293 == 3) {
          _0xdbf0x8e['className'] = 'calendar_item done'
        } else {
          _0xdbf0x8e['className'] = 'calendar_item failed'
        }
      } else {
        _0xdbf0x8e['className'] = 'calendar_item'
      }
    };
    _0xdbf0x8e['dataset']['day'] = _0xdbf0x4;
    _0xdbf0x8e['onclick'] = calendar_change_view_day;
    var _0xdbf0x26b = document['createElement']('div');
    _0xdbf0x26b['innerHTML'] = _0xdbf0x38;
    _0xdbf0x26b['className'] = 'calendar_item_day';
    _0xdbf0x8e['appendChild'](_0xdbf0x26b);
    var _0xdbf0x5e = document['createElement']('div');
    _0xdbf0x5e['innerHTML'] = _0xdbf0x293 + '/3';
    _0xdbf0x5e['className'] = 'calendar_day_status';
    _0xdbf0x8e['appendChild'](_0xdbf0x5e);
    _0xdbf0x55['append'](_0xdbf0x8e);
    _0xdbf0x291++
  };
  if (_0xdbf0x291 > 28) {
    for (var _0xdbf0x4 = _0xdbf0x291, _0xdbf0x38 = 1; _0xdbf0x4 < 42; _0xdbf0x4++, _0xdbf0x38++) {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'calendar_item none';
      _0xdbf0x8e['style']['cursor'] = 'default';
      var _0xdbf0x26b = document['createElement']('div');
      _0xdbf0x26b['innerHTML'] = _0xdbf0x38;
      _0xdbf0x26b['className'] = 'calendar_item_day';
      _0xdbf0x8e['appendChild'](_0xdbf0x26b);
      _0xdbf0x55['append'](_0xdbf0x8e)
    }
  };
  _0xdbf0x292['onclick']();
  var _0xdbf0x4b = _0xdbf0x290 / 100;
  var _0xdbf0x294 = Math['round'](window['player']['static_resources']['stamp'] / _0xdbf0x4b);
  _0xdbf0x28f['getElementsByClassName']('scale_progress')[0]['style']['width'] = _0xdbf0x294 + '%';
  var _0xdbf0x55 = _0xdbf0x28f['getElementsByClassName']('mark_list')[0]['getElementsByClassName']('mark_item');
  for (var _0xdbf0x7d in window['calendar_rewards']) {
    _0xdbf0x55[_0xdbf0x7d]['setAttribute']('tooltipcalendar', 'Чтобы забрать эту награду, накопите ' + window['calendar_rewards'][_0xdbf0x7d]['price'] + ' марок');
    _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_box')[0]['onmouseover'] = calendar_show_info_box;
    _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_box')[0]['onmouseout'] = calendar_hide_info_box;
    if (window['player']['calendar_reward'][_0xdbf0x7d] > 0) {
      _0xdbf0x55[_0xdbf0x7d]['classList']['add']('take');
      _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_reward')[0]['style']['display'] = 'none';
      var _0xdbf0x42 = _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_text')[0];
      _0xdbf0x42['innerHTML'] = 'Получено';
      _0xdbf0x42['style']['display'] = 'flex'
    } else {
      var _0xdbf0x42 = _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_reward')[0];
      if (window['player']['static_resources']['stamp'] >= window['calendar_rewards'][_0xdbf0x7d]['price']) {
        _0xdbf0x55[_0xdbf0x7d]['classList']['add']('available');
        _0xdbf0x42['style']['display'] = 'none';
        var _0xdbf0x36 = _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_text')[0];
        _0xdbf0x36['innerHTML'] = 'Забрать';
        _0xdbf0x36['style']['display'] = 'flex';
        _0xdbf0x36['style']['cursor'] = 'pointer';
        _0xdbf0x36['onclick'] = window['calendar_get_reward_' + _0xdbf0x7d]
      }
    };
    _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_box')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + window['calendar_rewards'][_0xdbf0x7d]['box_id'] + '-little.png';
    _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_count')[0]['innerHTML'] = '+' + window['calendar_rewards'][_0xdbf0x7d]['box_amount'];
    _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_reward')[0]['getElementsByTagName']('span')[0]['innerHTML'] = window['calendar_rewards'][_0xdbf0x7d]['price']
  };
  _0xdbf0x28f['getElementsByClassName']('holidays_desc_scroll')[0]['innerHTML'] = window['calendar_months'][window['system']['moth']]['holidays'];
  var _0xdbf0xf0 = 6;
  var _0xdbf0x36 = _0xdbf0x28f['getElementsByClassName']('calendar_info_box')[0];
  _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_name')[0]['innerHTML'] = window['boxes'][_0xdbf0xf0]['name'];
  _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + _0xdbf0xf0 + '.png';
  _0xdbf0x36['getElementsByClassName']('boxes_desc_frame_timer')[0]['innerHTML'] = boxes_timer(0);
  _0xdbf0x36['getElementsByClassName']('boxes_cards')[0]['innerHTML'] = window['boxes'][_0xdbf0xf0]['reward']['cards'];
  _0xdbf0x36['getElementsByClassName']('boxes_coins')[0]['innerHTML'] = window['boxes'][_0xdbf0xf0]['reward']['coins']['min'] + '-' + window['boxes'][_0xdbf0xf0]['reward']['coins']['max'];
  var _0xdbf0x18d = _0xdbf0x36['getElementsByClassName']('boxes_experience')[0];
  _0xdbf0x18d['parentNode']['getElementsByTagName']('div')[0]['innerHTML'] = 'Снаряды';
  _0xdbf0x18d['innerHTML'] = window['boxes'][_0xdbf0xf0]['reward']['weapons']['min'] + '-' + window['boxes'][_0xdbf0xf0]['reward']['weapons']['max'];
  _0xdbf0x36['getElementsByClassName']('boxes_tokens')[0]['innerHTML'] = window['boxes'][_0xdbf0xf0]['reward']['tokens']['min'] + '-' + window['boxes'][_0xdbf0xf0]['reward']['tokens']['max'];
  _0xdbf0x36['getElementsByClassName']('boxes_supply')[0]['innerHTML'] = window['boxes'][_0xdbf0xf0]['reward']['supply']['min'] + '-' + window['boxes'][_0xdbf0xf0]['reward']['supply']['max']
}

function time_hide_div(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  _0xdbf0x36['style']['opacity'] = '0.9';
  window['time_an'] = setTimeout(time_hide_div_2, 10, _0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298)
}

function time_hide_div_2(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  _0xdbf0x36['style']['opacity'] = '0.8';
  window['time_an'] = setTimeout(time_hide_div_3, 10, _0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298)
}

function time_hide_div_3(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  _0xdbf0x36['style']['opacity'] = '0.7';
  window['time_an'] = setTimeout(time_hide_div_4, 10, _0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298)
}

function time_hide_div_4(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  _0xdbf0x36['style']['opacity'] = '0.6';
  window['time_an'] = setTimeout(time_hide_div_5, 10, _0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298)
}

function time_hide_div_5(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  _0xdbf0x36['style']['opacity'] = '0.5';
  window['time_an'] = setTimeout(time_hide_div_6, 10, _0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298)
}

function time_hide_div_6(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  _0xdbf0x36['style']['opacity'] = '0.4';
  window['time_an'] = setTimeout(time_hide_div_7, 10, _0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298)
}

function time_hide_div_7(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  _0xdbf0x36['style']['opacity'] = '0.3';
  window['time_an'] = setTimeout(time_hide_div_8, 10, _0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298)
}

function time_hide_div_8(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  _0xdbf0x36['style']['opacity'] = '0.2';
  window['time_an'] = setTimeout(time_hide_div_9, 10, _0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298)
}

function time_hide_div_9(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  _0xdbf0x36['style']['opacity'] = '0.1';
  window['time_an'] = setTimeout(time_hide_div_10, 10, _0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298)
}

function time_hide_div_10(_0xdbf0x36, _0xdbf0x296, _0xdbf0x297, _0xdbf0x298) {
  if (_0xdbf0x298 == 1) {
    _0xdbf0x36['style']['opacity'] = '1';
    _0xdbf0x36['style']['display'] = 'none'
  } else {
    _0xdbf0x36['style']['opacity'] = '0'
  };
  if (_0xdbf0x296 == 1) {
    time_show_div(_0xdbf0x297)
  }
}

function time_exchange_div(_0xdbf0x2a3, _0xdbf0x297) {
  time_hide_div(_0xdbf0x2a3, 1, _0xdbf0x297, 1)
}

function calendar_show_info_box() {
  var _0xdbf0x28f = document['getElementsByClassName']('calendar')[0];
  var _0xdbf0x36 = _0xdbf0x28f['getElementsByClassName']('holidays_desc_scroll')[0];
  var _0xdbf0x297 = _0xdbf0x28f['getElementsByClassName']('calendar_info_box')[0];
  time_exchange_div(_0xdbf0x36, _0xdbf0x297);
  var _0xdbf0x36 = _0xdbf0x28f['getElementsByClassName']('holidays_header')[0];
  time_hide_div(_0xdbf0x36, 0, null)
}

function calendar_hide_info_box() {
  var _0xdbf0x28f = document['getElementsByClassName']('calendar')[0];
  var _0xdbf0x36 = _0xdbf0x28f['getElementsByClassName']('calendar_info_box')[0];
  var _0xdbf0x297 = _0xdbf0x28f['getElementsByClassName']('holidays_desc_scroll')[0];
  time_exchange_div(_0xdbf0x36, _0xdbf0x297);
  var _0xdbf0x36 = _0xdbf0x28f['getElementsByClassName']('holidays_header')[0];
  time_show_div(_0xdbf0x36)
}

function time_show_div(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0';
  _0xdbf0x36['style']['display'] = 'block';
  window['time_an'] = setTimeout(time_show_div_2, 10, _0xdbf0x36)
}

function time_show_div_2(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0.1';
  window['time_an'] = setTimeout(time_show_div_3, 10, _0xdbf0x36)
}

function time_show_div_3(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0.2';
  window['time_an'] = setTimeout(time_show_div_4, 10, _0xdbf0x36)
}

function time_show_div_4(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0.3';
  window['time_an'] = setTimeout(time_show_div_5, 10, _0xdbf0x36)
}

function time_show_div_5(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0.4';
  window['time_an'] = setTimeout(time_show_div_6, 10, _0xdbf0x36)
}

function time_show_div_6(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0.5';
  window['time_an'] = setTimeout(time_show_div_7, 10, _0xdbf0x36)
}

function time_show_div_7(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0.6';
  window['time_an'] = setTimeout(time_show_div_8, 10, _0xdbf0x36)
}

function time_show_div_8(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0.7';
  window['time_an'] = setTimeout(time_show_div_9, 10, _0xdbf0x36)
}

function time_show_div_9(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0.8';
  window['time_an'] = setTimeout(time_show_div_10, 10, _0xdbf0x36)
}

function time_show_div_10(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '0.9';
  window['time_an'] = setTimeout(time_show_div_11, 10, _0xdbf0x36)
}

function time_show_div_11(_0xdbf0x36) {
  _0xdbf0x36['style']['opacity'] = '1'
}

function calendar_get_reward_0() {
  calendar_get_reward(0)
}

function calendar_get_reward_1() {
  calendar_get_reward(1)
}

function calendar_get_reward_2() {
  calendar_get_reward(2)
}

function calendar_get_reward_3() {
  calendar_get_reward(3)
}

function calendar_get_reward(_0xdbf0x9a) {
  play_effect('click.mp3');
  var _0xdbf0xf8 = window['calendar_rewards'][_0xdbf0x9a]['price'];
  if (window['player']['static_resources']['stamp'] >= _0xdbf0xf8) {
    server_action('calendar.get_reward', {
      "moth": window['system']['moth'],
      "reward": _0xdbf0x9a
    });
    var _0xdbf0x36 = document['getElementsByClassName']('calendar')[0];
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('mark_list')[0]['getElementsByClassName']('mark_item');
    _0xdbf0x55[_0xdbf0x9a]['classList']['add']('take');
    _0xdbf0x55[_0xdbf0x9a]['onclick'] = '';
    _0xdbf0x55[_0xdbf0x9a]['style']['cursor'] = 'default';
    _0xdbf0x55[_0xdbf0x9a]['getElementsByClassName']('mark_item_text')[0]['innerHTML'] = 'Получено';
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_rewards'][_0xdbf0x9a]['box_amount']; _0xdbf0x4++) {
      window['player']['boxes']['push']({
        "id": window['player']['static_resources']['boxes_id']++,
        "open_time": get_current_timestamp(),
        "type": window['calendar_rewards'][_0xdbf0x9a]['box_id']
      })
    }
  }
}

function time_calendar() {
  var _0xdbf0x36 = document['getElementsByClassName']('calendar')[0];
  var _0xdbf0x137 = _0xdbf0x36['getElementsByClassName']('calendar_timer')[0]['getElementsByTagName']('span')[0];
  var _0xdbf0x76 = window['system']['time_resources']['new_day'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  var _0xdbf0x88 = _0xdbf0x6 % 60;
  var _0xdbf0x22 = (_0xdbf0x6 - _0xdbf0x88) / 60;
  if (_0xdbf0x87 > 0) {
    _0xdbf0x137['innerHTML'] = _0xdbf0x87 + 'ч ' + _0xdbf0x22 + 'м'
  } else {
    _0xdbf0x137['innerHTML'] = _0xdbf0x22 + 'м'
  }
}

function calendar_change_view_day() {
  play_effect('click.mp3');
  var _0xdbf0x26b = parseInt(this['dataset']['day']);
  var _0xdbf0x28f = document['getElementsByClassName']('calendar')[0];
  var _0xdbf0x55 = _0xdbf0x28f['getElementsByClassName']('calendar_tasks_block')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x2b8 = window['calendar_tasks'][window['system']['moth']][_0xdbf0x26b];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x2b8['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'calendar_tasks_item d-flex';
    var _0xdbf0x3d = document['createElement']('calendar_tasks_item_name');
    _0xdbf0x3d['className'] = 'calendar_tasks_item_name';
    var _0xdbf0x285 = document['createTextNode'](window['calendar_tasks'][window['system']['moth']][_0xdbf0x26b][_0xdbf0x4]['name']);
    _0xdbf0x3d['appendChild'](_0xdbf0x285);
    var _0xdbf0x5e = document['createElement']('span');
    _0xdbf0x5e['innerHTML'] = window['player']['calendar'][window['system']['moth']][_0xdbf0x26b][_0xdbf0x4] + ' / ' + window['calendar_tasks'][window['system']['moth']][_0xdbf0x26b][_0xdbf0x4]['count'];
    _0xdbf0x3d['appendChild'](_0xdbf0x5e);
    _0xdbf0x8e['appendChild'](_0xdbf0x3d);
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'calendar_tasks_item_cup d-flex';
    var _0xdbf0x1e7 = document['createElement']('img');
    _0xdbf0x1e7['src'] = 'https://cdn.bravegames.space/regiment/images/calendar/stamp.png';
    _0xdbf0x8f['appendChild'](_0xdbf0x1e7);
    var _0xdbf0x2b9 = document['createElement']('span');
    _0xdbf0x2b9['innerHTML'] = '+' + window['calendar_stamp'][_0xdbf0x4];
    _0xdbf0x8f['appendChild'](_0xdbf0x2b9);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    if (_0xdbf0x26b <= window['system']['day']) {
      var _0xdbf0x2ba = document['createElement']('div');
      if (window['player']['calendar'][window['system']['moth']][_0xdbf0x26b][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][_0xdbf0x26b][_0xdbf0x4]['count']) {
        _0xdbf0x2ba['className'] = 'calendar_tasks_item_dennyed';
        _0xdbf0x2ba['innerHTML'] = 'выполнено'
      } else {
        _0xdbf0x2ba['className'] = 'calendar_tasks_item_granted';
        var _0xdbf0x9f = document['createElement']('div');
        _0xdbf0x9f['innerHTML'] = 'Пропустить';
        _0xdbf0x9f['className'] = 'button button_orange';
        _0xdbf0x9f['dataset']['moth'] = window['system']['moth'];
        _0xdbf0x9f['dataset']['day'] = _0xdbf0x26b;
        _0xdbf0x9f['dataset']['difficulty'] = _0xdbf0x4;
        _0xdbf0x9f['onclick'] = calendar_skip_day;
        _0xdbf0x2ba['appendChild'](_0xdbf0x9f);
        var _0xdbf0xf8 = document['createTextNode']('Стоимость: ');
        _0xdbf0x2ba['appendChild'](_0xdbf0xf8);
        var _0xdbf0x2bb = document['createElement']('span');
        _0xdbf0x2bb['innerHTML'] = window['calendar_skip_price'][_0xdbf0x4];
        _0xdbf0x2ba['appendChild'](_0xdbf0x2bb);
        var _0xdbf0x2bc = document['createTextNode'](' талонов');
        _0xdbf0x2ba['appendChild'](_0xdbf0x2bc)
      };
      _0xdbf0x8e['appendChild'](_0xdbf0x2ba)
    } else {
      var _0xdbf0x2ba = document['createElement']('div');
      _0xdbf0x2ba['className'] = 'calendar_tasks_item_dennyed';
      _0xdbf0x2ba['innerHTML'] = 'недоступно';
      _0xdbf0x8e['appendChild'](_0xdbf0x2ba)
    };
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  if (_0xdbf0x26b == window['system']['day']) {
    _0xdbf0x28f['getElementsByClassName']('calendar_tasks_header')[0]['getElementsByTagName']('span')[0]['innerHTML'] = 'сегодня'
  } else {
    _0xdbf0x28f['getElementsByClassName']('calendar_tasks_header')[0]['getElementsByTagName']('span')[0]['innerHTML'] = (_0xdbf0x26b + 1) + ' ' + window['calendar_months'][window['system']['moth']]['name_r']
  }
}

function calendar_skip_day() {
  var _0xdbf0x2be = parseInt(this['dataset']['moth']);
  var _0xdbf0x26b = parseInt(this['dataset']['day']);
  var _0xdbf0x2bf = parseInt(this['dataset']['difficulty']);
  var _0xdbf0xf8 = window['calendar_skip_price'][_0xdbf0x2bf];
  if (window['player']['static_resources']['tickets'] >= _0xdbf0xf8) {
    server_action('calendar.skip', {
      "moth": _0xdbf0x2be,
      "day": _0xdbf0x26b,
      "difficulty": _0xdbf0x2bf
    });
    window['player']['calendar'][_0xdbf0x2be][_0xdbf0x26b][_0xdbf0x2bf] = window['calendar_tasks'][_0xdbf0x2be][_0xdbf0x26b][_0xdbf0x2bf]['count'];
    window['player']['static_resources']['tickets'] -= _0xdbf0xf8;
    window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x2bf];
    update_static_resources_tickets();
    update_calendar(_0xdbf0x26b);
    update_calendar_reward()
  } else {
    play_effect('click.mp3');
    show_modal_no_tickets()
  }
}

function update_calendar_reward() {
  var _0xdbf0x28f = document['getElementsByClassName']('calendar')[0];
  var _0xdbf0x55 = _0xdbf0x28f['getElementsByClassName']('mark_list')[0]['getElementsByClassName']('mark_item');
  for (var _0xdbf0x7d in window['calendar_rewards']) {
    if (window['player']['calendar_reward'][_0xdbf0x7d] == 0) {
      if (window['player']['static_resources']['stamp'] >= window['calendar_rewards'][_0xdbf0x7d]['price']) {
        _0xdbf0x55[_0xdbf0x7d]['classList']['add']('available');
        _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_reward')[0]['style']['display'] = 'none';
        var _0xdbf0x36 = _0xdbf0x55[_0xdbf0x7d]['getElementsByClassName']('mark_item_text')[0];
        _0xdbf0x36['innerHTML'] = 'Забрать';
        _0xdbf0x36['style']['display'] = 'flex';
        _0xdbf0x36['style']['cursor'] = 'pointer';
        _0xdbf0x36['onclick'] = window['calendar_get_reward_' + _0xdbf0x7d]
      }
    }
  }
}

function update_calendar(_0xdbf0x26) {
  var _0xdbf0x28f = document['getElementsByClassName']('calendar')[0];
  var _0xdbf0xcb = _0xdbf0x28f['getElementsByClassName']('calendar_cups_amount')[0];
  _0xdbf0xcb['getElementsByTagName']('span')[0]['innerHTML'] = window['player']['static_resources']['stamp'];
  var _0xdbf0x55 = _0xdbf0x28f['getElementsByClassName']('calendar_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x291 = 0;
  for (var _0xdbf0x4 = window['calendar_old_moth']['min']; _0xdbf0x4 <= window['calendar_old_moth']['max']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'calendar_item none';
    _0xdbf0x8e['style']['cursor'] = 'default';
    var _0xdbf0x26b = document['createElement']('div');
    _0xdbf0x26b['innerHTML'] = _0xdbf0x4;
    _0xdbf0x26b['className'] = 'calendar_item_day';
    _0xdbf0x8e['appendChild'](_0xdbf0x26b);
    _0xdbf0x55['append'](_0xdbf0x8e);
    _0xdbf0x291++
  };
  var _0xdbf0x42 = null;
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 1; _0xdbf0x4 < window['calendar_months'][window['system']['moth']]['count_days']; _0xdbf0x4++, _0xdbf0x38++) {
    var _0xdbf0x8e = document['createElement']('div');
    var _0xdbf0x293 = 0;
    for (var _0xdbf0xdd = 0; _0xdbf0xdd < 3; _0xdbf0xdd++) {
      if (window['player']['calendar'][window['system']['moth']][_0xdbf0x4][_0xdbf0xdd] >= window['calendar_tasks'][window['system']['moth']][_0xdbf0x4][_0xdbf0xdd]['count']) {
        _0xdbf0x293++
      }
    };
    if (_0xdbf0x4 == window['system']['day']) {
      _0xdbf0x8e['className'] = 'calendar_item current'
    } else {
      if (_0xdbf0x4 < window['system']['day']) {
        if (_0xdbf0x293 == 3) {
          _0xdbf0x8e['className'] = 'calendar_item done'
        } else {
          _0xdbf0x8e['className'] = 'calendar_item failed'
        }
      } else {
        _0xdbf0x8e['className'] = 'calendar_item'
      }
    };
    if (_0xdbf0x4 == _0xdbf0x26) {
      _0xdbf0x42 = _0xdbf0x8e
    };
    _0xdbf0x8e['dataset']['day'] = _0xdbf0x4;
    _0xdbf0x8e['onclick'] = calendar_change_view_day;
    var _0xdbf0x26b = document['createElement']('div');
    _0xdbf0x26b['innerHTML'] = _0xdbf0x38;
    _0xdbf0x26b['className'] = 'calendar_item_day';
    _0xdbf0x8e['appendChild'](_0xdbf0x26b);
    var _0xdbf0x5e = document['createElement']('div');
    _0xdbf0x5e['innerHTML'] = _0xdbf0x293 + '/3';
    _0xdbf0x5e['className'] = 'calendar_day_status';
    _0xdbf0x8e['appendChild'](_0xdbf0x5e);
    _0xdbf0x55['append'](_0xdbf0x8e);
    _0xdbf0x291++
  };
  if (_0xdbf0x291 > 28) {
    for (var _0xdbf0x4 = _0xdbf0x291, _0xdbf0x38 = 1; _0xdbf0x4 < 42; _0xdbf0x4++, _0xdbf0x38++) {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'calendar_item none';
      _0xdbf0x8e['style']['cursor'] = 'default';
      var _0xdbf0x26b = document['createElement']('div');
      _0xdbf0x26b['innerHTML'] = _0xdbf0x38;
      _0xdbf0x26b['className'] = 'calendar_item_day';
      _0xdbf0x8e['appendChild'](_0xdbf0x26b);
      _0xdbf0x55['append'](_0xdbf0x8e)
    }
  };
  _0xdbf0x42['onclick']();
  var _0xdbf0x290 = window['calendar_months'][window['system']['moth']]['count_days'] * 25;
  var _0xdbf0x4b = _0xdbf0x290 / 100;
  var _0xdbf0x294 = Math['round'](window['player']['static_resources']['stamp'] / _0xdbf0x4b);
  _0xdbf0x28f['getElementsByClassName']('scale_progress')[0]['style']['width'] = _0xdbf0x294 + '%'
}

function raid_lose() {
  var _0xdbf0x36 = document['getElementsByClassName']('boss_result_fight')[0];
  var _0xdbf0x11e = _0xdbf0x36['getElementsByClassName']('modal_header')[0];
  _0xdbf0x11e['className'] = 'modal_header lose';
  _0xdbf0x11e['innerHTML'] = 'Вы проиграли';
  _0xdbf0x36['getElementsByClassName']('boss_result_fight_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_lose_image.png';
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('boss_result_fight_award')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x138 = _0xdbf0x36['getElementsByClassName']('boss_result_fight_text')[0];
  _0xdbf0x138['style']['display'] = 'block';
  _0xdbf0x138['getElementsByTagName']('span')[0]['innerHTML'] = window['bosses'][window['player']['raid']['boss']]['short_name'];
  _0xdbf0x36['getElementsByClassName']('boss_result_fight_share')[0]['style']['display'] = 'none';
  _0xdbf0x36['getElementsByClassName']('boss_result_fight_get_button')[0]['onclick'] = finish_raid_lose;
  show_modal('boss_result_fight', 680);
  document['getElementById']('modal_close')['onclick'] = function() {
    hide_modal('boss_result_fight');
    hide_boss_fight(0)
  }
}

function raid_win() {
  animation_damage_weapons_static(1);
  animation_damage_weapons_static(2);
  animation_damage_weapons_static(3);
  firework();
  setTimeout(raid_win_step2, 3000)
}

function raid_win_step2() {
  var _0xdbf0x36 = document['getElementsByClassName']('boss_result_fight')[0];
  var _0xdbf0x11e = _0xdbf0x36['getElementsByClassName']('modal_header')[0];
  _0xdbf0x11e['className'] = 'modal_header';
  _0xdbf0x11e['innerHTML'] = 'Вы победили';
  _0xdbf0x36['getElementsByClassName']('boss_result_fight_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_win_image.png';
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('boss_result_fight_award')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  if (window['player']['boxes']['length'] < window['limit_boxes'] && window['player']['raid']['boss'] != 17) {
    var _0xdbf0xa6 = 1;
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'boss_result_fight_award_item';
    var _0xdbf0xc8 = document['createElement']('div');
    _0xdbf0xc8['className'] = 'boss_result_fight_award_item_img';
    var _0xdbf0x90 = document['createElement']('img');
    if (window['player']['raid']['boss'] == 14 || window['player']['raid']['boss'] == 15) {
      var _0xdbf0xf0 = window['player']['raid']['boss'] - 6
    } else {
      var _0xdbf0xf0 = 7
    };
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + _0xdbf0xf0 + '-middle.png';
    _0xdbf0xc8['appendChild'](_0xdbf0x90);
    if (window['player']['boxes']['length'] < (window['limit_boxes'] - 1)) {
      var _0xdbf0x90 = document['createElement']('img');
      var _0xdbf0xf1 = random(window['player']['randoms']['raid_box']);
      if (_0xdbf0xf1 < (70 / 100)) {
        _0xdbf0xf0 = 2
      } else {
        if (_0xdbf0xf1 < (90 / 100)) {
          _0xdbf0xf0 = 3
        } else {
          _0xdbf0xf0 = 4
        }
      };
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + _0xdbf0xf0 + '-middle.png';
      _0xdbf0xc8['appendChild'](_0xdbf0x90);
      _0xdbf0xa6++
    };
    _0xdbf0x8e['appendChild'](_0xdbf0xc8);
    var _0xdbf0x15 = document['createElement']('div');
    _0xdbf0x15['innerHTML'] = 'x' + _0xdbf0xa6;
    _0xdbf0x15['className'] = 'boss_result_fight_award_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0x15);
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  if (window['player']['raid']['boss'] == 17) {
    var _0xdbf0x26f = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['talents']['length']; _0xdbf0x4++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['talents'][_0xdbf0x4]['length']; _0xdbf0x38++) {
        _0xdbf0x26f += window['talents'][_0xdbf0x4][_0xdbf0x38]['amount']
      }
    };
    var _0xdbf0x270 = window['player']['static_resources']['used_talents'] + window['player']['static_resources']['new_talents'];
    var _0xdbf0x2c5 = _0xdbf0x26f - _0xdbf0x270;
    var _0xdbf0x22 = Math['min'](_0xdbf0x2c5, 3);
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'boss_result_fight_award_item';
    var _0xdbf0xc8 = document['createElement']('div');
    _0xdbf0xc8['className'] = 'boss_result_fight_award_item_img';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/talents_middle.png';
    _0xdbf0xc8['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0xc8);
    var _0xdbf0x15 = document['createElement']('div');
    _0xdbf0x15['innerHTML'] = 'x' + _0xdbf0x22;
    _0xdbf0x15['className'] = 'boss_result_fight_award_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0x15);
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'boss_result_fight_award_item';
  var _0xdbf0xc8 = document['createElement']('div');
  _0xdbf0xc8['className'] = 'boss_result_fight_award_item_img';
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/experience_2.png';
  _0xdbf0xc8['appendChild'](_0xdbf0x90);
  _0xdbf0x8e['appendChild'](_0xdbf0xc8);
  var _0xdbf0x15 = document['createElement']('div');
  _0xdbf0x15['innerHTML'] = 'x' + window['bosses'][window['player']['raid']['boss']]['reward']['experience'];
  _0xdbf0x15['className'] = 'boss_result_fight_award_item_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x15);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'boss_result_fight_award_item';
  var _0xdbf0xc8 = document['createElement']('div');
  _0xdbf0xc8['className'] = 'boss_result_fight_award_item_img';
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/encryptions_2.png';
  _0xdbf0xc8['appendChild'](_0xdbf0x90);
  _0xdbf0x8e['appendChild'](_0xdbf0xc8);
  var _0xdbf0x15 = document['createElement']('div');
  _0xdbf0x15['innerHTML'] = 'x' + window['bosses'][window['player']['raid']['boss']]['reward']['encryptions'];
  _0xdbf0x15['className'] = 'boss_result_fight_award_item_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x15);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_result_fight_get_button')[0];
  _0xdbf0x9f['onclick'] = finish_raid_win;
  if (window['player']['static_resources']['tutorial'] == 9) {
    _0xdbf0x9f['style']['pointerEvents'] = 'auto'
  };
  var _0xdbf0x138 = _0xdbf0x36['getElementsByClassName']('boss_result_fight_text')[0]['style']['display'] = 'none';
  var _0xdbf0x57 = _0xdbf0x36['getElementsByClassName']('boss_result_fight_share')[0];
  _0xdbf0x57['style']['display'] = 'block';
  if (window['player']['static_resources']['tutorial'] == 9) {
    _0xdbf0x57['style']['pointerEvents'] = 'auto';
    window['player']['static_resources']['tutorial']++
  };
  var _0xdbf0x57 = document['getElementById']('boss_result_fight_share');
  if (window['player']['settings']['share_raids'] == 1) {
    _0xdbf0x57['checked'] = true
  } else {
    _0xdbf0x57['checked'] = false
  };
  _0xdbf0x57['onchange'] = function() {
    change_share('raids')
  };
  show_modal('boss_result_fight', 680);
  document['getElementById']('modal_close')['onclick'] = function() {
    document['getElementById']('modal')['style']['zIndex'] = 4;
    window['fire_work_stop'] = 1;
    play_effect('click.mp3');
    hide_modal('boss_result_fight');
    hide_boss_fight(0)
  }
}

function firework() {
  document['getElementById']('modal')['style']['zIndex'] = 5;
  var _0xdbf0x2c7 = document['createElement']('canvas');
  _0xdbf0x2c7['style']['zIndex'] = 4;
  _0xdbf0x2c7['style']['position'] = 'absolute';
  _0xdbf0x2c7['style']['top'] = '0';
  document['getElementsByClassName']('game_karkass')[0]['appendChild'](_0xdbf0x2c7);
  _0xdbf0x2c7['width'] = 1000;
  _0xdbf0x2c7['height'] = 620;
  window['firework_ctx'] = _0xdbf0x2c7['getContext']('2d');
  window['firework_ctx']['fillStyle'] = 'rgba(0, 0, 0, 0)';
  window['firework_ctx']['fillRect'](0, 0, _0xdbf0x2c7['width'], _0xdbf0x2c7['height']);
  window['list_fire'] = [];
  window['list_firework'] = [];
  window['fire_number'] = 15;
  var _0xdbf0x2c8 = {
    x: _0xdbf0x2c7['width'] / 2,
    y: _0xdbf0x2c7['height'] / 2
  };
  window['range'] = 450;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['fire_number']; _0xdbf0x4++) {
    var _0xdbf0x2c9 = {
      x: Math['random']() * window['range'] / 2 - window['range'] / 4 + _0xdbf0x2c8['x'],
      y: Math['random']() * window['range'] * 2 + _0xdbf0x2c7['height'],
      size: Math['random']() + 0.5,
      fill: '#ffdc04',
      vx: Math['random']() - 0.5,
      vy: -(Math['random']() + 4),
      ax: Math['random']() * 0.02 - 0.01,
      far: Math['random']() * window['range'] + (_0xdbf0x2c8['y'] - window['range'])
    };
    _0xdbf0x2c9['base'] = {
      x: _0xdbf0x2c9['x'],
      y: _0xdbf0x2c9['y'],
      vx: _0xdbf0x2c9['vx']
    };
    window['list_fire']['push'](_0xdbf0x2c9)
  };
  window['fire_work_stop'] = 0;
  firework_loop()
}

function firework_rand_color() {
  var _0xdbf0xf1 = Math['floor'](Math['random']() * 256);
  var _0xdbf0x2cb = Math['floor'](Math['random']() * 256);
  var _0xdbf0x8d = Math['floor'](Math['random']() * 256);
  var _0xdbf0x2cc = 'rgb($r, $g, $b)';
  _0xdbf0x2cc = _0xdbf0x2cc['replace']('$r', _0xdbf0xf1);
  _0xdbf0x2cc = _0xdbf0x2cc['replace']('$g', _0xdbf0x2cb);
  _0xdbf0x2cc = _0xdbf0x2cc['replace']('$b', _0xdbf0x8d);
  return _0xdbf0x2cc
}

function firework_loop() {
  if (window['fire_work_stop'] == 0) {
    requestAnimationFrame(firework_loop);
    firework_update();
    firework_draw()
  } else {
    var _0xdbf0x2c7 = document['getElementsByTagName']('canvas')[0];
    _0xdbf0x2c7['parentNode']['removeChild'](_0xdbf0x2c7)
  }
}

function firework_update() {
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['list_fire']['length']; _0xdbf0x4++) {
    var _0xdbf0x2c9 = window['list_fire'][_0xdbf0x4];
    if (_0xdbf0x2c9['y'] <= _0xdbf0x2c9['far']) {
      var _0xdbf0x2cc = firework_rand_color();
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['fire_number'] * 5; _0xdbf0x4++) {
        var firework = {
          x: _0xdbf0x2c9['x'],
          y: _0xdbf0x2c9['y'],
          size: Math['random']() + 0.5,
          fill: _0xdbf0x2cc,
          vx: Math['random']() * 5 - 2.5,
          vy: Math['random']() * -5 + 1.5,
          ay: 0.05,
          alpha: 1,
          life: Math['round'](Math['random']() * window['range'] / 2) + window['range'] / 2
        };
        firework['base'] = {
          life: firework['life'],
          size: firework['size']
        };
        window['list_firework']['push'](firework)
      };
      _0xdbf0x2c9['y'] = _0xdbf0x2c9['base']['y'];
      _0xdbf0x2c9['x'] = _0xdbf0x2c9['base']['x'];
      _0xdbf0x2c9['vx'] = _0xdbf0x2c9['base']['vx'];
      _0xdbf0x2c9['ax'] = Math['random']() * 0.02 - 0.01
    };
    _0xdbf0x2c9['x'] += _0xdbf0x2c9['vx'];
    _0xdbf0x2c9['y'] += _0xdbf0x2c9['vy'];
    _0xdbf0x2c9['vx'] += _0xdbf0x2c9['ax']
  };
  for (var _0xdbf0x4 = window['list_firework']['length'] - 1; _0xdbf0x4 >= 0; _0xdbf0x4--) {
    var firework = window['list_firework'][_0xdbf0x4];
    if (firework) {
      firework['x'] += firework['vx'];
      firework['y'] += firework['vy'];
      firework['vy'] += firework['ay'];
      firework['alpha'] = (firework['life'] / firework['base']['life']) * 1.79;
      firework['size'] = firework['alpha'] * firework['base']['size'];
      firework['alpha'] = firework['alpha'] > 0.6 ? 1 : firework['alpha'];
      firework['life']--;
      if (firework['life'] <= 0) {
        window['list_firework']['splice'](_0xdbf0x4, 1)
      }
    }
  }
}

function firework_draw() {
  window['firework_ctx']['globalCompositeOperation'] = 'destination-in';
  window['firework_ctx']['globalAlpha'] = 0.9;
  window['firework_ctx']['fillStyle'] = 'rgba(0, 0, 0, 0.5)';
  var _0xdbf0x2c7 = document['getElementsByTagName']('canvas')[0];
  window['firework_ctx']['fillRect'](0, 0, _0xdbf0x2c7['width'], _0xdbf0x2c7['height']);
  window['firework_ctx']['globalCompositeOperation'] = 'destination-over';
  window['firework_ctx']['globalAlpha'] = 1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['list_fire']['length']; _0xdbf0x4++) {
    var _0xdbf0x2c9 = window['list_fire'][_0xdbf0x4];
    window['firework_ctx']['beginPath']();
    window['firework_ctx']['arc'](_0xdbf0x2c9['x'], _0xdbf0x2c9['y'], _0xdbf0x2c9['size'], 0, Math['PI'] * 2);
    window['firework_ctx']['closePath']();
    window['firework_ctx']['fillStyle'] = 'rgba(255, 213, 0, 0, 0.98)';
    window['firework_ctx']['fill']()
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['list_firework']['length']; _0xdbf0x4++) {
    var firework = window['list_firework'][_0xdbf0x4];
    window['firework_ctx']['globalAlpha'] = 1;
    window['firework_ctx']['beginPath']();
    window['firework_ctx']['arc'](firework['x'], firework['y'], firework['size'], 0, Math['PI'] * 2);
    window['firework_ctx']['closePath']();
    window['firework_ctx']['fillStyle'] = firework['fill'];
    window['firework_ctx']['fill']()
  }
}

function show_popup_need() {
  this['getElementsByClassName']('bosses_sector_need')[0]['style']['display'] = 'block'
}

function hide_popup_need() {
  this['getElementsByClassName']('bosses_sector_need')[0]['style']['display'] = 'none'
}

function show_raids() {
  play_music('raids_background.mp3');
  if (window['player']['raid']['health'] !== undefined && window['player']['raid']['health'] == 0 && window['player']['raid']['finish_time'] !== undefined) {
    show_boss_fight();
    clearTimeout(window['ubt']);
    update_top_damage_final();
    raid_win()
  } else {
    if (window['player']['raid']['finish_time'] !== undefined && window['player']['raid']['finish_time'] < get_current_timestamp()) {
      show_boss_fight();
      clearTimeout(window['ubt']);
      update_top_damage_final()
    } else {
      if (window['player']['raid']['health'] !== undefined) {
        show_boss_fight()
      } else {
        play_effect('click.mp3');
        if (window['player']['static_resources']['tutorial'] == 5) {
          document['getElementsByClassName']('bosses_map')[0]['getElementsByClassName']('modal_close')[0]['style']['display'] = 'none';
          window['player']['static_resources']['tutorial']++;
          tutorial_arrow_stop()
        };
        if (window['player']['static_resources']['tutorial'] == 6) {
          show_tutorial(6)
        };
        window['loc_page'] = 'boss_map';
        document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
        document['getElementsByClassName']('missions_map')[0]['style']['display'] = 'none';
        document['getElementsByClassName']('sector_map')[0]['style']['display'] = 'none';
        document['getElementsByClassName']('bosses_map')[0]['style']['display'] = 'block';
        document['getElementsByClassName']('main')[0]['className'] = 'main bosses_map_bg';
        document['getElementsByClassName']('game_block')[0]['style']['zIndex'] = '3';
        var _0xdbf0x55 = document['getElementsByClassName']('bosses_map_list')[0]['getElementsByClassName']('bosses_sector');
        var _0xdbf0x282 = 0;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
          if (_0xdbf0x55[_0xdbf0x4]['dataset']['unav'] != 1) {
            var _0xdbf0x1e = _0xdbf0x55[_0xdbf0x4]['className'];
            var _0xdbf0x6b = _0xdbf0x1e['split'](' ');
            var _0xdbf0x2c = '';
            for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x6b['length']; _0xdbf0x38++) {
              if (_0xdbf0x6b[_0xdbf0x38]['indexOf']('bosses_sector_') > -1) {
                _0xdbf0x2c = _0xdbf0x6b[_0xdbf0x38]
              }
            };
            var _0xdbf0x6b = _0xdbf0x2c['split']('_');
            var _0xdbf0x9a = parseInt(_0xdbf0x6b[2]) - 1;
            var _0xdbf0xdb = window['bosses_requirements'][_0xdbf0x9a];
            var _0xdbf0xdc = 0;
            for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0xdb['length']; _0xdbf0x38++) {
              if (_0xdbf0xdb[_0xdbf0x38]['mode'] == 'kill_boss') {
                var _0xdbf0xde = _0xdbf0xdb[_0xdbf0x38]['params'];
                var _0xdbf0xdf = 0;
                for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xde['length']; _0xdbf0xdd++) {
                  if (window['player']['bosses'] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xdd]['boss']] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xdd]['boss']]['win_count'] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xdd]['boss']]['win_count'] >= _0xdbf0xde[_0xdbf0xdd]['amount']) {
                    _0xdbf0xdf++
                  }
                };
                if (_0xdbf0xdf == _0xdbf0xde['length']) {
                  _0xdbf0xdb[_0xdbf0x38]['status'] = 1;
                  _0xdbf0xdc++
                } else {
                  _0xdbf0xdb[_0xdbf0x38]['status'] = 0
                }
              } else {
                if (_0xdbf0xdb[_0xdbf0x38]['mode'] == 'sut') {
                  if (window['player']['static_resources']['sut'] >= _0xdbf0xdb[_0xdbf0x38]['params'][0]['amount']) {
                    _0xdbf0xdb[_0xdbf0x38]['status'] = 1;
                    _0xdbf0xdc++
                  } else {
                    _0xdbf0xdb[_0xdbf0x38]['status'] = 0
                  }
                } else {
                  if (_0xdbf0xdb[_0xdbf0x38]['mode'] == 'missions') {
                    var _0xdbf0xe1 = _0xdbf0xdb[_0xdbf0x38]['params'];
                    var _0xdbf0xe2 = 0;
                    for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xe1['length']; _0xdbf0xdd++) {
                      if (window['player']['missions'][_0xdbf0xe1[_0xdbf0xdd]['front']][_0xdbf0xe1[_0xdbf0xdd]['mission']]['win_count'] >= _0xdbf0xe1[_0xdbf0xdd]['amount']) {
                        _0xdbf0xe2++
                      }
                    };
                    if (_0xdbf0xe2 == _0xdbf0xe1['length']) {
                      _0xdbf0xdb[_0xdbf0x38]['status'] = 1;
                      _0xdbf0xdc++
                    } else {
                      _0xdbf0xdb[_0xdbf0x38]['status'] = 0
                    }
                  }
                }
              }
            };
            if (_0xdbf0xdc < _0xdbf0xdb['length']) {
              _0xdbf0x55[_0xdbf0x4]['dataHtml'] = true;
              if (_0xdbf0x282 == 0) {
                var _0xdbf0x36 = _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('bosses_sector_need')[0];
                var _0xdbf0x216 = _0xdbf0x36['getElementsByTagName']('ul')[0];
                while (_0xdbf0x216['firstChild']) {
                  _0xdbf0x216['removeChild'](_0xdbf0x216['firstChild'])
                };
                for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0xdb['length']; _0xdbf0x38++) {
                  var _0xdbf0x2d3 = document['createElement']('li');
                  _0xdbf0x2d3['innerHTML'] = _0xdbf0xdb[_0xdbf0x38]['title'];
                  if (_0xdbf0xdb[_0xdbf0x38]['status'] == 1) {
                    _0xdbf0x2d3['className'] = 'complete'
                  };
                  _0xdbf0x216['appendChild'](_0xdbf0x2d3)
                };
                _0xdbf0x55[_0xdbf0x4]['onmouseover'] = show_popup_need;
                _0xdbf0x55[_0xdbf0x4]['onmouseout'] = hide_popup_need;
                _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('bosses_sector_name')[0]['innerHTML'] = window['bosses'][_0xdbf0x9a]['short_name'];
                _0xdbf0x282++
              } else {
                _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('bosses_sector_name')[0]['innerHTML'] = 'засекречено';
                _0xdbf0x55[_0xdbf0x4]['onmouseover'] = '';
                _0xdbf0x55[_0xdbf0x4]['onmouseout'] = ''
              };
              _0xdbf0x55[_0xdbf0x4]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/boss_lock.jpg'
            } else {
              _0xdbf0x55[_0xdbf0x4]['removeAttribute']('tooltipboss');
              _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('bosses_sector_name')[0]['innerHTML'] = window['bosses'][_0xdbf0x9a]['short_name'];
              _0xdbf0x55[_0xdbf0x4]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/' + _0xdbf0x9a + '.jpg';
              _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('bosses_sector_frame')[0]['className'] = 'bosses_sector_frame active';
              _0xdbf0x55[_0xdbf0x4]['onclick'] = window['show_boss_info_' + _0xdbf0x9a];
              _0xdbf0x55[_0xdbf0x4]['onmouseover'] = '';
              _0xdbf0x55[_0xdbf0x4]['onmouseout'] = ''
            }
          }
        };
        var _0xdbf0xe3 = -1;
        var _0xdbf0xe4 = window['system']['time_resources']['new_day'] - 86401;
        var _0xdbf0x2d4 = {};
        for (var _0xdbf0x4 = 14; _0xdbf0x4 <= 15; _0xdbf0x4++) {
          var _0xdbf0x76 = window['bosses'][_0xdbf0x4]['start_time'];
          while (_0xdbf0x76 < _0xdbf0xe4) {
            _0xdbf0x76 += 604800
          };
          if (get_current_timestamp() > _0xdbf0x76 && get_current_timestamp() < (_0xdbf0x76 + 86400)) {
            _0xdbf0xe3 = _0xdbf0x4
          };
          _0xdbf0x2d4['b' + _0xdbf0x4] = _0xdbf0x76
        };
        var _0xdbf0x2d5 = -1;
        if (_0xdbf0xe3 > -1) {
          var _0xdbf0x36 = document['getElementsByClassName']('bosses_night')[0];
          _0xdbf0x36['style']['display'] = 'block';
          _0xdbf0x36['classList']['add']('night_boss_' + (_0xdbf0xe3 - 13));
          _0xdbf0x36['getElementsByClassName']('bosses_night_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/' + _0xdbf0xe3 + '.png';
          _0xdbf0x36['getElementsByClassName']('bosses_night_name')[0]['innerHTML'] = window['bosses'][_0xdbf0xe3]['short_name'];
          _0xdbf0x36['getElementsByClassName']('bosses_night_award')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + (_0xdbf0xe3 - 6) + '-middle.png';
          var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('bosses_night_button')[0];
          _0xdbf0x9f['onclick'] = window['show_boss_info_' + _0xdbf0xe3]
        } else {
          if (_0xdbf0x2d4['b14'] < _0xdbf0x2d4['b15']) {
            var _0xdbf0x2d5 = 14
          } else {
            var _0xdbf0x2d5 = 15
          };
          var _0xdbf0x36 = document['getElementsByClassName']('bosses_night')[0];
          _0xdbf0x36['style']['display'] = 'block';
          _0xdbf0x36['classList']['add']('night_boss_' + (_0xdbf0x2d5 - 13));
          _0xdbf0x36['classList']['add']('no_available');
          _0xdbf0x36['getElementsByClassName']('bosses_night_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/' + _0xdbf0x2d5 + '.png';
          _0xdbf0x36['getElementsByClassName']('bosses_night_name')[0]['innerHTML'] = window['bosses'][_0xdbf0x2d5]['short_name'];
          _0xdbf0x36['getElementsByClassName']('bosses_night_award')[0]['style']['display'] = 'none';
          _0xdbf0x36['getElementsByClassName']('bosses_night_button')[0]['style']['display'] = 'none';
          _0xdbf0x36['getElementsByClassName']('bosses_night_event')[0]['style']['display'] = 'block'
        };
        document['getElementsByClassName']('front_block')[0]['style']['display'] = 'none';
        document['getElementsByClassName']('mission_footer_block')[0]['style']['display'] = 'none';
        document['getElementsByClassName']('friends_block')[0]['style']['display'] = 'block';
        var _0xdbf0x2d6 = document['getElementById']('arrow_prev');
        var _0xdbf0x2d7 = document['getElementById']('arrow_next');
        if (window['friends_mode'] == 0) {
          _0xdbf0x2d6['onclick'] = my_friends_prev;
          _0xdbf0x2d7['onclick'] = my_friends_next;
          if ((window['friends']['length'] - 1) > window['last_friend']) {
            document['getElementById']('arrow_next')['style']['right'] = '-22px'
          } else {
            document['getElementById']('arrow_next')['style']['right'] = '-9999px'
          };
          if (window['last_friend'] > 9) {
            _0xdbf0x2d6['style']['left'] = '-22px'
          } else {
            _0xdbf0x2d6['style']['left'] = '-9999px'
          }
        } else {
          if (window['friends_mode'] == 1) {
            _0xdbf0x2d6['onclick'] = top_level_prev;
            _0xdbf0x2d7['onclick'] = top_level_next;
            if ((window['top_level']['length'] - 1) > window['last_friend2']) {
              document['getElementById']('arrow_next')['style']['right'] = '-22px'
            } else {
              document['getElementById']('arrow_next')['style']['right'] = '-9999px'
            };
            if (window['last_friend2'] > 9) {
              _0xdbf0x2d6['style']['left'] = '-22px'
            } else {
              _0xdbf0x2d6['style']['left'] = '-9999px'
            }
          } else {
            if (window['friends_mode'] == 2) {
              _0xdbf0x2d6['onclick'] = top_sut_prev;
              _0xdbf0x2d7['onclick'] = top_sut_next;
              if ((window['top_sut']['length'] - 1) > window['last_friend3']) {
                document['getElementById']('arrow_next')['style']['right'] = '-22px'
              } else {
                document['getElementById']('arrow_next')['style']['right'] = '-9999px'
              };
              if (window['last_friend3'] > 9) {
                _0xdbf0x2d6['style']['left'] = '-22px'
              } else {
                _0xdbf0x2d6['style']['left'] = '-9999px'
              }
            }
          }
        };
        document['getElementsByClassName']('top_damage_icon_map')[0]['onclick'] = show_top_damage;
        document['getElementsByClassName']('bosses_map')[0]['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
          play_effect('click.mp3');
          play_music('background.mp3');
          show_homeland()
        };
        if (_0xdbf0xe3 > -1) {
          update_raids_timer(1);
          window['utdt'] = setInterval(update_raids_timer, 1000, 1)
        } else {
          update_raids_timer(0);
          window['utdt'] = setInterval(update_raids_timer, 1000, 0)
        }
      }
    }
  };
  var _0xdbf0x79 = [];
  var _0xdbf0x7a = [];
  var _0xdbf0x7b = [];
  var _0xdbf0x7c = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (window['friends'][_0xdbf0x4]['profile']) {
      _0xdbf0x7c['push'](window['friends'][_0xdbf0x4]['id'])
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
    if (window['other_friends'][_0xdbf0x4]['profile']) {
      _0xdbf0x7c['push'](window['other_friends'][_0xdbf0x4]['id'])
    }
  };
  if (window['top_damage']) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_damage']['length']; _0xdbf0x38++) {
        if (window['top_damage'][_0xdbf0x38][0] == window['friends'][_0xdbf0x4]['id'] && !window['friends'][_0xdbf0x4]['profile']) {
          _0xdbf0x79['push'](window['top_damage'][_0xdbf0x38][0])
        }
      }
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_damage']['length']; _0xdbf0x4++) {
      if (!in_array(window['top_damage'][_0xdbf0x4][0], _0xdbf0x7c)) {
        _0xdbf0x7b['push'](window['top_damage'][_0xdbf0x4][0])
      }
    }
  };
  if (window['top_damage_old']) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_damage_old']['length']; _0xdbf0x38++) {
        if (window['top_damage_old'][_0xdbf0x38][0] == window['friends'][_0xdbf0x4]['id'] && !window['friends'][_0xdbf0x4]['profile']) {
          _0xdbf0x79['push'](window['top_damage_old'][_0xdbf0x38][0])
        }
      }
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_damage_old']['length']; _0xdbf0x4++) {
      if (!in_array(window['top_damage_old'][_0xdbf0x4][0], _0xdbf0x7c)) {
        _0xdbf0x7b['push'](window['top_damage_old'][_0xdbf0x4][0])
      }
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < 10; _0xdbf0x38++) {
      if (window['top_boss_' + _0xdbf0x38 + '_friends']) {
        for (var _0xdbf0xdd = 0; _0xdbf0xdd < window['top_boss_' + _0xdbf0x38 + '_friends']['length']; _0xdbf0xdd++) {
          if (window['top_boss_' + _0xdbf0x38 + '_friends'][_0xdbf0xdd] == window['friends'][_0xdbf0x4]['id'] && !window['friends'][_0xdbf0x4]['profile']) {
            _0xdbf0x79['push'](window['top_damage'][_0xdbf0x38][0])
          }
        }
      }
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 10; _0xdbf0x4++) {
    if (window['top_boss_' + _0xdbf0x4 + '_friends']) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_boss_' + _0xdbf0x4 + '_friends']['length']; _0xdbf0x38++) {
        if (!in_array(window['top_boss_' + _0xdbf0x4 + '_friends'][_0xdbf0x38][0], _0xdbf0x7c)) {
          _0xdbf0x7b['push'](window['top_boss_' + _0xdbf0x4 + '_friends'][_0xdbf0x38][0])
        }
      }
    };
    if (window['top_boss_' + _0xdbf0x4]) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_boss_' + _0xdbf0x4]['length']; _0xdbf0x38++) {
        if (!in_array(window['top_boss_' + _0xdbf0x4][_0xdbf0x38][0], _0xdbf0x7c)) {
          _0xdbf0x7b['push'](window['top_boss_' + _0xdbf0x4][_0xdbf0x38][0])
        }
      }
    };
    if (window['top_boss_' + _0xdbf0x4 + '_old']) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_boss_' + _0xdbf0x4 + '_old']['length']; _0xdbf0x38++) {
        if (!in_array(window['top_boss_' + _0xdbf0x4 + '_old'][_0xdbf0x38][0], _0xdbf0x7c)) {
          _0xdbf0x7b['push'](window['top_boss_' + _0xdbf0x4 + '_old'][_0xdbf0x38][0])
        }
      }
    }
  };
  for (var _0xdbf0x4 = 14; _0xdbf0x4 <= 15; _0xdbf0x4++) {
    if (window['top_boss_' + _0xdbf0x4 + '_friends']) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_boss_' + _0xdbf0x4 + '_friends']['length']; _0xdbf0x38++) {
        if (!in_array(window['top_boss_' + _0xdbf0x4 + '_friends'][_0xdbf0x38][0], _0xdbf0x7c)) {
          _0xdbf0x7b['push'](window['top_boss_' + _0xdbf0x4 + '_friends'][_0xdbf0x38][0])
        }
      }
    };
    if (window['top_boss_' + _0xdbf0x4]) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_boss_' + _0xdbf0x4]['length']; _0xdbf0x38++) {
        if (!in_array(window['top_boss_' + _0xdbf0x4][_0xdbf0x38][0], _0xdbf0x7c)) {
          _0xdbf0x7b['push'](window['top_boss_' + _0xdbf0x4][_0xdbf0x38][0])
        }
      }
    };
    if (window['top_boss_' + _0xdbf0x4 + '_old']) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_boss_' + _0xdbf0x4 + '_old']['length']; _0xdbf0x38++) {
        if (!in_array(window['top_boss_' + _0xdbf0x4 + '_old'][_0xdbf0x38][0], _0xdbf0x7c)) {
          _0xdbf0x7b['push'](window['top_boss_' + _0xdbf0x4 + '_old'][_0xdbf0x38][0])
        }
      }
    }
  };
  if (_0xdbf0x7b['length'] > 0) {
    var _0xdbf0x7e = [];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
      _0xdbf0x7e['push'](window['other_friends'][_0xdbf0x4]['id'])
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x7b['length']; _0xdbf0x4++) {
      if (!in_array(_0xdbf0x7b[_0xdbf0x4], _0xdbf0x7e)) {
        var _0xdbf0x42 = {
          id: _0xdbf0x7b[_0xdbf0x4],
          sign: null,
          static_resources: {
            level: 1
          }
        };
        window['other_friends']['push'](_0xdbf0x42);
        _0xdbf0x7a['push'](_0xdbf0x7b[_0xdbf0x4]);
        _0xdbf0x7e['push'](_0xdbf0x7b[_0xdbf0x4])
      }
    }
  };
  if (_0xdbf0x79['length'] > 0) {
    VK['api']('users.get', {
      user_ids: _0xdbf0x79['join'](','),
      fields: 'photo_50,sex'
    }, friends_vk_load_window)
  };
  if (_0xdbf0x7a['length'] > 0) {
    VK['api']('users.get', {
      user_ids: _0xdbf0x7a['join'](','),
      fields: 'photo_50,sex'
    }, friends_vk_load_otwindow)
  }
}

function word_form(_0xdbf0x26, _0xdbf0x2d9, _0xdbf0x2da, _0xdbf0x2db) {
  var _0xdbf0x14d = _0xdbf0x26 % 100;
  if (_0xdbf0x14d > 10 && _0xdbf0x14d < 20) {
    var _0xdbf0x2c = _0xdbf0x2db
  } else {
    _0xdbf0x14d = _0xdbf0x26 % 10;
    if (_0xdbf0x14d == 1) {
      _0xdbf0x2c = _0xdbf0x2d9
    } else {
      if (_0xdbf0x14d > 1 && _0xdbf0x14d < 5) {
        _0xdbf0x2c = _0xdbf0x2da
      } else {
        _0xdbf0x2c = _0xdbf0x2db
      }
    }
  };
  return _0xdbf0x26 + ' ' + _0xdbf0x2c
}

function update_raids_timer(_0xdbf0x2dd) {
  var _0xdbf0x76 = window['system']['time_resources']['top_damage'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 86400;
  var _0xdbf0x85 = (_0xdbf0x76 - _0xdbf0x6) / 86400;
  var _0xdbf0x86 = _0xdbf0x6 % 3600;
  var _0xdbf0x87 = (_0xdbf0x6 - _0xdbf0x86) / 3600;
  var _0xdbf0x88 = _0xdbf0x86 % 60;
  var _0xdbf0x89 = (_0xdbf0x86 - _0xdbf0x88) / 60;
  var _0xdbf0x137 = document['getElementsByClassName']('top_damage_icon_map_timer')[0]['getElementsByTagName']('span')[0];
  if (_0xdbf0x85 > 0) {
    _0xdbf0x137['innerHTML'] = word_form(_0xdbf0x85, 'день', 'дня', 'дней')
  } else {
    var _0xdbf0x2c = _0xdbf0x87 + ':';
    if (_0xdbf0x89 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
    } else {
      _0xdbf0x2c += _0xdbf0x89 + ':'
    };
    if (_0xdbf0x88 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x88
    } else {
      _0xdbf0x2c += _0xdbf0x88
    };
    _0xdbf0x137['innerHTML'] = _0xdbf0x2c
  };
  if (_0xdbf0x2dd == 1) {
    var _0xdbf0x76 = window['system']['time_resources']['new_day'] - get_current_timestamp();
    var _0xdbf0x6 = _0xdbf0x76 % 3600;
    var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
    var _0xdbf0x88 = _0xdbf0x6 % 60;
    var _0xdbf0x89 = (_0xdbf0x6 - _0xdbf0x88) / 60;
    var _0xdbf0x2c = _0xdbf0x87 + ':';
    if (_0xdbf0x89 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
    } else {
      _0xdbf0x2c += _0xdbf0x89 + ':'
    };
    if (_0xdbf0x88 < 10) {
      _0xdbf0x2c += '0' + _0xdbf0x88
    } else {
      _0xdbf0x2c += _0xdbf0x88
    };
    var _0xdbf0x137 = document['getElementsByClassName']('bosses_night_timer')[0]['innerHTML'] = _0xdbf0x2c
  } else {
    var _0xdbf0xe4 = window['system']['time_resources']['new_day'] - 86401;
    var _0xdbf0x2d4 = {};
    for (var _0xdbf0x4 = 14; _0xdbf0x4 <= 15; _0xdbf0x4++) {
      var _0xdbf0x76 = window['bosses'][_0xdbf0x4]['start_time'];
      while (_0xdbf0x76 < _0xdbf0xe4) {
        _0xdbf0x76 += 604800
      };
      _0xdbf0x2d4['b' + _0xdbf0x4] = _0xdbf0x76
    };
    if (_0xdbf0x2d4['b14'] < _0xdbf0x2d4['b15']) {
      var _0xdbf0x2de = _0xdbf0x2d4['b14']
    } else {
      var _0xdbf0x2de = _0xdbf0x2d4['b15']
    };
    var _0xdbf0x76 = _0xdbf0x2de - get_current_timestamp();
    var _0xdbf0x6 = _0xdbf0x76 % 86400;
    var _0xdbf0x85 = (_0xdbf0x76 - _0xdbf0x6) / 86400;
    if (_0xdbf0x85 > 0) {
      if (_0xdbf0x6 > 0) {
        _0xdbf0x85++
      };
      var _0xdbf0x137 = document['getElementsByClassName']('bosses_night_timer')[0]['innerHTML'] = word_form(_0xdbf0x85, 'день', 'дня', 'дней')
    } else {
      var _0xdbf0x86 = _0xdbf0x6 % 3600;
      var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x86) / 3600;
      var _0xdbf0x88 = _0xdbf0x86 % 60;
      var _0xdbf0x89 = (_0xdbf0x86 - _0xdbf0x88) / 60;
      var _0xdbf0x2c = _0xdbf0x87 + ':';
      if (_0xdbf0x89 < 10) {
        _0xdbf0x2c += '0' + _0xdbf0x89 + ':'
      } else {
        _0xdbf0x2c += _0xdbf0x89 + ':'
      };
      if (_0xdbf0x88 < 10) {
        _0xdbf0x2c += '0' + _0xdbf0x88
      } else {
        _0xdbf0x2c += _0xdbf0x88
      };
      var _0xdbf0x137 = document['getElementsByClassName']('bosses_night_timer')[0]['innerHTML'] = _0xdbf0x2c
    }
  }
}

function show_boss_wiki() {
  play_effect('click.mp3');
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  var _0xdbf0x9b = parseInt(_0xdbf0x36['dataset']['bid']);
  _0xdbf0x36['getElementsByClassName']('boss_wiki_block_scroll')[0]['innerHTML'] = window['bosses'][_0xdbf0x9b]['descr'];
  _0xdbf0x36['getElementsByClassName']('boss_wrapper')[0]['style']['display'] = 'none';
  _0xdbf0x36['getElementsByClassName']('boss_wiki_block')[0]['style']['display'] = 'block';
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_wiki_icon')[0];
  _0xdbf0x9f['className'] = 'boss_help_icon';
  _0xdbf0x9f['onclick'] = hide_boss_wiki;
  document['getElementById']('modal_close')['onclick'] = hide_wiki_and_boss_info;
  _0xdbf0x36['getElementsByClassName']('boss_count_win')[0]['style']['display'] = 'none'
}

function hide_boss_wiki() {
  play_effect('click.mp3');
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  _0xdbf0x36['getElementsByClassName']('boss_wrapper')[0]['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('boss_wiki_block')[0]['style']['display'] = 'none';
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_help_icon')[0];
  _0xdbf0x9f['className'] = 'boss_wiki_icon';
  _0xdbf0x9f['onclick'] = show_boss_wiki;
  document['getElementById']('modal_close')['onclick'] = function() {
    hide_boss_info(0)
  };
  _0xdbf0x36['getElementsByClassName']('boss_count_win')[0]['style']['display'] = 'block'
}

function hide_wiki_and_boss_info() {
  hide_boss_wiki();
  hide_boss_info(1)
}

function tutorial_arrow_start_raid() {
  if (window['tutorial_arrow_stoped'] == 2) {
    tutorial_arrow(530, 570, 'up', 324, 1)
  } else {
    setTimeout(tutorial_arrow_start_raid, 50)
  }
}

function show_boss_info_0() {
  show_boss_info(0)
}

function show_boss_info_1() {
  show_boss_info(1)
}

function show_boss_info_2() {
  show_boss_info(2)
}

function show_boss_info_3() {
  show_boss_info(3)
}

function show_boss_info_4() {
  show_boss_info(4)
}

function show_boss_info_5() {
  show_boss_info(5)
}

function show_boss_info_6() {
  show_boss_info(6)
}

function show_boss_info_7() {
  show_boss_info(7)
}

function show_boss_info_8() {
  show_boss_info(8)
}

function show_boss_info_9() {
  show_boss_info(9)
}

function show_boss_info_14() {
  show_boss_info(14)
}

function show_boss_info_15() {
  show_boss_info(15)
}

function show_boss_info(_0xdbf0x9a) {
  if (window['player']['static_resources']['tutorial'] == 6) {
    document['getElementsByClassName']('boss_wiki_icon')[0]['style']['display'] = 'none';
    tutorial_arrow_stop();
    window['player']['static_resources']['tutorial']++;
    setTimeout(tutorial_arrow_start_raid, 50)
  };
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('modal')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('modal')[0]['style']['width'] = '700px';
  document['getElementsByClassName']('modal')[0]['style']['left'] = '150px';
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  _0xdbf0x36['dataset']['bid'] = _0xdbf0x9a;
  _0xdbf0x36['getElementsByClassName']('modal_header')[0]['innerHTML'] = window['bosses'][_0xdbf0x9a]['default_name'];
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['bosses_win'], 1, 86400);
  var _0xdbf0xd1 = _0xdbf0x36['getElementsByClassName']('boss_count_win')[0]['getElementsByTagName']('span');
  _0xdbf0xd1[0]['innerHTML'] = _0xdbf0xd5;
  _0xdbf0xd1[1]['innerHTML'] = (window['limit_bosses'] + window['player']['static_resources']['boost_bosses_win']);
  _0xdbf0x36['getElementsByClassName']('boss_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/' + _0xdbf0x9a + '-big.jpg';
  _0xdbf0x36['getElementsByClassName']('boss_heath_info')[0]['innerHTML'] = window['bosses'][_0xdbf0x9a]['health']['toLocaleString']() + ' / ' + window['bosses'][_0xdbf0x9a]['health']['toLocaleString']();
  _0xdbf0x36['getElementsByClassName']('boss_heath_meter_current')[0]['style']['width'] = '100%';
  _0xdbf0x36['getElementsByClassName']('boss_weakening_count')[0]['innerHTML'] = window['bosses'][_0xdbf0x9a]['dbf']['price'];
  _0xdbf0x36['getElementsByClassName']('boss_wiki_icon')[0]['onclick'] = show_boss_wiki;
  _0xdbf0x36['getElementsByClassName']('boss_experience')[0]['getElementsByTagName']('span')[0]['innerHTML'] = '+' + window['bosses'][_0xdbf0x9a]['reward']['experience'];
  _0xdbf0x36['getElementsByClassName']('boss_encryptions')[0]['getElementsByTagName']('span')[0]['innerHTML'] = '+' + window['bosses'][_0xdbf0x9a]['reward']['encryptions'];
  _0xdbf0x36['getElementsByClassName']('boss_backpack')[0]['getElementsByTagName']('span')[0]['innerHTML'] = '+' + window['bosses'][_0xdbf0x9a]['reward']['backpack'];
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_weakening_button')[0];
  if (window['player']['static_resources']['sut'] >= window['bosses'][_0xdbf0x9a]['dbf']['min_sut']) {
    _0xdbf0x9f['className'] = 'button_big button_big_green boss_weakening_button d-flex';
    _0xdbf0x9f['setAttribute']('tooltipmission', 'Минимальный СУТ - ' + window['bosses'][_0xdbf0x9a]['dbf']['min_sut'] + 'Максимальный СУТ - ' + window['bosses'][_0xdbf0x9a]['dbf']['max_sut']);
    _0xdbf0x9f['style']['cursor'] = 'pointer';
    _0xdbf0x9f['style']['color'] = '#ebddc3';
    _0xdbf0x9f['style']['filter'] = 'grayscale(0)';
    _0xdbf0x9f['getElementsByClassName']('boss_weakening_icon')[0]['style']['filter'] = 'grayscale(0)';
    _0xdbf0x9f['onclick'] = enable_debuff_boss;
    _0xdbf0x9f['onmouseover'] = mouseover_debuff_boss;
    _0xdbf0x9f['onmouseout'] = mouseout_debuff_boss
  } else {
    _0xdbf0x9f['className'] = 'button_big button_big_gray boss_weakening_button d-flex';
    _0xdbf0x9f['setAttribute']('tooltipmission', 'Необходимо  ' + window['bosses'][_0xdbf0x9a]['dbf']['min_sut'] + ' СУТ');
    _0xdbf0x9f['style']['cursor'] = 'default';
    _0xdbf0x9f['style']['color'] = '#222226';
    _0xdbf0x9f['getElementsByClassName']('boss_weakening_icon')[0]['style']['filter'] = 'grayscale(1)';
    _0xdbf0x9f['onclick'] = '';
    _0xdbf0x9f['onmouseover'] = '';
    _0xdbf0x9f['onmouseout'] = ''
  };
  _0xdbf0x36['dataset']['debuff'] = 0;
  _0xdbf0x36['style']['display'] = 'block';
  document['getElementById']('modal_close')['onclick'] = function() {
    hide_boss_info(0)
  };
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_fight_button')[0];
  _0xdbf0x9f['onclick'] = start_raid;
  if (window['player']['static_resources']['tutorial'] == 7) {
    _0xdbf0x9f['style']['pointerEvents'] = 'auto'
  };
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('boss_top_tabs')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['onclick'] = change_tab_boss_info_get
  };
  _0xdbf0x55[0]['onclick']();
  if (_0xdbf0x9a == 14) {
    var _0xdbf0x42 = document['getElementsByClassName']('boss_award_tech')[0];
    _0xdbf0x42['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/8.png';
    _0xdbf0x42['getElementsByClassName']('boss_award_name')[0]['innerHTML'] = 'Артиллерия'
  } else {
    if (_0xdbf0x9a == 15) {
      var _0xdbf0x42 = document['getElementsByClassName']('boss_award_tech')[0];
      _0xdbf0x42['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/9.png';
      _0xdbf0x42['getElementsByClassName']('boss_award_name')[0]['innerHTML'] = 'Авиация'
    } else {
      var _0xdbf0x42 = document['getElementsByClassName']('boss_award_tech')[0];
      _0xdbf0x42['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/7.png';
      _0xdbf0x42['getElementsByClassName']('boss_award_name')[0]['innerHTML'] = 'Танки'
    }
  };
  document['getElementsByClassName']('boss_award_next')[0]['onclick'] = boss_award_next;
  document['getElementsByClassName']('boss_award_prev')[0]['onclick'] = boss_award_prev;
  var _0xdbf0x55 = document['getElementsByClassName']('boss_award_list')[0]['getElementsByClassName']('boss_award_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x4 < 2) {
      _0xdbf0x55[_0xdbf0x4]['style']['display'] = 'block'
    } else {
      _0xdbf0x55[_0xdbf0x4]['style']['display'] = 'none'
    }
  };
  document['getElementsByClassName']('boss_award_prev')[0]['style']['cursor'] = 'default';
  window['view_modal'] = 1;
  _0xdbf0x36['getElementsByClassName']('boss_top_button')[0]['onclick'] = function() {
    play_effect('click.mp3');
    open_old_top()
  }
}

function open_old_top() {
  change_tab_boss_info(1, 1);
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_top_button')[0];
  _0xdbf0x9f['innerHTML'] = 'Текущий ТОП';
  _0xdbf0x9f['className'] = 'boss_top_button button_wide button_wide_red';
  _0xdbf0x9f['onclick'] = open_new_top
}

function open_new_top() {
  change_tab_boss_info(1, 0);
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_top_button')[0];
  _0xdbf0x9f['innerHTML'] = 'Предыдущий ТОП';
  _0xdbf0x9f['className'] = 'boss_top_button button_wide button_wide_orange';
  _0xdbf0x9f['onclick'] = open_old_top
}

function boss_award_prev() {
  play_effect('click.mp3');
  var _0xdbf0x55 = document['getElementsByClassName']('boss_award_list')[0]['getElementsByClassName']('boss_award_item');
  var _0xdbf0x2f3 = null;
  var _0xdbf0x65 = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['style']['display'] == 'block') {
      _0xdbf0x2f3 = _0xdbf0x55[_0xdbf0x4];
      _0xdbf0x65 = _0xdbf0x4
    }
  };
  if (_0xdbf0x65 >= 2) {
    _0xdbf0x2f3['style']['display'] = 'none';
    _0xdbf0x55[_0xdbf0x65 - 2]['style']['display'] = 'block'
  };
  var _0xdbf0x65 = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['style']['display'] == 'block') {
      _0xdbf0x65 = _0xdbf0x4
    }
  };
  if (_0xdbf0x65 >= 2) {
    var _0xdbf0x9f = document['getElementsByClassName']('boss_award_prev')[0];
    _0xdbf0x9f['className'] = 'boss_award_prev active';
    _0xdbf0x9f['style']['cursor'] = 'pointer'
  } else {
    var _0xdbf0x9f = document['getElementsByClassName']('boss_award_prev')[0];
    _0xdbf0x9f['className'] = 'boss_award_prev';
    _0xdbf0x9f['style']['cursor'] = 'default'
  };
  if (_0xdbf0x65 < 3) {
    var _0xdbf0x9f = document['getElementsByClassName']('boss_award_next')[0];
    _0xdbf0x9f['className'] = 'boss_award_next active';
    _0xdbf0x9f['style']['cursor'] = 'pointer'
  } else {
    var _0xdbf0x9f = document['getElementsByClassName']('boss_award_next')[0];
    _0xdbf0x9f['className'] = 'boss_award_next';
    _0xdbf0x9f['style']['cursor'] = 'default'
  }
}

function boss_award_next() {
  play_effect('click.mp3');
  var _0xdbf0x55 = document['getElementsByClassName']('boss_award_list')[0]['getElementsByClassName']('boss_award_item');
  var _0xdbf0x2f5 = null;
  var _0xdbf0xd8 = 0;
  var _0xdbf0x65 = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0xd8 == 0 && _0xdbf0x55[_0xdbf0x4]['style']['display'] == 'block') {
      _0xdbf0x2f5 = _0xdbf0x55[_0xdbf0x4];
      _0xdbf0x65 = _0xdbf0x4;
      _0xdbf0xd8 = 1
    }
  };
  if (_0xdbf0x65 <= 0) {
    _0xdbf0x2f5['style']['display'] = 'none';
    _0xdbf0x55[_0xdbf0x65 + 2]['style']['display'] = 'block'
  };
  var _0xdbf0x65 = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['style']['display'] == 'block') {
      _0xdbf0x65 = _0xdbf0x4
    }
  };
  if (_0xdbf0x65 >= 2) {
    var _0xdbf0x9f = document['getElementsByClassName']('boss_award_prev')[0];
    _0xdbf0x9f['className'] = 'boss_award_prev active';
    _0xdbf0x9f['style']['cursor'] = 'pointer'
  } else {
    var _0xdbf0x9f = document['getElementsByClassName']('boss_award_prev')[0];
    _0xdbf0x9f['className'] = 'boss_award_prev';
    _0xdbf0x9f['style']['cursor'] = 'default'
  };
  if (_0xdbf0x65 < 2) {
    var _0xdbf0x9f = document['getElementsByClassName']('boss_award_next')[0];
    _0xdbf0x9f['className'] = 'boss_award_next active';
    _0xdbf0x9f['style']['cursor'] = 'pointer'
  } else {
    var _0xdbf0x9f = document['getElementsByClassName']('boss_award_next')[0];
    _0xdbf0x9f['className'] = 'boss_award_next';
    _0xdbf0x9f['style']['cursor'] = 'default'
  }
}

function top_boss_friend() {
  hide_boss_info(1);
  show_homeland();
  var _0xdbf0x9a = parseInt(this['dataset']['fid']);
  if (_0xdbf0x9a != window['game_login']) {
    show_friend_help(_0xdbf0x9a)
  } else {
    show_my_profile()
  }
}

function change_tab_boss_info_get() {
  var _0xdbf0x2f8 = parseInt(this['dataset']['tid']);
  change_tab_boss_info(_0xdbf0x2f8, 0)
}

function boss_top_item_hover() {
  var _0xdbf0x3d = this['getElementsByClassName']('boss_top_item_name')[0];
  _0xdbf0x3d['style']['paddingRight'] = '6px';
  _0xdbf0x3d['style']['color'] = '#363636';
  this['getElementsByTagName']('img')[1]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_kill_icon.png';
  var _0xdbf0x137 = this['getElementsByTagName']('span')[0];
  _0xdbf0x137['style']['pointerEvents'] = 'none';
  _0xdbf0x137['innerHTML'] = this['dataset']['damage'];
  this['getElementsByClassName']('boss_top_item_count')[0]['style']['display'] = 'none'
}

function boss_top_item_regular() {
  var _0xdbf0x3d = this['getElementsByClassName']('boss_top_item_name')[0];
  _0xdbf0x3d['style']['textAlign'] = '';
  _0xdbf0x3d['style']['paddingRight'] = '';
  _0xdbf0x3d['style']['color'] = '';
  this['getElementsByTagName']('img')[1]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_win_icon.png';
  var _0xdbf0x137 = this['getElementsByTagName']('span')[0];
  _0xdbf0x137['style']['pointerEvents'] = 'none';
  _0xdbf0x137['innerHTML'] = this['dataset']['name'];
  this['getElementsByClassName']('boss_top_item_count')[0]['style']['display'] = ''
}

function change_tab_boss_info(_0xdbf0x2f8, _0xdbf0x24d) {
  play_effect('click.mp3');
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  if (_0xdbf0x24d == 0) {
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_top_button')[0];
    _0xdbf0x9f['innerHTML'] = 'Предыдущий ТОП';
    _0xdbf0x9f['className'] = 'boss_top_button button_wide button_wide_orange';
    _0xdbf0x9f['onclick'] = open_old_top
  };
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('boss_top_tabs')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = ''
  };
  var _0xdbf0x9b = parseInt(_0xdbf0x36['dataset']['bid']);
  _0xdbf0x55[_0xdbf0x2f8]['className'] = 'active';
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('boss_top_list_scroll')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  clearTimeout(window['timer']);
  if (_0xdbf0x2f8 == 0) {
    _0xdbf0x36['getElementsByClassName']('boss_top_my')[0]['style']['display'] = 'block';
    _0xdbf0x55['style']['height'] = '225px';
    _0xdbf0x55['style']['marginTop'] = '0px';
    _0xdbf0x36['getElementsByClassName']('boss_top_award_timer')[0]['style']['display'] = 'none';
    var in_array = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_boss_' + _0xdbf0x9b + '_friends']['length']; _0xdbf0x4++) {
      if (window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][0] == window['game_login']) {
        in_array = 1;
        if (window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_count'] !== undefined) {
          window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][1] = window['player']['bosses'][_0xdbf0x9b]['win_count']
        }
      }
    };
    if (window['top_boss_' + _0xdbf0x9b + '_friends']['length'] < 10 && in_array == 0 && window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_count'] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_count'] > 0) {
      window['top_boss_' + _0xdbf0x9b + '_friends']['push']([window['game_login'], window['player']['bosses'][_0xdbf0x9b]['win_count']])
    };
    if (window['top_boss_' + _0xdbf0x9b + '_friends']['length'] > 8) {
      _0xdbf0x55['style']['overflowY'] = 'auto'
    } else {
      _0xdbf0x55['style']['overflowY'] = 'hidden'
    };
    window['top_boss_' + _0xdbf0x9b + '_friends']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
      if (_0xdbf0x8c[1] < _0xdbf0x8d[1]) {
        return 1
      } else {
        if (_0xdbf0x8c[1] > _0xdbf0x8d[1]) {
          return -1
        } else {
          return 0
        }
      }
    });
    var _0xdbf0x2fc = -1;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_boss_' + _0xdbf0x9b + '_friends']['length']; _0xdbf0x4++) {
      var _0xdbf0x250 = 0;
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['friends']['length']; _0xdbf0x38++) {
        if (window['friends'][_0xdbf0x38]['id'] == window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][0] && window['friends'][_0xdbf0x38]['profile']) {
          _0xdbf0x250 = 1;
          var _0xdbf0x8e = document['createElement']('div');
          _0xdbf0x8e['className'] = 'boss_top_item d-flex';
          var _0xdbf0x26 = document['createElement']('div');
          _0xdbf0x26['className'] = 'boss_top_item_number';
          var _0xdbf0x2fd = document['createTextNode']((_0xdbf0x4 + 1) + '.');
          _0xdbf0x26['appendChild'](_0xdbf0x2fd);
          _0xdbf0x8e['appendChild'](_0xdbf0x26);
          var _0xdbf0x2fe = document['createElement']('div');
          _0xdbf0x2fe['className'] = 'boss_top_item_avatar';
          var _0xdbf0x2ff = document['createElement']('img');
          _0xdbf0x2ff['src'] = window['friends'][_0xdbf0x38]['profile']['photo_50'];
          _0xdbf0x2fe['appendChild'](_0xdbf0x2ff);
          _0xdbf0x2fe['dataset']['fid'] = window['friends'][_0xdbf0x38]['id'];
          _0xdbf0x2fe['onclick'] = top_boss_friend;
          _0xdbf0x8e['appendChild'](_0xdbf0x2fe);
          var _0xdbf0x3d = document['createElement']('div');
          _0xdbf0x3d['className'] = 'boss_top_item_name';
          var _0xdbf0x137 = document['createElement']('span');
          _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x38]['profile']['last_name'];
          _0xdbf0x137['dataset']['fid'] = window['friends'][_0xdbf0x38]['id'];
          _0xdbf0x137['onclick'] = top_boss_friend;
          _0xdbf0x3d['appendChild'](_0xdbf0x137);
          _0xdbf0x8e['appendChild'](_0xdbf0x3d);
          var _0xdbf0x8f = document['createElement']('div');
          _0xdbf0x8f['className'] = 'boss_top_item_icon';
          var _0xdbf0x300 = document['createElement']('img');
          _0xdbf0x300['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_win_icon.png';
          _0xdbf0x8f['appendChild'](_0xdbf0x300);
          _0xdbf0x8e['appendChild'](_0xdbf0x8f);
          var _0xdbf0x15 = document['createElement']('div');
          _0xdbf0x15['className'] = 'boss_top_item_count';
          if (window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][0] == window['game_login']) {
            var _0xdbf0x301 = document['createTextNode'](window['player']['bosses'][_0xdbf0x9b]['win_count']['toLocaleString']())
          } else {
            var _0xdbf0x301 = document['createTextNode'](window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][1]['toLocaleString']())
          };
          _0xdbf0x15['appendChild'](_0xdbf0x301);
          _0xdbf0x8e['appendChild'](_0xdbf0x15);
          var _0xdbf0x302 = document['createElement']('div');
          _0xdbf0x302['className'] = 'boss_top_item_border';
          var _0xdbf0x303 = document['createElement']('img');
          _0xdbf0x303['src'] = 'https://cdn.bravegames.space/regiment/images/boss_top_item_border.png';
          _0xdbf0x302['appendChild'](_0xdbf0x303);
          _0xdbf0x8e['appendChild'](_0xdbf0x302);
          _0xdbf0x55['appendChild'](_0xdbf0x8e);
          if (window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][0] == window['game_login']) {
            _0xdbf0x2fc = _0xdbf0x4 + 1
          }
        }
      };
      if (_0xdbf0x250 == 0) {
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['other_friends']['length']; _0xdbf0x38++) {
          if (window['other_friends'][_0xdbf0x38]['id'] == window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][0] && window['other_friends'][_0xdbf0x38]['profile']) {
            _0xdbf0x250 = 1;
            var _0xdbf0x8e = document['createElement']('div');
            _0xdbf0x8e['className'] = 'boss_top_item d-flex';
            var _0xdbf0x26 = document['createElement']('div');
            _0xdbf0x26['className'] = 'boss_top_item_number';
            var _0xdbf0x2fd = document['createTextNode']((_0xdbf0x4 + 1) + '.');
            _0xdbf0x26['appendChild'](_0xdbf0x2fd);
            _0xdbf0x8e['appendChild'](_0xdbf0x26);
            var _0xdbf0x2fe = document['createElement']('div');
            _0xdbf0x2fe['className'] = 'boss_top_item_avatar';
            var _0xdbf0x2ff = document['createElement']('img');
            _0xdbf0x2ff['src'] = window['other_friends'][_0xdbf0x38]['profile']['photo_50'];
            _0xdbf0x2fe['appendChild'](_0xdbf0x2ff);
            _0xdbf0x2fe['dataset']['fid'] = window['other_friends'][_0xdbf0x38]['id'];
            _0xdbf0x2fe['onclick'] = top_boss_friend;
            _0xdbf0x8e['appendChild'](_0xdbf0x2fe);
            var _0xdbf0x3d = document['createElement']('div');
            _0xdbf0x3d['className'] = 'boss_top_item_name';
            var _0xdbf0x137 = document['createElement']('span');
            _0xdbf0x137['innerHTML'] = window['other_friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['other_friends'][_0xdbf0x38]['profile']['last_name'];
            _0xdbf0x137['dataset']['fid'] = window['other_friends'][_0xdbf0x38]['id'];
            _0xdbf0x137['onclick'] = top_boss_friend;
            _0xdbf0x3d['appendChild'](_0xdbf0x137);
            _0xdbf0x8e['appendChild'](_0xdbf0x3d);
            var _0xdbf0x8f = document['createElement']('div');
            _0xdbf0x8f['className'] = 'boss_top_item_icon';
            var _0xdbf0x300 = document['createElement']('img');
            _0xdbf0x300['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_win_icon.png';
            _0xdbf0x8f['appendChild'](_0xdbf0x300);
            _0xdbf0x8e['appendChild'](_0xdbf0x8f);
            var _0xdbf0x15 = document['createElement']('div');
            _0xdbf0x15['className'] = 'boss_top_item_count';
            if (window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][0] == window['game_login']) {
              var _0xdbf0x301 = document['createTextNode'](window['player']['bosses'][_0xdbf0x9b]['win_count']['toLocaleString']())
            } else {
              var _0xdbf0x301 = document['createTextNode'](window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][1]['toLocaleString']())
            };
            _0xdbf0x15['appendChild'](_0xdbf0x301);
            _0xdbf0x8e['appendChild'](_0xdbf0x15);
            var _0xdbf0x302 = document['createElement']('div');
            _0xdbf0x302['className'] = 'boss_top_item_border';
            var _0xdbf0x303 = document['createElement']('img');
            _0xdbf0x303['src'] = 'https://cdn.bravegames.space/regiment/images/boss_top_item_border.png';
            _0xdbf0x302['appendChild'](_0xdbf0x303);
            _0xdbf0x8e['appendChild'](_0xdbf0x302);
            _0xdbf0x55['appendChild'](_0xdbf0x8e);
            if (window['top_boss_' + _0xdbf0x9b + '_friends'][_0xdbf0x4][0] == window['game_login']) {
              _0xdbf0x2fc = _0xdbf0x4 + 1
            }
          }
        }
      }
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      if (window['friends'][_0xdbf0x4]['id'] == window['game_login']) {
        var _0xdbf0x2c = '-';
        if (_0xdbf0x2fc > -1) {
          _0xdbf0x2c = _0xdbf0x2fc + '.'
        };
        var _0xdbf0x304 = 0;
        if (window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_count'] !== undefined) {
          _0xdbf0x304 = window['player']['bosses'][_0xdbf0x9b]['win_count']
        };
        var _0xdbf0x305 = _0xdbf0x36['getElementsByClassName']('boss_top_my')[0];
        while (_0xdbf0x305['firstChild']) {
          _0xdbf0x305['removeChild'](_0xdbf0x305['firstChild'])
        };
        var _0xdbf0x8e = document['createElement']('div');
        _0xdbf0x8e['className'] = 'boss_top_item d-flex';
        var _0xdbf0x26 = document['createElement']('div');
        _0xdbf0x26['className'] = 'boss_top_item_number';
        var _0xdbf0x2fd = document['createTextNode'](_0xdbf0x2c);
        _0xdbf0x26['appendChild'](_0xdbf0x2fd);
        _0xdbf0x8e['appendChild'](_0xdbf0x26);
        var _0xdbf0x2fe = document['createElement']('div');
        _0xdbf0x2fe['className'] = 'boss_top_item_avatar';
        var _0xdbf0x2ff = document['createElement']('img');
        _0xdbf0x2ff['src'] = window['friends'][_0xdbf0x4]['profile']['photo_50'];
        _0xdbf0x2fe['appendChild'](_0xdbf0x2ff);
        _0xdbf0x2fe['dataset']['fid'] = window['friends'][_0xdbf0x4]['id'];
        _0xdbf0x2fe['onclick'] = top_boss_friend;
        _0xdbf0x8e['appendChild'](_0xdbf0x2fe);
        var _0xdbf0x3d = document['createElement']('div');
        _0xdbf0x3d['className'] = 'boss_top_item_name';
        var _0xdbf0x137 = document['createElement']('span');
        _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x4]['profile']['last_name'];
        _0xdbf0x137['dataset']['fid'] = window['friends'][_0xdbf0x4]['id'];
        _0xdbf0x137['onclick'] = top_boss_friend;
        _0xdbf0x3d['appendChild'](_0xdbf0x137);
        _0xdbf0x8e['appendChild'](_0xdbf0x3d);
        var _0xdbf0x8f = document['createElement']('div');
        _0xdbf0x8f['className'] = 'boss_top_item_icon';
        var _0xdbf0x300 = document['createElement']('img');
        _0xdbf0x300['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_win_icon.png';
        _0xdbf0x8f['appendChild'](_0xdbf0x300);
        _0xdbf0x8e['appendChild'](_0xdbf0x8f);
        var _0xdbf0x15 = document['createElement']('div');
        _0xdbf0x15['className'] = 'boss_top_item_count';
        var _0xdbf0x301 = document['createTextNode'](_0xdbf0x304['toLocaleString']());
        _0xdbf0x15['appendChild'](_0xdbf0x301);
        _0xdbf0x8e['appendChild'](_0xdbf0x15);
        var _0xdbf0x302 = document['createElement']('div');
        _0xdbf0x302['className'] = 'boss_top_item_border';
        var _0xdbf0x303 = document['createElement']('img');
        _0xdbf0x303['src'] = 'https://cdn.bravegames.space/regiment/images/boss_top_item_border.png';
        _0xdbf0x302['appendChild'](_0xdbf0x303);
        _0xdbf0x8e['appendChild'](_0xdbf0x302);
        _0xdbf0x305['appendChild'](_0xdbf0x8e)
      }
    }
  } else {
    if (_0xdbf0x2f8 == 1) {
      if (_0xdbf0x24d == 1) {
        var _0xdbf0x306 = window['top_boss_' + _0xdbf0x9b + '_old'];
        var _0xdbf0x17c = _0xdbf0x36['getElementsByClassName']('boss_top_award_timer')[0];
        _0xdbf0x17c['innerHTML'] = 'Результаты прошлого ТОПа';
        _0xdbf0x17c['style']['display'] = 'block';
        _0xdbf0x55['style']['overflowY'] = 'auto';
        _0xdbf0x55['style']['height'] = '195px';
        _0xdbf0x55['style']['marginTop'] = '30px'
      } else {
        var _0xdbf0x306 = window['top_boss_' + _0xdbf0x9b];
        _0xdbf0x36['getElementsByClassName']('boss_top_award_timer')[0]['style']['display'] = 'none';
        _0xdbf0x55['style']['height'] = '225px';
        _0xdbf0x55['style']['marginTop'] = '0px'
      };
      _0xdbf0x36['getElementsByClassName']('boss_top_my')[0]['style']['display'] = 'block';
      var in_array = 0;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x306['length']; _0xdbf0x4++) {
        if (_0xdbf0x306[_0xdbf0x4][0] == window['game_login']) {
          in_array = 1;
          if (_0xdbf0x24d == 0 && window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_in_top'] !== undefined) {
            _0xdbf0x306[_0xdbf0x4][1] = window['player']['bosses'][_0xdbf0x9b]['win_in_top']
          };
          if (_0xdbf0x24d == 1 && window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_in_top_old'] !== undefined) {
            _0xdbf0x306[_0xdbf0x4][1] = window['player']['bosses'][_0xdbf0x9b]['win_in_top_old']
          };
          if (window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['damage_in_top'] !== undefined) {
            _0xdbf0x306[_0xdbf0x4][2] = window['player']['bosses'][_0xdbf0x9b]['damage_in_top']
          }
        }
      };
      if (_0xdbf0x24d == 0 && _0xdbf0x306['length'] < 10 && in_array == 0 && window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_in_top'] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_in_top'] > 0 && window['player']['bosses'][_0xdbf0x9b]['damage_in_top'] !== undefined) {
        _0xdbf0x306['push']([window['game_login'], window['player']['bosses'][_0xdbf0x9b]['win_in_top'], window['player']['bosses'][_0xdbf0x9b]['damage_in_top']])
      };
      if (_0xdbf0x24d == 1 && _0xdbf0x306['length'] < 10 && in_array == 0 && window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_in_top_old'] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_in_top_old'] > 0 && window['player']['bosses'][_0xdbf0x9b]['damage_in_top'] !== undefined) {
        _0xdbf0x306['push']([window['game_login'], window['player']['bosses'][_0xdbf0x9b]['win_in_top_old'], window['player']['bosses'][_0xdbf0x9b]['damage_in_top']])
      };
      if (_0xdbf0x306['length'] > 8) {
        _0xdbf0x55['style']['overflowY'] = 'auto'
      } else {
        _0xdbf0x55['style']['overflowY'] = 'hidden'
      };
      _0xdbf0x306['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
        if (_0xdbf0x8c[1] < _0xdbf0x8d[1]) {
          return 1
        } else {
          if (_0xdbf0x8c[1] > _0xdbf0x8d[1]) {
            return -1
          } else {
            if (_0xdbf0x8c[2] < _0xdbf0x8d[2]) {
              return 1
            } else {
              if (_0xdbf0x8c[2] > _0xdbf0x8d[2]) {
                return -1
              } else {
                return 0
              }
            }
          }
        }
      });
      var _0xdbf0x2fc = -1;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x306['length']; _0xdbf0x4++) {
        var _0xdbf0x250 = 0;
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['friends']['length']; _0xdbf0x38++) {
          if (window['friends'][_0xdbf0x38]['id'] == _0xdbf0x306[_0xdbf0x4][0] && window['friends'][_0xdbf0x38]['profile']) {
            _0xdbf0x250 = 1;
            var _0xdbf0x8e = document['createElement']('div');
            _0xdbf0x8e['className'] = 'boss_top_item d-flex';
            _0xdbf0x8e['dataset']['name'] = window['friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x38]['profile']['last_name'];
            _0xdbf0x8e['dataset']['damage'] = 'Нанесено ' + number_format(_0xdbf0x306[_0xdbf0x4][2]) + ' урона';
            _0xdbf0x8e['onmouseover'] = boss_top_item_hover;
            _0xdbf0x8e['onmouseout'] = boss_top_item_regular;
            var _0xdbf0x26 = document['createElement']('div');
            _0xdbf0x26['className'] = 'boss_top_item_number';
            var _0xdbf0x2fd = document['createTextNode']((_0xdbf0x4 + 1) + '.');
            _0xdbf0x26['appendChild'](_0xdbf0x2fd);
            _0xdbf0x8e['appendChild'](_0xdbf0x26);
            var _0xdbf0x2fe = document['createElement']('div');
            _0xdbf0x2fe['className'] = 'boss_top_item_avatar';
            var _0xdbf0x2ff = document['createElement']('img');
            _0xdbf0x2ff['src'] = window['friends'][_0xdbf0x38]['profile']['photo_50'];
            _0xdbf0x2fe['appendChild'](_0xdbf0x2ff);
            _0xdbf0x2fe['dataset']['fid'] = window['friends'][_0xdbf0x38]['id'];
            _0xdbf0x2fe['onclick'] = top_boss_friend;
            _0xdbf0x8e['appendChild'](_0xdbf0x2fe);
            var _0xdbf0x3d = document['createElement']('div');
            _0xdbf0x3d['className'] = 'boss_top_item_name';
            var _0xdbf0x137 = document['createElement']('span');
            _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x38]['profile']['last_name'];
            _0xdbf0x137['dataset']['fid'] = window['friends'][_0xdbf0x38]['id'];
            _0xdbf0x137['onclick'] = top_boss_friend;
            _0xdbf0x3d['appendChild'](_0xdbf0x137);
            _0xdbf0x8e['appendChild'](_0xdbf0x3d);
            var _0xdbf0x8f = document['createElement']('div');
            _0xdbf0x8f['className'] = 'boss_top_item_icon';
            var _0xdbf0x300 = document['createElement']('img');
            _0xdbf0x300['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_win_icon.png';
            _0xdbf0x8f['appendChild'](_0xdbf0x300);
            _0xdbf0x8e['appendChild'](_0xdbf0x8f);
            var _0xdbf0x15 = document['createElement']('div');
            _0xdbf0x15['className'] = 'boss_top_item_count';
            if (_0xdbf0x24d == 0 && _0xdbf0x306[_0xdbf0x4][0] == window['game_login']) {
              var _0xdbf0x301 = document['createTextNode'](window['player']['bosses'][_0xdbf0x9b]['win_in_top']['toLocaleString']())
            } else {
              if (_0xdbf0x24d == 1 && _0xdbf0x306[_0xdbf0x4][0] == window['game_login']) {
                var _0xdbf0x301 = document['createTextNode'](window['player']['bosses'][_0xdbf0x9b]['win_in_top_old']['toLocaleString']())
              } else {
                var _0xdbf0x301 = document['createTextNode'](_0xdbf0x306[_0xdbf0x4][1]['toLocaleString']())
              }
            };
            _0xdbf0x15['appendChild'](_0xdbf0x301);
            _0xdbf0x8e['appendChild'](_0xdbf0x15);
            var _0xdbf0x302 = document['createElement']('div');
            _0xdbf0x302['className'] = 'boss_top_item_border';
            var _0xdbf0x303 = document['createElement']('img');
            _0xdbf0x303['src'] = 'https://cdn.bravegames.space/regiment/images/boss_top_item_border.png';
            _0xdbf0x302['appendChild'](_0xdbf0x303);
            _0xdbf0x8e['appendChild'](_0xdbf0x302);
            _0xdbf0x55['appendChild'](_0xdbf0x8e);
            if (_0xdbf0x306[_0xdbf0x4][0] == window['game_login']) {
              _0xdbf0x2fc = _0xdbf0x4 + 1
            }
          }
        };
        if (_0xdbf0x250 == 0) {
          for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['other_friends']['length']; _0xdbf0x38++) {
            window['other_friends'][_0xdbf0x4];
            if (window['other_friends'][_0xdbf0x38]['id'] == _0xdbf0x306[_0xdbf0x4][0] && window['other_friends'][_0xdbf0x38]['profile']) {
              var _0xdbf0x8e = document['createElement']('div');
              _0xdbf0x8e['className'] = 'boss_top_item d-flex';
              _0xdbf0x8e['dataset']['name'] = window['other_friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['other_friends'][_0xdbf0x38]['profile']['last_name'];
              _0xdbf0x8e['dataset']['damage'] = 'Нанесено ' + number_format(_0xdbf0x306[_0xdbf0x4][2]) + ' урона';
              _0xdbf0x8e['onmouseover'] = boss_top_item_hover;
              _0xdbf0x8e['onmouseout'] = boss_top_item_regular;
              var _0xdbf0x26 = document['createElement']('div');
              _0xdbf0x26['className'] = 'boss_top_item_number';
              var _0xdbf0x2fd = document['createTextNode']((_0xdbf0x4 + 1) + '.');
              _0xdbf0x26['appendChild'](_0xdbf0x2fd);
              _0xdbf0x8e['appendChild'](_0xdbf0x26);
              var _0xdbf0x2fe = document['createElement']('div');
              _0xdbf0x2fe['className'] = 'boss_top_item_avatar';
              var _0xdbf0x2ff = document['createElement']('img');
              _0xdbf0x2ff['src'] = window['other_friends'][_0xdbf0x38]['profile']['photo_50'];
              _0xdbf0x2fe['appendChild'](_0xdbf0x2ff);
              _0xdbf0x2fe['dataset']['fid'] = window['other_friends'][_0xdbf0x38]['id'];
              _0xdbf0x2fe['onclick'] = top_boss_friend;
              _0xdbf0x8e['appendChild'](_0xdbf0x2fe);
              var _0xdbf0x3d = document['createElement']('div');
              _0xdbf0x3d['className'] = 'boss_top_item_name';
              var _0xdbf0x137 = document['createElement']('span');
              _0xdbf0x137['innerHTML'] = window['other_friends'][_0xdbf0x38]['profile']['first_name'] + ' ' + window['other_friends'][_0xdbf0x38]['profile']['last_name'];
              _0xdbf0x137['dataset']['fid'] = window['other_friends'][_0xdbf0x38]['id'];
              _0xdbf0x137['onclick'] = top_boss_friend;
              _0xdbf0x3d['appendChild'](_0xdbf0x137);
              _0xdbf0x8e['appendChild'](_0xdbf0x3d);
              var _0xdbf0x8f = document['createElement']('div');
              _0xdbf0x8f['className'] = 'boss_top_item_icon';
              var _0xdbf0x300 = document['createElement']('img');
              _0xdbf0x300['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_win_icon.png';
              _0xdbf0x8f['appendChild'](_0xdbf0x300);
              _0xdbf0x8e['appendChild'](_0xdbf0x8f);
              var _0xdbf0x15 = document['createElement']('div');
              _0xdbf0x15['className'] = 'boss_top_item_count';
              if (_0xdbf0x24d == 0 && _0xdbf0x306[_0xdbf0x4][0] == window['game_login']) {
                var _0xdbf0x301 = document['createTextNode'](window['player']['bosses'][_0xdbf0x9b]['win_in_top']['toLocaleString']())
              } else {
                if (_0xdbf0x24d == 1 && _0xdbf0x306[_0xdbf0x4][0] == window['game_login']) {
                  var _0xdbf0x301 = document['createTextNode'](window['player']['bosses'][_0xdbf0x9b]['win_in_top_old']['toLocaleString']())
                } else {
                  var _0xdbf0x301 = document['createTextNode'](_0xdbf0x306[_0xdbf0x4][1]['toLocaleString']())
                }
              };
              _0xdbf0x15['appendChild'](_0xdbf0x301);
              _0xdbf0x8e['appendChild'](_0xdbf0x15);
              var _0xdbf0x302 = document['createElement']('div');
              _0xdbf0x302['className'] = 'boss_top_item_border';
              var _0xdbf0x303 = document['createElement']('img');
              _0xdbf0x303['src'] = 'https://cdn.bravegames.space/regiment/images/boss_top_item_border.png';
              _0xdbf0x302['appendChild'](_0xdbf0x303);
              _0xdbf0x8e['appendChild'](_0xdbf0x302);
              _0xdbf0x55['appendChild'](_0xdbf0x8e);
              if (_0xdbf0x306[_0xdbf0x4][0] == window['game_login']) {
                _0xdbf0x2fc = _0xdbf0x4 + 1
              }
            }
          }
        }
      };
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
        if (window['friends'][_0xdbf0x4]['id'] == window['game_login']) {
          var _0xdbf0x2c = '-';
          if (_0xdbf0x2fc > -1) {
            _0xdbf0x2c = _0xdbf0x2fc + '.'
          };
          var _0xdbf0x304 = 0;
          if (_0xdbf0x24d == 0) {
            if (window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_in_top'] !== undefined) {
              _0xdbf0x304 = window['player']['bosses'][_0xdbf0x9b]['win_in_top']
            }
          } else {
            if (window['player']['bosses'][_0xdbf0x9b] !== undefined && window['player']['bosses'][_0xdbf0x9b]['win_in_top_old'] !== undefined) {
              _0xdbf0x304 = window['player']['bosses'][_0xdbf0x9b]['win_in_top_old']
            }
          };
          var _0xdbf0x305 = _0xdbf0x36['getElementsByClassName']('boss_top_my')[0];
          while (_0xdbf0x305['firstChild']) {
            _0xdbf0x305['removeChild'](_0xdbf0x305['firstChild'])
          };
          var _0xdbf0x8e = document['createElement']('div');
          _0xdbf0x8e['className'] = 'boss_top_item d-flex';
          var _0xdbf0x26 = document['createElement']('div');
          _0xdbf0x26['className'] = 'boss_top_item_number';
          var _0xdbf0x2fd = document['createTextNode'](_0xdbf0x2c);
          _0xdbf0x26['appendChild'](_0xdbf0x2fd);
          _0xdbf0x8e['appendChild'](_0xdbf0x26);
          var _0xdbf0x2fe = document['createElement']('div');
          _0xdbf0x2fe['className'] = 'boss_top_item_avatar';
          var _0xdbf0x2ff = document['createElement']('img');
          _0xdbf0x2ff['src'] = window['friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x2fe['appendChild'](_0xdbf0x2ff);
          _0xdbf0x2fe['dataset']['fid'] = window['friends'][_0xdbf0x4]['id'];
          _0xdbf0x2fe['onclick'] = top_boss_friend;
          _0xdbf0x8e['appendChild'](_0xdbf0x2fe);
          var _0xdbf0x3d = document['createElement']('div');
          _0xdbf0x3d['className'] = 'boss_top_item_name';
          var _0xdbf0x137 = document['createElement']('span');
          _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['dataset']['fid'] = window['friends'][_0xdbf0x4]['id'];
          _0xdbf0x137['onclick'] = top_boss_friend;
          _0xdbf0x3d['appendChild'](_0xdbf0x137);
          _0xdbf0x8e['appendChild'](_0xdbf0x3d);
          var _0xdbf0x8f = document['createElement']('div');
          _0xdbf0x8f['className'] = 'boss_top_item_icon';
          var _0xdbf0x300 = document['createElement']('img');
          _0xdbf0x300['src'] = 'https://cdn.bravegames.space/regiment/images/bosses_win_icon.png';
          _0xdbf0x8f['appendChild'](_0xdbf0x300);
          _0xdbf0x8e['appendChild'](_0xdbf0x8f);
          var _0xdbf0x15 = document['createElement']('div');
          _0xdbf0x15['className'] = 'boss_top_item_count';
          var _0xdbf0x301 = document['createTextNode'](_0xdbf0x304['toLocaleString']());
          _0xdbf0x15['appendChild'](_0xdbf0x301);
          _0xdbf0x8e['appendChild'](_0xdbf0x15);
          var _0xdbf0x302 = document['createElement']('div');
          _0xdbf0x302['className'] = 'boss_top_item_border';
          var _0xdbf0x303 = document['createElement']('img');
          _0xdbf0x303['src'] = 'https://cdn.bravegames.space/regiment/images/boss_top_item_border.png';
          _0xdbf0x302['appendChild'](_0xdbf0x303);
          _0xdbf0x8e['appendChild'](_0xdbf0x302);
          _0xdbf0x305['appendChild'](_0xdbf0x8e)
        }
      }
    } else {
      if (_0xdbf0x2f8 == 2) {
        _0xdbf0x36['getElementsByClassName']('boss_top_my')[0]['style']['display'] = 'none';
        _0xdbf0x55['style']['overflowY'] = 'auto';
        _0xdbf0x55['style']['height'] = '225px';
        _0xdbf0x55['style']['marginTop'] = '27px';
        var _0xdbf0x17c = _0xdbf0x36['getElementsByClassName']('boss_top_award_timer')[0];
        while (_0xdbf0x17c['firstChild']) {
          _0xdbf0x17c['removeChild'](_0xdbf0x17c['firstChild'])
        };
        var _0xdbf0x168 = document['createTextNode']('До выдачи наград: ');
        _0xdbf0x17c['appendChild'](_0xdbf0x168);
        var _0xdbf0x137 = document['createElement']('span');
        _0xdbf0x17c['appendChild'](_0xdbf0x137);
        _0xdbf0x17c['style']['display'] = 'block';
        timer_boss_info();
        window['timer'] = setInterval(timer_boss_info, 1000);
        for (var _0xdbf0x4 = 0, _0xdbf0x38 = 1; _0xdbf0x4 < window['tops_reward']['boss_' + _0xdbf0x9b]['length']; _0xdbf0x4++) {
          if (window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['place']) {
            var _0xdbf0x8e = generate_item(_0xdbf0x38++, window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['reward']['tokens'], window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['reward']['box_count'], window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['reward']['box_type']);
            _0xdbf0x55['appendChild'](_0xdbf0x8e)
          } else {
            if (window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['place_min'] && window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['place_max']) {
              for (var _0xdbf0xdd = window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['place_min']; _0xdbf0xdd <= window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['place_max']; _0xdbf0xdd++) {
                var _0xdbf0x8e = generate_item(_0xdbf0x38++, window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['reward']['tokens'], window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['reward']['box_count'], window['tops_reward']['boss_' + _0xdbf0x9b][_0xdbf0x4]['reward']['box_type']);
                _0xdbf0x55['appendChild'](_0xdbf0x8e)
              }
            }
          }
        }
      }
    }
  }
}

function timer_boss_info() {
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  var _0xdbf0x9b = parseInt(_0xdbf0x36['dataset']['bid']);
  var _0xdbf0x17c = _0xdbf0x36['getElementsByClassName']('boss_top_award_timer')[0];
  var _0xdbf0x137 = _0xdbf0x17c['getElementsByTagName']('span')[0];
  if (_0xdbf0x9b == 14 || _0xdbf0x9b == 15) {
    var _0xdbf0x76 = window['system']['time_resources']['new_day'] - get_current_timestamp()
  } else {
    var _0xdbf0x76 = window['system']['time_resources']['top_boss'] - get_current_timestamp()
  };
  var _0xdbf0x6 = _0xdbf0x76 % 86400;
  var _0xdbf0x85 = (_0xdbf0x76 - _0xdbf0x6) / 86400;
  var _0xdbf0x86 = _0xdbf0x6 % 3600;
  var _0xdbf0x87 = (_0xdbf0x6 - _0xdbf0x86) / 3600;
  var _0xdbf0x88 = _0xdbf0x86 % 60;
  var _0xdbf0x22 = (_0xdbf0x86 - _0xdbf0x88) / 60;
  if (_0xdbf0x85 > 0) {
    var _0xdbf0x2c = _0xdbf0x85 + 'д';
    if (_0xdbf0x87 > 0) {
      _0xdbf0x2c += ' ' + _0xdbf0x87 + 'ч'
    };
    _0xdbf0x137['innerHTML'] = _0xdbf0x2c
  } else {
    if (_0xdbf0x87 > 0) {
      var _0xdbf0x2c = _0xdbf0x87 + 'ч';
      if (_0xdbf0x22 > 0) {
        _0xdbf0x2c += ' ' + _0xdbf0x22 + 'м'
      };
      _0xdbf0x137['innerHTML'] = _0xdbf0x2c
    } else {
      _0xdbf0x137['innerHTML'] = _0xdbf0x22 + 'м'
    }
  }
}

function generate_item(_0xdbf0x309, _0xdbf0xa6, _0xdbf0x30a, _0xdbf0xf0) {
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'boss_top_award_item d-flex';
  var _0xdbf0x26 = document['createElement']('div');
  _0xdbf0x26['className'] = 'boss_top_award_item_number';
  _0xdbf0x26['innerHTML'] = 'Топ-' + _0xdbf0x309 + '.';
  _0xdbf0x8e['appendChild'](_0xdbf0x26);
  var _0xdbf0x30b = document['createElement']('div');
  _0xdbf0x30b['className'] = 'boss_top_award_item_tokens_icon';
  var _0xdbf0x25e = document['createElement']('img');
  _0xdbf0x25e['src'] = 'https://cdn.bravegames.space/regiment/images/tokens_interface.png';
  _0xdbf0x30b['appendChild'](_0xdbf0x25e);
  _0xdbf0x8e['appendChild'](_0xdbf0x30b);
  var _0xdbf0x30c = document['createElement']('div');
  _0xdbf0x30c['innerHTML'] = _0xdbf0xa6;
  _0xdbf0x30c['className'] = 'boss_top_award_item_tokens_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x30c);
  var _0xdbf0x30d = document['createElement']('div');
  _0xdbf0x30d['className'] = 'boss_top_award_item_box_icon';
  var _0xdbf0x260 = document['createElement']('img');
  _0xdbf0x260['src'] = 'https://cdn.bravegames.space/regiment/images/boxes/' + _0xdbf0xf0 + '-little.png';
  _0xdbf0x30d['appendChild'](_0xdbf0x260);
  _0xdbf0x8e['appendChild'](_0xdbf0x30d);
  var _0xdbf0x30e = document['createElement']('div');
  _0xdbf0x30e['innerHTML'] = _0xdbf0x30a;
  _0xdbf0x30e['className'] = 'boss_top_award_item_box_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x30e);
  var _0xdbf0x302 = document['createElement']('div');
  _0xdbf0x302['className'] = 'boss_top_item_border';
  var _0xdbf0x30f = document['createElement']('img');
  _0xdbf0x30f['src'] = 'https://cdn.bravegames.space/regiment/images/boss_top_item_border.png';
  _0xdbf0x302['appendChild'](_0xdbf0x30f);
  _0xdbf0x8e['appendChild'](_0xdbf0x302);
  return _0xdbf0x8e
}

function finish_raid_win() {
  this['onclick'] = '';
  document['getElementById']('modal')['style']['zIndex'] = 5;
  window['fire_work_stop'] = 1;
  if (document['getElementById']('boss_result_fight_share')['checked']) {
    post_wall('win_raid', window['player']['raid']['boss'])
  };
  if (window['player']['static_resources']['tutorial'] == 10) {
    var _0xdbf0x36 = document['getElementsByClassName']('bosses_map')[0];
    _0xdbf0x36['getElementsByClassName']('bosses_sector')[0]['style']['pointerEvents'] = '';
    show_tutorial(10)
  };
  var _0xdbf0x6 = [1, 2, 3];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x6['length']; _0xdbf0x4++) {
    var _0xdbf0x42 = document['getElementsByClassName']('soldier_' + _0xdbf0x6[_0xdbf0x4])[0];
    _0xdbf0x42['dataset']['used'] = 0;
    _0xdbf0x42['style']['display'] = 'none';
    var _0xdbf0x75 = _0xdbf0x42['getElementsByClassName']('soldier_indicator')[0];
    _0xdbf0x75['className'] = 'soldier_indicator'
  };
  window['player']['experiences']['experience']['amount'] += window['bosses'][window['player']['raid']['boss']]['reward']['experience'];
  window['player']['static_resources']['encryptions'] += window['bosses'][window['player']['raid']['boss']]['reward']['encryptions'];
  window['player']['achievements']['encryptions'] += window['bosses'][window['player']['raid']['boss']]['reward']['encryptions'];
  var _0xdbf0xef = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['raid']['top']['length']; _0xdbf0x4++) {
    if (window['player']['raid']['top'][_0xdbf0x4][0] == window['game_login']) {
      _0xdbf0xef = window['player']['raid']['top'][_0xdbf0x4][1]
    }
  };
  if (window['player']['raid']['boss'] != 17) {
    if (window['player']['bosses'][window['player']['raid']['boss']]) {
      if (window['player']['bosses'][window['player']['raid']['boss']]['win_count']) {
        window['player']['bosses'][window['player']['raid']['boss']]['win_count']++
      } else {
        window['player']['bosses'][window['player']['raid']['boss']]['win_count'] = 1
      };
      if (window['player']['bosses'][window['player']['raid']['boss']]['win_in_top']) {
        window['player']['bosses'][window['player']['raid']['boss']]['win_in_top']++
      } else {
        window['player']['bosses'][window['player']['raid']['boss']]['win_in_top'] = 1
      };
      if (window['player']['bosses'][window['player']['raid']['boss']]['damage_in_top']) {
        window['player']['bosses'][window['player']['raid']['boss']]['damage_in_top'] += _0xdbf0xef
      } else {
        window['player']['bosses'][window['player']['raid']['boss']]['damage_in_top'] = _0xdbf0xef
      }
    } else {
      window['player']['bosses'][window['player']['raid']['boss']] = {
        win_count: 1,
        win_in_top: 1,
        damage_in_top: _0xdbf0xef
      }
    };
    window['player']['achievements']['win_boss_' + window['player']['raid']['boss']]++
  };
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  if (window['player']['raid']['boss'] != 17) {
    if (window['player']['raid']['boss'] == 14 || window['player']['raid']['boss'] == 15) {
      var _0xdbf0xf0 = window['player']['raid']['boss'] - 6
    } else {
      var _0xdbf0xf0 = 7
    };
    if (window['player']['boxes']['length'] < window['limit_boxes']) {
      window['player']['boxes']['push']({
        "id": window['player']['static_resources']['boxes_id']++,
        "open_time": get_current_timestamp(),
        "type": _0xdbf0xf0
      })
    };
    if (window['player']['boxes']['length'] < window['limit_boxes']) {
      var _0xdbf0xf1 = random(window['player']['randoms']['raid_box']++);
      if (_0xdbf0xf1 < (70 / 100)) {
        _0xdbf0xf0 = 2
      } else {
        if (_0xdbf0xf1 < (90 / 100)) {
          _0xdbf0xf0 = 3
        } else {
          _0xdbf0xf0 = 4
        }
      };
      window['player']['boxes']['push']({
        "id": window['player']['static_resources']['boxes_id']++,
        "open_time": 0,
        "type": _0xdbf0xf0
      })
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'kill_boss') {
      if (window['player']['raid']['boss'] == window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['boss']) {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4]++;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  if (window['player']['raid']['boss'] == 17) {
    var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['boss_17_win'], 1, 86400);
    _0xdbf0xd5++;
    window['player']['expiring_resources']['boss_17_win']['amount'] = _0xdbf0xd5;
    window['player']['expiring_resources']['boss_17_win']['time'] = get_current_timestamp();
    window['player']['static_resources']['boss_17_level']++
  } else {
    var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['bosses_win'], 1, 86400);
    _0xdbf0xd5++;
    window['player']['expiring_resources']['bosses_win']['amount'] = _0xdbf0xd5;
    window['player']['expiring_resources']['bosses_win']['time'] = get_current_timestamp()
  };
  if (window['player']['raid']['boss'] == 17) {
    var _0xdbf0x26f = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['talents']['length']; _0xdbf0x4++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['talents'][_0xdbf0x4]['length']; _0xdbf0x38++) {
        _0xdbf0x26f += window['talents'][_0xdbf0x4][_0xdbf0x38]['amount']
      }
    };
    var _0xdbf0x270 = window['player']['static_resources']['used_talents'] + window['player']['static_resources']['new_talents'];
    var _0xdbf0x2c5 = _0xdbf0x26f - _0xdbf0x270;
    var _0xdbf0x22 = Math['min'](_0xdbf0x2c5, 3);
    window['player']['static_resources']['new_talents'] += _0xdbf0x22
  };
  if (window['player']['raid']['boss'] == 17) {
    server_action('talents.finish', {});
    finished_raid()
  } else {
    server_action('raid.finish', {});
    finished_raid()
  }
}

function finish_raid_lose() {
  this['onclick'] = '';
  var _0xdbf0x6 = [1, 2, 3];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x6['length']; _0xdbf0x4++) {
    var _0xdbf0x42 = document['getElementsByClassName']('soldier_' + _0xdbf0x6[_0xdbf0x4])[0];
    _0xdbf0x42['dataset']['used'] = 0;
    _0xdbf0x42['style']['display'] = 'none';
    var _0xdbf0x75 = _0xdbf0x42['getElementsByClassName']('soldier_indicator')[0];
    _0xdbf0x75['className'] = 'soldier_indicator'
  };
  if (window['player']['raid']['boss'] == 17) {
    server_action('talents.finish', {});
    finished_raid()
  } else {
    server_action('raid.finish', {});
    finished_raid()
  }
}

function check_boxes_status() {
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    if (window['player']['boxes'][_0xdbf0x4]['open_time'] > 0 && window['player']['boxes'][_0xdbf0x4]['open_time'] <= get_current_timestamp()) {
      _0xdbf0x15++
    }
  };
  if (_0xdbf0x15 > 0) {
    var _0xdbf0x137 = document['getElementById']('boxes')['getElementsByTagName']('span')[0];
    _0xdbf0x137['innerHTML'] = _0xdbf0x15;
    _0xdbf0x137['style']['display'] = 'block'
  } else {
    document['getElementById']('boxes')['getElementsByTagName']('span')[0]['style']['display'] = 'none'
  }
}

function check_gifts_status() {
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x7d in window['player']['gifts']) {
    if (get_current_timestamp() < (window['player']['gifts'][_0xdbf0x7d]['time'] + 86400)) {
      _0xdbf0x15++
    }
  };
  if (_0xdbf0x15 > 0) {
    var _0xdbf0x137 = document['getElementById']('my_profile')['getElementsByTagName']('span')[0];
    _0xdbf0x137['innerHTML'] = _0xdbf0x15;
    _0xdbf0x137['style']['display'] = 'block'
  } else {
    document['getElementById']('my_profile')['getElementsByTagName']('span')[0]['style']['display'] = 'none'
  }
}

function finished_raid(_0xdbf0x12) {
  window['player']['time_resources']['free_hit'] = 0;
  hide_modal('boss_result_fight');
  hide_boss_fight(1);
  var _0xdbf0xe3 = window['player']['raid']['boss'];
  delete window['player']['raid']['boss'];
  delete window['player']['raid']['finish_time'];
  delete window['player']['raid']['health'];
  delete window['player']['raid']['top'];
  delete window['player']['raid']['paid_mode'];
  if (_0xdbf0xe3 == 17) {
    show_talents()
  } else {
    show_raids()
  };
  update_level(0)
}

function start_raid() {
  this['onclick'] = '';
  var _0xdbf0x296 = 0;
  if (get_current_timestamp() > window['player']['settings']['time_skip_boxes_limit']) {
    if (window['player']['boxes']['length'] == (window['limit_boxes'] - 1)) {
      _0xdbf0x296 = 1
    } else {
      if (window['player']['boxes']['length'] >= window['limit_boxes']) {
        _0xdbf0x296 = 2
      } else {
        _0xdbf0x296 = 3
      }
    }
  } else {
    _0xdbf0x296 = 3
  };
  if (_0xdbf0x296 == 1) {
    show_boxes_limit(0)
  } else {
    if (_0xdbf0x296 == 2) {
      show_boxes_limit(1)
    } else {
      if (_0xdbf0x296 == 3) {
        start_raid_2()
      }
    }
  }
}

function show_boxes_limit(_0xdbf0x5d) {
  hide_boss_info(1);
  if (_0xdbf0x5d == 0) {
    var _0xdbf0x168 = 'Лимит ящиков близок - ' + window['player']['boxes']['length'] + ' / ' + window['limit_boxes'] + '.<br>Если вы продолжите, то потеряете часть награды. Будет получен только ящик с техникой. Желаете ли вы продолжить?'
  } else {
    var _0xdbf0x168 = 'Достигнут лимит ящиков - ' + window['player']['boxes']['length'] + ' / ' + window['limit_boxes'] + '.<br>Если вы продолжите, то потеряете заслуженную награду.<br>Желаете ли вы продолжить?'
  };
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('full_boxes_limit')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('full_boxes_limit_button_yes')[0]['onclick'] = boxes_limit_yes;
  _0xdbf0x36['getElementsByClassName']('full_boxes_limit_button_no')[0]['onclick'] = boxes_limit_no;
  _0xdbf0x36['getElementsByClassName']('full_boxes_limit_text')[0]['innerHTML'] = _0xdbf0x168
}

function boxes_limit_yes() {
  var _0xdbf0x318 = document['getElementById']('full_boxes_limit_skip');
  if (_0xdbf0x318['checked'] == 1) {
    window['player']['settings']['time_skip_boxes_limit'] = window['system']['time_resources']['new_day'];
    server_action('settings.skip_boxes_limit', {})
  };
  hide_boxes_limit();
  start_raid_2()
}

function boxes_limit_no() {
  hide_boxes_limit();
  var _0xdbf0x9b = parseInt(document['getElementsByClassName']('boss_info')[0]['dataset']['bid']);
  show_boss_info(_0xdbf0x9b)
}

function hide_boxes_limit() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('full_boxes_limit')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function start_raid_2() {
  clearTimeout(window['utdt']);
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['bosses_win'], 1, 86400);
  var _0xdbf0x12 = document['getElementsByClassName']('boss_info')[0]['dataset'];
  if (_0xdbf0xd5 >= (window['limit_bosses'] + window['player']['static_resources']['boost_bosses_win'])) {
    var _0xdbf0x9b = parseInt(_0xdbf0x12['bid']);
    var _0xdbf0xa7 = parseInt(_0xdbf0x12['debuff']);
    show_buy_raid(_0xdbf0x9b, _0xdbf0xa7)
  } else {
    window['count_weapons'] = 0;
    var _0xdbf0x9b = parseInt(_0xdbf0x12['bid']);
    window['player']['raid']['boss'] = _0xdbf0x9b;
    var _0xdbf0xe6 = Math['min'](window['player']['static_resources']['sut'] - window['bosses'][_0xdbf0x9b]['dbf']['min_sut'], window['bosses'][_0xdbf0x9b]['dbf']['max_sut'] - window['bosses'][_0xdbf0x9b]['dbf']['min_sut']);
    if (_0xdbf0x12['debuff'] == '1') {
      var _0xdbf0xe7 = Math['round']((window['bosses'][_0xdbf0x9b]['health'] - window['bosses'][_0xdbf0x9b]['dbf']['start'] - window['bosses'][_0xdbf0x9b]['dbf']['remains']) / (window['bosses'][_0xdbf0x9b]['dbf']['max_sut'] - window['bosses'][_0xdbf0x9b]['dbf']['min_sut']));
      var _0xdbf0xe8 = window['bosses'][_0xdbf0x9b]['dbf']['start'] + _0xdbf0xe6 * _0xdbf0xe7;
      window['player']['static_resources']['coins'] -= window['bosses'][_0xdbf0x9b]['dbf']['price'];
      update_static_resources_coins()
    } else {
      var _0xdbf0xe8 = 0
    };
    var _0xdbf0xe9 = window['bosses'][_0xdbf0x9b]['health'] - _0xdbf0xe8;
    window['player']['raid']['health'] = _0xdbf0xe9;
    window['player']['raid']['start_time'] = get_current_timestamp();
    window['player']['raid']['finish_time'] = get_current_timestamp() + 28800 + window['player']['static_resources']['boost_fight_time'];
    window['player']['raid']['top'] = [];
    hide_boss_info(1);
    update_static_resources_coins();
    show_boss_fight();
    window['player']['static_resources']['used_free_hit_0'] = 0;
    window['player']['static_resources']['used_free_hit_1'] = 0;
    window['player']['static_resources']['used_free_hit_2'] = 0;
    server_action('raid.start', {
      "boss": _0xdbf0x12['bid'],
      "debuff": _0xdbf0x12['debuff']
    })
  }
}

function show_buy_raid(_0xdbf0x9b, _0xdbf0xa7) {
  hide_boss_info(0);
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_buy_raid')[0];
  _0xdbf0x36['getElementsByClassName']('buy_raid_name')[0]['innerHTML'] = window['bosses'][_0xdbf0x9b]['short_name'];
  _0xdbf0x36['getElementsByClassName']('buy_raid_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/' + _0xdbf0x9b + '-big.jpg';
  _0xdbf0x36['getElementsByClassName']('buy_raid_price')[0]['getElementsByTagName']('span')[0]['innerHTML'] = word_form(window['price_buy_raid'], 'талон', 'талона', 'талонов');
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('buy_raid_buttons_yes')[0]['onclick'] = function() {
    start_paid_raid(_0xdbf0x9b, _0xdbf0xa7)
  };
  _0xdbf0x36['getElementsByClassName']('buy_raid_buttons_no')[0]['onclick'] = hide_buy_raid
}

function hide_buy_raid() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  _0xdbf0x35['getElementsByClassName']('modal_buy_raid')[0]['style']['display'] = 'none'
}

function start_paid_raid(_0xdbf0x9b, _0xdbf0xa7) {
  if (window['player']['static_resources']['tickets'] >= window['price_buy_raid']) {
    window['count_weapons'] = 0;
    window['player']['static_resources']['tickets'] -= window['price_buy_raid'];
    update_static_resources_tickets();
    window['player']['raid']['boss'] = _0xdbf0x9b;
    var _0xdbf0xe6 = Math['min'](window['player']['static_resources']['sut'] - window['bosses'][_0xdbf0x9b]['dbf']['min_sut'], window['bosses'][_0xdbf0x9b]['dbf']['max_sut'] - window['bosses'][_0xdbf0x9b]['dbf']['min_sut']);
    if (_0xdbf0xa7 == 1) {
      var _0xdbf0xe8 = window['bosses'][_0xdbf0x9b]['dbf']['start'] + _0xdbf0xe6 * window['bosses'][_0xdbf0x9b]['dbf']['step'];
      window['player']['static_resources']['coins'] -= window['bosses'][_0xdbf0x9b]['dbf']['price'];
      update_static_resources_coins()
    } else {
      var _0xdbf0xe8 = 0
    };
    var _0xdbf0xe9 = window['bosses'][_0xdbf0x9b]['health'] - _0xdbf0xe8;
    window['player']['raid']['health'] = _0xdbf0xe9;
    window['player']['raid']['start_time'] = get_current_timestamp();
    window['player']['raid']['finish_time'] = get_current_timestamp() + 28800 + window['player']['static_resources']['boost_fight_time'];
    window['player']['raid']['top'] = [];
    hide_buy_raid();
    hide_boss_info(1);
    update_static_resources_coins();
    show_boss_fight();
    window['player']['static_resources']['used_free_hit_0'] = 0;
    window['player']['static_resources']['used_free_hit_1'] = 0;
    window['player']['static_resources']['used_free_hit_2'] = 0;
    server_action('raid.paid_start', {
      "boss": _0xdbf0x9b,
      "debuff": _0xdbf0xa7
    })
  } else {
    hide_buy_raid();
    show_modal_no_tickets()
  }
}

function show_boss_fight() {
  play_music('raids_background.mp3');
  window['loc_page'] = 'boss_fight';
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight')[0];
  if (window['player']['static_resources']['tutorial'] == 7) {
    window['player']['static_resources']['tutorial']++;
    tutorial_arrow_stop();
    _0xdbf0x36['getElementsByClassName']('modal_close')[0]['style']['display'] = 'none';
    show_tutorial(8)
  };
  _0xdbf0x36['className'] = 'boss_fight boss_fight_' + window['player']['raid']['boss'];
  document['getElementsByClassName']('game_block')[0]['style']['zIndex'] = '2';
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('missions_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('sector_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('bosses_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'none';
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (window['friends'][_0xdbf0x4]['id'] == window['game_login']) {
      var _0xdbf0x10a = window['friends'][_0xdbf0x4]['profile'];
      _0xdbf0x10a['id'] = window['game_login']
    }
  };
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_my_avatar')[0];
  _0xdbf0x36['getElementsByTagName']('img')[0]['src'] = _0xdbf0x10a['photo_50'];
  document['getElementsByClassName']('boss_fight_name_player')[0]['innerHTML'] = _0xdbf0x10a['first_name'] + ' ' + _0xdbf0x10a['last_name'];
  update_boss_timer();
  window['ubt'] = setInterval(update_boss_timer, 1000);
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_foe_avatar')[0];
  _0xdbf0x36['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/' + window['player']['raid']['boss'] + '.jpg';
  document['getElementsByClassName']('boss_fight_name_foe')[0]['innerHTML'] = window['bosses'][window['player']['raid']['boss']]['short_name'];
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_foe_line_health')[0];
  if (window['player']['raid']['boss'] == 17) {
    if (window['player']['raid']['paid_mode'] == 0) {
      var _0xdbf0x4a = window['bosses'][17]['health'][window['player']['static_resources']['boss_17_level']]
    } else {
      if (window['player']['raid']['paid_mode'] == 1) {
        var _0xdbf0x4a = 3 * window['bosses'][17]['health'][window['player']['static_resources']['boss_17_level']]
      }
    }
  } else {
    var _0xdbf0x4a = window['bosses'][window['player']['raid']['boss']]['health']
  };
  _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_count')[0]['innerHTML'] = window['player']['raid']['health']['toLocaleString']() + ' / ' + _0xdbf0x4a['toLocaleString']();
  var _0xdbf0x4b = _0xdbf0x4a / 100;
  var _0xdbf0x4c = Math['round'](window['player']['raid']['health'] / _0xdbf0x4b);
  _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_current')[0]['style']['width'] = _0xdbf0x4c + '%';
  var _0xdbf0x55 = document['getElementsByClassName']('boss_fight_weapons_type_shot')[0]['getElementsByClassName']('boss_fight_weapons_type_shot_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['onclick'] = change_count_weapons;
    if (window['count_weapons'] == _0xdbf0x55[_0xdbf0x4]['dataset']['cid']) {
      _0xdbf0x55[_0xdbf0x4]['onclick']()
    }
  };
  document['getElementsByClassName']('boss_fight')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('footer_boss_fight')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('boss_fight_top')[0]['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
    play_effect('click.mp3');
    hide_boss_fight(0)
  };
  var _0xdbf0x55 = document['getElementsByClassName']('soldier');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['dataset']['vid'] = '';
    _0xdbf0x55[_0xdbf0x4]['style']['display'] = 'none'
  };
  update_boss_top();
  var _0xdbf0x55 = document['getElementsByClassName']('boss_fight_menu')[0]['getElementsByClassName']('boss_fight_menu_item');
  _0xdbf0x55[0]['style']['filter'] = 'grayscale(1)';
  _0xdbf0x55[0]['style']['cursor'] = 'default';
  _0xdbf0x55[0]['onclick'] = '';
  if (window['player']['raid']['boss'] == 17) {
    _0xdbf0x55[1]['style']['filter'] = 'grayscale(1)';
    _0xdbf0x55[1]['style']['cursor'] = 'default'
  } else {
    _0xdbf0x55[1]['onclick'] = help_raid;
    setTimeout(btn_enable_update_raid, 5000)
  };
  _0xdbf0x55[2]['onclick'] = show_boss_fight_leave;
  if (!window['player']['raid']['top'] || window['player']['raid']['top']['length'] == 0) {
    show_boss_tech()
  }
}

function help_raid() {
  play_effect('click.mp3');
  post_wall('help_raid', window['player']['raid']['boss'])
}

function show_boss_tech() {
  var _0xdbf0x55 = document['getElementsByClassName']('soldier');
  var _0xdbf0x322 = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['dataset']['vid']) {
      _0xdbf0x322['push'](parseInt(_0xdbf0x55[_0xdbf0x4]['dataset']['vid']))
    }
  };
  var _0xdbf0x129 = 3 - _0xdbf0x322['length'];
  if (_0xdbf0x129 > 0) {
    var _0xdbf0x2c = [];
    if (!in_array(window['game_login'], _0xdbf0x322)) {
      _0xdbf0x2c['push'](window['game_login']);
      _0xdbf0x129--
    };
    if (_0xdbf0x129 > 0) {
      if (window['player']['raid']['top']) {
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['raid']['top']['length']; _0xdbf0x4++) {
          if (_0xdbf0x129 > 0 && !in_array(window['player']['raid']['top'][_0xdbf0x4][0], _0xdbf0x322) && !in_array(window['player']['raid']['top'][_0xdbf0x4][0], _0xdbf0x2c)) {
            _0xdbf0x2c['push'](window['player']['raid']['top'][_0xdbf0x4][0]);
            _0xdbf0x129--
          }
        }
      }
    };
    if (_0xdbf0x2c['length'] > 0) {
      _0xdbf0x2c['sort'](function() {
        return Math['random']() - 0.5
      });
      var _0xdbf0x7d = 0;
      var _0xdbf0x55 = document['getElementsByClassName']('soldier');
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
        if (!_0xdbf0x55[_0xdbf0x4]['dataset']['vid'] && _0xdbf0x2c[_0xdbf0x7d]) {
          var _0xdbf0x135 = 0;
          var _0xdbf0x10a = {};
          var _0xdbf0x323 = -1;
          for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['friends']['length']; _0xdbf0x38++) {
            if (window['friends'][_0xdbf0x38]['id'] == _0xdbf0x2c[_0xdbf0x7d] && window['friends'][_0xdbf0x38]['profile']) {
              _0xdbf0x135 = 1;
              _0xdbf0x10a = window['friends'][_0xdbf0x38]['profile'];
              _0xdbf0x323 = window['friends'][_0xdbf0x38]['id']
            }
          };
          if (_0xdbf0x135 == 1) {
            _0xdbf0x55[_0xdbf0x4]['dataset']['vid'] = _0xdbf0x2c[_0xdbf0x7d];
            if (_0xdbf0x323 == window['game_login']) {
              var _0xdbf0x75 = [];
              for (var _0xdbf0x7d in window['player']['hangar'][1]) {
                _0xdbf0x75['push'](parseInt(_0xdbf0x7d))
              };
              var _0xdbf0x6b = random_int(0, _0xdbf0x75['length'] - 1);
              var _0xdbf0x9a = _0xdbf0x75[_0xdbf0x6b]
            } else {
              var _0xdbf0x9a = random_int(0, 374)
            };
            _0xdbf0x55[_0xdbf0x4]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/1/' + _0xdbf0x9a + '.png';
            var _0xdbf0x36 = _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('soldier_indicator')[0];
            if (_0xdbf0x2c[_0xdbf0x7d] == window['game_login']) {
              _0xdbf0x36['className'] = 'soldier_indicator myself'
            } else {
              _0xdbf0x36['className'] = 'soldier_indicator'
            };
            _0xdbf0x55[_0xdbf0x4]['getElementsByTagName']('img')[1]['src'] = _0xdbf0x10a['photo_50'];
            _0xdbf0x36['setAttribute']('tooltipbig', _0xdbf0x10a['first_name'] + ' ' + _0xdbf0x10a['last_name']);
            _0xdbf0x55[_0xdbf0x4]['style']['display'] = 'block'
          };
          _0xdbf0x7d++
        }
      }
    }
  }
}

function random_int(_0xdbf0x22, _0xdbf0x23) {
  var _0xdbf0x24 = Math['round'](_0xdbf0x22 - 0.5 + Math['random']() * (_0xdbf0x23 - _0xdbf0x22 + 1));
  return _0xdbf0x24
}

function show_boss_fight_leave() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_boss_fight_end')[0];
  _0xdbf0x36['getElementsByClassName']('boss_fight_end_name')[0]['innerHTML'] = window['bosses'][window['player']['raid']['boss']]['short_name'];
  _0xdbf0x36['getElementsByClassName']('boss_fight_end_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/bosses/' + window['player']['raid']['boss'] + '-big.jpg';
  if (window['bosses'][window['player']['raid']['boss']]['leave']['resource'] == 'tokens') {
    var _0xdbf0x2c = word_form(window['bosses'][window['player']['raid']['boss']]['leave']['count'], 'жетонов', 'жетона', 'жетонов')
  } else {
    if (window['bosses'][window['player']['raid']['boss']]['leave']['resource'] == 'tickets') {
      var _0xdbf0x2c = word_form(window['bosses'][window['player']['raid']['boss']]['leave']['count'], 'талон', 'талона', 'талонов')
    }
  };
  _0xdbf0x36['getElementsByClassName']('boss_fight_end_price')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0x2c;
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('boss_fight_end_buttons_yes')[0]['onclick'] = leave_boss_fight;
  _0xdbf0x36['getElementsByClassName']('boss_fight_end_buttons_no')[0]['onclick'] = function() {
    hide_boss_fight_leave(0)
  }
}

function leave_boss_fight() {
  if (window['player']['static_resources'][window['bosses'][window['player']['raid']['boss']]['leave']['resource']] >= window['bosses'][window['player']['raid']['boss']]['leave']['count']) {
    if (window['player']['raid']['boss'] == 17) {
      server_action('talents.leave', {})
    } else {
      server_action('raid.leave', {})
    };
    if (window['bosses'][window['player']['raid']['boss']]['leave']['resource'] == 'tokens') {
      window['player']['static_resources']['tokens'] -= window['bosses'][window['player']['raid']['boss']]['leave']['count'];
      if (window['player']['settings']['resource'] == 0) {
        change_resource('tokens', 0)
      } else {
        change_resource('encryptions', 0)
      }
    } else {
      if (window['bosses'][window['player']['raid']['boss']]['leave']['resource'] == 'tickets') {
        window['player']['static_resources']['tickets'] -= window['bosses'][window['player']['raid']['boss']]['leave']['count'];
        update_static_resources_tickets()
      }
    };
    hide_boss_fight_leave(1);
    finished_raid()
  } else {
    if (window['bosses'][window['player']['raid']['boss']]['leave']['resource'] == 'tokens') {
      hide_boss_fight_leave(0);
      show_modal_no_tokens()
    } else {
      if (window['bosses'][window['player']['raid']['boss']]['leave']['resource'] == 'tickets') {
        hide_boss_fight_leave(0);
        show_modal_no_tickets()
      }
    }
  }
}

function empty_callback() {}

function show_modal_no_tokens() {
  window['view_modal'] = 1;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_tokens')[0];
  document['getElementById']('btn_buy_tokens')['onclick'] = function() {
    hide_modal_no_tokens();
    hide_boss_fight(0);
    show_homeland();
    show_shop(1);
    shop_menu('tokens', 1)
  };
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x35['getElementsByClassName']('modal_close')[0]['onclick'] = hide_modal_no_tokens
}

function hide_modal_no_tokens() {
  play_effect('click.mp3');
  window['view_modal'] = 0;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_tokens')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function show_modal_no_tickets() {
  window['view_modal'] = 1;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_tickets')[0];
  document['getElementById']('btn_buy_tickets')['onclick'] = function() {
    hide_modal_no_tickets(1);
    hide_boss_fight(0);
    hide_calendar();
    show_homeland();
    show_shop(1);
    shop_menu('tickets', 1)
  };
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x35['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
    hide_modal_no_tickets(0)
  }
}

function hide_modal_no_tickets(_0xdbf0x10f) {
  if (_0xdbf0x10f != 1) {
    play_effect('click.mp3')
  };
  window['view_modal'] = 0;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_tickets')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function hide_boss_fight_leave(_0xdbf0x10f) {
  if (_0xdbf0x10f != 1) {
    play_effect('click.mp3')
  };
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  _0xdbf0x35['getElementsByClassName']('modal_boss_fight_end')[0]['style']['display'] = 'none'
}

function update_server_raid() {
  play_effect('click.mp3');
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_menu')[0]['getElementsByClassName']('boss_fight_menu_item')[0];
  _0xdbf0x36['style']['filter'] = 'grayscale(1)';
  _0xdbf0x36['style']['cursor'] = 'default';
  _0xdbf0x36['onclick'] = '';
  server_action_fast('raid.update', {}, 'updated_server_raid');
  setTimeout(btn_enable_update_raid, 5000)
}

function btn_enable_update_raid() {
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_menu')[0]['getElementsByClassName']('boss_fight_menu_item')[0];
  _0xdbf0x36['style']['filter'] = 'grayscale(0)';
  _0xdbf0x36['style']['cursor'] = 'pointer';
  _0xdbf0x36['onclick'] = update_server_raid
}

function updated_server_raid(_0xdbf0x12) {
  window['player']['raid']['top'] = _0xdbf0x12['player']['raid']['top'];
  window['player']['raid']['health'] = _0xdbf0x12['player']['raid']['health'];
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_foe_line_health')[0];
  _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_count')[0]['innerHTML'] = window['player']['raid']['health']['toLocaleString']() + ' / ' + window['bosses'][window['player']['raid']['boss']]['health']['toLocaleString']();
  var _0xdbf0x4b = window['bosses'][window['player']['raid']['boss']]['health'] / 100;
  var _0xdbf0x4c = Math['round'](window['player']['raid']['health'] / _0xdbf0x4b);
  _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_current')[0]['style']['width'] = _0xdbf0x4c + '%';
  if (window['player']['raid']['health'] !== undefined && window['player']['raid']['health'] == 0 && window['player']['raid']['finish_time'] !== undefined) {
    update_top_damage_final();
    raid_win()
  };
  update_boss_top()
}

function free_hit() {
  animation_damage_weapons();
  var _0xdbf0x9a = parseInt(this['dataset']['fhid']);
  var _0xdbf0xea = window['free_hits'][_0xdbf0x9a]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x9a];
  if (get_current_timestamp() > window['player']['time_resources']['free_hit']) {
    play_effect('weapon_' + random_int(1, 4) + '.mp3');
    window['player']['time_resources']['free_hit'] = get_current_timestamp() + window['free_hits'][_0xdbf0x9a]['time'] - window['player']['static_resources']['boost_speed_recovery_free_weapon_' + _0xdbf0x9a];
    if (window['player']['raid']['boss'] == 17) {
      server_action('talents.free_hit', {
        "weapon": _0xdbf0x9a
      })
    } else {
      server_action('weapons.free_hit', {
        "weapon": _0xdbf0x9a
      })
    };
    window['player']['raid']['health'] -= _0xdbf0xea;
    if (window['player']['raid']['health'] < 0) {
      window['player']['raid']['health'] = 0
    };
    var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_foe_line_health')[0];
    if (window['player']['raid']['boss'] == 17) {
      var _0xdbf0x4a = window['bosses'][window['player']['raid']['boss']]['health'][window['player']['static_resources']['boss_17_level']]
    } else {
      var _0xdbf0x4a = window['bosses'][window['player']['raid']['boss']]['health']
    };
    _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_count')[0]['innerHTML'] = window['player']['raid']['health']['toLocaleString']() + ' / ' + _0xdbf0x4a['toLocaleString']();
    var _0xdbf0x4b = _0xdbf0x4a / 100;
    var _0xdbf0x4c = Math['round'](window['player']['raid']['health'] / _0xdbf0x4b);
    _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_current')[0]['style']['width'] = _0xdbf0x4c + '%';
    var _0xdbf0x24f = 0;
    if (window['player']['raid']['top']) {
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['raid']['top']['length']; _0xdbf0x4++) {
        if (window['player']['raid']['top'][_0xdbf0x4][0] == window['game_login']) {
          window['player']['raid']['top'][_0xdbf0x4][1] += _0xdbf0xea;
          _0xdbf0x24f = 1
        }
      }
    } else {
      window['player']['raid']['top'] = []
    };
    if (_0xdbf0x24f == 0) {
      window['player']['raid']['top']['push']([window['game_login'], _0xdbf0xea])
    };
    update_boss_top();
    if (window['player']['raid']['health'] <= 0) {
      update_top_damage_final();
      raid_win()
    }
  };
  window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
  window['player']['achievements']['total_damage'] += _0xdbf0xea;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'damage') {
      var _0xdbf0xea = window['free_hits'][_0xdbf0x9a]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x9a];
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0xea;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    }
  }
}

function change_count_weapons() {
  play_effect('click.mp3');
  window['count_weapons'] = this['dataset']['cid'];
  var _0xdbf0x55 = document['getElementsByClassName']('boss_fight_weapons_type_shot')[0]['getElementsByClassName']('boss_fight_weapons_type_shot_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['dataset']['cid'] == window['count_weapons']) {
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_type_shot_item active'
    } else {
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_type_shot_item'
    }
  };
  var _0xdbf0x15 = 1;
  if (window['count_weapons'] == 1) {
    _0xdbf0x15 = 10
  } else {
    if (window['count_weapons'] == 2) {
      _0xdbf0x15 = 100
    } else {
      if (window['count_weapons'] == 3) {
        _0xdbf0x15 = 1000
      }
    }
  };
  var _0xdbf0x55 = document['getElementsByClassName']('boss_fight_weapons_list')[0]['getElementsByClassName']('boss_fight_weapons_item');
  var _0xdbf0x76 = window['player']['time_resources']['free_hit'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  if (_0xdbf0x87 > 0) {
    var _0xdbf0x2c = _0xdbf0x87 + ':'
  } else {
    var _0xdbf0x2c = ''
  };
  var _0xdbf0x88 = _0xdbf0x6 % 60;
  var _0xdbf0x22 = (_0xdbf0x6 - _0xdbf0x88) / 60;
  if (_0xdbf0x22 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x22 + ':'
  } else {
    _0xdbf0x2c += _0xdbf0x22 + ':'
  };
  if (_0xdbf0x88 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x88
  } else {
    _0xdbf0x2c += _0xdbf0x88
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    if (get_current_timestamp() > window['player']['time_resources']['free_hit']) {
      _0xdbf0x55[_0xdbf0x4]['onclick'] = free_hit;
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item active';
      var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltipmission', window['free_hits'][_0xdbf0x4]['name'] + '\x0AУрон: ' + number_format(_0xdbf0xea));
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = 'Готово'
    } else {
      _0xdbf0x55[_0xdbf0x4]['style']['cursor'] = 'pointer';
      _0xdbf0x55[_0xdbf0x4]['onclick'] = show_buy_refresh_free_hits;
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item';
      var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltipmission', window['free_hits'][_0xdbf0x4]['name'] + '\x0AУрон: ' + number_format(_0xdbf0xea));
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = _0xdbf0x2c
    }
  };
  for (var _0xdbf0x4 = 3, _0xdbf0x38 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    if (window['player']['static_resources']['weapon_' + _0xdbf0x38] >= _0xdbf0x15) {
      _0xdbf0x55[_0xdbf0x4]['onclick'] = weapons_hit;
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item active';
      var _0xdbf0xea = _0xdbf0x15 * (window['weapons_damage'][_0xdbf0x38]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x38]);
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltipmission', window['weapons_damage'][_0xdbf0x38]['name'] + '\x0AУрон: ' + number_format(_0xdbf0xea));
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = window['player']['static_resources']['weapon_' + _0xdbf0x38]
    } else {
      _0xdbf0x55[_0xdbf0x4]['onclick'] = '';
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item';
      var _0xdbf0xea = _0xdbf0x15 * (window['weapons_damage'][_0xdbf0x38]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x38]);
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltipmission', window['weapons_damage'][_0xdbf0x38]['name'] + '\x0AУрон: ' + number_format(_0xdbf0xea));
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = window['player']['static_resources']['weapon_' + _0xdbf0x38]
    }
  }
}

function number_format(_0xdbf0x332) {
  return _0xdbf0x332.toString()['replace'](/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function animation_damage_weapons_static(_0xdbf0x26) {
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['className'] = 'explosion explosion_' + _0xdbf0x26;
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/animation/damage/1.png';
  document['getElementsByClassName']('boss_fight')[0]['appendChild'](_0xdbf0x90);
  setTimeout(an_damage_next, 15, _0xdbf0x90, 1)
}

function animation_damage_weapons() {
  var _0xdbf0x1f = random_int(1, 3);
  while (_0xdbf0x1f == window['last_position_damage']) {
    _0xdbf0x1f = random_int(1, 3)
  };
  window['last_position_damage'] = _0xdbf0x1f;
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['className'] = 'explosion explosion_' + _0xdbf0x1f;
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/animation/damage/1.png';
  document['getElementsByClassName']('boss_fight')[0]['appendChild'](_0xdbf0x90);
  setTimeout(an_damage_next, 15, _0xdbf0x90, 1)
}

function an_damage_next(_0xdbf0x90, _0xdbf0x26) {
  _0xdbf0x26++;
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/animation/damage/' + _0xdbf0x26 + '.png';
  if (_0xdbf0x26 < 64) {
    setTimeout(an_damage_next, 15, _0xdbf0x90, _0xdbf0x26)
  } else {
    setTimeout(delete_animation, 15, _0xdbf0x90)
  }
}

function delete_animation(_0xdbf0x90) {
  _0xdbf0x90['parentNode']['removeChild'](_0xdbf0x90)
}

function weapons_hit() {
  animation_damage_weapons();
  if (window['player']['static_resources']['tutorial'] == 8) {
    document['getElementsByClassName']('boss_fight_weapons_list')[0]['getElementsByClassName']('boss_fight_weapons_item')[7]['style']['pointerEvents'] = '';
    tutorial_arrow_stop();
    window['player']['static_resources']['tutorial']++
  };
  var _0xdbf0x9a = parseInt(this['dataset']['wid']);
  var _0xdbf0x15 = 1;
  if (window['count_weapons'] == 1) {
    _0xdbf0x15 = 10
  } else {
    if (window['count_weapons'] == 2) {
      _0xdbf0x15 = 100
    } else {
      if (window['count_weapons'] == 3) {
        _0xdbf0x15 = 1000
      }
    }
  };
  var _0xdbf0xea = _0xdbf0x15 * (window['weapons_damage'][_0xdbf0x9a]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x9a]);
  if (window['player']['static_resources']['weapon_' + _0xdbf0x9a] >= _0xdbf0x15) {
    play_effect('weapon_' + random_int(1, 4) + '.mp3');
    window['player']['static_resources']['weapon_' + _0xdbf0x9a] -= _0xdbf0x15;
    if (window['player']['raid']['boss'] == 17) {
      server_action('talents.hit', {
        "mode": window['count_weapons'],
        "weapon": +_0xdbf0x9a
      })
    } else {
      server_action('weapons.hit', {
        "mode": window['count_weapons'],
        "weapon": +_0xdbf0x9a
      })
    };
    hited_weapons();
    window['player']['raid']['health'] -= _0xdbf0xea;
    if (window['player']['static_resources']['tutorial'] == 9) {
      window['player']['raid']['health'] -= 1000000
    };
    if (window['player']['raid']['health'] < 0) {
      window['player']['raid']['health'] = 0
    };
    var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_foe_line_health')[0];
    if (window['player']['raid']['boss'] == 17) {
      var _0xdbf0x4a = window['bosses'][window['player']['raid']['boss']]['health'][window['player']['static_resources']['boss_17_level']]
    } else {
      var _0xdbf0x4a = window['bosses'][window['player']['raid']['boss']]['health']
    };
    _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_count')[0]['innerHTML'] = window['player']['raid']['health']['toLocaleString']() + ' / ' + _0xdbf0x4a['toLocaleString']();
    var _0xdbf0x4b = _0xdbf0x4a / 100;
    var _0xdbf0x4c = Math['round'](window['player']['raid']['health'] / _0xdbf0x4b);
    _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_current')[0]['style']['width'] = _0xdbf0x4c + '%';
    var _0xdbf0x24f = 0;
    if (window['player']['raid']['top']) {
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['raid']['top']['length']; _0xdbf0x4++) {
        if (window['player']['raid']['top'][_0xdbf0x4][0] == window['game_login']) {
          window['player']['raid']['top'][_0xdbf0x4][1] += _0xdbf0xea;
          _0xdbf0x24f = 1
        }
      }
    } else {
      window['player']['raid']['top'] = []
    };
    if (_0xdbf0x24f == 0) {
      window['player']['raid']['top']['push']([window['game_login'], _0xdbf0xea])
    };
    update_boss_top();
    if (window['player']['static_resources']['tutorial'] == 9) {
      _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_count')[0]['innerHTML'] = '0 / ' + window['bosses'][window['player']['raid']['boss']]['health']['toLocaleString']();
      _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_current')[0]['style']['width'] = '0%'
    };
    if (window['player']['raid']['health'] <= 0) {
      update_top_damage_final();
      raid_win()
    }
  };
  window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
  window['player']['achievements']['total_damage'] += _0xdbf0xea;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'damage') {
      var _0xdbf0xea = _0xdbf0x15 * (window['weapons_damage'][_0xdbf0x9a]['damage'] + window['player']['static_resources']['boost_weapon_' + _0xdbf0x9a]);
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0xea;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    } else {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'weapons') {
        if (_0xdbf0x9a == window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['weapon']) {
          window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x15;
          if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
            window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
            window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
          }
        }
      }
    }
  }
}

function show_buy_refresh_free_hits() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_apply_free_weapon')[0];
  var _0xdbf0x9a = parseInt(this['dataset']['fhid']);
  _0xdbf0x36['getElementsByClassName']('apply_free_weapon_name')[0]['innerHTML'] = window['free_hits'][_0xdbf0x9a]['name'];
  _0xdbf0x36['getElementsByClassName']('apply_free_weapon_image')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/w' + (_0xdbf0x9a + 1) + '-large.png';
  var _0xdbf0x76 = window['player']['time_resources']['free_hit'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x15 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  if (_0xdbf0x6 > 0) {
    _0xdbf0x15++
  };
  var _0xdbf0x2c = word_form(_0xdbf0x15, 'жетон', 'жетона', 'жетонов');
  _0xdbf0x36['getElementsByClassName']('apply_free_weapon_price')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0x2c;
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('apply_free_weapon_buttons_yes')[0]['onclick'] = function() {
    buy_refresh_free_hits(_0xdbf0x9a)
  };
  _0xdbf0x36['getElementsByClassName']('apply_free_weapon_buttons_no')[0]['onclick'] = hide_buy_refresh_free_hits
}

function buy_refresh_free_hits(_0xdbf0x9a) {
  var _0xdbf0x76 = window['player']['time_resources']['free_hit'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x15 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  if (_0xdbf0x6 > 0) {
    _0xdbf0x15++
  };
  if (window['player']['static_resources']['tokens'] >= _0xdbf0x15) {
    if (window['player']['static_resources']['used_free_hit_' + _0xdbf0x9a] < 10) {
      animation_damage_weapons();
      play_effect('weapon_' + random_int(1, 4) + '.mp3');
      window['player']['time_resources']['free_hit'] = get_current_timestamp() + window['free_hits'][_0xdbf0x9a]['time'] - window['player']['static_resources']['boost_speed_recovery_free_weapon_' + _0xdbf0x9a];
      window['player']['static_resources']['tokens'] -= _0xdbf0x15;
      if (window['player']['settings']['resource'] == 0) {
        change_resource('tokens', 0)
      } else {
        change_resource('encryptions', 0)
      };
      window['player']['static_resources']['used_free_hit_' + _0xdbf0x9a]++;
      if (window['player']['raid']['boss'] == 17) {
        server_action('talents.refresh', {
          "weapon": _0xdbf0x9a
        })
      } else {
        server_action('weapons.refresh', {
          "weapon": _0xdbf0x9a
        })
      };
      var _0xdbf0xea = window['free_hits'][_0xdbf0x9a]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x9a];
      window['player']['raid']['health'] -= _0xdbf0xea;
      if (window['player']['raid']['health'] < 0) {
        window['player']['raid']['health'] = 0
      };
      var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_foe_line_health')[0];
      if (window['player']['raid']['boss'] == 17) {
        var _0xdbf0x4a = window['bosses'][window['player']['raid']['boss']]['health'][window['player']['static_resources']['boss_17_level']]
      } else {
        var _0xdbf0x4a = window['bosses'][window['player']['raid']['boss']]['health']
      };
      _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_count')[0]['innerHTML'] = window['player']['raid']['health']['toLocaleString']() + ' / ' + _0xdbf0x4a['toLocaleString']();
      var _0xdbf0x4b = _0xdbf0x4a / 100;
      var _0xdbf0x4c = Math['round'](window['player']['raid']['health'] / _0xdbf0x4b);
      _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_current')[0]['style']['width'] = _0xdbf0x4c + '%';
      var _0xdbf0x24f = 0;
      if (window['player']['raid']['top']) {
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['raid']['top']['length']; _0xdbf0x4++) {
          if (window['player']['raid']['top'][_0xdbf0x4][0] == window['game_login']) {
            window['player']['raid']['top'][_0xdbf0x4][1] += _0xdbf0xea;
            _0xdbf0x24f = 1
          }
        }
      } else {
        window['player']['raid']['top'] = []
      };
      if (_0xdbf0x24f == 0) {
        window['player']['raid']['top']['push']([window['game_login'], _0xdbf0xea])
      };
      update_boss_top();
      if (window['player']['raid']['health'] <= 0) {
        update_top_damage_final();
        raid_win()
      };
      window['player']['static_resources']['damage_in_top'] += _0xdbf0xea;
      window['player']['achievements']['total_damage'] += _0xdbf0xea;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
        if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'damage') {
          var _0xdbf0xea = window['free_hits'][_0xdbf0x9a]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x9a];
          window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0xea;
          if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
            window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
            window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
          }
        }
      };
      hide_buy_refresh_free_hits()
    } else {
      hide_buy_refresh_free_hits();
      show_free_hit_unavailable()
    }
  } else {
    hide_buy_refresh_free_hits();
    show_modal_no_tokens()
  }
}

function show_free_hit_unavailable() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('free_hit_unavailable')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('free_hit_unavailable_button')[0]['onclick'] = hide_free_hit_unavailable
}

function hide_free_hit_unavailable() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('free_hit_unavailable')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function refreshed_free_hits(_0xdbf0x12) {
  window['player']['raid']['top'] = _0xdbf0x12['player']['raid']['top'];
  window['player']['raid']['health'] = _0xdbf0x12['player']['raid']['health'];
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  update_weapons();
  update_boss_top();
  hide_buy_refresh_free_hits()
}

function hide_buy_refresh_free_hits() {
  play_effect('click.mp3');
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_5')[0];
  _0xdbf0x35['style']['display'] = 'none';
  _0xdbf0x35['getElementsByClassName']('modal_apply_free_weapon')[0]['style']['display'] = 'none'
}

function hited_weapons() {
  var _0xdbf0x15 = 1;
  if (window['count_weapons'] == 1) {
    _0xdbf0x15 = 10
  } else {
    if (window['count_weapons'] == 2) {
      _0xdbf0x15 = 100
    } else {
      if (window['count_weapons'] == 3) {
        _0xdbf0x15 = 1000
      }
    }
  };
  var _0xdbf0x55 = document['getElementsByClassName']('boss_fight_weapons_list')[0]['getElementsByClassName']('boss_fight_weapons_item');
  var _0xdbf0x76 = window['player']['time_resources']['free_hit'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  if (_0xdbf0x87 > 0) {
    var _0xdbf0x2c = _0xdbf0x87 + ':'
  } else {
    var _0xdbf0x2c = ''
  };
  var _0xdbf0x88 = _0xdbf0x6 % 60;
  var _0xdbf0x22 = (_0xdbf0x6 - _0xdbf0x88) / 60;
  if (_0xdbf0x22 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x22 + ':'
  } else {
    _0xdbf0x2c += _0xdbf0x22 + ':'
  };
  if (_0xdbf0x88 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x88
  } else {
    _0xdbf0x2c += _0xdbf0x88
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    if (get_current_timestamp() > window['player']['time_resources']['free_hit']) {
      _0xdbf0x55[_0xdbf0x4]['onclick'] = free_hit;
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item active';
      var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltip', window['free_hits'][_0xdbf0x4]['name'] + '\x0AУрон: ' + _0xdbf0xea['toLocaleString']());
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = 'Готово'
    } else {
      _0xdbf0x55[_0xdbf0x4]['style']['cursor'] = 'pointer';
      _0xdbf0x55[_0xdbf0x4]['onclick'] = show_buy_refresh_free_hits;
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item';
      var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltip', window['free_hits'][_0xdbf0x4]['name'] + '\x0AУрон: ' + _0xdbf0xea['toLocaleString']());
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = _0xdbf0x2c
    }
  };
  for (var _0xdbf0x4 = 3, _0xdbf0x38 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = window['player']['static_resources']['weapon_' + _0xdbf0x38];
    if (window['player']['static_resources']['weapon_' + _0xdbf0x38] < _0xdbf0x15) {
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item';
      _0xdbf0x55[_0xdbf0x4]['onclick'] = ''
    }
  }
}

function update_weapons() {
  var _0xdbf0x15 = 1;
  if (window['count_weapons'] == 1) {
    _0xdbf0x15 = 10
  } else {
    if (window['count_weapons'] == 2) {
      _0xdbf0x15 = 100
    } else {
      if (window['count_weapons'] == 3) {
        _0xdbf0x15 = 1000
      }
    }
  };
  var _0xdbf0x55 = document['getElementsByClassName']('boss_fight_weapons_list')[0]['getElementsByClassName']('boss_fight_weapons_item');
  var _0xdbf0x76 = window['player']['time_resources']['free_hit'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  if (_0xdbf0x87 > 0) {
    var _0xdbf0x2c = _0xdbf0x87 + ':'
  } else {
    var _0xdbf0x2c = ''
  };
  var _0xdbf0x88 = _0xdbf0x6 % 60;
  var _0xdbf0x22 = (_0xdbf0x6 - _0xdbf0x88) / 60;
  if (_0xdbf0x22 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x22 + ':'
  } else {
    _0xdbf0x2c += _0xdbf0x22 + ':'
  };
  if (_0xdbf0x88 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x88
  } else {
    _0xdbf0x2c += _0xdbf0x88
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    if (get_current_timestamp() > window['player']['time_resources']['free_hit']) {
      _0xdbf0x55[_0xdbf0x4]['onclick'] = free_hit;
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item active';
      var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltip', window['free_hits'][_0xdbf0x4]['name'] + '\x0AУрон: ' + _0xdbf0xea['toLocaleString']());
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = 'Готово'
    } else {
      _0xdbf0x55[_0xdbf0x4]['style']['cursor'] = 'pointer';
      _0xdbf0x55[_0xdbf0x4]['onclick'] = show_buy_refresh_free_hits;
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item';
      var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltip', window['free_hits'][_0xdbf0x4]['name'] + '\x0AУрон: ' + _0xdbf0xea['toLocaleString']());
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = _0xdbf0x2c
    }
  };
  for (var _0xdbf0x4 = 3, _0xdbf0x38 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = window['player']['static_resources']['weapon_' + _0xdbf0x38];
    if (window['player']['static_resources']['weapon_' + _0xdbf0x38] < _0xdbf0x15) {
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item';
      _0xdbf0x55[_0xdbf0x4]['onclick'] = ''
    }
  };
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_foe_line_health')[0];
  if (window['player']['static_resources']['tutorial'] == 9) {
    _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_count')[0]['innerHTML'] = '0 / ' + window['bosses'][window['player']['raid']['boss']]['health']['toLocaleString']();
    _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_current')[0]['style']['width'] = '0%'
  } else {
    if (window['player']['raid']['boss'] == 17) {
      if (window['player']['raid']['paid_mode'] == 0) {
        var _0xdbf0x340 = window['bosses'][17]['health'][window['player']['static_resources']['boss_17_level']]
      } else {
        if (window['player']['raid']['paid_mode'] == 1) {
          var _0xdbf0x340 = 3 * window['bosses'][17]['health'][window['player']['static_resources']['boss_17_level']]
        }
      }
    } else {
      var _0xdbf0x340 = window['bosses'][window['player']['raid']['boss']]['health']
    };
    _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_count')[0]['innerHTML'] = window['player']['raid']['health']['toLocaleString']() + ' / ' + _0xdbf0x340['toLocaleString']();
    var _0xdbf0x4b = _0xdbf0x340 / 100;
    var _0xdbf0x4c = Math['round'](window['player']['raid']['health'] / _0xdbf0x4b);
    _0xdbf0x36['getElementsByClassName']('boss_fight_foe_line_health_current')[0]['style']['width'] = _0xdbf0x4c + '%'
  };
  if (window['player']['raid']['health'] !== undefined && window['player']['raid']['health'] == 0 && window['player']['raid']['finish_time'] !== undefined) {
    update_top_damage_final();
    raid_win()
  };
  update_boss_top();
  if (window['player']['static_resources']['tutorial'] == 9) {
    update_top_damage_final();
    raid_win()
  };
  var _0xdbf0x75 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_damage']['length']; _0xdbf0x4++) {
    if (window['top_damage'][_0xdbf0x4][0] == window['game_login']) {
      window['top_damage'][_0xdbf0x4][1] = window['player']['static_resources']['damage_in_top'];
      _0xdbf0x75 = 1
    }
  };
  if (_0xdbf0x75 == 1) {
    window['top_damage']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
      if (_0xdbf0x8c[1] < _0xdbf0x8d[1]) {
        return 1
      } else {
        if (_0xdbf0x8c[1] > _0xdbf0x8d[1]) {
          return -1
        } else {
          return 0
        }
      }
    })
  }
}

function check_in_friends_raid() {
  if (window['player']['raid']) {
    if (window['player']['raid']['top']) {
      var _0xdbf0x79 = [];
      var _0xdbf0x7a = [];
      var _0xdbf0x7b = [];
      var _0xdbf0x7c = [];
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['player']['raid']['top']['length']; _0xdbf0x38++) {
          if (window['player']['raid']['top'][_0xdbf0x38][0] == window['friends'][_0xdbf0x4]['id'] && !window['friends'][_0xdbf0x4]['profile']) {
            _0xdbf0x79['push'](window['player']['raid']['top'][_0xdbf0x38][0])
          }
        };
        _0xdbf0x7c['push'](window['friends'][_0xdbf0x4]['id'])
      };
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['raid']['top']['length']; _0xdbf0x4++) {
        if (!in_array(window['player']['raid']['top'][_0xdbf0x4][0], _0xdbf0x7c)) {
          _0xdbf0x7b['push'](window['player']['raid']['top'][_0xdbf0x4][0])
        }
      };
      if (_0xdbf0x7b['length'] > 0) {
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x7b['length']; _0xdbf0x4++) {
          var _0xdbf0x42 = {
            id: _0xdbf0x7b[_0xdbf0x4],
            sign: null,
            static_resources: {
              level: 1
            }
          };
          window['other_friends']['push'](_0xdbf0x42);
          _0xdbf0x7a['push'](_0xdbf0x7b[_0xdbf0x4])
        }
      };
      if (_0xdbf0x79['length'] > 0) {
        VK['api']('users.get', {
          user_ids: _0xdbf0x79['join'](','),
          fields: 'photo_50,sex'
        }, friends_vk_load_window)
      };
      if (_0xdbf0x7a['length'] > 0) {
        VK['api']('users.get', {
          user_ids: _0xdbf0x7a['join'](','),
          fields: 'photo_50,sex'
        }, friends_vk_load_otwindow)
      }
    }
  }
}

function raid_top_friends_click() {
  hide_boss_fight(0);
  var _0xdbf0x9a = parseInt(this['dataset']['fid']);
  if (_0xdbf0x9a != window['game_login']) {
    show_friend_help(_0xdbf0x9a)
  } else {
    show_my_profile()
  }
}

function update_boss_top() {
  if (window['player']['raid']['top'] !== undefined) {
    var _0xdbf0x55 = document['getElementsByClassName']('boss_fight_stats_scroll')[0];
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    };
    if (window['player']['raid']['top']['length'] > 0) {
      var _0xdbf0x344 = 0;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['player']['raid']['top']['length']; _0xdbf0x38++) {
          if (window['player']['raid']['top'][_0xdbf0x38][0] == window['friends'][_0xdbf0x4]['id']) {
            if (window['friends'][_0xdbf0x4]['profile']) {
              _0xdbf0x344++
            }
          }
        }
      };
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['player']['raid']['top']['length']; _0xdbf0x38++) {
          if (window['player']['raid']['top'][_0xdbf0x38][0] == window['other_friends'][_0xdbf0x4]['id']) {
            if (window['other_friends'][_0xdbf0x4]['profile']) {
              _0xdbf0x344++
            }
          }
        }
      };
      var _0xdbf0xd7 = 1;
      if (_0xdbf0x344 < window['player']['raid']['top']['length']) {
        check_in_friends_raid();
        _0xdbf0xd7 = 0
      };
      if (_0xdbf0xd7 == 1) {
        var _0xdbf0x345 = 0;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['raid']['top']['length']; _0xdbf0x4++) {
          var _0xdbf0x346 = 0;
          var _0xdbf0x10a = [];
          for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['friends']['length']; _0xdbf0x38++) {
            if (window['player']['raid']['top'][_0xdbf0x4][0] == window['friends'][_0xdbf0x38]['id'] && window['friends'][_0xdbf0x38]['profile']) {
              _0xdbf0x10a = window['friends'][_0xdbf0x38]['profile'];
              _0xdbf0x346 = 1
            }
          };
          for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['other_friends']['length']; _0xdbf0x38++) {
            if (window['player']['raid']['top'][_0xdbf0x4][0] == window['other_friends'][_0xdbf0x38]['id'] && window['other_friends'][_0xdbf0x38]['profile']) {
              _0xdbf0x10a = window['other_friends'][_0xdbf0x38]['profile'];
              _0xdbf0x346 = 1
            }
          };
          if (_0xdbf0x346 == 1) {
            if (window['player']['raid']['top'][_0xdbf0x4][0] == window['game_login']) {
              var _0xdbf0x347 = window['player']['raid']['top'][_0xdbf0x4][1]
            };
            var _0xdbf0x8e = document['createElement']('div');
            _0xdbf0x8e['className'] = 'boss_fight_stats_line d-flex';
            var _0xdbf0x348 = document['createElement']('div');
            _0xdbf0x348['className'] = 'boss_fight_stats_image';
            var _0xdbf0x349 = document['createElement']('img');
            _0xdbf0x349['src'] = _0xdbf0x10a['photo_50'];
            _0xdbf0x348['appendChild'](_0xdbf0x349);
            _0xdbf0x348['dataset']['fid'] = window['player']['raid']['top'][_0xdbf0x4][0];
            _0xdbf0x348['onclick'] = raid_top_friends_click;
            _0xdbf0x8e['appendChild'](_0xdbf0x348);
            var _0xdbf0x34a = document['createElement']('div');
            _0xdbf0x34a['className'] = 'boss_fight_stats_name';
            var _0xdbf0x137 = document['createElement']('span');
            _0xdbf0x137['innerHTML'] = _0xdbf0x10a['first_name'] + ' ' + _0xdbf0x10a['last_name'];
            _0xdbf0x137['dataset']['fid'] = window['player']['raid']['top'][_0xdbf0x4][0];
            _0xdbf0x137['onclick'] = raid_top_friends_click;
            _0xdbf0x34a['appendChild'](_0xdbf0x137);
            _0xdbf0x8e['appendChild'](_0xdbf0x34a);
            var _0xdbf0x34b = document['createElement']('div');
            _0xdbf0x34b['className'] = 'boss_fight_stats_damage';
            var _0xdbf0xea = document['createTextNode'](window['player']['raid']['top'][_0xdbf0x4][1]['toLocaleString']());
            _0xdbf0x34b['appendChild'](_0xdbf0xea);
            _0xdbf0x8e['appendChild'](_0xdbf0x34b);
            _0xdbf0x55['appendChild'](_0xdbf0x8e)
          } else {
            _0xdbf0x345 = 1
          }
        };
        if (window['player']['raid']['top']['length'] > 4) {
          document['getElementsByClassName']('boss_fight_stats_scroll')[0]['style']['overflowY'] = 'auto'
        } else {
          document['getElementsByClassName']('boss_fight_stats_scroll')[0]['style']['overflowY'] = 'hidden'
        };
        if (_0xdbf0x345 == 1) {
          _0xdbf0x55['style']['overflowY'] = 'hidden';
          var _0xdbf0x137 = document['createElement']('span');
          var _0xdbf0x34c = document['createTextNode']('Загрузка...');
          _0xdbf0x137['appendChild'](_0xdbf0x34c);
          _0xdbf0x55['appendChild'](_0xdbf0x137);
          setTimeout(update_boss_top, 100)
        } else {
          if (window['player']['static_resources']['tutorial'] == 9) {
            var _0xdbf0x8e = document['createElement']('div');
            _0xdbf0x8e['className'] = 'boss_fight_stats_line d-flex';
            var _0xdbf0x348 = document['createElement']('div');
            _0xdbf0x348['className'] = 'boss_fight_stats_image';
            var _0xdbf0x349 = document['createElement']('img');
            _0xdbf0x349['src'] = 'https://cdn.bravegames.space/regiment/images/icons/epihin.jpg';
            _0xdbf0x348['appendChild'](_0xdbf0x349);
            _0xdbf0x8e['appendChild'](_0xdbf0x348);
            var _0xdbf0x34a = document['createElement']('div');
            _0xdbf0x34a['className'] = 'boss_fight_stats_name';
            var _0xdbf0x137 = document['createElement']('span');
            _0xdbf0x137['innerHTML'] = 'Поддержка из штаба';
            _0xdbf0x34a['appendChild'](_0xdbf0x137);
            _0xdbf0x8e['appendChild'](_0xdbf0x34a);
            var _0xdbf0x34b = document['createElement']('div');
            _0xdbf0x34b['className'] = 'boss_fight_stats_damage';
            var _0xdbf0xea = document['createTextNode'](window['bosses'][0]['health']['toLocaleString']());
            _0xdbf0x34b['appendChild'](_0xdbf0xea);
            _0xdbf0x8e['appendChild'](_0xdbf0x34b);
            _0xdbf0x55['appendChild'](_0xdbf0x8e)
          };
          show_boss_tech()
        }
      } else {
        _0xdbf0x55['style']['overflowY'] = 'hidden';
        var _0xdbf0x137 = document['createElement']('span');
        var _0xdbf0x34c = document['createTextNode']('Загрузка...');
        _0xdbf0x137['appendChild'](_0xdbf0x34c);
        _0xdbf0x55['appendChild'](_0xdbf0x137);
        setTimeout(update_boss_top, 100)
      }
    } else {
      _0xdbf0x55['style']['overflowY'] = 'hidden';
      var _0xdbf0x137 = document['createElement']('span');
      _0xdbf0x137['className'] = 'empty_top';
      var _0xdbf0x34c = document['createTextNode']('Здесь пока тихо...');
      _0xdbf0x137['appendChild'](_0xdbf0x34c);
      _0xdbf0x55['appendChild'](_0xdbf0x137)
    }
  } else {
    var _0xdbf0x55 = document['getElementsByClassName']('boss_fight_stats_scroll')[0];
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    };
    _0xdbf0x55['style']['overflowY'] = 'hidden';
    var _0xdbf0x137 = document['createElement']('span');
    _0xdbf0x137['className'] = 'empty_top';
    var _0xdbf0x34c = document['createTextNode']('Здесь пока тихо...');
    _0xdbf0x137['appendChild'](_0xdbf0x34c);
    _0xdbf0x55['appendChild'](_0xdbf0x137)
  }
}

function update_boss_timer() {
  var _0xdbf0x76 = window['player']['raid']['finish_time'] - get_current_timestamp();
  if (_0xdbf0x76 < 0) {
    _0xdbf0x76 = 0
  };
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  var _0xdbf0x88 = _0xdbf0x6 % 60;
  if (_0xdbf0x88 < 10) {
    _0xdbf0x88 = '0' + _0xdbf0x88
  };
  var _0xdbf0x89 = (_0xdbf0x6 - _0xdbf0x88) / 60;
  if (_0xdbf0x89 < 10) {
    _0xdbf0x89 = '0' + _0xdbf0x89
  };
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_time')[0]['getElementsByTagName']('span')[0];
  _0xdbf0x36['innerHTML'] = _0xdbf0x87 + ':' + _0xdbf0x89 + ':' + _0xdbf0x88;
  var _0xdbf0x34e = 28800;
  var _0xdbf0x4b = _0xdbf0x34e / 100;
  var _0xdbf0x4c = Math['round'](_0xdbf0x76 / _0xdbf0x4b);
  if (_0xdbf0x4c > 100) {
    _0xdbf0x4c = 100
  };
  var _0xdbf0x36 = document['getElementsByClassName']('boss_fight_my_line_health')[0];
  _0xdbf0x36['getElementsByClassName']('boss_fight_my_line_health_current')[0]['style']['width'] = _0xdbf0x4c + '%';
  _0xdbf0x36['getElementsByClassName']('boss_fight_my_line_health_count')[0]['innerHTML'] = _0xdbf0x4c + ' / 100';
  if (_0xdbf0x76 == 0 && window['player']['raid']['health'] > 0) {
    clearTimeout(window['ubt']);
    update_top_damage_final();
    raid_lose()
  };
  var _0xdbf0x55 = document['getElementsByClassName']('boss_fight_weapons_list')[0]['getElementsByClassName']('boss_fight_weapons_item');
  var _0xdbf0x76 = window['player']['time_resources']['free_hit'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  if (_0xdbf0x87 > 0) {
    var _0xdbf0x2c = _0xdbf0x87 + ':'
  } else {
    var _0xdbf0x2c = ''
  };
  var _0xdbf0x88 = _0xdbf0x6 % 60;
  var _0xdbf0x22 = (_0xdbf0x6 - _0xdbf0x88) / 60;
  if (_0xdbf0x22 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x22 + ':'
  } else {
    _0xdbf0x2c += _0xdbf0x22 + ':'
  };
  if (_0xdbf0x88 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x88
  } else {
    _0xdbf0x2c += _0xdbf0x88
  };
  var _0xdbf0x76 = window['player']['time_resources']['free_hit'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  if (_0xdbf0x87 > 0) {
    var _0xdbf0x2c = _0xdbf0x87 + ':'
  } else {
    var _0xdbf0x2c = ''
  };
  var _0xdbf0x88 = _0xdbf0x6 % 60;
  var _0xdbf0x22 = (_0xdbf0x6 - _0xdbf0x88) / 60;
  if (_0xdbf0x22 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x22 + ':'
  } else {
    _0xdbf0x2c += _0xdbf0x22 + ':'
  };
  if (_0xdbf0x88 < 10) {
    _0xdbf0x2c += '0' + _0xdbf0x88
  } else {
    _0xdbf0x2c += _0xdbf0x88
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    if (get_current_timestamp() > window['player']['time_resources']['free_hit']) {
      _0xdbf0x55[_0xdbf0x4]['onclick'] = free_hit;
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item active';
      var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltip', window['free_hits'][_0xdbf0x4]['name'] + '\x0AУрон: ' + _0xdbf0xea['toLocaleString']());
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = 'Готово'
    } else {
      _0xdbf0x55[_0xdbf0x4]['style']['cursor'] = 'pointer';
      _0xdbf0x55[_0xdbf0x4]['onclick'] = show_buy_refresh_free_hits;
      _0xdbf0x55[_0xdbf0x4]['className'] = 'boss_fight_weapons_item';
      var _0xdbf0xea = window['free_hits'][_0xdbf0x4]['damage'] + window['player']['static_resources']['boost_free_hit_' + _0xdbf0x4];
      _0xdbf0x55[_0xdbf0x4]['setAttribute']('tooltip', window['free_hits'][_0xdbf0x4]['name'] + '\x0AУрон: ' + _0xdbf0xea['toLocaleString']());
      _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('boss_fight_weapons_count')[0]['innerHTML'] = _0xdbf0x2c
    }
  }
}

function hide_boss_fight(_0xdbf0x350) {
  if (_0xdbf0x350 == 0) {
    play_music('background.mp3')
  } else {
    if (_0xdbf0x350 == 1) {
      play_music('raids_background.mp3')
    }
  };
  clearTimeout(window['ubt']);
  update_calendar_current_day();
  document['getElementsByClassName']('boss_fight')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer_boss_fight')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('friends_block')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('front_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('mission_footer_block')[0]['style']['display'] = 'none';
  var _0xdbf0x351 = get_season();
  document['getElementsByClassName']('main')[0]['className'] = 'main ' + _0xdbf0x351 + '_homeland'
}

function mouseover_debuff_boss() {
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  var _0xdbf0x9a = parseInt(_0xdbf0x36['dataset']['bid']);
  var _0xdbf0xe6 = Math['min'](window['player']['static_resources']['sut'] - window['bosses'][_0xdbf0x9a]['dbf']['min_sut'], window['bosses'][_0xdbf0x9a]['dbf']['max_sut'] - window['bosses'][_0xdbf0x9a]['dbf']['min_sut']);
  var _0xdbf0xe7 = Math['round']((window['bosses'][_0xdbf0x9a]['health'] - window['bosses'][_0xdbf0x9a]['dbf']['start'] - window['bosses'][_0xdbf0x9a]['dbf']['remains']) / (window['bosses'][_0xdbf0x9a]['dbf']['max_sut'] - window['bosses'][_0xdbf0x9a]['dbf']['min_sut']));
  var _0xdbf0xe8 = window['bosses'][_0xdbf0x9a]['dbf']['start'] + _0xdbf0xe6 * _0xdbf0xe7;
  var _0xdbf0xe9 = window['bosses'][_0xdbf0x9a]['health'] - _0xdbf0xe8;
  _0xdbf0x36['getElementsByClassName']('boss_heath_info')[0]['innerHTML'] = _0xdbf0xe9['toLocaleString']() + ' / ' + window['bosses'][_0xdbf0x9a]['health']['toLocaleString']();
  var _0xdbf0x4b = window['bosses'][_0xdbf0x9a]['health'] / 100;
  _0xdbf0x36['getElementsByClassName']('boss_heath_meter_current')[0]['style']['width'] = (_0xdbf0xe9 / _0xdbf0x4b) + '%'
}

function mouseout_debuff_boss() {
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  var _0xdbf0x9a = parseInt(_0xdbf0x36['dataset']['bid']);
  _0xdbf0x36['getElementsByClassName']('boss_heath_info')[0]['innerHTML'] = window['bosses'][_0xdbf0x9a]['health']['toLocaleString']() + ' / ' + window['bosses'][_0xdbf0x9a]['health']['toLocaleString']();
  _0xdbf0x36['getElementsByClassName']('boss_heath_meter_current')[0]['style']['width'] = '100%'
}

function enable_debuff_boss() {
  var _0xdbf0x36 = document['getElementsByClassName']('boss_info')[0];
  var _0xdbf0x9a = parseInt(_0xdbf0x36['dataset']['bid']);
  if (window['player']['static_resources']['coins'] >= window['bosses'][_0xdbf0x9a]['dbf']['price']) {
    _0xdbf0x36['dataset']['debuff'] = 1;
    var _0xdbf0xe6 = Math['min'](window['player']['static_resources']['sut'] - window['bosses'][_0xdbf0x9a]['dbf']['min_sut'], window['bosses'][_0xdbf0x9a]['dbf']['max_sut'] - window['bosses'][_0xdbf0x9a]['dbf']['min_sut']);
    var _0xdbf0xe7 = Math['round']((window['bosses'][_0xdbf0x9a]['health'] - window['bosses'][_0xdbf0x9a]['dbf']['start'] - window['bosses'][_0xdbf0x9a]['dbf']['remains']) / (window['bosses'][_0xdbf0x9a]['dbf']['max_sut'] - window['bosses'][_0xdbf0x9a]['dbf']['min_sut']));
    var _0xdbf0xe8 = window['bosses'][_0xdbf0x9a]['dbf']['start'] + _0xdbf0xe6 * _0xdbf0xe7;
    var _0xdbf0xe9 = window['bosses'][_0xdbf0x9a]['health'] - _0xdbf0xe8;
    _0xdbf0x36['getElementsByClassName']('boss_heath_info')[0]['innerHTML'] = _0xdbf0xe9['toLocaleString']() + ' / ' + window['bosses'][_0xdbf0x9a]['health']['toLocaleString']();
    var _0xdbf0x4b = window['bosses'][_0xdbf0x9a]['health'] / 100;
    _0xdbf0x36['getElementsByClassName']('boss_heath_meter_current')[0]['style']['width'] = (_0xdbf0xe9 / _0xdbf0x4b) + '%';
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boss_weakening_button')[0];
    _0xdbf0x9f['onclick'] = '';
    _0xdbf0x9f['onmouseover'] = '';
    _0xdbf0x9f['onmouseout'] = '';
    _0xdbf0x9f['style']['filter'] = 'grayscale(1)';
    _0xdbf0x9f['style']['cursor'] = 'default'
  } else {
    show_modal_no_coins()
  }
}

function show_modal_no_coins() {
  var _0xdbf0x34 = ['supply', 'weapons'];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x34['length']; _0xdbf0x4++) {
    hide_modal(_0xdbf0x34[_0xdbf0x4] + '_block')
  };
  hide_modal2(0);
  window['view_modal'] = 1;
  document['getElementsByClassName']('boss_info')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_coins')[0];
  document['getElementById']('btn_buy_coins')['onclick'] = function() {
    hide_modal_no_coins();
    show_homeland();
    show_shop(1);
    shop_menu('coins', 1)
  };
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x35['getElementsByClassName']('modal_close')[0]['onclick'] = hide_modal_no_coins
}

function hide_modal_no_coins() {
  play_effect('click.mp3');
  window['view_modal'] = 0;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_coins')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function hide_boss_info(_0xdbf0x10f) {
  if (_0xdbf0x10f != 1) {
    play_effect('click.mp3')
  };
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  document['getElementById']('modal')['style']['display'] = 'none';
  document['getElementsByClassName']('boss_info')[0]['style']['display'] = 'none';
  document['getElementById']('modal_close')['onclick'] = '';
  window['view_modal'] = 0
}

function show_homeland() {
  clearTimeout(window['utdt']);
  clearTimeout(window['ubt']);
  window['loc_page'] = '';
  if (window['player']['static_resources']['tutorial'] == 5) {
    show_tutorial(5);
    server_action('tutorial.step', {
      "step": 0
    })
  };
  if (window['player']['static_resources']['tutorial'] == 10) {
    tutorial_arrow_stop();
    var _0xdbf0x9f = document['getElementById']('main_raids');
    _0xdbf0x9f['style']['pointerEvents'] = '';
    _0xdbf0x9f['style']['opacity'] = '';
    window['player']['static_resources']['tutorial']++;
    show_tutorial(11);
    server_action('tutorial.step', {
      "step": 1
    })
  };
  if (window['player']['static_resources']['tutorial'] == 16) {
    tutorial_arrow_stop();
    document['getElementById']('boxes')['style']['pointerEvents'] = '';
    window['player']['static_resources']['tutorial']++;
    show_tutorial(17);
    server_action('tutorial.step', {
      "step": 2
    })
  };
  if (window['player']['static_resources']['tutorial'] == 21) {
    tutorial_arrow_stop();
    var _0xdbf0x9f = document['getElementById']('main_hangar');
    _0xdbf0x9f['style']['pointerEvents'] = '';
    _0xdbf0x9f['style']['opacity'] = '';
    window['player']['static_resources']['tutorial']++;
    show_tutorial(22);
    server_action('tutorial.step', {
      "step": 3
    })
  };
  document['getElementsByClassName']('game_block')[0]['style']['zIndex'] = '2';
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('missions_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('front_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('bosses_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('boxes_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('shop_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('package_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('talents')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('subscription_block')[0]['style']['display'] = 'none';
  document['getElementById']('sector_map')['style']['display'] = 'none';
  document['getElementsByClassName']('hangar_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('leveling_decks_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('friends_block')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('footer_hangar')[0]['style']['display'] = 'none';
  var _0xdbf0x351 = get_season();
  document['getElementsByClassName']('main')[0]['className'] = 'main ' + _0xdbf0x351 + '_homeland';
  var _0xdbf0x2d6 = document['getElementById']('arrow_prev');
  var _0xdbf0x2d7 = document['getElementById']('arrow_next');
  if (window['friends_mode'] == 0) {
    _0xdbf0x2d6['onclick'] = my_friends_prev;
    _0xdbf0x2d7['onclick'] = my_friends_next;
    if ((window['friends']['length'] - 1) > window['last_friend']) {
      document['getElementById']('arrow_next')['style']['right'] = '-22px'
    } else {
      document['getElementById']('arrow_next')['style']['right'] = '-9999px'
    };
    if (window['last_friend'] > 9) {
      _0xdbf0x2d6['style']['left'] = '-22px'
    } else {
      _0xdbf0x2d6['style']['left'] = '-9999px'
    }
  } else {
    if (window['friends_mode'] == 1) {
      _0xdbf0x2d6['onclick'] = top_level_prev;
      _0xdbf0x2d7['onclick'] = top_level_next;
      if ((window['top_level']['length'] - 1) > window['last_friend2']) {
        document['getElementById']('arrow_next')['style']['right'] = '-22px'
      } else {
        document['getElementById']('arrow_next')['style']['right'] = '-9999px'
      };
      if (window['last_friend2'] > 9) {
        _0xdbf0x2d6['style']['left'] = '-22px'
      } else {
        _0xdbf0x2d6['style']['left'] = '-9999px'
      }
    } else {
      if (window['friends_mode'] == 2) {
        _0xdbf0x2d6['onclick'] = top_sut_prev;
        _0xdbf0x2d7['onclick'] = top_sut_next;
        if ((window['top_sut']['length'] - 1) > window['last_friend3']) {
          document['getElementById']('arrow_next')['style']['right'] = '-22px'
        } else {
          document['getElementById']('arrow_next')['style']['right'] = '-9999px'
        };
        if (window['last_friend3'] > 9) {
          _0xdbf0x2d6['style']['left'] = '-22px'
        } else {
          _0xdbf0x2d6['style']['left'] = '-9999px'
        }
      }
    }
  };
  update_calendar_current_day()
}

function get_season() {
  if ((window['system']['moth'] >= 0 && window['system']['moth'] <= 1) || window['system']['moth'] == 11) {
    var _0xdbf0x351 = 'winter'
  } else {
    if (window['system']['moth'] >= 2 && window['system']['moth'] <= 4) {
      var _0xdbf0x351 = 'spring'
    } else {
      if (window['system']['moth'] >= 5 && window['system']['moth'] <= 7) {
        var _0xdbf0x351 = 'summer'
      } else {
        if (window['system']['moth'] >= 8 && window['system']['moth'] <= 10) {
          var _0xdbf0x351 = 'autumn'
        }
      }
    }
  };
  return _0xdbf0x351
}

function create_homeland_background() {
  if ((window['system']['moth'] >= 0 && window['system']['moth'] <= 1) || window['system']['moth'] == 11) {
    var _0xdbf0x351 = 'winter';
    var _0xdbf0x35b = 1
  } else {
    if (window['system']['moth'] >= 2 && window['system']['moth'] <= 4) {
      var _0xdbf0x351 = 'spring';
      var _0xdbf0x35b = 2
    } else {
      if (window['system']['moth'] >= 5 && window['system']['moth'] <= 7) {
        var _0xdbf0x351 = 'summer';
        var _0xdbf0x35b = 3
      } else {
        if (window['system']['moth'] >= 8 && window['system']['moth'] <= 10) {
          var _0xdbf0x351 = 'autumn';
          var _0xdbf0x35b = 4
        }
      }
    }
  };
  document['getElementsByClassName']('main')[0]['className'] = 'main ' + _0xdbf0x351 + '_homeland';
  var _0xdbf0x55 = document['getElementsByClassName']('main_menu_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  _0xdbf0x55['className'] = 'main_menu_list ' + _0xdbf0x351 + '_list';
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'sector_menu_1';
  if (_0xdbf0x35b == 4) {
    _0xdbf0x8e['id'] = 'main_shop'
  } else {
    _0xdbf0x8e['id'] = 'main_missions'
  };
  var _0xdbf0xc8 = document['createElement']('img');
  _0xdbf0xc8['src'] = 'https://cdn.bravegames.space/regiment/images/homeland/main_' + _0xdbf0x35b + '_sector_menu_1.png';
  _0xdbf0x8e['appendChild'](_0xdbf0xc8);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'sector_menu_2';
  _0xdbf0x8e['id'] = 'main_hangar';
  var _0xdbf0xc8 = document['createElement']('img');
  _0xdbf0xc8['src'] = 'https://cdn.bravegames.space/regiment/images/homeland/main_' + _0xdbf0x35b + '_sector_menu_2.png';
  _0xdbf0x8e['appendChild'](_0xdbf0xc8);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'sector_menu_3';
  _0xdbf0x8e['id'] = 'main_raids';
  var _0xdbf0xc8 = document['createElement']('img');
  _0xdbf0xc8['src'] = 'https://cdn.bravegames.space/regiment/images/homeland/main_' + _0xdbf0x35b + '_sector_menu_3.png';
  _0xdbf0x8e['appendChild'](_0xdbf0xc8);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'sector_menu_4';
  if (_0xdbf0x35b == 4) {
    _0xdbf0x8e['id'] = 'main_missions'
  } else {
    _0xdbf0x8e['id'] = 'main_shop'
  };
  var _0xdbf0xc8 = document['createElement']('img');
  _0xdbf0xc8['src'] = 'https://cdn.bravegames.space/regiment/images/homeland/main_' + _0xdbf0x35b + '_sector_menu_4.png';
  _0xdbf0x8e['appendChild'](_0xdbf0xc8);
  _0xdbf0x55['appendChild'](_0xdbf0x8e)
}

function update_calendar_current_day() {
  var _0xdbf0x28f = document['getElementsByClassName']('main_icons')[0]['getElementsByClassName']('calendar_icon')[0];
  var _0xdbf0xa6 = _0xdbf0x28f['getElementsByClassName']('calendar_icon_amount')[0];
  var _0xdbf0x293 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < 3; _0xdbf0x4++) {
    if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count']) {
      _0xdbf0x293++
    }
  };
  _0xdbf0xa6['innerHTML'] = _0xdbf0x293 + '/3'
}

function show_mission_need() {
  this['getElementsByClassName']('mission_sector_need')[0]['style']['display'] = 'block'
}

function hide_mission_need() {
  this['getElementsByClassName']('mission_sector_need')[0]['style']['display'] = 'none'
}

function select_front() {
  if (this['dataset']['fid'] != window['selected_front']) {
    var _0xdbf0x55 = document['getElementsByClassName']('fronts_list')[0]['getElementsByClassName']('front_item');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      if (_0xdbf0x55[_0xdbf0x4]['dataset']['unav'] != 1) {
        _0xdbf0x55[_0xdbf0x4]['className'] = 'front_item';
        var _0xdbf0x283 = 0;
        if (_0xdbf0x4 > 0) {
          if (window['player']['missions'][_0xdbf0x4 - 1][6]['win_count'] == 0) {
            var _0xdbf0x283 = 1
          }
        };
        if (_0xdbf0x283 == 0) {
          _0xdbf0x55[_0xdbf0x4]['classList']['remove']('closed');
          _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('front_item_lock')[0]['style']['display'] = 'none';
          _0xdbf0x55[_0xdbf0x4]['style']['cursor'] = 'pointer';
          _0xdbf0x55[_0xdbf0x4]['onclick'] = select_front
        } else {
          _0xdbf0x55[_0xdbf0x4]['classList']['add']('closed');
          _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('front_item_lock')[0]['style']['display'] = 'block';
          _0xdbf0x55[_0xdbf0x4]['style']['cursor'] = 'default';
          _0xdbf0x55[_0xdbf0x4]['onclick'] = ''
        }
      }
    };
    this['className'] = 'front_item active';
    window['selected_front'] = this['dataset']['fid'];
    document['getElementById']('front_title')['innerHTML'] = window['fronts'][this['dataset']['fid']]['title'];
    var _0xdbf0x282 = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < 7; _0xdbf0x4++) {
      var _0xdbf0x36 = document['getElementsByClassName']('mission_sector_' + _0xdbf0x4)[0];
      var _0xdbf0xdb = window['missions_requirements'][window['selected_front']][_0xdbf0x4];
      var _0xdbf0xdc = 0;
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0xdb['length']; _0xdbf0x38++) {
        if (_0xdbf0xdb[_0xdbf0x38]['mode'] == 'kill_boss') {
          var _0xdbf0xde = _0xdbf0xdb[_0xdbf0x38]['params'];
          var _0xdbf0xdf = 0;
          for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xde['length']; _0xdbf0xdd++) {
            if (window['player']['bosses'] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xdd]['boss']] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xdd]['boss']]['win_count'] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xdd]['boss']]['win_count'] >= _0xdbf0xde[_0xdbf0xdd]['amount']) {
              _0xdbf0xdf++
            }
          };
          if (_0xdbf0xdf == _0xdbf0xde['length']) {
            _0xdbf0xdb[_0xdbf0x38]['status'] = 1;
            _0xdbf0xdc++
          } else {
            _0xdbf0xdb[_0xdbf0x38]['status'] = 0
          }
        } else {
          if (_0xdbf0xdb[_0xdbf0x38]['mode'] == 'sut') {
            if (window['player']['static_resources']['sut'] >= _0xdbf0xdb[_0xdbf0x38]['params'][0]['amount']) {
              _0xdbf0xdb[_0xdbf0x38]['status'] = 1;
              _0xdbf0xdc++
            } else {
              _0xdbf0xdb[_0xdbf0x38]['status'] = 0
            }
          } else {
            if (_0xdbf0xdb[_0xdbf0x38]['mode'] == 'missions') {
              var _0xdbf0xe1 = _0xdbf0xdb[_0xdbf0x38]['params'];
              var _0xdbf0xe2 = 0;
              for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xe1['length']; _0xdbf0xdd++) {
                if (window['player']['missions'][_0xdbf0xe1[_0xdbf0xdd]['front']][_0xdbf0xe1[_0xdbf0xdd]['mission']]['win_count'] >= _0xdbf0xe1[_0xdbf0xdd]['amount']) {
                  _0xdbf0xe2++
                }
              };
              if (_0xdbf0xe2 == _0xdbf0xe1['length']) {
                _0xdbf0xdb[_0xdbf0x38]['status'] = 1;
                _0xdbf0xdc++
              } else {
                _0xdbf0xdb[_0xdbf0x38]['status'] = 0
              }
            }
          }
        }
      };
      if (_0xdbf0xdc < _0xdbf0xdb['length']) {
        _0xdbf0x36['classList']['add']('closed');
        _0xdbf0x36['style']['cursor'] = 'default';
        _0xdbf0x36['onclick'] = '';
        _0xdbf0x36['removeAttribute']('tooltipmission');
        if (_0xdbf0x282 == 0) {
          _0xdbf0x36['onmouseover'] = show_mission_need;
          _0xdbf0x36['onmouseout'] = hide_mission_need;
          var _0xdbf0x216 = _0xdbf0x36['getElementsByTagName']('ul')[0];
          while (_0xdbf0x216['firstChild']) {
            _0xdbf0x216['removeChild'](_0xdbf0x216['firstChild'])
          };
          for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0xdb['length']; _0xdbf0x38++) {
            var _0xdbf0x2d3 = document['createElement']('li');
            _0xdbf0x2d3['innerHTML'] = _0xdbf0xdb[_0xdbf0x38]['title'];
            if (_0xdbf0xdb[_0xdbf0x38]['status'] == 1) {
              _0xdbf0x2d3['className'] = 'complete'
            };
            _0xdbf0x216['appendChild'](_0xdbf0x2d3)
          };
          _0xdbf0x282++
        } else {
          _0xdbf0x36['onmouseover'] = '';
          _0xdbf0x36['onmouseout'] = ''
        }
      } else {
        _0xdbf0x36['classList']['remove']('closed');
        _0xdbf0x36['style']['cursor'] = 'pointer';
        _0xdbf0x36['onclick'] = select_mission;
        _0xdbf0x36['setAttribute']('tooltipmission', 'Выиграно сражений: ' + window['player']['missions'][window['selected_front']][_0xdbf0x4]['win_count']);
        _0xdbf0x36['onmouseover'] = '';
        _0xdbf0x36['onmouseout'] = ''
      };
      _0xdbf0x36['getElementsByClassName']('mission_sector_name')[0]['innerHTML'] = window['fronts'][this['dataset']['fid']]['missions'][_0xdbf0x4];
      _0xdbf0x36['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/missions/mission_' + window['selected_front'] + '_' + _0xdbf0x4 + '/icon_map.png';
      var _0xdbf0x15 = window['player']['missions'][window['selected_front']][_0xdbf0x4]['win_count'];
      if (_0xdbf0x15 > 10) {
        _0xdbf0x15 = 10
      };
      var _0xdbf0x6 = 0;
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['fronts'][window['selected_front']]['sectors'][_0xdbf0x4]['length']; _0xdbf0x38++) {
        if (window['player']['missions'][window['selected_front']][_0xdbf0x4]['sectors'][_0xdbf0x38] == window['fronts'][window['selected_front']]['sectors'][_0xdbf0x4][_0xdbf0x38]) {
          _0xdbf0x6++
        }
      };
      if (_0xdbf0x6 == 0 && window['player']['missions'][window['selected_front']][_0xdbf0x4]['sectors'][0] > 0) {
        _0xdbf0x6++
      };
      var _0xdbf0x360 = window['fronts'][window['selected_front']]['sectors'][_0xdbf0x4]['length'] / 100;
      if (_0xdbf0x6 > 0) {
        _0xdbf0x36['getElementsByClassName']('mission_progress')[0]['style']['display'] = 'block';
        _0xdbf0x36['getElementsByClassName']('mission_progress_active')[0]['style']['width'] = (_0xdbf0x6 / _0xdbf0x360) + '%';
        _0xdbf0x36['classList']['add']('active')
      } else {
        _0xdbf0x36['getElementsByClassName']('mission_progress')[0]['style']['display'] = 'none';
        _0xdbf0x36['classList']['remove']('active')
      }
    }
  } else {
    var _0xdbf0x55 = document['getElementsByClassName']('fronts_list')[0]['getElementsByClassName']('front_item');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      if (_0xdbf0x55[_0xdbf0x4]['dataset']['unav'] != 1) {
        var _0xdbf0x283 = 0;
        if (_0xdbf0x4 > 0) {
          if (window['player']['missions'][_0xdbf0x4 - 1][6]['win_count'] == 0) {
            var _0xdbf0x283 = 1
          }
        };
        if (_0xdbf0x283 == 0) {
          _0xdbf0x55[_0xdbf0x4]['classList']['remove']('closed');
          _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('front_item_lock')[0]['style']['display'] = 'none';
          _0xdbf0x55[_0xdbf0x4]['style']['cursor'] = 'pointer';
          _0xdbf0x55[_0xdbf0x4]['onclick'] = select_front
        } else {
          _0xdbf0x55[_0xdbf0x4]['classList']['add']('closed');
          _0xdbf0x55[_0xdbf0x4]['getElementsByClassName']('front_item_lock')[0]['style']['display'] = 'block';
          _0xdbf0x55[_0xdbf0x4]['style']['cursor'] = 'default';
          _0xdbf0x55[_0xdbf0x4]['onclick'] = ''
        }
      }
    };
    var _0xdbf0x282 = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < 7; _0xdbf0x4++) {
      var _0xdbf0x36 = document['getElementsByClassName']('mission_sector_' + _0xdbf0x4)[0];
      var _0xdbf0xdb = window['missions_requirements'][window['selected_front']][_0xdbf0x4];
      var _0xdbf0xdc = 0;
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0xdb['length']; _0xdbf0x38++) {
        if (_0xdbf0xdb[_0xdbf0x38]['mode'] == 'kill_boss') {
          var _0xdbf0xde = _0xdbf0xdb[_0xdbf0x38]['params'];
          var _0xdbf0xdf = 0;
          for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xde['length']; _0xdbf0xdd++) {
            if (window['player']['bosses'] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xdd]['boss']] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xdd]['boss']]['win_count'] && window['player']['bosses'][_0xdbf0xde[_0xdbf0xdd]['boss']]['win_count'] >= _0xdbf0xde[_0xdbf0xdd]['amount']) {
              _0xdbf0xdf++
            }
          };
          if (_0xdbf0xdf == _0xdbf0xde['length']) {
            _0xdbf0xdb[_0xdbf0x38]['status'] = 1;
            _0xdbf0xdc++
          } else {
            _0xdbf0xdb[_0xdbf0x38]['status'] = 0
          }
        } else {
          if (_0xdbf0xdb[_0xdbf0x38]['mode'] == 'sut') {
            if (window['player']['static_resources']['sut'] >= _0xdbf0xdb[_0xdbf0x38]['params'][0]['amount']) {
              _0xdbf0xdb[_0xdbf0x38]['status'] = 1;
              _0xdbf0xdc++
            } else {
              _0xdbf0xdb[_0xdbf0x38]['status'] = 0
            }
          } else {
            if (_0xdbf0xdb[_0xdbf0x38]['mode'] == 'missions') {
              var _0xdbf0xe1 = _0xdbf0xdb[_0xdbf0x38]['params'];
              var _0xdbf0xe2 = 0;
              for (var _0xdbf0xdd = 0; _0xdbf0xdd < _0xdbf0xe1['length']; _0xdbf0xdd++) {
                if (window['player']['missions'][_0xdbf0xe1[_0xdbf0xdd]['front']][_0xdbf0xe1[_0xdbf0xdd]['mission']]['win_count'] >= _0xdbf0xe1[_0xdbf0xdd]['amount']) {
                  _0xdbf0xe2++
                }
              };
              if (_0xdbf0xe2 == _0xdbf0xe1['length']) {
                _0xdbf0xdb[_0xdbf0x38]['status'] = 1;
                _0xdbf0xdc++
              } else {
                _0xdbf0xdb[_0xdbf0x38]['status'] = 0
              }
            }
          }
        }
      };
      if (_0xdbf0xdc < _0xdbf0xdb['length']) {
        _0xdbf0x36['classList']['add']('closed');
        _0xdbf0x36['style']['cursor'] = 'default';
        _0xdbf0x36['onclick'] = '';
        if (_0xdbf0x282 == 0) {
          _0xdbf0x36['onmouseover'] = show_mission_need;
          _0xdbf0x36['onmouseout'] = hide_mission_need;
          var _0xdbf0x216 = _0xdbf0x36['getElementsByTagName']('ul')[0];
          while (_0xdbf0x216['firstChild']) {
            _0xdbf0x216['removeChild'](_0xdbf0x216['firstChild'])
          };
          for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0xdb['length']; _0xdbf0x38++) {
            var _0xdbf0x2d3 = document['createElement']('li');
            _0xdbf0x2d3['innerHTML'] = _0xdbf0xdb[_0xdbf0x38]['title'];
            if (_0xdbf0xdb[_0xdbf0x38]['status'] == 1) {
              _0xdbf0x2d3['className'] = 'complete'
            };
            _0xdbf0x216['appendChild'](_0xdbf0x2d3)
          };
          _0xdbf0x282++
        } else {
          _0xdbf0x36['onmouseover'] = '';
          _0xdbf0x36['onmouseout'] = ''
        }
      } else {
        _0xdbf0x36['classList']['remove']('closed');
        _0xdbf0x36['style']['cursor'] = 'pointer';
        _0xdbf0x36['onclick'] = select_mission;
        _0xdbf0x36['setAttribute']('tooltipmission', 'Выиграно сражений: ' + window['player']['missions'][window['selected_front']][_0xdbf0x4]['win_count']);
        _0xdbf0x36['onmouseover'] = '';
        _0xdbf0x36['onmouseout'] = ''
      };
      var _0xdbf0x15 = window['player']['missions'][window['selected_front']][_0xdbf0x4]['win_count'];
      if (_0xdbf0x15 > 10) {
        _0xdbf0x15 = 10
      };
      var _0xdbf0x6 = 0;
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['fronts'][window['selected_front']]['sectors'][_0xdbf0x4]['length']; _0xdbf0x38++) {
        if (window['player']['missions'][window['selected_front']][_0xdbf0x4]['sectors'][_0xdbf0x38] == window['fronts'][window['selected_front']]['sectors'][_0xdbf0x4][_0xdbf0x38]) {
          _0xdbf0x6++
        }
      };
      if (_0xdbf0x6 == 0 && window['player']['missions'][window['selected_front']][_0xdbf0x4]['sectors'][0] > 0) {
        _0xdbf0x6++
      };
      var _0xdbf0x360 = window['fronts'][window['selected_front']]['sectors'][_0xdbf0x4]['length'] / 100;
      if (_0xdbf0x6 > 0) {
        _0xdbf0x36['getElementsByClassName']('mission_progress')[0]['style']['display'] = 'block';
        _0xdbf0x36['getElementsByClassName']('mission_progress_active')[0]['style']['width'] = (_0xdbf0x6 / _0xdbf0x360) + '%';
        _0xdbf0x36['classList']['add']('active')
      } else {
        _0xdbf0x36['getElementsByClassName']('mission_progress')[0]['style']['display'] = 'none';
        _0xdbf0x36['classList']['remove']('active')
      }
    }
  }
}

function animate(_0xdbf0x362) {
  var _0xdbf0xd7 = performance['now']();
  requestAnimationFrame(function animate(_0xdbf0x76) {
    var _0xdbf0x363 = (_0xdbf0x76 - _0xdbf0xd7) / _0xdbf0x362['duration'];
    if (_0xdbf0x363 > 1) {
      _0xdbf0x363 = 1
    };
    var _0xdbf0xcb = _0xdbf0x362['timing'](_0xdbf0x363);
    _0xdbf0x362['draw'](_0xdbf0xcb);
    if (_0xdbf0x363 < 1) {
      requestAnimationFrame(animate)
    }
  })
}

function makeEaseOut(_0xdbf0x365) {
  return function(_0xdbf0x363) {
    return _0xdbf0x365(_0xdbf0x363)
  }
}

function animate_back(_0xdbf0x363) {
  var _0xdbf0x332 = 4;
  return Math['pow'](_0xdbf0x363, 2) * ((_0xdbf0x332 + 1) * _0xdbf0x363 - _0xdbf0x332)
}

function animate_quad(_0xdbf0x363) {
  return Math['pow'](_0xdbf0x363, 2)
}

function click_sector_mission(_0xdbf0xa2) {
  var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
  if (_0xdbf0x59 >= 5) {
    var _0xdbf0x369 = 80;
    var _0xdbf0x36a = _0xdbf0xa2['getAttribute']('data-items')['split'](',');
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'item';
    for (let _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x36a['length']; _0xdbf0x4++) {
      if (_0xdbf0x36a[_0xdbf0x4] == 'coin' || _0xdbf0x36a[_0xdbf0x4] == 'experience') {
        var _0xdbf0x68 = document['createElement']('img');
        _0xdbf0x68['className'] = 'res';
        _0xdbf0x68['src'] = 'https://cdn.bravegames.space/regiment/images/icons/' + _0xdbf0x36a[_0xdbf0x4] + '.png'
      } else {
        if (_0xdbf0x36a[_0xdbf0x4] == 'helmet' || _0xdbf0x36a[_0xdbf0x4] == 'map') {
          var _0xdbf0x68 = document['createElement']('div');
          _0xdbf0x68['className'] = 'res ' + _0xdbf0x36a[_0xdbf0x4]
        } else {
          if (_0xdbf0x36a[_0xdbf0x4] == 'supply') {
            var _0xdbf0x68 = document['createElement']('img');
            _0xdbf0x68['className'] = 'res';
            _0xdbf0x68['src'] = 'https://cdn.bravegames.space/regiment/images/supply_interface.png'
          } else {
            if (_0xdbf0x36a[_0xdbf0x4] == 'weapon_0' || _0xdbf0x36a[_0xdbf0x4] == 'weapon_1' || _0xdbf0x36a[_0xdbf0x4] == 'weapon_2' || _0xdbf0x36a[_0xdbf0x4] == 'weapon_3' || _0xdbf0x36a[_0xdbf0x4] == 'weapon_4' || _0xdbf0x36a[_0xdbf0x4] == 'weapon_5' || _0xdbf0x36a[_0xdbf0x4] == 'weapon_6') {
              var _0xdbf0x12 = _0xdbf0x36a[_0xdbf0x4]['split']('_');
              if (_0xdbf0x12[0] == 'weapon') {
                var _0xdbf0x68 = document['createElement']('img');
                _0xdbf0x68['className'] = 'res';
                _0xdbf0x68['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/w' + (parseInt(_0xdbf0x12[1]) + 4) + '-36.png'
              }
            } else {
              var _0xdbf0x36b = _0xdbf0x36a[_0xdbf0x4]['split']('_');
              if (_0xdbf0x36b[0] == 'collection') {
                var _0xdbf0x68 = document['createElement']('img');
                _0xdbf0x68['className'] = 'res';
                _0xdbf0x68['src'] = 'https://cdn.bravegames.space/regiment/images/collection/' + _0xdbf0x36b[1] + '.png';
                _0xdbf0x68['style']['width'] = '65px';
                _0xdbf0x68['style']['height'] = 'auto';
                _0xdbf0x68['style']['filter'] = 'sepia(1)'
              }
            }
          }
        }
      };
      let _0xdbf0x36c = 60 - _0xdbf0x68['clientHeight'];
      let _0xdbf0x332 = random_int(-_0xdbf0x369, _0xdbf0x369);
      animate({
        duration: 700,
        timing: makeEaseOut(animate_back),
        draw: function(_0xdbf0xcb) {
          _0xdbf0x8e['getElementsByClassName']('res')[_0xdbf0x4]['style']['top'] = _0xdbf0x36c * _0xdbf0xcb + 'px'
        }
      });
      animate({
        duration: 700,
        timing: makeEaseOut(animate_quad),
        draw: function(_0xdbf0xcb) {
          _0xdbf0x8e['getElementsByClassName']('res')[_0xdbf0x4]['style']['left'] = _0xdbf0x332 * _0xdbf0xcb + 'px';
          if (_0xdbf0xcb === 1) {
            animate({
              duration: 2000,
              timing: makeEaseOut(animate_quad),
              draw: function(_0xdbf0xcb) {
                _0xdbf0x8e['getElementsByClassName']('res')[_0xdbf0x4]['style']['opacity'] = 1 - _0xdbf0xcb;
                if (_0xdbf0xcb === 1) {
                  _0xdbf0x8e['style']['display'] = 'none'
                }
              }
            })
          }
        }
      });
      _0xdbf0x8e['appendChild'](_0xdbf0x68)
    };
    _0xdbf0xa2['appendChild'](_0xdbf0x8e);
    _0xdbf0x59 -= 5;
    var _0xdbf0x54 = Math['floor'](random(window['player']['randoms']['missions_coins']++) * window['mission_rnd_max_coins']) + 1;
    window['player']['static_resources']['coins'] += _0xdbf0x54;
    window['player']['achievements']['coins'] += _0xdbf0x54;
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_collections']++);
    if (_0xdbf0xf1 < window['mission_rnd_collection']) {
      var _0xdbf0xf1 = random(window['player']['randoms']['missions_collection_choice']++);
      var _0xdbf0x26 = Math['floor'](_0xdbf0xf1 * 59) + 1;
      window['player']['collections'][_0xdbf0x26]['amount']++
    };
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_supply']++);
    if (_0xdbf0xf1 < window['mission_rnd_supply']) {
      _0xdbf0x59 += 15
    };
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_0']++);
    if (_0xdbf0xf1 < window['mission_rnd_weapons_0_1']) {
      window['player']['static_resources']['weapon_0']++;
      window['player']['achievements']['weapon_0']++
    };
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_1']++);
    if (_0xdbf0xf1 < window['mission_rnd_weapons_0_1']) {
      window['player']['static_resources']['weapon_1']++;
      window['player']['achievements']['weapon_1']++
    };
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_2']++);
    if (_0xdbf0xf1 < window['mission_rnd_weapons_2']) {
      window['player']['static_resources']['weapon_2']++;
      window['player']['achievements']['weapon_2']++
    };
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_3']++);
    if (_0xdbf0xf1 < window['mission_rnd_weapons_3']) {
      window['player']['static_resources']['weapon_3']++;
      window['player']['achievements']['weapon_3']++
    };
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_4']++);
    if (_0xdbf0xf1 < window['mission_rnd_weapons_4']) {
      window['player']['static_resources']['weapon_4']++;
      window['player']['achievements']['weapon_4']++
    };
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_5']++);
    if (_0xdbf0xf1 < window['mission_rnd_weapons_5']) {
      window['player']['static_resources']['weapon_5']++;
      window['player']['achievements']['weapon_5']++
    };
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_6']++);
    if (_0xdbf0xf1 < window['mission_rnd_weapons_6']) {
      window['player']['static_resources']['weapon_6']++;
      window['player']['achievements']['weapon_6']++
    };
    window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x59;
    window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_helmets']++);
    if (_0xdbf0xf1 < window['mission_rnd_helmets']) {
      window['player']['static_resources']['helmets']++
    };
    var _0xdbf0xf1 = random(window['player']['randoms']['missions_maps']++);
    if (_0xdbf0xf1 < window['mission_rnd_maps']) {
      window['player']['static_resources']['maps']++
    };
    window['player']['experiences']['experience']['amount'] += 5;
    window['player']['missions'][window['selected_front']][window['selected_mission']]['sectors'][_0xdbf0xa2['dataset']['iid']] += 5;
    var _0xdbf0x36d = ['explosion.mp3', 'tank.mp3', 'machine_gun.mp3'];
    var _0xdbf0xd8 = 0;
    while (_0xdbf0xd8 == 0) {
      var _0xdbf0x24 = random_int(0, _0xdbf0x36d['length'] - 1);
      if (_0xdbf0x24 != window['sound_last']) {
        _0xdbf0xd8 = 1;
        window['sound_last'] = _0xdbf0x24
      }
    };
    play_effect(_0xdbf0x36d[window['sound_last']]);
    server_action('missions.hit', {
      "front": +window['selected_front'],
      "mission": +window['selected_mission'],
      "sector": +_0xdbf0xa2['dataset']['iid']
    });
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'spent_supply') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += 5;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    };
    if (_0xdbf0x54 > 0) {
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
        if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
          window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x54;
          if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
            window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
            window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
          }
        }
      }
    };
    update_level(0);
    mission_set_sector_ignore(_0xdbf0xa2['dataset']['iid']);
    update_mission();
    update_renewable_resources_supply();
    update_static_resources_coins()
  } else {
    show_modal_no_supply()
  }
}

function mission_set_sector_ignore(_0xdbf0x9a) {
  var _0xdbf0x36f = window['fronts'][window['selected_front']]['sectors'][window['selected_mission']];
  var _0xdbf0x370 = window['player']['missions'][window['selected_front']][window['selected_mission']]['sectors'];
  if (_0xdbf0x370[_0xdbf0x9a] >= _0xdbf0x36f[_0xdbf0x9a]) {
    var _0xdbf0x36 = document['getElementById']('sector_common');
    var _0xdbf0x371 = _0xdbf0x36['getElementsByClassName']('sector_common sector_' + _0xdbf0x9a)[0];
    _0xdbf0x371['dataset']['backup_bg'] = _0xdbf0x371['style']['background'];
    _0xdbf0x371['style']['background'] = 'none';
    _0xdbf0x371['dataset']['ignore'] = '1';
    var _0xdbf0x372 = _0xdbf0x371['getElementsByClassName']('indicator')[0];
    _0xdbf0x372['dataset']['backup_bg'] = _0xdbf0x372['style']['background'];
    _0xdbf0x372['style']['background'] = 'none';
    _0xdbf0x372['style']['cursor'] = 'default';
    _0xdbf0x372['onclick'] = '';
    var _0xdbf0x137 = _0xdbf0x372['getElementsByTagName']('span')[0];
    _0xdbf0x137['style']['display'] = 'none';
    setTimeout(mission_hide_sector, 3000, _0xdbf0x9a)
  }
}

function mission_hide_sector(_0xdbf0x9a) {
  var _0xdbf0x36 = document['getElementById']('sector_common');
  var _0xdbf0x371 = _0xdbf0x36['getElementsByClassName']('sector_common sector_' + _0xdbf0x9a)[0];
  _0xdbf0x371['style']['display'] = 'none';
  _0xdbf0x371['style']['background'] = _0xdbf0x371['dataset']['backup_bg'];
  _0xdbf0x371['dataset']['ignore'] = '';
  var _0xdbf0x372 = _0xdbf0x371['getElementsByClassName']('indicator')[0];
  _0xdbf0x372['style']['background'] = _0xdbf0x372['dataset']['backup_bg'];
  _0xdbf0x372['style']['cursor'] = 'pointer';
  var _0xdbf0x137 = _0xdbf0x372['getElementsByTagName']('span')[0];
  _0xdbf0x137['style']['display'] = 'block'
}

function show_modal_no_supply() {
  var _0xdbf0x34 = ['supply', 'weapons'];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x34['length']; _0xdbf0x4++) {
    hide_modal(_0xdbf0x34[_0xdbf0x4] + '_block')
  };
  hide_modal2(0);
  window['view_modal'] = 1;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'block';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_supply')[0];
  _0xdbf0x36['style']['display'] = 'block';
  var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_accept'], 1, 86400);
  if (_0xdbf0x59 < window['limit_supply_max'] && _0xdbf0xd5 < (window['limit_supply_accept'] + window['player']['static_resources']['boost_get_supply'] + window['player']['static_resources']['boost_get_supply'])) {
    var _0xdbf0x9f = document['getElementById']('btn_get_supply');
    _0xdbf0x9f['className'] = 'button button_yellow';
    _0xdbf0x9f['onclick'] = no_supply_get
  } else {
    document['getElementById']('btn_get_supply')['className'] = 'button button_dark'
  };
  document['getElementById']('btn_buy_supply')['onclick'] = function() {
    hide_modal_no_supply(0);
    show_homeland();
    show_shop(1);
    shop_menu('supply', 1)
  };
  _0xdbf0x35['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
    hide_modal_no_supply(0)
  }
}

function no_supply_get() {
  hide_modal_no_supply(1);
  show_supply_block()
}

function hide_modal_no_supply(_0xdbf0x10f) {
  if (_0xdbf0x10f != 1) {
    play_effect('click.mp3')
  };
  window['view_modal'] = 0;
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementsByClassName']('modal_3')[0];
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x36 = _0xdbf0x35['getElementsByClassName']('modal_no_supply')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function update_mission() {
  update_mission_helmets();
  update_mission_maps();
  var _0xdbf0x36f = window['fronts'][window['selected_front']]['sectors'][window['selected_mission']];
  var _0xdbf0x370 = window['player']['missions'][window['selected_front']][window['selected_mission']]['sectors'];
  var _0xdbf0x36 = document['getElementById']('sector_common');
  var _0xdbf0xd8 = 0;
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x36f['length']; _0xdbf0x4++) {
    if (_0xdbf0x36f[_0xdbf0x4] > _0xdbf0x370[_0xdbf0x4]) {
      var _0xdbf0x371 = _0xdbf0x36['getElementsByClassName']('sector_common sector_' + _0xdbf0x4)[0];
      _0xdbf0x371['style']['display'] = 'block';
      var _0xdbf0x372 = _0xdbf0x371['getElementsByClassName']('indicator')[0];
      var _0xdbf0xd1 = _0xdbf0x372['getElementsByTagName']('span');
      if (_0xdbf0xd1['length'] > 0) {
        _0xdbf0xd1[0]['innerHTML'] = _0xdbf0x36f[_0xdbf0x4] - _0xdbf0x370[_0xdbf0x4]
      } else {
        var _0xdbf0x137 = document['createElement']('span');
        _0xdbf0x137['innerHTML'] = _0xdbf0x36f[_0xdbf0x4] - _0xdbf0x370[_0xdbf0x4];
        _0xdbf0x372['appendChild'](_0xdbf0x137)
      };
      if (_0xdbf0xd8 == 0) {
        _0xdbf0x372['style']['display'] = 'block';
        _0xdbf0xd8 = 1;
        _0xdbf0x372['dataset']['items'] = 'coin,experience';
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_collections']);
        if (_0xdbf0xf1 < window['mission_rnd_collection']) {
          var _0xdbf0xf1 = random(window['player']['randoms']['missions_collection_choice']);
          var _0xdbf0x26 = Math['floor'](_0xdbf0xf1 * 59) + 1;
          _0xdbf0x372['dataset']['items'] += ',collection_' + _0xdbf0x26
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_helmets']);
        if (_0xdbf0xf1 < window['mission_rnd_helmets']) {
          _0xdbf0x372['dataset']['items'] += ',helmet'
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_maps']);
        if (_0xdbf0xf1 < window['mission_rnd_maps']) {
          _0xdbf0x372['dataset']['items'] += ',map'
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_supply']);
        if (_0xdbf0xf1 < window['mission_rnd_supply']) {
          _0xdbf0x372['dataset']['items'] += ',supply'
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_0']);
        if (_0xdbf0xf1 < window['mission_rnd_weapons_0_1']) {
          _0xdbf0x372['dataset']['items'] += ',weapon_0'
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_1']);
        if (_0xdbf0xf1 < window['mission_rnd_weapons_0_1']) {
          _0xdbf0x372['dataset']['items'] += ',weapon_1'
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_2']);
        if (_0xdbf0xf1 < window['mission_rnd_weapons_2']) {
          _0xdbf0x372['dataset']['items'] += ',weapon_2'
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_3']);
        if (_0xdbf0xf1 < window['mission_rnd_weapons_3']) {
          _0xdbf0x372['dataset']['items'] += ',weapon_3'
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_4']);
        if (_0xdbf0xf1 < window['mission_rnd_weapons_4']) {
          _0xdbf0x372['dataset']['items'] += ',weapon_4'
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_5']);
        if (_0xdbf0xf1 < window['mission_rnd_weapons_5']) {
          _0xdbf0x372['dataset']['items'] += ',weapon_5'
        };
        var _0xdbf0xf1 = random(window['player']['randoms']['missions_weapon_6']);
        if (_0xdbf0xf1 < window['mission_rnd_weapons_6']) {
          _0xdbf0x372['dataset']['items'] += ',weapon_6'
        }
      } else {
        _0xdbf0x372['style']['display'] = 'none'
      };
      if (window['player']['static_resources']['tutorial'] == 3) {
        _0xdbf0x372['style']['pointerEvents'] = 'auto';
        _0xdbf0x372['style']['cursor'] = 'pointer'
      };
      _0xdbf0x372['onclick'] = mission_click
    } else {
      var _0xdbf0x371 = _0xdbf0x36['getElementsByClassName']('sector_common sector_' + _0xdbf0x4)[0];
      if (_0xdbf0x371['dataset']['ignore'] != '1') {
        _0xdbf0x371['style']['display'] = 'none'
      };
      _0xdbf0x15++
    }
  };
  for (; _0xdbf0x4 < 9; _0xdbf0x4++) {
    var _0xdbf0x371 = _0xdbf0x36['getElementsByClassName']('sector_common sector_' + _0xdbf0x4)[0];
    _0xdbf0x371['style']['display'] = 'none'
  };
  if (_0xdbf0x15 == _0xdbf0x36f['length']) {
    if (window['player']['static_resources']['tutorial'] == 3) {
      window['player']['static_resources']['tutorial']++
    };
    if (window['player']['static_resources']['tutorial'] == 4) {
      show_tutorial(4)
    };
    var _0xdbf0x9f = document['getElementsByClassName']('win_button')[0];
    _0xdbf0x9f['style']['display'] = 'block';
    _0xdbf0x9f['onclick'] = show_win_mission
  } else {
    document['getElementsByClassName']('win_button')[0]['style']['display'] = 'none'
  }
}

function mission_click() {
  if (mission_click['clicked']) {
    return
  } else {
    mission_click['clicked'] = true;
    click_sector_mission(this);
    setTimeout(() => {
      mission_click['clicked'] = false
    }, 100)
  }
}

function animation(_0xdbf0xa2, _0xdbf0x37a, _0xdbf0x37b, _0xdbf0x37c, _0xdbf0x37d, _0xdbf0x37e, _0xdbf0x1d) {
  if (_0xdbf0x37d == 0) {
    var _0xdbf0x4f = _0xdbf0x37b
  } else {
    if (_0xdbf0x37d == 1) {
      var _0xdbf0x4f = _0xdbf0x37b + 'px'
    }
  };
  _0xdbf0xa2['style'][_0xdbf0x37a] = _0xdbf0x4f;
  if (_0xdbf0x37c > _0xdbf0x37b) {
    var _0xdbf0x5d = 0
  } else {
    if (_0xdbf0x37b > _0xdbf0x37c) {
      var _0xdbf0x5d = 1
    }
  };
  var _0xdbf0x23 = Math['max'](_0xdbf0x37b, _0xdbf0x37c);
  var _0xdbf0x22 = Math['min'](_0xdbf0x37b, _0xdbf0x37c);
  var _0xdbf0xe7 = (_0xdbf0x23 - _0xdbf0x22) / _0xdbf0x37e * 10;
  var _0xdbf0x37f = Math['max'](_0xdbf0x37c, _0xdbf0x37b) - Math['min'](_0xdbf0x37c, _0xdbf0x37b);
  var _0xdbf0x380 = _0xdbf0x37f / _0xdbf0xe7;
  var _0xdbf0x76 = _0xdbf0x37e / _0xdbf0x380;
  animation_start(_0xdbf0xa2, _0xdbf0x37a, _0xdbf0x37b, _0xdbf0x5d, _0xdbf0x37c, _0xdbf0x37d, _0xdbf0xe7, _0xdbf0x76, _0xdbf0x1d)
}

function animation_start(_0xdbf0xa2, _0xdbf0x37a, _0xdbf0x382, _0xdbf0x5d, _0xdbf0x37c, _0xdbf0x37d, _0xdbf0xe7, _0xdbf0x76, _0xdbf0x1d) {
  setTimeout(animation_iteration, _0xdbf0x76, _0xdbf0xa2, _0xdbf0x37a, _0xdbf0x382, _0xdbf0x5d, _0xdbf0xe7, _0xdbf0x37d, _0xdbf0x37c, _0xdbf0x76, _0xdbf0x1d)
}

function animation_iteration(_0xdbf0xa2, _0xdbf0x37a, _0xdbf0x382, _0xdbf0x5d, _0xdbf0xe7, _0xdbf0x37d, _0xdbf0x37c, _0xdbf0x76, _0xdbf0x1d) {
  if (_0xdbf0x5d == 0) {
    var _0xdbf0x4f = _0xdbf0x382 + _0xdbf0xe7
  } else {
    if (_0xdbf0x5d == 1) {
      var _0xdbf0x4f = _0xdbf0x382 - _0xdbf0xe7
    }
  };
  var _0xdbf0x32 = _0xdbf0x4f;
  if (_0xdbf0x37d == 1) {
    _0xdbf0x32 += 'px'
  };
  _0xdbf0xa2['style'][_0xdbf0x37a] = _0xdbf0x32;
  if ((_0xdbf0x5d == 0 && (_0xdbf0x4f + _0xdbf0xe7) < _0xdbf0x37c) || (_0xdbf0x5d == 1 && (_0xdbf0x4f + _0xdbf0xe7) > _0xdbf0x37c)) {
    animation_start(_0xdbf0xa2, _0xdbf0x37a, _0xdbf0x4f, _0xdbf0x5d, _0xdbf0x37c, _0xdbf0x37d, _0xdbf0xe7, _0xdbf0x76, _0xdbf0x1d)
  } else {
    if (_0xdbf0x1d != '') {
      window[_0xdbf0x1d](_0xdbf0xa2)
    }
  }
}

function helmets_animation_finish(_0xdbf0xa2) {
  var _0xdbf0x5e = parseInt(_0xdbf0xa2['dataset']['an_status']);
  _0xdbf0x5e--;
  _0xdbf0xa2['dataset']['an_status'] = _0xdbf0x5e;
  if (_0xdbf0x5e == 0) {
    check_helmets()
  }
}

function check_helmets() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_helmets')[0]['getElementsByClassName']('mission_puzzle_helmets_item');
  var _0xdbf0xd7 = 1;
  for (var _0xdbf0x4 = _0xdbf0x55['length'] - 1; _0xdbf0x4 >= 0; _0xdbf0x4--) {
    if (_0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] == '1' || _0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] == '2') {
      _0xdbf0xd7 = 0
    }
  };
  if (_0xdbf0xd7 == 1) {
    show_helmets_text()
  }
}

function show_helmets_text() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_helmets')[0];
  if (_0xdbf0x56['dataset']['first_run'] != '1') {
    _0xdbf0x56['dataset']['first_run'] = '1';
    var _0xdbf0x168 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_helmets_item_text')[0];
    animation(_0xdbf0x168, 'opacity', 0, 1, 0, 500, 'wait_helmets_text')
  }
}

function wait_helmets_text() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_helmets')[0];
  setTimeout(hide_helmets_text, 2000)
}

function hide_helmets_text() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_helmets')[0];
  var _0xdbf0x55 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_helmets_item');
  var _0xdbf0x168 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_helmets_item_text')[0];
  animation(_0xdbf0x55[0], 'opacity', 1, 0, 0, 500, '');
  animation(_0xdbf0x168, 'opacity', 1, 0, 0, 500, 'recovery_helmets_text')
}

function recovery_helmets_text() {
  mission_helmets_return();
  update_mission_helmets_hide()
}

function mission_helmets_return() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_helmets')[0]['getElementsByClassName']('mission_puzzle_helmets_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['style']['left'] = (5 + _0xdbf0x4 * 47) + 'px'
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    animation(_0xdbf0x55[_0xdbf0x4], 'opacity', 0, 1, 0, 500, '')
  }
}

function update_mission_helmets_hide() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_helmets')[0];
  var _0xdbf0x55 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_helmets_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = 'mission_puzzle_helmets_item helmet_' + _0xdbf0x4
  };
  if (window['player']['static_resources']['helmets'] == 5) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < 5; _0xdbf0x4++) {
      _0xdbf0x55[_0xdbf0x4]['classList']['add']('available')
    }
  } else {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['static_resources']['helmets']; _0xdbf0x4++) {
      _0xdbf0x55[_0xdbf0x4]['classList']['add']('available')
    }
  };
  _0xdbf0x56['dataset']['first_run'] = '0'
}

function update_mission_helmets() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_helmets')[0];
  var _0xdbf0x55 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_helmets_item');
  var _0xdbf0x38d = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] == '1' || _0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] == '2') {
      _0xdbf0x38d = 1
    }
  };
  if (_0xdbf0x56['dataset']['first_run'] == '1') {
    _0xdbf0x38d = 1
  };
  var _0xdbf0x54 = Math['floor'](random(window['player']['randoms']['missions_helmets_coins']) * 50) + 1;
  if (_0xdbf0x38d == 1) {
    if (window['player']['static_resources']['helmets'] == 5) {
      window['player']['static_resources']['helmets'] = 0;
      window['player']['static_resources']['coins'] += _0xdbf0x54;
      window['player']['achievements']['coins'] += _0xdbf0x54;
      window['player']['randoms']['missions_helmets_coins']++;
      if (_0xdbf0x54 > 0) {
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
            window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x54;
            if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
              window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
              window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
            }
          }
        }
      };
      update_static_resources_coins()
    }
  } else {
    var _0xdbf0x168 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_helmets_item_text')[0];
    _0xdbf0x168['innerHTML'] = 'Ваша награда - <img src="https://cdn.bravegames.space/regiment/images/icons/coin.png">' + _0xdbf0x54;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      _0xdbf0x55[_0xdbf0x4]['className'] = 'mission_puzzle_helmets_item helmet_' + _0xdbf0x4
    };
    if (window['player']['static_resources']['helmets'] == 5) {
      _0xdbf0x55[0]['classList']['add']('available');
      for (var _0xdbf0x4 = 1; _0xdbf0x4 < 5; _0xdbf0x4++) {
        _0xdbf0x55[_0xdbf0x4]['classList']['add']('available');
        _0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] = 2;
        animation(_0xdbf0x55[_0xdbf0x4], 'left', 5 + 47 * _0xdbf0x4, 0, 1, 700, 'helmets_animation_finish');
        animation(_0xdbf0x55[_0xdbf0x4], 'opacity', 1, 0, 0, 700, 'helmets_animation_finish')
      };
      window['player']['static_resources']['helmets'] = 0;
      window['player']['static_resources']['coins'] += _0xdbf0x54;
      window['player']['achievements']['coins'] += _0xdbf0x54;
      window['player']['randoms']['missions_helmets_coins']++;
      if (_0xdbf0x54 > 0) {
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
          if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
            window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x54;
            if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
              window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
              window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
            }
          }
        }
      };
      update_static_resources_coins()
    } else {
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['static_resources']['helmets']; _0xdbf0x4++) {
        _0xdbf0x55[_0xdbf0x4]['classList']['add']('available')
      }
    }
  }
}

function maps_animation_finish(_0xdbf0xa2) {
  var _0xdbf0x5e = parseInt(_0xdbf0xa2['dataset']['an_status']);
  _0xdbf0x5e--;
  _0xdbf0xa2['dataset']['an_status'] = _0xdbf0x5e;
  if (_0xdbf0x5e == 0) {
    check_maps()
  }
}

function check_maps() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_maps')[0]['getElementsByClassName']('mission_puzzle_maps_item');
  var _0xdbf0xd7 = 1;
  for (var _0xdbf0x4 = _0xdbf0x55['length'] - 1; _0xdbf0x4 >= 0; _0xdbf0x4--) {
    if (_0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] == '1' || _0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] == '2') {
      _0xdbf0xd7 = 0
    }
  };
  if (_0xdbf0xd7 == 1) {
    show_maps_text()
  }
}

function show_maps_text() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_maps')[0];
  if (_0xdbf0x56['dataset']['first_run'] != '1') {
    _0xdbf0x56['dataset']['first_run'] = '1';
    var _0xdbf0x168 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_maps_item_text')[0];
    animation(_0xdbf0x168, 'opacity', 0, 1, 0, 500, 'wait_maps_text')
  }
}

function wait_maps_text() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_maps')[0];
  setTimeout(hide_maps_text, 2000)
}

function hide_maps_text() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_maps')[0];
  var _0xdbf0x55 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_maps_item');
  var _0xdbf0x168 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_maps_item_text')[0];
  animation(_0xdbf0x55[0], 'opacity', 1, 0, 0, 500, '');
  animation(_0xdbf0x168, 'opacity', 1, 0, 0, 500, 'recovery_maps_text')
}

function recovery_maps_text() {
  mission_maps_return();
  update_mission_maps_hide()
}

function mission_maps_return() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_maps')[0]['getElementsByClassName']('mission_puzzle_maps_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['style']['opacity'] = 1;
    _0xdbf0x55[_0xdbf0x4]['style']['left'] = (5 + _0xdbf0x4 * 47) + 'px'
  }
}

function update_mission_maps_hide() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_maps')[0];
  var _0xdbf0x55 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_maps_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = 'mission_puzzle_maps_item map_' + _0xdbf0x4
  };
  if (window['player']['static_resources']['maps'] == 5) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < 5; _0xdbf0x4++) {
      _0xdbf0x55[_0xdbf0x4]['classList']['add']('available')
    }
  } else {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['static_resources']['maps']; _0xdbf0x4++) {
      _0xdbf0x55[_0xdbf0x4]['classList']['add']('available')
    }
  };
  _0xdbf0x56['dataset']['first_run'] = '0'
}

function update_mission_maps() {
  var _0xdbf0x36 = document['getElementsByClassName']('mission_puzzle')[0];
  var _0xdbf0x56 = _0xdbf0x36['getElementsByClassName']('mission_puzzle_maps')[0];
  var _0xdbf0x55 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_maps_item');
  var _0xdbf0x38d = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] == '1' || _0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] == '2') {
      _0xdbf0x38d = 1
    }
  };
  if (_0xdbf0x56['dataset']['first_run'] == '1') {
    _0xdbf0x38d = 1
  };
  var _0xdbf0x1dd = Math['floor'](random(window['player']['randoms']['missions_maps_exp']) * 50) + 1;
  if (_0xdbf0x38d == 1) {
    if (window['player']['static_resources']['maps'] == 5) {
      window['player']['static_resources']['maps'] = 0;
      window['player']['experiences']['experience']['amount'] += _0xdbf0x1dd;
      window['player']['randoms']['missions_maps_exp']++;
      update_level(0)
    }
  } else {
    var _0xdbf0x168 = _0xdbf0x56['getElementsByClassName']('mission_puzzle_maps_item_text')[0];
    _0xdbf0x168['innerHTML'] = 'Ваша награда - <img src="https://cdn.bravegames.space/regiment/images/icons/experience.png">' + _0xdbf0x1dd;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      _0xdbf0x55[_0xdbf0x4]['className'] = 'mission_puzzle_maps_item map_' + _0xdbf0x4
    };
    if (window['player']['static_resources']['maps'] == 5) {
      _0xdbf0x55[0]['classList']['add']('available');
      for (var _0xdbf0x4 = 1; _0xdbf0x4 < 5; _0xdbf0x4++) {
        _0xdbf0x55[_0xdbf0x4]['classList']['add']('available');
        _0xdbf0x55[_0xdbf0x4]['dataset']['an_status'] = 2;
        animation(_0xdbf0x55[_0xdbf0x4], 'left', 5 + 47 * _0xdbf0x4, 0, 1, 700, 'maps_animation_finish');
        animation(_0xdbf0x55[_0xdbf0x4], 'opacity', 1, 0, 0, 700, 'maps_animation_finish')
      };
      window['player']['static_resources']['maps'] = 0;
      window['player']['experiences']['experience']['amount'] += _0xdbf0x1dd;
      window['player']['randoms']['missions_maps_exp']++;
      update_level(0)
    } else {
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['static_resources']['maps']; _0xdbf0x4++) {
        _0xdbf0x55[_0xdbf0x4]['classList']['add']('available')
      }
    }
  }
}

function top_mission_generate(_0xdbf0x9a, _0xdbf0xa6, _0xdbf0x289) {
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'mission_result_top_item';
  if (_0xdbf0x9a == window['game_login']) {
    _0xdbf0x8e['classList']['add']('my_top_background')
  };
  if (_0xdbf0x289 == 1) {
    _0xdbf0x8e['classList']['add']('my_top_position')
  };
  var _0xdbf0x136 = document['createElement']('div');
  _0xdbf0x136['className'] = 'mission_result_top_item_avatar';
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/add_friend.png';
  _0xdbf0x136['appendChild'](_0xdbf0x90);
  _0xdbf0x136['dataset']['fid'] = _0xdbf0x9a;
  _0xdbf0x8e['appendChild'](_0xdbf0x136);
  var _0xdbf0x3d = document['createElement']('div');
  _0xdbf0x3d['className'] = 'mission_result_top_item_name';
  var _0xdbf0x137 = document['createElement']('span');
  _0xdbf0x137['innerHTML'] = 'Загрузка...';
  _0xdbf0x137['style']['cursor'] = 'default';
  _0xdbf0x137['dataset']['fid'] = _0xdbf0x9a;
  _0xdbf0x3d['appendChild'](_0xdbf0x137);
  _0xdbf0x8e['appendChild'](_0xdbf0x3d);
  var _0xdbf0x15 = document['createElement']('div');
  _0xdbf0x15['innerHTML'] = _0xdbf0xa6['toLocaleString']();
  _0xdbf0x15['className'] = 'mission_result_top_item_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x15);
  return _0xdbf0x8e
}

function top_mission_friends_click() {
  hide_modal('mission_result');
  show_homeland();
  var _0xdbf0x9a = parseInt(this['dataset']['fid']);
  if (_0xdbf0x9a != window['game_login']) {
    show_friend_help(_0xdbf0x9a)
  } else {
    show_my_profile()
  }
}

function update_top_mission() {
  var _0xdbf0x55 = document['getElementsByClassName']('mission_result_top')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var in_array = 0;
  var _0xdbf0x56 = [];
  var _0xdbf0x2fc = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_mission_' + window['selected_front'] + '_' + window['selected_mission'] + '_friends']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = window['top_mission_' + window['selected_front'] + '_' + window['selected_mission'] + '_friends'][_0xdbf0x4];
    var _0xdbf0x9a = parseInt(_0xdbf0x8e[0]);
    var _0xdbf0xa6 = parseInt(_0xdbf0x8e[1]);
    _0xdbf0x2fc['push']([_0xdbf0x9a, _0xdbf0xa6])
  };
  _0xdbf0x2fc['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
    if (_0xdbf0x8c[1] < _0xdbf0x8d[1]) {
      return 1
    } else {
      if (_0xdbf0x8c[1] > _0xdbf0x8d[1]) {
        return -1
      } else {
        return 0
      }
    }
  });
  var _0xdbf0x22 = 4;
  if (_0xdbf0x2fc['length'] < 4) {
    _0xdbf0x22 = _0xdbf0x2fc['length']
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x22; _0xdbf0x4++) {
    var _0xdbf0x8e = top_mission_generate(_0xdbf0x2fc[_0xdbf0x4][0], _0xdbf0x2fc[_0xdbf0x4][1], 0);
    _0xdbf0x55['appendChild'](_0xdbf0x8e);
    if (_0xdbf0x2fc[_0xdbf0x4][0] == window['game_login']) {
      in_array = 1
    };
    _0xdbf0x56['push'](_0xdbf0x2fc[_0xdbf0x4][0])
  };
  if (in_array == 0) {
    var _0xdbf0x5e = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x2fc['length']; _0xdbf0x4++) {
      if (_0xdbf0x2fc[_0xdbf0x4][0] == window['game_login']) {
        var _0xdbf0x8e = top_mission_generate(_0xdbf0x2fc[_0xdbf0x4][0], _0xdbf0x2fc[_0xdbf0x4][1], 1);
        _0xdbf0x55['appendChild'](_0xdbf0x8e);
        _0xdbf0x56['push'](_0xdbf0x2fc[_0xdbf0x4][0]);
        _0xdbf0x5e = 1
      }
    };
    if (_0xdbf0x5e == 0 && _0xdbf0x22 == 4) {
      var _0xdbf0x8e = top_mission_generate(_0xdbf0x2fc[4][0], _0xdbf0x2fc[4][1], 0);
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      _0xdbf0x56['push'](_0xdbf0x2fc[4][0])
    }
  } else {
    if (_0xdbf0x2fc['length'] >= 5) {
      var _0xdbf0x8e = top_mission_generate(_0xdbf0x2fc[4][0], _0xdbf0x2fc[4][1], 0);
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      _0xdbf0x56['push'](_0xdbf0x2fc[4][0])
    }
  };
  var _0xdbf0x28b = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x56['length']; _0xdbf0x38++) {
      if (_0xdbf0x56[_0xdbf0x38] != -1 && _0xdbf0x56[_0xdbf0x38] == window['friends'][_0xdbf0x4]['id']) {
        if (window['friends'][_0xdbf0x4]['profile']) {
          _0xdbf0x56[_0xdbf0x38] = -1;
          var _0xdbf0x8e = _0xdbf0x55['getElementsByClassName']('mission_result_top_item')[_0xdbf0x38];
          var _0xdbf0x136 = _0xdbf0x8e['getElementsByClassName']('mission_result_top_item_avatar')[0];
          _0xdbf0x136['getElementsByTagName']('img')[0]['src'] = window['friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x136['style']['cursor'] = 'pointer';
          _0xdbf0x136['onclick'] = top_mission_friends_click;
          var _0xdbf0x3d = _0xdbf0x8e['getElementsByClassName']('mission_result_top_item_name')[0];
          var _0xdbf0x137 = _0xdbf0x3d['getElementsByTagName']('span')[0];
          _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + '<br>' + window['friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['style']['cursor'] = 'pointer';
          _0xdbf0x137['onclick'] = top_mission_friends_click
        } else {
          _0xdbf0x28b = 1
        }
      }
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x56['length']; _0xdbf0x38++) {
      if (_0xdbf0x56[_0xdbf0x38] != -1 && _0xdbf0x56[_0xdbf0x38] == window['other_friends'][_0xdbf0x4]['id']) {
        if (window['other_friends'][_0xdbf0x4]['profile']) {
          _0xdbf0x56[_0xdbf0x38] = -1;
          var _0xdbf0x8e = _0xdbf0x55['getElementsByClassName']('mission_result_top_item')[_0xdbf0x38];
          var _0xdbf0x136 = _0xdbf0x8e['getElementsByClassName']('mission_result_top_item_avatar')[0];
          _0xdbf0x136['getElementsByTagName']('img')[0]['src'] = window['other_friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x136['style']['cursor'] = 'pointer';
          _0xdbf0x136['onclick'] = top_mission_friends_click;
          var _0xdbf0x3d = _0xdbf0x8e['getElementsByClassName']('mission_result_top_item_name')[0];
          var _0xdbf0x137 = _0xdbf0x3d['getElementsByTagName']('span')[0];
          _0xdbf0x137['innerHTML'] = window['other_friends'][_0xdbf0x4]['profile']['first_name'] + '<br>' + window['other_friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['style']['cursor'] = 'pointer';
          _0xdbf0x137['onclick'] = top_mission_friends_click
        } else {
          _0xdbf0x28b = 1
        }
      }
    }
  };
  if (_0xdbf0x28b == 1) {
    window['top_mission_items'] = _0xdbf0x56;
    setTimeout(update_top_mission_repeat, 100)
  }
}

function update_top_mission_repeat() {
  var _0xdbf0x55 = document['getElementsByClassName']('mission_result_top')[0];
  var _0xdbf0x28b = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_mission_items']['length']; _0xdbf0x38++) {
      if (window['top_mission_items'][_0xdbf0x38] != -1 && window['top_mission_items'][_0xdbf0x38] == window['friends'][_0xdbf0x4]['id']) {
        if (window['friends'][_0xdbf0x4]['profile']) {
          window['top_mission_items'][_0xdbf0x38] = -1;
          var _0xdbf0x8e = _0xdbf0x55['getElementsByClassName']('mission_result_top_item')[_0xdbf0x38];
          var _0xdbf0x136 = _0xdbf0x8e['getElementsByClassName']('mission_result_top_item_avatar')[0];
          _0xdbf0x136['getElementsByTagName']('img')[0]['src'] = window['friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x136['style']['cursor'] = 'pointer';
          _0xdbf0x136['onclick'] = top_mission_friends_click;
          var _0xdbf0x3d = _0xdbf0x8e['getElementsByClassName']('mission_result_top_item_name')[0];
          var _0xdbf0x137 = _0xdbf0x3d['getElementsByTagName']('span')[0];
          _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['style']['cursor'] = 'pointer';
          _0xdbf0x137['onclick'] = top_mission_friends_click
        } else {
          _0xdbf0x28b = 1
        }
      }
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['top_mission_items']['length']; _0xdbf0x38++) {
      if (window['top_mission_items'][_0xdbf0x38] != -1 && window['top_mission_items'][_0xdbf0x38] == window['other_friends'][_0xdbf0x4]['id']) {
        if (window['other_friends'][_0xdbf0x4]['profile']) {
          window['top_mission_items'][_0xdbf0x38] = -1;
          var _0xdbf0x8e = _0xdbf0x55['getElementsByClassName']('mission_result_top_item')[_0xdbf0x38];
          var _0xdbf0x136 = _0xdbf0x8e['getElementsByClassName']('mission_result_top_item_avatar')[0];
          _0xdbf0x136['getElementsByTagName']('img')[0]['src'] = window['other_friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x136['style']['cursor'] = 'pointer';
          _0xdbf0x136['onclick'] = top_mission_friends_click;
          var _0xdbf0x3d = _0xdbf0x8e['getElementsByClassName']('mission_result_top_item_name')[0];
          var _0xdbf0x137 = _0xdbf0x3d['getElementsByTagName']('span')[0];
          _0xdbf0x137['innerHTML'] = window['other_friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['other_friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['style']['cursor'] = 'pointer';
          _0xdbf0x137['onclick'] = top_mission_friends_click
        } else {
          _0xdbf0x28b = 1
        }
      }
    }
  };
  if (_0xdbf0x28b == 1) {
    setTimeout(update_top_mission_repeat, 100)
  }
}

function show_win_mission() {
  if (window['player']['static_resources']['tutorial'] == 4) {
    window['player']['static_resources']['tutorial']++;
    tutorial_arrow_stop()
  };
  var _0xdbf0x7d = 'top_mission_' + window['selected_front'] + '_' + window['selected_mission'] + '_friends';
  var _0xdbf0x5e = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window[_0xdbf0x7d]['length']; _0xdbf0x4++) {
    if (window[_0xdbf0x7d][_0xdbf0x4][0] == window['game_login']) {
      window[_0xdbf0x7d][_0xdbf0x4][1]++;
      _0xdbf0x5e = 1
    }
  };
  if (_0xdbf0x5e == 0) {
    window[_0xdbf0x7d]['push']([window['game_login'], 1])
  };
  update_top_mission();
  var _0xdbf0x36 = document['getElementsByClassName']('mission_result')[0];
  if (window['player']['static_resources']['tutorial'] == 5) {
    document['getElementById']('modal_close')['style']['display'] = 'none';
    _0xdbf0x36['getElementsByClassName']('mission_result_get_button')[0]['style']['pointerEvents'] = 'auto';
    _0xdbf0x36['getElementsByClassName']('mission_result_share')[0]['style']['pointerEvents'] = 'auto'
  };
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('mission_result_award')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'mission_result_award_item';
  var _0xdbf0xc8 = document['createElement']('div');
  _0xdbf0xc8['className'] = 'mission_result_award_item_img';
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/experience_2.png';
  _0xdbf0xc8['appendChild'](_0xdbf0x90);
  _0xdbf0x8e['appendChild'](_0xdbf0xc8);
  var _0xdbf0x15 = document['createElement']('div');
  _0xdbf0x15['innerHTML'] = 'x' + window['fronts'][window['selected_front']]['reward'][window['selected_mission']]['experience'];
  _0xdbf0x15['className'] = 'mission_result_award_item_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x15);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'mission_result_award_item';
  var _0xdbf0xc8 = document['createElement']('div');
  _0xdbf0xc8['className'] = 'mission_result_award_item_img';
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/encryptions_2.png';
  _0xdbf0xc8['appendChild'](_0xdbf0x90);
  _0xdbf0x8e['appendChild'](_0xdbf0xc8);
  var _0xdbf0x15 = document['createElement']('div');
  _0xdbf0x15['innerHTML'] = 'x' + window['fronts'][window['selected_front']]['reward'][window['selected_mission']]['encryptions'];
  _0xdbf0x15['className'] = 'mission_result_award_item_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x15);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'mission_result_award_item';
  var _0xdbf0xc8 = document['createElement']('div');
  _0xdbf0xc8['className'] = 'mission_result_award_item_img';
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/coin_2.png';
  _0xdbf0xc8['appendChild'](_0xdbf0x90);
  _0xdbf0x8e['appendChild'](_0xdbf0xc8);
  var _0xdbf0x15 = document['createElement']('div');
  _0xdbf0x15['innerHTML'] = 'x' + window['fronts'][window['selected_front']]['reward'][window['selected_mission']]['coins'];
  _0xdbf0x15['className'] = 'mission_result_award_item_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x15);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  _0xdbf0x36['getElementsByClassName']('mission_result_get_button')[0]['onclick'] = win_mission;
  var _0xdbf0x57 = document['getElementById']('mission_result_share');
  if (window['player']['settings']['share_missions'] == 1) {
    _0xdbf0x57['checked'] = true
  } else {
    _0xdbf0x57['checked'] = false
  };
  _0xdbf0x57['onchange'] = function() {
    change_share('missions')
  };
  show_modal('mission_result', 680);
  if (window['player']['static_resources']['tutorial'] == 5) {
    var _0xdbf0x39c = document['getElementById']('modal_close');
    _0xdbf0x39c['onclick'] = ''
  }
}

function change_share(_0xdbf0x16f) {
  if (window['player']['settings']['share_' + _0xdbf0x16f] == 1) {
    window['player']['settings']['share_' + _0xdbf0x16f] = 0
  } else {
    if (window['player']['settings']['share_' + _0xdbf0x16f] == 0) {
      window['player']['settings']['share_' + _0xdbf0x16f] = 1
    }
  };
  server_action('settings.share_' + _0xdbf0x16f, {
    ['share_' + _0xdbf0x16f]: window['player']['settings']['share_' + _0xdbf0x16f]
  })
}

function win_mission() {
  window['player']['missions'][window['selected_front']][window['selected_mission']]['win_count']++;
  window['player']['achievements']['mission_' + window['selected_front'] + '_' + window['selected_mission']]++;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['missions'][window['selected_front']][window['selected_mission']]['sectors']['length']; _0xdbf0x4++) {
    window['player']['missions'][window['selected_front']][window['selected_mission']]['sectors'][_0xdbf0x4] = 0
  };
  window['player']['static_resources']['encryptions'] += window['fronts'][window['selected_front']]['reward'][window['selected_mission']]['encryptions'];
  window['player']['achievements']['encryptions'] += window['fronts'][window['selected_front']]['reward'][window['selected_mission']]['encryptions'];
  window['player']['static_resources']['coins'] += window['fronts'][window['selected_front']]['reward'][window['selected_mission']]['coins'];
  window['player']['achievements']['coins'] += window['fronts'][window['selected_front']]['reward'][window['selected_mission']]['coins'];
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  update_static_resources_coins();
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += window['fronts'][window['selected_front']]['reward'][window['selected_mission']]['coins'];
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'missions') {
      if (window['selected_front'] == window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['front'] && window['selected_mission'] == window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['mission']) {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += 1;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  hide_modal('mission_result');
  window['player']['experiences']['experience']['amount'] += window['fronts'][window['selected_front']]['reward'][window['selected_mission']]['experience'];
  server_action('missions.win', {
    "front": window['selected_front'],
    "mission": window['selected_mission']
  });
  update_level(0);
  winned_mission();
  if (document['getElementById']('mission_result_share')['checked']) {
    post_wall('missions', window['selected_front'] + '_' + window['selected_mission'])
  }
}

function post_wall(_0xdbf0x16f, _0xdbf0x131) {
  var _0xdbf0x10a = {};
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (window['friends'][_0xdbf0x4]['id'] == window['game_login']) {
      _0xdbf0x10a = window['friends'][_0xdbf0x4]['profile']
    }
  };
  switch (_0xdbf0x16f) {
    case 'missions':
      var _0xdbf0x12 = _0xdbf0x131['split']('_');
      var _0xdbf0x168 = 'Пройдена миссия "' + window['fronts'][_0xdbf0x12[0]]['missions'][_0xdbf0x12[1]] + '". А сколько секторов ты сможешь освободить?';
      var _0xdbf0x3a0 = [
        [457239126, 457239160, 457239128, 457239129, 457239130, 457239131, 457239132],
        [457239133, 457239134, 457239135, 457239136, 457239137, 457239138, 457239139],
        [457239140, 457239141, 457239142, 457239143, 457239144, 457239145, 457239146],
        [457239169, 457239170, 457239171, 457239172, 457239173, 457239174, 457239175]
      ];
      var _0xdbf0x3a1 = _0xdbf0x3a0[_0xdbf0x12[0]][_0xdbf0x12[1]];
      break;
    case 'help_raid':
      var _0xdbf0x168 = 'Друзья! Мне срочно необходима ваша помощь в битве с боссом "' + window['bosses'][_0xdbf0x131]['short_name'] + '". Враг наступает по всем фронтам!';
      var _0xdbf0x3a0 = [457239116, 457239117, 457239118, 457239119, 457239120, 457239121, 457239122, 457239123, 457239124, 457239125, -1, -1, -1, -1, 457239161, 457239162];
      var _0xdbf0x3a1 = _0xdbf0x3a0[_0xdbf0x131];
      break;
    case 'new_level':
      if (_0xdbf0x10a['sex'] == 1) {
        var _0xdbf0x168 = 'Я достигла ' + _0xdbf0x131 + ' уровня. А как высоко ты заберёшься?'
      } else {
        if (_0xdbf0x10a['sex'] == 2) {
          var _0xdbf0x168 = 'Я достиг ' + _0xdbf0x131 + ' уровня. А как высоко ты заберёшься?'
        }
      };
      var _0xdbf0x3a1 = 457239147;
      break;
    case 'win_raid':
      if (_0xdbf0x10a['sex'] == 1) {
        var _0xdbf0x168 = 'Я одержала победу над боссом "' + window['bosses'][_0xdbf0x131]['short_name'] + '". А как далеко ты продвинешься на фронте?'
      } else {
        if (_0xdbf0x10a['sex'] == 2) {
          var _0xdbf0x168 = 'Я одержал победу над боссом "' + window['bosses'][_0xdbf0x131]['short_name'] + '". А как далеко ты продвинешься на фронте?'
        }
      };
      var _0xdbf0x3a0 = [457239148, 457239149, 457239150, 457239151, 457239152, 457239153, 457239154, 457239155, 457239156, 457239157, -1, -1, -1, -1, 457239163, 457239164, -1, 457239168];
      var _0xdbf0x3a1 = _0xdbf0x3a0[_0xdbf0x131];
      break;
    case 'top_boss':
      var _0xdbf0x12 = _0xdbf0x131['split']('_');
      if (_0xdbf0x10a['sex'] == 1) {
        var _0xdbf0x168 = 'Я получила ' + _0xdbf0x12[0] + ' место в топе по боссу "' + window['bosses'][_0xdbf0x12[1]]['short_name'] + '". А сколько вражеских отрядов ты сможешь победить?'
      } else {
        if (_0xdbf0x10a['sex'] == 2) {
          var _0xdbf0x168 = 'Я получил ' + _0xdbf0x12[0] + ' место в топе по боссу "' + window['bosses'][_0xdbf0x12[1]]['short_name'] + '". А сколько вражеских отрядов ты сможешь победить?'
        }
      };
      var _0xdbf0x3a1 = 457239158;
      break;
    case 'top_damage':
      if (_0xdbf0x10a['sex'] == 1) {
        var _0xdbf0x168 = 'Я получила ' + _0xdbf0x131 + ' место в топе по урону. А сколько ты сможешь нанести урона по врагам?'
      } else {
        if (_0xdbf0x10a['sex'] == 2) {
          var _0xdbf0x168 = 'Я получил ' + _0xdbf0x131 + ' место в топе по урону. А сколько ты сможешь нанести урона по врагам?'
        }
      };
      var _0xdbf0x3a1 = 457239159;
      break
  };
  VK['api']('wall.post', {
    "owner_id": window['game_login'],
    "message": _0xdbf0x168,
    "attachments": 'photo379285226_' + _0xdbf0x3a1 + ',https://vk.com/app8016542'
  })
}

function winned_mission() {
  show_homeland();
  if (window['player']['static_resources']['tutorial'] != 5) {
    show_missions()
  }
}

function select_mission() {
  play_effect('click.mp3');
  if (window['player']['static_resources']['tutorial'] == 2) {
    window['player']['static_resources']['tutorial']++;
    var _0xdbf0x36 = document['getElementsByClassName']('sector_map')[0];
    _0xdbf0x36['getElementsByClassName']('modal_close')[0]['style']['display'] = 'none';
    var _0xdbf0x36 = document['getElementsByClassName']('missions_map')[0];
    _0xdbf0x36['getElementsByClassName']('mission_sector')[0]['style']['pointerEvents'] = '';
    _0xdbf0x36['getElementsByClassName']('mission_sector_frame')[0]['style']['background'] = '';
    tutorial_arrow_stop();
    show_tutorial(3)
  };
  document['getElementsByClassName']('front_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('mission_footer_block')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('missions_map')[0]['style']['display'] = 'none';
  document['getElementById']('sector_map')['style']['display'] = 'block';
  document['getElementsByClassName']('game_block')[0]['style']['zIndex'] = '2';
  if (window['player']['static_resources']['tutorial'] != 3) {
    document['getElementsByClassName']('sector_map')[0]['getElementsByClassName']('modal_close')[0]['onclick'] = winned_mission
  };
  if (window['selected_front'] == 0) {
    var _0xdbf0x3a4 = 'kursk'
  } else {
    if (window['selected_front'] == 1) {
      var _0xdbf0x3a4 = 'stalingrad'
    } else {
      if (window['selected_front'] == 2) {
        var _0xdbf0x3a4 = 'sevastopol'
      } else {
        if (window['selected_front'] == 3) {
          var _0xdbf0x3a4 = 'brest'
        }
      }
    }
  };
  document['getElementById']('sector_map')['className'] = 'sector_map ' + _0xdbf0x3a4 + '_front';
  var _0xdbf0x3a5 = document['getElementById']('origin');
  _0xdbf0x3a5['className'] = 'mission_' + this['dataset']['mid'] + '_original';
  _0xdbf0x3a5['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/missions/mission_' + window['selected_front'] + '_' + this['dataset']['mid'] + '/full.jpg';
  document['getElementById']('sector_common')['className'] = 'mission_' + this['dataset']['mid'];
  window['selected_mission'] = parseInt(this['dataset']['mid']);
  update_mission();
  var _0xdbf0x55 = document['getElementsByClassName']('mission_footer_wraper')[0]['getElementsByClassName']('mission_helper_item');
  _0xdbf0x55[2]['onclick'] = show_collections;
  update_missons_buttons()
}

function update_missons_buttons() {
  var _0xdbf0x55 = document['getElementsByClassName']('mission_footer_wraper')[0]['getElementsByClassName']('mission_helper_item');
  if (window['player']['static_resources']['airstrike'] == 10) {
    _0xdbf0x55[0]['style']['cursor'] = 'pointer';
    _0xdbf0x55[0]['onclick'] = airstrike
  } else {
    _0xdbf0x55[0]['style']['cursor'] = 'default';
    _0xdbf0x55[0]['onclick'] = ''
  };
  var _0xdbf0x36 = _0xdbf0x55[0]['getElementsByClassName']('mission_helper_item_image')[0];
  _0xdbf0x36['className'] = 'mission_helper_item_image ' + 'gs' + (window['player']['static_resources']['airstrike'] * 10);
  var _0xdbf0x36 = _0xdbf0x55[0]['getElementsByClassName']('mission_helper_availability')[0];
  _0xdbf0x36['className'] = 'mission_helper_availability ' + 'h' + (window['player']['static_resources']['airstrike'] * 10);
  _0xdbf0x55[0]['getElementsByClassName']('mission_helper_availability_count')[0]['innerHTML'] = (window['player']['static_resources']['airstrike'] * 10) + '%';
  if (window['player']['static_resources']['ammunition'] == 10) {
    _0xdbf0x55[1]['style']['cursor'] = 'pointer';
    _0xdbf0x55[1]['onclick'] = ammunition_exchange
  } else {
    _0xdbf0x55[1]['style']['cursor'] = 'default';
    _0xdbf0x55[1]['onclick'] = ''
  };
  var _0xdbf0x36 = _0xdbf0x55[1]['getElementsByClassName']('mission_helper_item_image')[0];
  _0xdbf0x36['className'] = 'mission_helper_item_image ' + 'gs' + (window['player']['static_resources']['ammunition'] * 10);
  var _0xdbf0x36 = _0xdbf0x55[1]['getElementsByClassName']('mission_helper_availability')[0];
  _0xdbf0x36['className'] = 'mission_helper_availability ' + 'h' + (window['player']['static_resources']['ammunition'] * 10);
  _0xdbf0x55[1]['getElementsByClassName']('mission_helper_availability_count')[0]['innerHTML'] = (window['player']['static_resources']['ammunition'] * 10) + '%'
}

function ammunition_exchange() {
  window['player']['boxes']['push']({
    "id": window['player']['static_resources']['boxes_id']++,
    "open_time": get_current_timestamp(),
    "type": 1
  });
  window['player']['static_resources']['ammunition'] = 0;
  update_missons_buttons();
  server_action('missions.ammunition', {});
  var _0xdbf0x9a = window['player']['static_resources']['boxes_id'] - 1;
  server_action_fast('boxes.open', {
    "box": _0xdbf0x9a
  }, 'opened_ammunition')
}

function opened_ammunition(_0xdbf0x12) {
  var check_level = 0;
  document['getElementsByClassName']('header')[0]['style']['zIndex'] = '4';
  var _0xdbf0x36 = document['getElementsByClassName']('open_box')[0];
  _0xdbf0x36['getElementsByClassName']('modal_header')[0]['innerHTML'] = 'Боезапас';
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('boxes_awards_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x192 = {
    "coins": 'Монеты',
    "experience": 'Опыт',
    "tokens": 'Жетоны',
    "supply": 'Снабжение',
    "weapon_0": 'Трассирующие',
    "weapon_1": 'Осколочные',
    "weapon_2": 'Разрывные',
    "weapon_3": 'Зажигательные',
    "weapon_4": 'Фугасные',
    "weapon_5": 'Бронебойные',
    "weapon_6": 'Кумулятивные'
  };
  var _0xdbf0x155 = 0;
  var _0xdbf0x156 = 0;
  var _0xdbf0x193 = 0;
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d == 'coins' || _0xdbf0x7d == 'experience' || _0xdbf0x7d == 'tokens' || _0xdbf0x7d == 'supply' || _0xdbf0x7d == 'weapon_0' || _0xdbf0x7d == 'weapon_1' || _0xdbf0x7d == 'weapon_2' || _0xdbf0x7d == 'weapon_3' || _0xdbf0x7d == 'weapon_4' || _0xdbf0x7d == 'weapon_5' || _0xdbf0x7d == 'weapon_6') {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'boxes_awards_item boxes_awards_type_res';
      var _0xdbf0x8f = document['createElement']('div');
      _0xdbf0x8f['className'] = 'boxes_awards_item_icon';
      var _0xdbf0x90 = document['createElement']('img');
      if (_0xdbf0x7d == 'weapon_0' || _0xdbf0x7d == 'weapon_1' || _0xdbf0x7d == 'weapon_2' || _0xdbf0x7d == 'weapon_3' || _0xdbf0x7d == 'weapon_4' || _0xdbf0x7d == 'weapon_5' || _0xdbf0x7d == 'weapon_6') {
        var _0xdbf0x42 = _0xdbf0x7d['split']('_');
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w' + (parseInt(_0xdbf0x42[1]) + 4) + '-3.png'
      } else {
        if (_0xdbf0x7d == 'coins') {
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/coin_3.png'
        } else {
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/' + _0xdbf0x7d + '_2.png'
        }
      };
      _0xdbf0x8f['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x8f);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = '+' + _0xdbf0x12['box_reward'][_0xdbf0x7d];
      _0xdbf0x15['className'] = 'boxes_awards_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['innerHTML'] = _0xdbf0x192[_0xdbf0x7d];
      _0xdbf0x3d['className'] = 'boxes_awards_item_name';
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      if (_0xdbf0x7d == 'tokens') {
        _0xdbf0x155 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
        window['player']['static_resources']['tokens'] += _0xdbf0x155;
        window['player']['achievements']['tokens'] += _0xdbf0x155
      } else {
        if (_0xdbf0x7d == 'coins') {
          _0xdbf0x156 = _0xdbf0x12['box_reward'][_0xdbf0x7d];
          window['player']['static_resources']['coins'] += _0xdbf0x156;
          window['player']['achievements']['coins'] += _0xdbf0x156
        } else {
          if (_0xdbf0x7d == 'supply') {
            var _0xdbf0x78 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
            _0xdbf0x78 += _0xdbf0x12['box_reward'][_0xdbf0x7d];
            window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x78;
            window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
            _0xdbf0x193 = 1
          } else {
            if (_0xdbf0x7d == 'experience') {
              window['player']['experiences']['experience']['amount'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
              check_level = 1
            } else {
              if (_0xdbf0x7d == 'weapon_0') {
                window['player']['static_resources']['weapon_0'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                window['player']['achievements']['weapon_0'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
              } else {
                if (_0xdbf0x7d == 'weapon_1') {
                  window['player']['static_resources']['weapon_1'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                  window['player']['achievements']['weapon_1'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                } else {
                  if (_0xdbf0x7d == 'weapon_2') {
                    window['player']['static_resources']['weapon_2'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                    window['player']['achievements']['weapon_2'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                  } else {
                    if (_0xdbf0x7d == 'weapon_3') {
                      window['player']['static_resources']['weapon_3'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                      window['player']['achievements']['weapon_3'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                    } else {
                      if (_0xdbf0x7d == 'weapon_4') {
                        window['player']['static_resources']['weapon_4'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                        window['player']['achievements']['weapon_4'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                      } else {
                        if (_0xdbf0x7d == 'weapon_5') {
                          window['player']['static_resources']['weapon_5'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                          window['player']['achievements']['weapon_5'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                        } else {
                          if (_0xdbf0x7d == 'weapon_6') {
                            window['player']['static_resources']['weapon_6'] += _0xdbf0x12['box_reward'][_0xdbf0x7d];
                            window['player']['achievements']['weapon_6'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  if (_0xdbf0x155 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_tokens') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x155;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  if (_0xdbf0x156 > 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += _0xdbf0x156;
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  };
  var _0xdbf0x194 = 0;
  for (var _0xdbf0x7d in _0xdbf0x12['box_reward']) {
    if (_0xdbf0x7d != 'coins' && _0xdbf0x7d != 'experience' && _0xdbf0x7d != 'tokens' && _0xdbf0x7d != 'supply' && _0xdbf0x7d != 'weapon_0' && _0xdbf0x7d != 'weapon_1' && _0xdbf0x7d != 'weapon_2' && _0xdbf0x7d != 'weapon_3' && _0xdbf0x7d != 'weapon_4' && _0xdbf0x7d != 'weapon_5' && _0xdbf0x7d != 'weapon_6') {
      var _0xdbf0x42 = _0xdbf0x7d['split']('_');
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'boxes_awards_item boxes_awards_type_' + _0xdbf0x42[1];
      var _0xdbf0x8f = document['createElement']('div');
      _0xdbf0x8f['className'] = 'boxes_awards_item_icon';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/' + _0xdbf0x42[1] + '/' + _0xdbf0x42[2] + '.png';
      _0xdbf0x8f['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x8f);
      var _0xdbf0x16f = document['createElement']('div');
      _0xdbf0x16f['className'] = 'boxes_awards_item_type';
      var _0xdbf0x195 = document['createElement']('img');
      _0xdbf0x195['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/type_' + _0xdbf0x42[1] + '.png';
      _0xdbf0x16f['appendChild'](_0xdbf0x195);
      _0xdbf0x8e['appendChild'](_0xdbf0x16f);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = '+' + _0xdbf0x12['box_reward'][_0xdbf0x7d];
      _0xdbf0x15['className'] = 'boxes_awards_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['innerHTML'] = window['cards'][_0xdbf0x42[1]][_0xdbf0x42[2]]['name'];
      _0xdbf0x3d['className'] = 'boxes_awards_item_name';
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      _0xdbf0x55['appendChild'](_0xdbf0x8e);
      if (window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]) {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]]['count'] += _0xdbf0x12['box_reward'][_0xdbf0x7d]
      } else {
        window['player']['hangar'][_0xdbf0x42[1]][_0xdbf0x42[2]] = {
          "count": _0xdbf0x12['box_reward'][_0xdbf0x7d],
          "get_time": get_current_timestamp(),
          "last_get_time": get_current_timestamp(),
          "level": 0
        };
        window['player']['static_resources']['sut'] += 1;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['top_sut']['length']; _0xdbf0x4++) {
          if (window['top_sut'][_0xdbf0x4]['id'] == window['game_login']) {
            window['top_sut'][_0xdbf0x4]['static_resources']['sut']++
          }
        };
        if (window['friends_mode'] == 2) {
          window['friends_mode'] = 0;
          change_friends_mode(2)
        };
        document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
        window['player']['static_resources']['boost_free_hit_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w0'];
        window['player']['static_resources']['boost_free_hit_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w1'];
        window['player']['static_resources']['boost_free_hit_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w2'];
        window['player']['static_resources']['boost_weapon_0'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w3'];
        window['player']['static_resources']['boost_weapon_1'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w4'];
        window['player']['static_resources']['boost_weapon_2'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w5'];
        window['player']['static_resources']['boost_weapon_3'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w6'];
        window['player']['static_resources']['boost_weapon_4'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w7'];
        window['player']['static_resources']['boost_weapon_5'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w8'];
        window['player']['static_resources']['boost_weapon_6'] += window['cards_upgrade'][_0xdbf0x42[1]][0]['w9']
      }
    };
    _0xdbf0x194++
  };
  document['getElementsByClassName']('sut_block')[0]['getElementsByClassName']('default_count')[0]['innerHTML'] = window['player']['static_resources']['sut'];
  if (_0xdbf0x194 <= 8) {
    show_modal('open_box', 454)
  } else {
    if (_0xdbf0x194 == 9 || _0xdbf0x194 == 10) {
      show_modal('open_box', 563)
    } else {
      if (_0xdbf0x194 == 11 || _0xdbf0x194 == 12) {
        show_modal('open_box', 671)
      } else {
        if (_0xdbf0x194 == 13 || _0xdbf0x194 == 14) {
          show_modal('open_box', 778)
        } else {
          if (_0xdbf0x194 == 15 || _0xdbf0x194 == 16) {
            show_modal('open_box', 886)
          }
        }
      }
    }
  };
  document['getElementById']('modal_close')['onclick'] = function() {
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '5';
    close_open_ammunition(_0xdbf0x12['open_box_id'])
  };
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('boxes_awards_button')[0];
  _0xdbf0x9f['onclick'] = function() {
    document['getElementsByClassName']('header')[0]['style']['zIndex'] = '5';
    close_open_ammunition(_0xdbf0x12['open_box_id'])
  };
  if (_0xdbf0x193 == 1) {
    update_renewable_resources_supply()
  };
  if (_0xdbf0x156 > 0) {
    update_static_resources_coins()
  };
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
    if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'open_box') {
      window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += 1;
      if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
        window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
        window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
      }
    }
  };
  if (check_level == 1) {
    update_level(0)
  }
}

function close_open_ammunition(_0xdbf0x9b) {
  hide_modal('open_box');
  var _0xdbf0x7d = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['boxes']['length']; _0xdbf0x4++) {
    if (window['player']['boxes'][_0xdbf0x4]['id'] == _0xdbf0x9b) {
      _0xdbf0x7d = _0xdbf0x4
    }
  };
  window['player']['boxes']['splice'](_0xdbf0x7d, 1)
}

function airstrike() {
  if (window['player']['static_resources']['airstrike'] == 10) {
    var _0xdbf0x13f = 0;
    var _0xdbf0x3ab = window['power_airstrike'] + window['player']['static_resources']['boost_damage_airstrike'];
    var _0xdbf0x36f = [];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['fronts'][window['selected_front']]['sectors'][window['selected_mission']]['length']; _0xdbf0x4++) {
      if (window['player']['missions'][window['selected_front']][window['selected_mission']]['sectors'][_0xdbf0x4] < window['fronts'][window['selected_front']]['sectors'][window['selected_mission']][_0xdbf0x4]) {
        var _0xdbf0x371 = window['fronts'][window['selected_front']]['sectors'][window['selected_mission']][_0xdbf0x4] - window['player']['missions'][window['selected_front']][window['selected_mission']]['sectors'][_0xdbf0x4];
        if (_0xdbf0x3ab < _0xdbf0x371) {
          var _0xdbf0xa6 = _0xdbf0x3ab
        } else {
          var _0xdbf0xa6 = _0xdbf0x371
        };
        _0xdbf0x3ab -= _0xdbf0xa6;
        window['player']['missions'][window['selected_front']][window['selected_mission']]['sectors'][_0xdbf0x4] += _0xdbf0xa6;
        _0xdbf0x13f = 1;
        if (_0xdbf0xa6 > 0) {
          _0xdbf0x36f['push'](_0xdbf0x4)
        }
      }
    };
    if (_0xdbf0x13f == 1) {
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x36f['length']; _0xdbf0x4++) {
        generate_an_damage(_0xdbf0x36f[_0xdbf0x4])
      };
      play_effect('explosion.mp3');
      setTimeout(update_mission, 1200)
    };
    window['player']['static_resources']['airstrike'] = 0;
    update_missons_buttons();
    server_action('missions.airstrike', {
      "front": window['selected_front'],
      "mission": window['selected_mission']
    })
  }
}

function generate_an_damage(_0xdbf0x371) {
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/animation/damage/1.png';
  document['getElementById']('sector_common')['getElementsByClassName']('sector_' + _0xdbf0x371)[0]['appendChild'](_0xdbf0x90);
  setTimeout(an_damage_next, 15, _0xdbf0x90, 1)
}

function show_collections() {
  show_my_profile();
  change_my_profile_menu_2()
}

function show_missions() {
  play_effect('click.mp3');
  play_music('background.mp3');
  window['loc_page'] = '';
  if (window['player']['static_resources']['tutorial'] == 1) {
    var _0xdbf0x9f = document['getElementById']('main_missions');
    _0xdbf0x9f['style']['pointerEvents'] = '';
    _0xdbf0x9f['style']['opacity'] = '';
    window['player']['static_resources']['tutorial']++;
    tutorial_arrow_stop();
    show_tutorial(2)
  };
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('bosses_map')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('front_block')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('mission_footer_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('missions_map')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('friends_block')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('main')[0]['className'] = 'main missions_map_bg';
  var _0xdbf0x81 = document['getElementById']('arrow_prev');
  _0xdbf0x81['style']['left'] = '-22px';
  _0xdbf0x81['onclick'] = front_list_prev;
  _0xdbf0x81 = document['getElementById']('arrow_next');
  _0xdbf0x81['style']['right'] = '-22px';
  _0xdbf0x81['onclick'] = front_list_next;
  var _0xdbf0x36 = document['getElementsByClassName']('fronts_list')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('front_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['dataset']['unav'] != 1) {
      _0xdbf0x55[_0xdbf0x4]['onclick'] = select_front
    }
  };
  var _0xdbf0x3af = parseInt(_0xdbf0x36['dataset']['lfront']);
  if (_0xdbf0x3af > 6) {
    document['getElementById']('arrow_prev')['style']['left'] = '-22px'
  } else {
    document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
  };
  if ((_0xdbf0x3af + 1) < window['count_fronts']) {
    document['getElementById']('arrow_next')['style']['right'] = '-22px'
  } else {
    document['getElementById']('arrow_next')['style']['right'] = '-9999px'
  };
  var _0xdbf0x3b0 = window['selected_front'];
  if (_0xdbf0x3b0 < 0) {
    _0xdbf0x3b0 = 0
  };
  _0xdbf0x55[_0xdbf0x3b0]['onclick']();
  if (window['player']['static_resources']['tutorial'] == 2) {
    document['getElementsByClassName']('missions_map')[0]['getElementsByClassName']('modal_close')[0]['style']['display'] = 'none'
  };
  if (window['player']['static_resources']['tutorial'] != 2) {
    document['getElementsByClassName']('missions_map')[0]['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
      play_effect('click.mp3');
      show_homeland()
    }
  }
}

function front_list_prev() {
  var _0xdbf0x36 = document['getElementsByClassName']('fronts_list')[0];
  var _0xdbf0x3af = parseInt(_0xdbf0x36['dataset']['lfront']);
  if (_0xdbf0x3af > 6) {
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('front_item');
    var _0xdbf0x6 = _0xdbf0x3af % 7;
    var _0xdbf0xd7 = (_0xdbf0x3af - _0xdbf0x6) - 7;
    if (_0xdbf0x6 == 0) {
      _0xdbf0xd7 -= 7
    };
    if (_0xdbf0xd7 < 0) {
      _0xdbf0xd7 = 0
    };
    var _0xdbf0x15 = 7;
    var _0xdbf0x234 = _0xdbf0xd7 + _0xdbf0x15;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      if (_0xdbf0x4 >= _0xdbf0xd7 && _0xdbf0x4 < _0xdbf0x234) {
        _0xdbf0x55[_0xdbf0x4]['style']['display'] = 'block'
      } else {
        _0xdbf0x55[_0xdbf0x4]['style']['display'] = 'none'
      }
    };
    _0xdbf0x36['dataset']['lfront'] = _0xdbf0x234 - 1
  };
  _0xdbf0x3af = parseInt(_0xdbf0x36['dataset']['lfront']);
  if (_0xdbf0x3af > 6) {
    document['getElementById']('arrow_prev')['style']['left'] = '-22px'
  } else {
    document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
  };
  if ((_0xdbf0x3af + 1) < window['count_fronts']) {
    document['getElementById']('arrow_next')['style']['right'] = '-22px'
  } else {
    document['getElementById']('arrow_next')['style']['right'] = '-9999px'
  }
}

function front_list_next() {
  var _0xdbf0x36 = document['getElementsByClassName']('fronts_list')[0];
  var _0xdbf0x3af = parseInt(_0xdbf0x36['dataset']['lfront']);
  if ((_0xdbf0x3af + 1) < window['count_fronts']) {
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('front_item');
    var _0xdbf0x15 = 7;
    if ((_0xdbf0x3af + 7) > window['count_fronts']) {
      _0xdbf0x15 = window['count_fronts'] - _0xdbf0x3af - 1
    };
    var _0xdbf0x234 = _0xdbf0x3af + _0xdbf0x15;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      if (_0xdbf0x4 > _0xdbf0x3af && _0xdbf0x4 <= _0xdbf0x234) {
        _0xdbf0x55[_0xdbf0x4]['style']['display'] = 'block'
      } else {
        _0xdbf0x55[_0xdbf0x4]['style']['display'] = 'none'
      }
    };
    _0xdbf0x36['dataset']['lfront'] = _0xdbf0x234
  };
  _0xdbf0x3af = parseInt(_0xdbf0x36['dataset']['lfront']);
  if (_0xdbf0x3af > 6) {
    document['getElementById']('arrow_prev')['style']['left'] = '-22px'
  } else {
    document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
  };
  if ((_0xdbf0x3af + 1) < window['count_fronts']) {
    document['getElementById']('arrow_next')['style']['right'] = '-22px'
  } else {
    document['getElementById']('arrow_next')['style']['right'] = '-9999px'
  }
}

function change_friends_mode(_0xdbf0x3b4) {
  if (window['friends_mode'] != _0xdbf0x3b4 && _0xdbf0x3b4 == 0) {
    document['getElementById']('my_friends')['className'] = 'active';
    document['getElementById']('top_level')['className'] = '';
    document['getElementById']('top_tech')['className'] = '';
    document['getElementById']('arrow_prev')['onclick'] = my_friends_prev;
    document['getElementById']('arrow_next')['onclick'] = my_friends_next;
    window['friends_mode'] = 0;
    var _0xdbf0x22 = 10;
    if (window['friends']['length'] < _0xdbf0x22) {
      _0xdbf0x22 = window['friends']['length']
    };
    window['last_friend'] = _0xdbf0x22 - 1;
    window['friends']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
      if (_0xdbf0x8c['static_resources']['level'] < _0xdbf0x8d['static_resources']['level']) {
        return 1
      } else {
        if (_0xdbf0x8c['static_resources']['level'] > _0xdbf0x8d['static_resources']['level']) {
          return -1
        } else {
          return 0
        }
      }
    });
    var _0xdbf0x14 = window['friends']['slice'](0, _0xdbf0x22);
    update_friends(_0xdbf0x14, 0, 0);
    if ((window['friends']['length'] - 1) > window['last_friend']) {
      document['getElementById']('arrow_next')['style']['right'] = '-22px'
    } else {
      document['getElementById']('arrow_next')['style']['right'] = '-9999px'
    };
    document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
  } else {
    if (window['friends_mode'] != _0xdbf0x3b4 && _0xdbf0x3b4 == 1) {
      document['getElementById']('my_friends')['className'] = '';
      document['getElementById']('top_level')['className'] = 'active';
      document['getElementById']('top_tech')['className'] = '';
      document['getElementById']('arrow_prev')['onclick'] = top_level_prev;
      document['getElementById']('arrow_next')['onclick'] = top_level_next;
      window['friends_mode'] = 1;
      var _0xdbf0x22 = 10;
      if (window['top_level']['length'] < _0xdbf0x22) {
        _0xdbf0x22 = window['top_level']['length']
      };
      window['last_friend2'] = _0xdbf0x22 - 1;
      window['top_level']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
        if (_0xdbf0x8c['static_resources']['level'] < _0xdbf0x8d['static_resources']['level']) {
          return 1
        } else {
          if (_0xdbf0x8c['static_resources']['level'] > _0xdbf0x8d['static_resources']['level']) {
            return -1
          } else {
            return 0
          }
        }
      });
      var _0xdbf0x14 = window['top_level']['slice'](0, _0xdbf0x22);
      update_friends(_0xdbf0x14, 0, 1);
      if ((window['top_level']['length'] - 1) > window['last_friend2']) {
        document['getElementById']('arrow_next')['style']['right'] = '-22px'
      } else {
        document['getElementById']('arrow_next')['style']['right'] = '-9999px'
      };
      document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
    } else {
      if (window['friends_mode'] != _0xdbf0x3b4 && _0xdbf0x3b4 == 2) {
        document['getElementById']('my_friends')['className'] = '';
        document['getElementById']('top_level')['className'] = '';
        document['getElementById']('top_tech')['className'] = 'active';
        document['getElementById']('arrow_prev')['onclick'] = top_sut_prev;
        document['getElementById']('arrow_next')['onclick'] = top_sut_next;
        window['friends_mode'] = 2;
        var _0xdbf0x22 = 10;
        if (window['top_sut']['length'] < _0xdbf0x22) {
          _0xdbf0x22 = window['top_sut']['length']
        };
        window['last_friend3'] = _0xdbf0x22 - 1;
        window['top_sut']['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
          if (_0xdbf0x8c['static_resources']['sut'] < _0xdbf0x8d['static_resources']['sut']) {
            return 1
          } else {
            if (_0xdbf0x8c['static_resources']['sut'] > _0xdbf0x8d['static_resources']['sut']) {
              return -1
            } else {
              return 0
            }
          }
        });
        var _0xdbf0x14 = window['top_sut']['slice'](0, _0xdbf0x22);
        update_friends(_0xdbf0x14, 0, 2);
        if ((window['top_sut']['length'] - 1) > window['last_friend3']) {
          document['getElementById']('arrow_next')['style']['right'] = '-22px'
        } else {
          document['getElementById']('arrow_next')['style']['right'] = '-9999px'
        };
        document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
      }
    }
  }
}

function top_level_prev() {
  play_effect('click.mp3');
  if (window['view_modal'] == 0) {
    var _0xdbf0x6 = window['last_friend2'] % 10;
    var _0xdbf0xd7 = window['last_friend2'] - _0xdbf0x6 - 10;
    if (_0xdbf0xd7 < 0) {
      _0xdbf0xd7 = 0
    };
    var _0xdbf0x234 = _0xdbf0xd7 + 10;
    if (_0xdbf0x234 > (window['top_level']['length'] - 1)) {
      _0xdbf0x234 = window['top_level']['length']
    };
    var _0xdbf0x14 = window['top_level']['slice'](_0xdbf0xd7, _0xdbf0x234);
    update_friends(_0xdbf0x14, _0xdbf0xd7, 1);
    window['last_friend2'] = _0xdbf0x234 - 1;
    if ((window['top_level']['length'] - 1) > window['last_friend2']) {
      document['getElementById']('arrow_next')['style']['right'] = '-22px'
    } else {
      document['getElementById']('arrow_next')['style']['right'] = '-9999px'
    };
    if (_0xdbf0xd7 > 0) {
      document['getElementById']('arrow_prev')['style']['left'] = '-22px'
    } else {
      document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
    }
  }
}

function top_level_next() {
  play_effect('click.mp3');
  if (window['view_modal'] == 0) {
    var _0xdbf0xd7 = window['last_friend2'] + 1;
    if (window['top_level']['length'] < 10) {
      _0xdbf0xd7 = 0
    };
    var _0xdbf0x234 = _0xdbf0xd7 + 10;
    if (_0xdbf0x234 > (window['top_level']['length'] - 1)) {
      _0xdbf0x234 = window['top_level']['length']
    };
    var _0xdbf0x14 = window['top_level']['slice'](_0xdbf0xd7, _0xdbf0x234);
    if (_0xdbf0x14['length'] > 0) {
      update_friends(_0xdbf0x14, _0xdbf0xd7, 1);
      window['last_friend2'] = _0xdbf0x234 - 1
    };
    if ((window['top_level']['length'] - 1) > window['last_friend2']) {
      document['getElementById']('arrow_next')['style']['right'] = '-22px'
    } else {
      document['getElementById']('arrow_next')['style']['right'] = '-9999px'
    };
    if (_0xdbf0xd7 > 0) {
      document['getElementById']('arrow_prev')['style']['left'] = '-22px'
    } else {
      document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
    }
  }
}

function top_sut_prev() {
  play_effect('click.mp3');
  if (window['view_modal'] == 0) {
    var _0xdbf0x6 = window['last_friend3'] % 10;
    var _0xdbf0xd7 = window['last_friend3'] - _0xdbf0x6 - 10;
    if (_0xdbf0xd7 < 0) {
      _0xdbf0xd7 = 0
    };
    var _0xdbf0x234 = _0xdbf0xd7 + 10;
    if (_0xdbf0x234 > (window['top_sut']['length'] - 1)) {
      _0xdbf0x234 = window['top_sut']['length']
    };
    var _0xdbf0x14 = window['top_sut']['slice'](_0xdbf0xd7, _0xdbf0x234);
    update_friends(_0xdbf0x14, _0xdbf0xd7, 2);
    window['last_friend3'] = _0xdbf0x234 - 1;
    if ((window['top_sut']['length'] - 1) > window['last_friend3']) {
      document['getElementById']('arrow_next')['style']['right'] = '-22px'
    } else {
      document['getElementById']('arrow_next')['style']['right'] = '-9999px'
    };
    if (_0xdbf0xd7 > 0) {
      document['getElementById']('arrow_prev')['style']['left'] = '-22px'
    } else {
      document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
    }
  }
}

function top_sut_next() {
  play_effect('click.mp3');
  if (window['view_modal'] == 0) {
    var _0xdbf0xd7 = window['last_friend3'] + 1;
    if (window['top_sut']['length'] < 10) {
      _0xdbf0xd7 = 0
    };
    var _0xdbf0x234 = _0xdbf0xd7 + 10;
    if (_0xdbf0x234 > (window['top_sut']['length'] - 1)) {
      _0xdbf0x234 = window['top_sut']['length']
    };
    var _0xdbf0x14 = window['top_sut']['slice'](_0xdbf0xd7, _0xdbf0x234);
    if (_0xdbf0x14['length'] > 0) {
      update_friends(_0xdbf0x14, _0xdbf0xd7, 2);
      window['last_friend3'] = _0xdbf0x234 - 1
    };
    if ((window['top_sut']['length'] - 1) > window['last_friend3']) {
      document['getElementById']('arrow_next')['style']['right'] = '-22px'
    } else {
      document['getElementById']('arrow_next')['style']['right'] = '-9999px'
    };
    if (_0xdbf0xd7 > 0) {
      document['getElementById']('arrow_prev')['style']['left'] = '-22px'
    } else {
      document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
    }
  }
}

function hide_news(_0xdbf0x10f) {
  if (_0xdbf0x10f == 0) {
    play_effect('click.mp3')
  };
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('news_modal')[0]['style']['display'] = 'none';
  var _0xdbf0x9c = document['getElementById']('news_hide');
  if (_0xdbf0x9c['checked']) {
    window['player']['static_resources']['hide_news'] = 1;
    server_action('news.hide', {})
  };
  var _0xdbf0xd8 = 0;
  for (var _0xdbf0x7d in window['player']['tops']) {
    if (_0xdbf0xd8 == 0 && get_current_timestamp() < window['player']['tops'][_0xdbf0x7d]['time'] + 604800) {
      show_top_reward(_0xdbf0x7d, window['player']['tops'][_0xdbf0x7d]['place']);
      _0xdbf0xd8 = 1
    }
  };
  if (_0xdbf0xd8 == 0) {
    show_daily_reward()
  };
  if (_0xdbf0xd8 == 0) {
    var _0xdbf0x60 = check_level(1);
    if (_0xdbf0x60) {
      _0xdbf0xd8 = 1
    }
  } else {
    check_level(0);
    if (_0xdbf0x60) {
      _0xdbf0xd8 = 1
    }
  };
  if (_0xdbf0xd8 == 0 && window['player']['bonuses']['length'] > 0) {
    show_bonuses()
  }
}

function show_news() {
  var _0xdbf0x2c = [];
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['news']['length']; _0xdbf0x4++) {
    if (get_current_timestamp() < (window['news'][_0xdbf0x4]['start_time'] + window['news'][_0xdbf0x4]['period'])) {
      _0xdbf0x2c['push'](window['news'][_0xdbf0x4])
    }
  };
  window['news'] = _0xdbf0x2c;
  var _0xdbf0x36 = document['getElementsByClassName']('news_modal')[0];
  _0xdbf0x36['getElementsByClassName']('modal_close')[0]['onclick'] = function() {
    hide_news(0)
  };
  if (window['news']['length'] > 0) {
    _0xdbf0x36['dataset']['news_page'] = 0;
    _0xdbf0x36['getElementsByClassName']('news_right_text')[0]['innerHTML'] = window['news'][0]['descr'];
    _0xdbf0x36['getElementsByClassName']('news_right_image')[0]['getElementsByTagName']('img')[0]['src'] = window['news'][0]['image'];
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('news_right_button')[0];
    if (window['news'][0]['action']['length'] != '') {
      var _0xdbf0xd8 = 0;
      if (window['news'][0]['requirement'] == 'level_10') {
        if (window['player']['static_resources']['level'] < 10) {
          _0xdbf0xd8 = 1
        }
      };
      if (_0xdbf0xd8 == 0) {
        _0xdbf0x9f['style']['display'] = 'block';
        _0xdbf0x9f['onclick'] = function() {
          hide_news(1);
          window[window['news'][0]['action']]()
        }
      } else {
        _0xdbf0x9f['style']['display'] = 'none';
        _0xdbf0x9f['onclick'] = ''
      }
    } else {
      _0xdbf0x9f['style']['display'] = 'none';
      _0xdbf0x9f['onclick'] = ''
    };
    if (window['news']['length'] > 1) {
      var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('news_skip')[0];
      _0xdbf0x9f['style']['display'] = 'block';
      _0xdbf0x9f['onclick'] = news_next_page
    };
    document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
    _0xdbf0x36['style']['display'] = 'block';
    var _0xdbf0x9c = document['getElementById']('news_hide');
    _0xdbf0x9c['onchange'] = function() {
      play_effect('click.mp3')
    }
  } else {
    skip_news()
  }
}

function skip_news() {
  var _0xdbf0xd8 = 0;
  for (var _0xdbf0x7d in window['player']['tops']) {
    if (_0xdbf0xd8 == 0 && get_current_timestamp() < window['player']['tops'][_0xdbf0x7d]['time'] + 604800) {
      show_top_reward(_0xdbf0x7d, window['player']['tops'][_0xdbf0x7d]['place']);
      _0xdbf0xd8 = 1
    }
  };
  if (_0xdbf0xd8 == 0) {
    show_daily_reward()
  };
  if (_0xdbf0xd8 == 0) {
    var _0xdbf0x60 = check_level(1);
    if (_0xdbf0x60) {
      _0xdbf0xd8 = 1
    }
  } else {
    check_level(0);
    if (_0xdbf0x60) {
      _0xdbf0xd8 = 1
    }
  };
  if (_0xdbf0xd8 == 0 && window['player']['bonuses']['length'] > 0) {
    show_bonuses()
  }
}

function news_next_page() {
  var _0xdbf0x36 = document['getElementsByClassName']('news_modal')[0];
  var _0xdbf0x11f = parseInt(_0xdbf0x36['dataset']['news_page']);
  if (window['news'][_0xdbf0x11f + 1]) {
    _0xdbf0x11f++
  } else {
    _0xdbf0x11f = 0
  };
  _0xdbf0x36['dataset']['news_page'] = _0xdbf0x11f;
  _0xdbf0x36['getElementsByClassName']('news_right_text')[0]['innerHTML'] = window['news'][_0xdbf0x11f]['descr'];
  _0xdbf0x36['getElementsByClassName']('news_right_image')[0]['getElementsByTagName']('img')[0]['src'] = window['news'][_0xdbf0x11f]['image'];
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('news_right_button')[0];
  if (window['news'][_0xdbf0x11f]['action']['length'] != '') {
    var _0xdbf0xd8 = 0;
    if (window['news'][0]['requirement'] == 'level_10') {
      if (window['player']['static_resources']['level'] < 10) {
        _0xdbf0xd8 = 1
      }
    };
    if (_0xdbf0xd8 == 0) {
      _0xdbf0x9f['style']['display'] = 'block';
      _0xdbf0x9f['onclick'] = function() {
        hide_news(1);
        window[window['news'][_0xdbf0x11f]['action']]()
      }
    } else {
      _0xdbf0x9f['style']['display'] = 'none';
      _0xdbf0x9f['onclick'] = ''
    }
  } else {
    _0xdbf0x9f['style']['display'] = 'none';
    _0xdbf0x9f['onclick'] = ''
  }
}

function start_level() {
  var _0xdbf0x38 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['levels']['length']; _0xdbf0x4++) {
    if (window['player']['experiences']['experience']['amount'] >= window['levels'][_0xdbf0x4]) {
      _0xdbf0x38++
    }
  };
  window['player']['static_resources']['level'] = _0xdbf0x38;
  var _0xdbf0x5f = document['getElementById']('level_profile');
  _0xdbf0x5f['innerHTML'] = window['player']['static_resources']['level']
}

function show_game() {
  var _0xdbf0x3bf = document['getElementById']('loader');
  _0xdbf0x3bf['parentNode']['removeChild'](_0xdbf0x3bf);
  start_level();
  var _0xdbf0xd8 = 0;
  if (window['player']['static_resources']['hide_news'] == 0) {
    show_news();
    _0xdbf0xd8 = 1
  };
  for (var _0xdbf0x7d in window['player']['tops']) {
    if (_0xdbf0xd8 == 0 && get_current_timestamp() < window['player']['tops'][_0xdbf0x7d]['time'] + 604800) {
      show_top_reward(_0xdbf0x7d, window['player']['tops'][_0xdbf0x7d]['place']);
      _0xdbf0xd8 = 1
    }
  };
  if (window['player']['static_resources']['tutorial'] == 0 || window['player']['static_resources']['tutorial'] == 5 || window['player']['static_resources']['tutorial'] == 11 || window['player']['static_resources']['tutorial'] == 17 || window['player']['static_resources']['tutorial'] == 22) {
    _0xdbf0xd8 = 1
  };
  if (_0xdbf0xd8 == 0) {
    show_daily_reward()
  };
  if (_0xdbf0xd8 == 0) {
    var _0xdbf0x60 = check_level(1);
    if (_0xdbf0x60) {
      _0xdbf0xd8 = 1
    }
  } else {
    var _0xdbf0x60 = check_level(0);
    if (_0xdbf0x60) {
      _0xdbf0xd8 = 1
    }
  };
  if (_0xdbf0xd8 == 0 && window['player']['bonuses']['length'] > 0) {
    show_bonuses()
  };
  play_music('background.mp3');
  if (window['player']['static_resources']['tutorial'] == 0 || window['player']['static_resources']['tutorial'] == 5 || window['player']['static_resources']['tutorial'] == 11 || window['player']['static_resources']['tutorial'] == 17 || window['player']['static_resources']['tutorial'] == 22) {
    show_tutorial(window['player']['static_resources']['tutorial'])
  }
}

function show_bonuses() {
  var _0xdbf0x36 = document['getElementsByClassName']('gifts')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('gifts_award')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x192 = ['Снабжение', 'Жетоны', 'Шифровки', 'Монеты'];
  var _0xdbf0x128 = ['supply_2.png', 'tokens_3.png', 'encryptions_3.png', 'coin_3.png'];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['bonuses']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'gifts_award_item awards_type_1';
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'gifts_award_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/' + _0xdbf0x128[window['player']['bonuses'][_0xdbf0x4]['resource']];
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0xa6 = document['createElement']('div');
    _0xdbf0xa6['innerHTML'] = '+' + window['player']['bonuses'][_0xdbf0x4]['amount'];
    _0xdbf0xa6['className'] = 'gifts_award_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0xa6);
    var _0xdbf0xbe = document['createElement']('div');
    _0xdbf0xbe['innerHTML'] = _0xdbf0x192[window['player']['bonuses'][_0xdbf0x4]['resource']];
    _0xdbf0xbe['className'] = 'gifts_award_item_name';
    _0xdbf0x8e['appendChild'](_0xdbf0xbe);
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  _0xdbf0x36['getElementsByClassName']('gifts_button')[0]['onclick'] = get_bonuses;
  show_modal('gifts', 450)
}

function get_bonuses() {
  hide_modal('gifts');
  server_action('bonuses.get_reward', {});
  var _0xdbf0x3c2 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['bonuses']['length']; _0xdbf0x4++) {
    if (window['player']['bonuses'][_0xdbf0x4]['resource'] == 0) {
      var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
      _0xdbf0x59 += window['player']['bonuses'][_0xdbf0x4]['amount'];
      window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x59;
      window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
      update_renewable_resources_supply()
    } else {
      if (window['player']['bonuses'][_0xdbf0x4]['resource'] == 1) {
        window['player']['static_resources']['tokens'] += window['player']['bonuses'][_0xdbf0x4]['amount'];
        _0xdbf0x3c2 = 1
      } else {
        if (window['player']['bonuses'][_0xdbf0x4]['resource'] == 2) {
          window['player']['static_resources']['encryptions'] += window['player']['bonuses'][_0xdbf0x4]['amount'];
          _0xdbf0x3c2 = 1
        } else {
          if (window['player']['bonuses'][_0xdbf0x4]['resource'] == 3) {
            window['player']['static_resources']['coins'] += window['player']['bonuses'][_0xdbf0x4]['amount'];
            update_static_resources_coins()
          }
        }
      }
    }
  };
  if (_0xdbf0x3c2 == 1) {
    if (window['player']['settings']['resource'] == 0) {
      change_resource('tokens', 0)
    } else {
      change_resource('encryptions', 0)
    }
  }
}

function show_daily_reward() {
  var _0xdbf0x3c4 = expiring_resources(window['player']['expiring_resources']['get_daily_reward'], 1, 86400);
  if (_0xdbf0x3c4 == 0) {
    show_modal('daily_reward_block', 791);
    var _0xdbf0x36 = document['getElementsByClassName']('daily_reward_block')[0];
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('daily_reward_days')[0]['getElementsByTagName']('div');
    _0xdbf0x55[window['player']['static_resources']['daily_day']]['className'] = 'daily_reward_days_num active';
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('daily_reward_list')[0];
    for (var _0xdbf0x7d in window['daily_reward']) {
      var _0xdbf0x8e = document['createElement']('div');
      if (_0xdbf0x7d == window['player']['static_resources']['daily_day']) {
        _0xdbf0x8e['className'] = 'daily_reward_list_item active'
      } else {
        _0xdbf0x8e['className'] = 'daily_reward_list_item'
      };
      var _0xdbf0x8f = document['createElement']('div');
      _0xdbf0x8f['className'] = 'daily_reward_item_icon';
      var _0xdbf0x90 = document['createElement']('img');
      _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/' + window['daily_reward'][_0xdbf0x7d]['icon'] + '.png';
      _0xdbf0x8f['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x8f);
      var _0xdbf0x15 = document['createElement']('div');
      _0xdbf0x15['innerHTML'] = '+' + window['daily_reward'][_0xdbf0x7d]['count'];
      _0xdbf0x15['className'] = 'daily_reward_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0x15);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['innerHTML'] = window['daily_reward'][_0xdbf0x7d]['name'];
      _0xdbf0x3d['className'] = 'daily_reward_item_name';
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      _0xdbf0x55['appendChild'](_0xdbf0x8e)
    };
    document['getElementById']('modal_close')['onclick'] = close_daily_reward;
    var _0xdbf0x1f1 = _0xdbf0x36['getElementsByClassName']('daily_reward_buttons')[0]['getElementsByClassName']('button');
    _0xdbf0x1f1[0]['onclick'] = get_daily_reward;
    _0xdbf0x1f1[1]['onclick'] = close_daily_reward;
    time_daily_reward();
    window['timer'] = setInterval(time_daily_reward, 1000)
  }
}

function close_daily_reward() {
  play_effect('click.mp3');
  clearTimeout(window['timer']);
  hide_modal('daily_reward_block');
  var _0xdbf0xd8 = 0;
  var _0xdbf0x60 = check_level(1);
  if (_0xdbf0x60) {
    _0xdbf0xd8 = 1
  };
  if (_0xdbf0xd8 == 0 && window['player']['bonuses']['length'] > 0) {
    show_bonuses()
  }
}

function time_daily_reward() {
  var _0xdbf0x36 = document['getElementsByClassName']('daily_reward_block')[0];
  var _0xdbf0x137 = _0xdbf0x36['getElementsByClassName']('daily_reward_timer')[0]['getElementsByTagName']('span')[0];
  var _0xdbf0x76 = window['system']['time_resources']['new_day'] - get_current_timestamp();
  var _0xdbf0x6 = _0xdbf0x76 % 3600;
  var _0xdbf0x87 = (_0xdbf0x76 - _0xdbf0x6) / 3600;
  var _0xdbf0x88 = _0xdbf0x6 % 60;
  var _0xdbf0x22 = (_0xdbf0x6 - _0xdbf0x88) / 60;
  if (_0xdbf0x87 > 0) {
    _0xdbf0x137['innerHTML'] = _0xdbf0x87 + 'ч ' + _0xdbf0x22 + 'м'
  } else {
    _0xdbf0x137['innerHTML'] = _0xdbf0x22 + 'м'
  }
}

function get_daily_reward() {
  play_effect('click.mp3');
  clearTimeout(window['timer']);
  if (window['daily_reward'][window['player']['static_resources']['daily_day']]['resource'] == 'coins') {
    window['player']['static_resources']['coins'] += window['daily_reward'][window['player']['static_resources']['daily_day']]['count'];
    update_static_resources_coins();
    window['player']['achievements']['coins'] += window['daily_reward'][window['player']['static_resources']['daily_day']]['count'];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['calendar_tasks'][window['system']['moth']][window['system']['day']]['length']; _0xdbf0x4++) {
      if (window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['type'] == 'get_coins') {
        window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] += window['daily_reward'][window['player']['static_resources']['daily_day']]['count'];
        if (window['player']['calendar'][window['system']['moth']][window['system']['day']][_0xdbf0x4] >= window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['count'] && window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] != 1) {
          window['player']['static_resources']['stamp'] += window['calendar_stamp'][_0xdbf0x4];
          window['calendar_tasks'][window['system']['moth']][window['system']['day']][_0xdbf0x4]['done'] = 1
        }
      }
    }
  } else {
    if (window['daily_reward'][window['player']['static_resources']['daily_day']]['resource'] == 'supply') {
      var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
      _0xdbf0x59 += window['daily_reward'][window['player']['static_resources']['daily_day']]['count'];
      window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x59;
      window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
      update_renewable_resources_supply()
    } else {
      if (window['daily_reward'][window['player']['static_resources']['daily_day']]['resource'] == 'experience') {
        window['player']['experiences']['experience']['amount'] += window['daily_reward'][window['player']['static_resources']['daily_day']]['count']
      } else {
        if (window['daily_reward'][window['player']['static_resources']['daily_day']]['resource'] == 'boxes_2') {
          for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['daily_reward'][window['player']['static_resources']['daily_day']]['count']; _0xdbf0x4++) {
            window['player']['boxes']['push']({
              "id": window['player']['static_resources']['boxes_id']++,
              "open_time": get_current_timestamp(),
              "type": 2
            })
          }
        }
      }
    }
  };
  server_action_fast('daily.get_reward', {}, 'geted_daily_reward');
  hide_modal('daily_reward_block');
  if (window['daily_reward'][window['player']['static_resources']['daily_day']]['resource'] == 'experience') {
    update_level(0)
  }
}

function geted_daily_reward(_0xdbf0x12) {
  if (_0xdbf0x12['daily_reward']) {
    var _0xdbf0x36 = document['getElementsByClassName']('open_box')[0];
    _0xdbf0x36['getElementsByClassName']('modal_header')[0]['innerHTML'] = 'Ваша награда';
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('boxes_awards_list')[0];
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    };
    var _0xdbf0x192 = {
      "weapon_0": 'Трассирующие',
      "weapon_1": 'Осколочные',
      "weapon_2": 'Разрывные',
      "weapon_3": 'Зажигательные',
      "weapon_4": 'Фугасные',
      "weapon_5": 'Бронебойные',
      "weapon_6": 'Кумулятивные'
    };
    for (var _0xdbf0x7d in _0xdbf0x12['daily_reward']) {
      var _0xdbf0x42 = _0xdbf0x7d['split']('_');
      if (_0xdbf0x42[0] == 'weapon') {
        var _0xdbf0x8e = document['createElement']('div');
        _0xdbf0x8e['className'] = 'boxes_awards_item boxes_awards_type_res';
        var _0xdbf0x8f = document['createElement']('div');
        _0xdbf0x8f['className'] = 'boxes_awards_item_icon';
        var _0xdbf0x90 = document['createElement']('img');
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/weapons/shop/w' + (parseInt(_0xdbf0x42[1]) + 4) + '-3.png';
        _0xdbf0x8f['appendChild'](_0xdbf0x90);
        _0xdbf0x8e['appendChild'](_0xdbf0x8f);
        var _0xdbf0x15 = document['createElement']('div');
        _0xdbf0x15['innerHTML'] = '+' + _0xdbf0x12['daily_reward'][_0xdbf0x7d];
        _0xdbf0x15['className'] = 'boxes_awards_item_count';
        _0xdbf0x8e['appendChild'](_0xdbf0x15);
        var _0xdbf0x3d = document['createElement']('div');
        _0xdbf0x3d['innerHTML'] = _0xdbf0x192[_0xdbf0x7d];
        _0xdbf0x3d['className'] = 'boxes_awards_item_name';
        _0xdbf0x8e['appendChild'](_0xdbf0x3d);
        _0xdbf0x55['appendChild'](_0xdbf0x8e);
        window['player']['static_resources'][_0xdbf0x7d] += _0xdbf0x12['daily_reward'][_0xdbf0x7d];
        window['player']['achievements'][_0xdbf0x7d] += _0xdbf0x12['daily_reward'][_0xdbf0x7d]
      } else {
        if (_0xdbf0x42[0] == 'collection') {
          var _0xdbf0x3c9 = parseInt(_0xdbf0x42[1]);
          var _0xdbf0x8e = document['createElement']('div');
          _0xdbf0x8e['className'] = 'boxes_awards_item boxes_awards_type_res';
          var _0xdbf0x8f = document['createElement']('div');
          _0xdbf0x8f['className'] = 'boxes_awards_item_icon';
          var _0xdbf0x90 = document['createElement']('img');
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/collection/' + _0xdbf0x3c9 + '.png';
          _0xdbf0x8f['appendChild'](_0xdbf0x90);
          _0xdbf0x8e['appendChild'](_0xdbf0x8f);
          var _0xdbf0x15 = document['createElement']('div');
          _0xdbf0x15['innerHTML'] = '+' + _0xdbf0x12['daily_reward'][_0xdbf0x7d];
          _0xdbf0x15['className'] = 'boxes_awards_item_count';
          _0xdbf0x8e['appendChild'](_0xdbf0x15);
          var _0xdbf0x3d = document['createElement']('div');
          _0xdbf0x3d['innerHTML'] = 'Коллекция';
          _0xdbf0x3d['className'] = 'boxes_awards_item_name';
          _0xdbf0x8e['appendChild'](_0xdbf0x3d);
          _0xdbf0x55['appendChild'](_0xdbf0x8e);
          window['player']['collections'][_0xdbf0x3c9]['amount'] = _0xdbf0x12['daily_reward'][_0xdbf0x7d]
        }
      }
    };
    show_modal('open_box', 454);
    _0xdbf0x36['getElementsByClassName']('boxes_awards_button')[0]['onclick'] = function() {
      hide_modal('open_box')
    }
  }
}

function show_top_reward(_0xdbf0x2fc, _0xdbf0x3cb) {
  var _0xdbf0x36 = document['getElementsByClassName']('win_top')[0];
  _0xdbf0x36['dataset']['top'] = _0xdbf0x2fc;
  var _0xdbf0x168 = _0xdbf0x36['getElementsByClassName']('modal_text')[0];
  var _0xdbf0x137 = _0xdbf0x168['getElementsByTagName']('span');
  _0xdbf0x168['getElementsByTagName']('i')[0]['innerHTML'] = _0xdbf0x3cb;
  if (_0xdbf0x2fc == 'damage') {
    _0xdbf0x137[0]['innerHTML'] = '<i>урону</i>';
    var _0xdbf0x195 = 'damage';
    var _0xdbf0x3cc = _0xdbf0x3cb
  } else {
    var _0xdbf0x42 = _0xdbf0x2fc['split']('_');
    _0xdbf0x137[0]['innerHTML'] = 'боссу <i>' + window['bosses'][_0xdbf0x42[1]]['short_name'] + '</i>';
    var _0xdbf0x195 = _0xdbf0x42[0];
    var _0xdbf0x3cc = _0xdbf0x3cb + '_' + _0xdbf0x42[1]
  };
  var _0xdbf0x25d = -1;
  var _0xdbf0x3cd = -1;
  var _0xdbf0x30e = -1;
  var _0xdbf0xf0 = -1;
  var _0xdbf0xd8 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['tops_reward'][_0xdbf0x2fc]['length']; _0xdbf0x4++) {
    if (_0xdbf0xd8 == 0) {
      if (window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['place'] && window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['place'] == _0xdbf0x3cb) {
        if (window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['tokens']) {
          _0xdbf0x25d = window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['tokens']
        } else {
          if (window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['experience']) {
            _0xdbf0x3cd = window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['experience']
          }
        };
        if (window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['box_count'] && window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['box_type']) {
          _0xdbf0x30e = window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['box_count'];
          _0xdbf0xf0 = window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['box_type']
        };
        _0xdbf0xd8 = 1
      } else {
        if (window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['place_min'] && window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['place_max'] && _0xdbf0x3cb >= window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['place_min'] && _0xdbf0x3cb <= window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['place_max']) {
          if (window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['tokens']) {
            _0xdbf0x25d = window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['tokens']
          } else {
            if (window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['experience']) {
              _0xdbf0x3cd = window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['experience']
            }
          };
          if (window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['box_count'] && window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['box_type']) {
            _0xdbf0x30e = window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['box_count'];
            _0xdbf0xf0 = window['tops_reward'][_0xdbf0x2fc][_0xdbf0x4]['reward']['box_type']
          };
          _0xdbf0xd8 = 1
        }
      }
    }
  };
  if (_0xdbf0x25d > -1) {
    _0xdbf0x36['getElementsByClassName']('win_top_award_add_item_icon')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/icons/tokens_top.png';
    _0xdbf0x36['getElementsByClassName']('win_top_award_add_item_count')[0]['innerHTML'] = '+' + _0xdbf0x25d['toLocaleString']()
  } else {
    if (_0xdbf0x3cd > -1) {
      _0xdbf0x36['getElementsByClassName']('win_top_award_add_item_icon')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/icons/experience_top.png';
      _0xdbf0x36['getElementsByClassName']('win_top_award_add_item_count')[0]['innerHTML'] = '+' + _0xdbf0x3cd['toLocaleString']()
    }
  };
  if (_0xdbf0x30e > 0 && _0xdbf0xf0 > -1) {
    var _0xdbf0x188 = _0xdbf0x36['getElementsByClassName']('win_top_award_box')[0];
    _0xdbf0x188['getElementsByClassName']('win_top_award_box_image')[0]['className'] = 'win_top_award_box_image box-' + _0xdbf0xf0;
    _0xdbf0x188['getElementsByTagName']('span')[0]['innerHTML'] = 'x' + _0xdbf0x30e
  };
  _0xdbf0x36['getElementsByClassName']('win_top_button')[0]['onclick'] = function() {
    top_reward(_0xdbf0x25d, _0xdbf0x3cd, _0xdbf0xf0, _0xdbf0x30e, _0xdbf0x195, _0xdbf0x3cc)
  };
  var _0xdbf0x57 = document['getElementById']('win_top_share');
  if (window['player']['settings']['share_tops'] == 1) {
    _0xdbf0x57['checked'] = true
  } else {
    _0xdbf0x57['checked'] = false
  };
  _0xdbf0x57['onchange'] = function() {
    change_share('tops')
  };
  show_modal('win_top', 420);
  document['getElementById']('modal_close')['onclick'] = close_top_reward
}

function close_top_reward() {
  play_effect('click.mp3');
  var _0xdbf0x36 = document['getElementsByClassName']('win_top')[0];
  hide_modal('win_top');
  delete window['player']['tops'][_0xdbf0x36['dataset']['top']];
  var _0xdbf0xd8 = 0;
  for (var _0xdbf0x7d in window['player']['tops']) {
    if (_0xdbf0xd8 == 0 && get_current_timestamp() < window['player']['tops'][_0xdbf0x7d]['time'] + 604800) {
      show_top_reward(_0xdbf0x7d, window['player']['tops'][_0xdbf0x7d]['place']);
      _0xdbf0xd8 = 1
    }
  };
  if (_0xdbf0xd8 == 0) {
    show_daily_reward()
  };
  if (_0xdbf0xd8 == 0) {
    var _0xdbf0x60 = check_level(1);
    if (_0xdbf0x60) {
      _0xdbf0xd8 = 1
    }
  } else {
    var _0xdbf0x60 = check_level(0);
    if (_0xdbf0x60) {
      _0xdbf0xd8 = 1
    }
  };
  if (_0xdbf0xd8 == 0 && window['player']['bonuses']['length'] > 0) {
    show_bonuses()
  }
}

function top_reward(_0xdbf0x25d, _0xdbf0x3cd, _0xdbf0xf0, _0xdbf0x30e, _0xdbf0x195, _0xdbf0x131) {
  play_effect('click.mp3');
  if (document['getElementById']('win_top_share')['checked']) {
    if (_0xdbf0x195 == 'damage') {
      post_wall('top_damage', _0xdbf0x131)
    } else {
      if (_0xdbf0x195 == 'boss') {
        post_wall('top_boss', _0xdbf0x131)
      }
    }
  };
  get_top_reward(_0xdbf0x25d, _0xdbf0x3cd, _0xdbf0xf0, _0xdbf0x30e)
}

function get_top_reward(_0xdbf0x25d, _0xdbf0x3cd, _0xdbf0xf0, _0xdbf0x30e) {
  var _0xdbf0x36 = document['getElementsByClassName']('win_top')[0];
  hide_modal('win_top');
  if (_0xdbf0x25d > -1) {
    window['player']['static_resources']['tokens'] += _0xdbf0x25d;
    window['player']['achievements']['tokens'] += _0xdbf0x25d
  };
  if (_0xdbf0x3cd > -1) {
    window['player']['experiences']['experience']['amount'] += _0xdbf0x3cd
  };
  if (_0xdbf0xf0 > -1 && _0xdbf0x30e > -1) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x30e; _0xdbf0x4++) {
      window['player']['boxes']['push']({
        "id": window['player']['static_resources']['boxes_id']++,
        "open_time": get_current_timestamp(),
        "type": _0xdbf0xf0
      })
    }
  };
  if (window['player']['settings']['resource'] == 0) {
    change_resource('tokens', 0)
  } else {
    change_resource('encryptions', 0)
  };
  server_action('tops.get_reward', {
    "top": _0xdbf0x36['dataset']['top']
  });
  delete window['player']['tops'][_0xdbf0x36['dataset']['top']];
  var _0xdbf0xd8 = 0;
  for (var _0xdbf0x7d in window['player']['tops']) {
    if (_0xdbf0xd8 == 0 && get_current_timestamp() < window['player']['tops'][_0xdbf0x7d]['time'] + 604800) {
      show_top_reward(_0xdbf0x7d, window['player']['tops'][_0xdbf0x7d]['place']);
      _0xdbf0xd8 = 1
    }
  };
  if (_0xdbf0xd8 == 0) {
    show_daily_reward()
  }
}

function my_friends_next() {
  play_effect('click.mp3');
  if (window['view_modal'] == 0) {
    var _0xdbf0xd7 = window['last_friend'] + 1;
    if (window['friends']['length'] < 10) {
      _0xdbf0xd7 = 0
    };
    var _0xdbf0x234 = _0xdbf0xd7 + 10;
    if (_0xdbf0x234 > (window['friends']['length'] - 1)) {
      _0xdbf0x234 = window['friends']['length']
    };
    var _0xdbf0x14 = window['friends']['slice'](_0xdbf0xd7, _0xdbf0x234);
    if (_0xdbf0x14['length'] > 0) {
      update_friends(_0xdbf0x14, _0xdbf0xd7, 0);
      window['last_friend'] = _0xdbf0x234 - 1
    };
    if ((window['friends']['length'] - 1) > window['last_friend']) {
      document['getElementById']('arrow_next')['style']['right'] = '-22px'
    } else {
      document['getElementById']('arrow_next')['style']['right'] = '-9999px'
    };
    if (_0xdbf0xd7 > 0) {
      document['getElementById']('arrow_prev')['style']['left'] = '-22px'
    } else {
      document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
    }
  }
}

function my_friends_prev() {
  play_effect('click.mp3');
  if (window['view_modal'] == 0) {
    var _0xdbf0x6 = window['last_friend'] % 10;
    var _0xdbf0xd7 = window['last_friend'] - _0xdbf0x6 - 10;
    if (_0xdbf0xd7 < 0) {
      _0xdbf0xd7 = 0
    };
    var _0xdbf0x234 = _0xdbf0xd7 + 10;
    if (_0xdbf0x234 > (window['friends']['length'] - 1)) {
      _0xdbf0x234 = window['friends']['length']
    };
    var _0xdbf0x14 = window['friends']['slice'](_0xdbf0xd7, _0xdbf0x234);
    update_friends(_0xdbf0x14, _0xdbf0xd7, 0);
    window['last_friend'] = _0xdbf0x234 - 1;
    if ((window['friends']['length'] - 1) > window['last_friend']) {
      document['getElementById']('arrow_next')['style']['right'] = '-22px'
    } else {
      document['getElementById']('arrow_next')['style']['right'] = '-9999px'
    };
    if (_0xdbf0xd7 > 0) {
      document['getElementById']('arrow_prev')['style']['left'] = '-22px'
    } else {
      document['getElementById']('arrow_prev')['style']['left'] = '-9999px'
    }
  }
}

function update_friends(_0xdbf0x14, _0xdbf0x3d4, _0xdbf0x5d) {
  var _0xdbf0x79 = [];
  var _0xdbf0x22 = 10;
  if (_0xdbf0x14['length'] < _0xdbf0x22) {
    _0xdbf0x22 = _0xdbf0x14['length']
  };
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 1; _0xdbf0x4 < _0xdbf0x22; _0xdbf0x4++, _0xdbf0x38++) {
    _0xdbf0x79['push'](_0xdbf0x14[_0xdbf0x4]['id']);
    var _0xdbf0x3c = document['getElementById']('friend' + _0xdbf0x38);
    if (_0xdbf0x14[_0xdbf0x4]['id'] == window['game_login']) {
      _0xdbf0x3c['className'] = 'friend_item_my'
    } else {
      _0xdbf0x3c['className'] = 'friend_item'
    };
    _0xdbf0x3c['dataset']['id'] = _0xdbf0x14[_0xdbf0x4]['id'];
    _0xdbf0x3c['dataset']['iinlist'] = _0xdbf0x3d4++;
    _0xdbf0x3c['style']['cursor'] = 'pointer';
    var _0xdbf0x3d5 = _0xdbf0x3c['getElementsByClassName']('friend_level')[0];
    if (_0xdbf0x3d5['dataset']['silevel'] == 1) {
      if (_0xdbf0x5d == 2) {
        if (_0xdbf0x14[_0xdbf0x4]['id'] == window['game_login']) {
          _0xdbf0x3d5['getElementsByTagName']('span')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/friend_sut_my.png'
        } else {
          _0xdbf0x3d5['getElementsByTagName']('span')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/friend_sut.png'
        };
        _0xdbf0x3d5['getElementsByTagName']('span')[1]['innerHTML'] = _0xdbf0x14[_0xdbf0x4]['static_resources']['sut']
      } else {
        if (_0xdbf0x14[_0xdbf0x4]['id'] == window['game_login']) {
          _0xdbf0x3d5['getElementsByTagName']('span')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/friend_level_my.png'
        } else {
          _0xdbf0x3d5['getElementsByTagName']('span')[0]['getElementsByTagName']('img')[0]['src'] = 'https://cdn.bravegames.space/regiment/images/friend_level.png'
        };
        _0xdbf0x3d5['getElementsByTagName']('span')[1]['innerHTML'] = _0xdbf0x14[_0xdbf0x4]['static_resources']['level']
      }
    } else {
      var _0xdbf0x3d6 = document['createElement']('span');
      var _0xdbf0x3d7 = document['createElement']('img');
      if (_0xdbf0x5d == 2) {
        if (_0xdbf0x14[_0xdbf0x4]['id'] == window['game_login']) {
          _0xdbf0x3d7['src'] = 'https://cdn.bravegames.space/regiment/images/friend_sut_my.png'
        } else {
          _0xdbf0x3d7['src'] = 'https://cdn.bravegames.space/regiment/images/friend_sut.png'
        }
      } else {
        if (_0xdbf0x14[_0xdbf0x4]['id'] == window['game_login']) {
          _0xdbf0x3d7['src'] = 'https://cdn.bravegames.space/regiment/images/friend_level_my.png'
        } else {
          _0xdbf0x3d7['src'] = 'https://cdn.bravegames.space/regiment/images/friend_level.png'
        }
      };
      _0xdbf0x3d6['appendChild'](_0xdbf0x3d7);
      _0xdbf0x3d5['appendChild'](_0xdbf0x3d6);
      var _0xdbf0x3d6 = document['createElement']('span');
      if (_0xdbf0x5d == 2) {
        _0xdbf0x3d6['innerHTML'] = _0xdbf0x14[_0xdbf0x4]['static_resources']['sut']
      } else {
        _0xdbf0x3d6['innerHTML'] = _0xdbf0x14[_0xdbf0x4]['static_resources']['level']
      };
      _0xdbf0x3d5['appendChild'](_0xdbf0x3d6);
      _0xdbf0x3d5['dataset']['silevel'] = 1
    };
    if (_0xdbf0x14[_0xdbf0x4]['id'] == window['game_login']) {
      _0xdbf0x3c['onclick'] = ''
    } else {
      _0xdbf0x3c['dataset']['fid'] = _0xdbf0x14[_0xdbf0x4]['id'];
      _0xdbf0x3c['onclick'] = friends_click
    }
  };
  if (_0xdbf0x79['length'] > 0) {
    if (_0xdbf0x5d == 0) {
      VK['api']('users.get', {
        user_ids: _0xdbf0x79['join'](','),
        fields: 'photo_50,sex'
      }, friends_vk_load)
    } else {
      if (_0xdbf0x5d == 1) {
        VK['api']('users.get', {
          user_ids: _0xdbf0x79['join'](','),
          fields: 'photo_50,sex'
        }, friends_vk_load2)
      } else {
        if (_0xdbf0x5d == 2) {
          VK['api']('users.get', {
            user_ids: _0xdbf0x79['join'](','),
            fields: 'photo_50,sex'
          }, friends_vk_load3)
        }
      }
    }
  };
  if (_0xdbf0x22 < 10) {
    for (var _0xdbf0x4 = _0xdbf0x22 + 1; _0xdbf0x4 <= 10; _0xdbf0x4++) {
      var _0xdbf0x3c = document['getElementById']('friend' + _0xdbf0x4);
      _0xdbf0x3c['className'] = 'friend_item';
      _0xdbf0x3c['dataset']['id'] = 0;
      _0xdbf0x3c['dataset']['iinlist'] = -1;
      _0xdbf0x3c['style']['cursor'] = 'default';
      _0xdbf0x3c['getElementsByClassName']('friend_name')[0]['innerHTML'] = '';
      var _0xdbf0x136 = _0xdbf0x3c['getElementsByClassName']('friend_avatar')[0];
      while (_0xdbf0x136['firstChild']) {
        _0xdbf0x136['removeChild'](_0xdbf0x136['firstChild'])
      };
      _0xdbf0x136['dataset']['iavatar'] = 0;
      var _0xdbf0x3d8 = _0xdbf0x3c['getElementsByClassName']('friend_level')[0];
      while (_0xdbf0x3d8['firstChild']) {
        _0xdbf0x3d8['removeChild'](_0xdbf0x3d8['firstChild'])
      };
      _0xdbf0x3d8['dataset']['silevel'] = 0;
      _0xdbf0x3c['onclick'] = ''
    }
  }
}

function vk_load_send_supply(_0xdbf0x12) {
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x12['response']['length']; _0xdbf0x38++) {
      if (_0xdbf0x12['response'][_0xdbf0x38]['id'] == window['friends'][_0xdbf0x4]['id']) {
        window['friends'][_0xdbf0x4]['profile'] = {};
        window['friends'][_0xdbf0x4]['profile']['first_name'] = _0xdbf0x12['response'][_0xdbf0x38]['first_name'];
        window['friends'][_0xdbf0x4]['profile']['last_name'] = _0xdbf0x12['response'][_0xdbf0x38]['last_name'];
        window['friends'][_0xdbf0x4]['profile']['photo_50'] = _0xdbf0x12['response'][_0xdbf0x38]['photo_50'];
        window['friends'][_0xdbf0x4]['profile']['sex'] = _0xdbf0x12['response'][_0xdbf0x38]['sex']
      }
    }
  };
  load_send_supply()
}

function load_send_supply() {
  var _0xdbf0x3db = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (!window['friends'][_0xdbf0x4]['profile'] && _0xdbf0x3db['length'] < 1000) {
      _0xdbf0x3db['push'](window['friends'][_0xdbf0x4]['id'])
    }
  };
  if (_0xdbf0x3db['length'] > 0) {
    VK['api']('users.get', {
      user_ids: _0xdbf0x3db['join'](','),
      fields: 'photo_50,sex'
    }, vk_load_send_supply)
  } else {
    window['supply_send_loaded'] = 1;
    if (window['supply_send_mode'] == 1) {
      document['getElementsByClassName']('send_supply_scroll_loading')[0]['style']['display'] = 'none';
      var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_send'], 1, 86400);
      if (_0xdbf0xd5 < 500) {
        var _0xdbf0x15 = 0;
        for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
          if (window['friends'][_0xdbf0x4]['id'] != window['game_login'] && window['friends'][_0xdbf0x4]['supply_send'] != 1) {
            _0xdbf0x15++
          }
        };
        if (_0xdbf0x15 > 0) {
          document['getElementsByClassName']('send_supply_scroll_list')[0]['style']['display'] = 'block';
          document['getElementsByClassName']('send_supply_scroll_empty')[0]['style']['display'] = 'none';
          document['getElementsByClassName']('send_supply_scroll_limit')[0]['style']['display'] = 'none'
        } else {
          document['getElementsByClassName']('send_supply_scroll_list')[0]['style']['display'] = 'block';
          document['getElementsByClassName']('send_supply_scroll_empty')[0]['style']['display'] = 'none';
          document['getElementsByClassName']('send_supply_scroll_limit')[0]['style']['display'] = 'none'
        }
      } else {
        document['getElementsByClassName']('send_supply_scroll_list')[0]['style']['display'] = 'none';
        document['getElementsByClassName']('send_supply_scroll_limit')[0]['style']['display'] = 'block';
        document['getElementsByClassName']('send_supply_search')[0]['style']['display'] = 'none';
        document['getElementsByClassName']('send_supply_text')[0]['style']['display'] = 'block'
      }
    };
    var _0xdbf0x55 = document['getElementsByClassName']('send_supply_scroll_list')[0];
    var _0xdbf0x15 = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      if (window['friends'][_0xdbf0x4]['id'] != window['game_login'] && window['friends'][_0xdbf0x4]['supply_send'] != 1) {
        _0xdbf0x15++;
        var _0xdbf0x3dc = document['createElement']('div');
        _0xdbf0x3dc['dataset']['id'] = window['friends'][_0xdbf0x4]['id'];
        var _0xdbf0x9c = document['createElement']('input');
        _0xdbf0x9c['type'] = 'checkbox';
        _0xdbf0x9c['id'] = 'ssfi_' + _0xdbf0x4;
        _0xdbf0x9c['onchange'] = check_send_supply_friend;
        _0xdbf0x3dc['appendChild'](_0xdbf0x9c);
        var _0xdbf0xca = document['createElement']('label');
        _0xdbf0xca['htmlFor'] = 'ssfi_' + _0xdbf0x4;
        _0xdbf0xca['className'] = 'checkbox';
        _0xdbf0x3dc['appendChild'](_0xdbf0xca);
        var _0xdbf0xca = document['createElement']('label');
        _0xdbf0xca['htmlFor'] = 'ssfi_' + _0xdbf0x4;
        _0xdbf0xca['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x4]['profile']['last_name'];
        _0xdbf0x3dc['appendChild'](_0xdbf0xca);
        _0xdbf0x3dc['className'] = 'send_supply_friend';
        _0xdbf0x55['appendChild'](_0xdbf0x3dc)
      }
    };
    if (_0xdbf0x15 <= 10) {
      _0xdbf0x55['style']['overflowY'] = 'hidden'
    } else {
      _0xdbf0x55['style']['overflowY'] = 'auto'
    }
  }
}

function check_send_supply_friend() {
  play_effect('click.mp3');
  var _0xdbf0x55 = document['getElementsByClassName']('send_supply_scroll_list')[0];
  var _0xdbf0x15 = parseInt(_0xdbf0x55['dataset']['checked']);
  if (this['checked']) {
    var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_send'], 1, 86400);
    if (_0xdbf0x15 < 100 && (_0xdbf0x15 + 1) <= (500 - _0xdbf0xd5)) {
      _0xdbf0x15++
    } else {
      this['checked'] = false
    }
  } else {
    _0xdbf0x15--
  };
  _0xdbf0x55['dataset']['checked'] = _0xdbf0x15;
  var _0xdbf0x9f = document['getElementById']('btn_supply_send');
  if (_0xdbf0x15 > 0) {
    _0xdbf0x9f['className'] = 'button button_red'
  } else {
    _0xdbf0x9f['className'] = 'button button_dark'
  }
}

function show_supply_block() {
  show_supply_get();
  show_supply_send()
}

function show_supply_get() {
  var _0xdbf0x55 = document['getElementsByClassName']('accept_supply_scroll')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_accept'], 1, 86400);
  var _0xdbf0x2c = window['limit_supply_accept'] + window['player']['static_resources']['boost_get_supply'] - _0xdbf0xd5;
  if (_0xdbf0x2c < 0) {
    _0xdbf0x2c = 0
  };
  document['getElementsByClassName']('availability_supply_count')[0]['innerHTML'] = _0xdbf0x2c;
  if (window['player']['supply_incoming']['length'] > 0) {
    var _0xdbf0x3db = [];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['player']['supply_incoming']['length']; _0xdbf0x38++) {
        if (window['player']['supply_incoming'][_0xdbf0x38]['sender'] == window['friends'][_0xdbf0x4]['id'] && !window['friends'][_0xdbf0x4]['profile']) {
          if (window['player']['supply_incoming'][_0xdbf0x38]['expired_time'] > get_current_timestamp()) {
            _0xdbf0x3db['push'](window['player']['supply_incoming'][_0xdbf0x38]['sender'])
          }
        }
      }
    };
    if (_0xdbf0x3db['length'] > 0) {
      VK['api']('users.get', {
        user_ids: _0xdbf0x3db['join'](','),
        fields: 'photo_50,sex'
      }, vk_load_accept_supply)
    } else {
      load_accept_supply()
    }
  } else {
    document['getElementsByClassName']('accept_supply_scroll_loading')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('accept_supply_scroll_empty')[0]['style']['display'] = 'block'
  }
}

function vk_load_accept_supply(_0xdbf0x12) {
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x12['response']['length']; _0xdbf0x38++) {
      if (_0xdbf0x12['response'][_0xdbf0x38]['id'] == window['friends'][_0xdbf0x4]['id']) {
        window['friends'][_0xdbf0x4]['profile'] = {};
        window['friends'][_0xdbf0x4]['profile']['first_name'] = _0xdbf0x12['response'][_0xdbf0x38]['first_name'];
        window['friends'][_0xdbf0x4]['profile']['last_name'] = _0xdbf0x12['response'][_0xdbf0x38]['last_name'];
        window['friends'][_0xdbf0x4]['profile']['photo_50'] = _0xdbf0x12['response'][_0xdbf0x38]['photo_50'];
        window['friends'][_0xdbf0x4]['profile']['sex'] = _0xdbf0x12['response'][_0xdbf0x38]['sex']
      }
    }
  };
  load_accept_supply()
}

function load_accept_supply() {
  if (window['player']['supply_incoming']['length'] > 0) {
    document['getElementById']('btn_supply_accept')['className'] = 'button_wide button_wide_red';
    document['getElementsByClassName']('accept_supply_scroll_loading')[0]['style']['display'] = 'none';
    var _0xdbf0x55 = document['getElementsByClassName']('accept_supply_scroll')[0];
    _0xdbf0x55['style']['display'] = 'block';
    if (window['player']['supply_incoming']['length'] > 6) {
      _0xdbf0x55['style']['overflowY'] = 'auto'
    } else {
      _0xdbf0x55['style']['overflowY'] = 'hidden'
    };
    var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_accept'], 1, 86400);
    var _0xdbf0x22 = 100;
    var _0xdbf0x75 = [3, 5, 7, 10];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['supply_incoming']['length']; _0xdbf0x4++) {
      if (_0xdbf0x75[window['player']['supply_incoming'][_0xdbf0x4]['count']] < _0xdbf0x22) {
        _0xdbf0x22 = _0xdbf0x75[window['player']['supply_incoming'][_0xdbf0x4]['count']]
      }
    };
    var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
    if (window['player']['supply_incoming']['length'] > 0 && _0xdbf0xd5 < (window['limit_supply_accept'] + window['player']['static_resources']['boost_get_supply']) && _0xdbf0x59 < (window['limit_supply_max'] + window['player']['static_resources']['boost_max_supply'])) {
      var _0xdbf0x9f = document['getElementById']('btn_supply_accept');
      _0xdbf0x9f['onclick'] = accept_supply_all;
      _0xdbf0x9f['className'] = 'button_wide button_wide_red'
    } else {
      document['getElementById']('btn_supply_accept')['className'] = 'button_wide button_wide_dark'
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < window['player']['supply_incoming']['length']; _0xdbf0x38++) {
        if (window['player']['supply_incoming'][_0xdbf0x38]['sender'] == window['friends'][_0xdbf0x4]['id'] && window['friends'][_0xdbf0x4]['profile']) {
          if (window['player']['supply_incoming'][_0xdbf0x38]['expired_time'] > get_current_timestamp()) {
            var _0xdbf0x8e = document['createElement']('div');
            _0xdbf0x8e['dataset']['sender'] = window['player']['supply_incoming'][_0xdbf0x38]['sender'];
            _0xdbf0x8e['dataset']['count'] = _0xdbf0x75[window['player']['supply_incoming'][_0xdbf0x38]['count']];
            if (_0xdbf0x59 < (window['limit_supply_max'] + window['player']['static_resources']['boost_max_supply']) && _0xdbf0xd5 < (window['limit_supply_accept'] + window['player']['static_resources']['boost_get_supply'])) {
              _0xdbf0x8e['onclick'] = accept_supply_server;
              _0xdbf0x8e['className'] = 'accept_supply_item d-flex'
            } else {
              _0xdbf0x8e['className'] = 'accept_supply_item_limit d-flex'
            };
            var _0xdbf0x3a1 = document['createElement']('div');
            var _0xdbf0x90 = document['createElement']('img');
            _0xdbf0x90['src'] = window['friends'][_0xdbf0x4]['profile']['photo_50'];
            _0xdbf0x3a1['appendChild'](_0xdbf0x90);
            _0xdbf0x3a1['className'] = 'supply_friend_avatar';
            _0xdbf0x8e['appendChild'](_0xdbf0x3a1);
            var _0xdbf0x3d = document['createElement']('div');
            _0xdbf0x3d['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x4]['profile']['last_name'];
            _0xdbf0x3d['className'] = 'supply_friend_name';
            _0xdbf0x8e['appendChild'](_0xdbf0x3d);
            var _0xdbf0x8f = document['createElement']('div');
            var _0xdbf0x90 = document['createElement']('img');
            _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/supply_interface.png';
            _0xdbf0x8f['appendChild'](_0xdbf0x90);
            _0xdbf0x8f['className'] = 'supply_friend_icon';
            _0xdbf0x8e['appendChild'](_0xdbf0x8f);
            var _0xdbf0x15 = document['createElement']('div');
            _0xdbf0x15['innerHTML'] = '+' + _0xdbf0x75[window['player']['supply_incoming'][_0xdbf0x38]['count']];
            _0xdbf0x15['className'] = 'supply_friend_count';
            _0xdbf0x8e['appendChild'](_0xdbf0x15);
            _0xdbf0x55['appendChild'](_0xdbf0x8e)
          }
        }
      }
    }
  } else {
    document['getElementsByClassName']('accept_supply_scroll')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('accept_supply_scroll_empty')[0]['style']['display'] = 'block';
    document['getElementById']('btn_supply_accept')['className'] = 'button_wide button_wide_dark'
  }
}

function accept_supply_server() {
  var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_accept'], 1, 86400);
  if (_0xdbf0x59 < (window['limit_supply_max'] + window['player']['static_resources']['boost_max_supply']) && _0xdbf0xd5 < (window['limit_supply_accept'] + window['player']['static_resources']['boost_get_supply'])) {
    play_effect('click.mp3');
    this['parentNode']['removeChild'](this);
    var _0xdbf0x6b = [];
    var _0xdbf0x13d = parseInt(this['dataset']['sender']);
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['supply_incoming']['length']; _0xdbf0x4++) {
      if (window['player']['supply_incoming'][_0xdbf0x4]['sender'] != _0xdbf0x13d) {
        _0xdbf0x6b['push'](window['player']['supply_incoming'][_0xdbf0x4])
      }
    };
    window['player']['supply_incoming'] = _0xdbf0x6b;
    var _0xdbf0xa6 = parseInt(this['dataset']['count']);
    var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
    _0xdbf0x59 += _0xdbf0xa6;
    window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x59;
    window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
    update_renewable_resources_supply();
    _0xdbf0xd5 += _0xdbf0xa6;
    window['player']['expiring_resources']['supply_accept']['amount'] = _0xdbf0xd5;
    window['player']['expiring_resources']['supply_accept']['time'] = get_current_timestamp();
    var _0xdbf0x55 = document['getElementsByClassName']('accept_supply_scroll')[0];
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    };
    var _0xdbf0x2c = window['limit_supply_accept'] + window['player']['static_resources']['boost_get_supply'] - _0xdbf0xd5;
    if (_0xdbf0x2c < 0) {
      _0xdbf0x2c = 0
    };
    document['getElementsByClassName']('availability_supply_count')[0]['innerHTML'] = _0xdbf0x2c;
    load_accept_supply();
    server_action('supply.accept', {
      "sender": this['dataset']['sender']
    })
  }
}

function accept_supply_all() {
  var _0xdbf0x59 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_accept'], 1, 86400);
  var _0xdbf0x75 = [3, 5, 7, 10];
  var _0xdbf0x3e4 = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['supply_incoming']['length']; _0xdbf0x4++) {
    if (window['player']['supply_incoming'][_0xdbf0x4]['expired_time'] > get_current_timestamp() && _0xdbf0x59 < (window['limit_supply_max'] + window['player']['static_resources']['boost_max_supply']) && _0xdbf0xd5 < (window['limit_supply_accept'] + window['player']['static_resources']['boost_get_supply'])) {
      var _0xdbf0x6b = _0xdbf0x75[window['player']['supply_incoming'][_0xdbf0x4]['count']];
      _0xdbf0x59 += _0xdbf0x6b;
      _0xdbf0xd5 += _0xdbf0x6b;
      _0xdbf0x3e4['push'](window['player']['supply_incoming'][_0xdbf0x4]['sender'])
    }
  };
  if (_0xdbf0x3e4['length'] > 0) {
    play_effect('click.mp3');
    var _0xdbf0x36 = document['getElementsByClassName']('accept_supply_scroll')[0];
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('accept_supply_item');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      if (in_array(_0xdbf0x55[_0xdbf0x4]['dataset']['sender'], _0xdbf0x3e4)) {
        _0xdbf0x36['removeChild'](_0xdbf0x55[_0xdbf0x4])
      }
    };
    var _0xdbf0x3e5 = [];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['player']['supply_incoming']['length']; _0xdbf0x4++) {
      if (!in_array(window['player']['supply_incoming'][_0xdbf0x4]['sender'], _0xdbf0x3e4)) {
        _0xdbf0x3e5['push'](window['player']['supply_incoming'][_0xdbf0x4])
      }
    };
    window['player']['supply_incoming'] = _0xdbf0x3e5;
    var _0xdbf0x3e6 = renewable_resources(window['player']['renewable_resources']['supply']['time'], window['player']['renewable_resources']['supply']['amount'], window['player']['static_resources']['boost_max_supply'], window['player']['static_resources']['boost_speed_recovery_supply']);
    _0xdbf0x3e6 += _0xdbf0x59;
    window['player']['renewable_resources']['supply']['amount'] = _0xdbf0x59;
    window['player']['renewable_resources']['supply']['time'] = get_current_timestamp();
    update_renewable_resources_supply();
    window['player']['expiring_resources']['supply_accept']['amount'] = _0xdbf0xd5;
    window['player']['expiring_resources']['supply_accept']['time'] = get_current_timestamp();
    var _0xdbf0x55 = document['getElementsByClassName']('accept_supply_scroll')[0];
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    };
    var _0xdbf0x2c = window['limit_supply_accept'] + window['player']['static_resources']['boost_get_supply'] - _0xdbf0xd5;
    if (_0xdbf0x2c < 0) {
      _0xdbf0x2c = 0
    };
    document['getElementsByClassName']('availability_supply_count')[0]['innerHTML'] = _0xdbf0x2c;
    load_accept_supply();
    server_action('supply.receive', {
      "senders": _0xdbf0x3e4['join'](',')
    })
  }
}

function show_supply_send() {
  var _0xdbf0x3e8 = document['getElementsByClassName']('send_supply_scroll_list')[0];
  while (_0xdbf0x3e8['firstChild']) {
    _0xdbf0x3e8['removeChild'](_0xdbf0x3e8['firstChild'])
  };
  document['getElementsByClassName']('send_supply_search')[0]['getElementsByTagName']('input')[0]['value'] = '';
  var _0xdbf0x3e8 = document['getElementsByClassName']('send_supply_scroll')[0];
  var _0xdbf0x3e9 = _0xdbf0x3e8['getElementsByClassName']('send_supply_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x3e9['length']; _0xdbf0x4++) {
    _0xdbf0x3e9[_0xdbf0x4]['className'] = 'send_supply_item'
  };
  var _0xdbf0x3e9 = _0xdbf0x3e8['getElementsByClassName']('send_supply_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x3e9['length']; _0xdbf0x4++) {
    _0xdbf0x3e9[_0xdbf0x4]['dataset']['id'] = _0xdbf0x4;
    _0xdbf0x3e9[_0xdbf0x4]['onclick'] = change_type_supply
  };
  _0xdbf0x3e9[3]['onclick']();
  var _0xdbf0x3e9 = document['getElementsByClassName']('button_send_supply_count');
  if (_0xdbf0x3e9['length'] > 0) {
    _0xdbf0x3e9[0]['onclick'] = change_mode_0_supply_send
  } else {
    document['getElementsByClassName']('button_send_supply_list')[0]['onclick'] = change_mode_1_supply_send
  };
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_send'], 1, 86400);
  var _0xdbf0x3ea = document['getElementsByClassName']('send_supply_text')[0];
  if (_0xdbf0xd5 < 500) {
    _0xdbf0x3ea['getElementsByTagName']('span')[0]['innerHTML'] = 'Отправлено сегодня: ';
    _0xdbf0x3ea['getElementsByTagName']('span')[1]['innerHTML'] = _0xdbf0xd5 + '/500'
  } else {
    _0xdbf0x3ea['getElementsByTagName']('span')[0]['innerHTML'] = 'Доступно через';
    _0xdbf0x3ea['getElementsByTagName']('span')[1]['innerHTML'] = '12ч 26м'
  };
  if (window['supply_send_mode'] == 0) {
    _0xdbf0x3ea['style']['display'] = 'block'
  };
  var _0xdbf0x9f = document['getElementById']('btn_supply_send');
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (window['friends'][_0xdbf0x4]['supply_send'] != 1 && window['friends'][_0xdbf0x4]['id'] != window['game_login']) {
      _0xdbf0x15++
    }
  };
  if (_0xdbf0xd5 < 500 && _0xdbf0x15 > 0) {
    _0xdbf0x9f['className'] = 'button button_red'
  };
  _0xdbf0x9f['onclick'] = send_supply;
  load_send_supply();
  show_modal('supply_block', 700)
}

function change_mode_0_supply_send() {
  play_effect('click.mp3');
  window['supply_send_mode'] = 0;
  document['getElementsByClassName']('send_supply_scroll')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('send_supply_scroll_list')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('send_supply_scroll_empty')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('send_supply_scroll_limit')[0]['style']['display'] = 'none';
  var _0xdbf0x9f = document['getElementsByClassName']('button_send_supply_count')[0];
  _0xdbf0x9f['className'] = 'button_send_supply_list';
  _0xdbf0x9f['onclick'] = change_mode_1_supply_send;
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_send'], 1, 86400);
  var _0xdbf0x3ea = document['getElementsByClassName']('send_supply_text')[0];
  if (_0xdbf0xd5 < 500) {
    _0xdbf0x3ea['getElementsByTagName']('span')[0]['innerHTML'] = 'Отправлено сегодня: ';
    _0xdbf0x3ea['getElementsByTagName']('span')[1]['innerHTML'] = _0xdbf0xd5 + '/500'
  } else {
    _0xdbf0x3ea['getElementsByTagName']('span')[0]['innerHTML'] = 'Доступно через';
    _0xdbf0x3ea['getElementsByTagName']('span')[1]['innerHTML'] = '12ч 26м'
  };
  _0xdbf0x3ea['style']['display'] = 'block';
  document['getElementsByClassName']('send_supply_search')[0]['style']['display'] = 'none';
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (window['friends'][_0xdbf0x4]['supply_send'] != 1 && window['friends'][_0xdbf0x4]['id'] != window['game_login']) {
      _0xdbf0x15++
    }
  };
  if (_0xdbf0xd5 < 500 && _0xdbf0x15 > 0) {
    document['getElementById']('btn_supply_send')['className'] = 'button button_red'
  } else {
    document['getElementById']('btn_supply_send')['className'] = 'button button_dark'
  }
}

function change_mode_1_supply_send() {
  play_effect('click.mp3');
  window['supply_send_mode'] = 1;
  document['getElementsByClassName']('send_supply_scroll')[0]['style']['display'] = 'none';
  var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_send'], 1, 86400);
  if (_0xdbf0xd5 < 500) {
    if (window['supply_send_loaded'] == 1) {
      var _0xdbf0x15 = 0;
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
        if (window['friends'][_0xdbf0x4]['supply_send'] != 1 && window['friends'][_0xdbf0x4]['id'] != window['game_login']) {
          _0xdbf0x15++
        }
      };
      if (_0xdbf0x15 == 0) {
        document['getElementsByClassName']('send_supply_scroll_empty')[0]['style']['display'] = 'block'
      } else {
        document['getElementsByClassName']('send_supply_scroll_list')[0]['style']['display'] = 'block'
      }
    } else {
      document['getElementsByClassName']('send_supply_scroll_loading')[0]['style']['display'] = 'block'
    }
  } else {
    document['getElementsByClassName']('send_supply_scroll_limit')[0]['style']['display'] = 'block'
  };
  var _0xdbf0x9f = document['getElementsByClassName']('button_send_supply_list')[0];
  _0xdbf0x9f['className'] = 'button_send_supply_count';
  _0xdbf0x9f['onclick'] = change_mode_0_supply_send;
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (window['friends'][_0xdbf0x4]['supply_send'] != 1 && window['friends'][_0xdbf0x4]['id'] != window['game_login']) {
      _0xdbf0x15++
    }
  };
  if (_0xdbf0xd5 < 500 && _0xdbf0x15 > 0) {
    document['getElementsByClassName']('send_supply_text')[0]['style']['display'] = 'none';
    var _0xdbf0x36 = document['getElementsByClassName']('send_supply_search')[0];
    _0xdbf0x36['style']['display'] = 'inline-grid';
    var _0xdbf0x9c = _0xdbf0x36['getElementsByTagName']('input')[0];
    _0xdbf0x9c['onfocus'] = function() {
      document['getElementsByClassName']('send_supply_search')[0]['getElementsByClassName']('fa-search')[0]['style']['color'] = '#801717'
    };
    _0xdbf0x9c['onblur'] = function() {
      document['getElementsByClassName']('send_supply_search')[0]['getElementsByClassName']('fa-search')[0]['style']['color'] = '#61605c'
    };
    _0xdbf0x9c['focus']();
    _0xdbf0x9c['oninput'] = input_search_supply
  };
  var _0xdbf0x15 = parseInt(document['getElementsByClassName']('send_supply_scroll_list')[0]['dataset']['checked']);
  if (_0xdbf0x15 == 0) {
    document['getElementById']('btn_supply_send')['className'] = 'button button_dark'
  } else {
    document['getElementById']('btn_supply_send')['className'] = 'button button_red'
  }
}

function input_search_supply() {
  var _0xdbf0x3db = [];
  var _0xdbf0x26 = parseInt(this['value']);
  if (_0xdbf0x26 >= 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      if (String(window['friends'][_0xdbf0x4]['id'])['indexOf'](String(_0xdbf0x26)) > -1 && window['friends'][_0xdbf0x4]['supply_send'] != 1) {
        _0xdbf0x3db['push'](window['friends'][_0xdbf0x4]['id'])
      }
    }
  } else {
    if ((this['value']['indexOf']('id') == 0 && this['value']['length'] > 2) || (this['value']['indexOf']('шв') == 0 && this['value']['length'] > 2)) {
      _0xdbf0x26 = this['value']['substring'](2);
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
        if (window['friends'][_0xdbf0x4]['supply_send'] != 1) {
          var _0xdbf0x75 = 'id' + String(window['friends'][_0xdbf0x4]['id']);
          var _0xdbf0x3ee = 'id' + _0xdbf0x26;
          if (_0xdbf0x75['indexOf'](_0xdbf0x3ee) > -1) {
            _0xdbf0x3db['push'](window['friends'][_0xdbf0x4]['id'])
          }
        }
      }
    }
  };
  if (_0xdbf0x3db['length'] > 0) {
    VK['api']('users.get', {
      user_ids: _0xdbf0x3db['join'](','),
      fields: 'photo_50,sex'
    }, vk_search_supply_id)
  } else {
    VK['api']('friends.search', {
      q: this['value'],
      fields: 'photo_50,sex',
      count: 1000
    }, vk_search_supply)
  }
}

function vk_search_supply_id(_0xdbf0x12) {
  var _0xdbf0x2c = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x12['response']['length']; _0xdbf0x38++) {
      if (_0xdbf0x12['response'][_0xdbf0x38]['id'] == window['friends'][_0xdbf0x4]['id'] && window['friends'][_0xdbf0x4]['id'] != window['game_login'] && window['friends'][_0xdbf0x4]['supply_send'] != 1) {
        _0xdbf0x2c['push'](_0xdbf0x12['response'][_0xdbf0x38]['id']);
        window['friends'][_0xdbf0x4]['profile'] = {};
        window['friends'][_0xdbf0x4]['profile']['first_name'] = _0xdbf0x12['response'][_0xdbf0x38]['first_name'];
        window['friends'][_0xdbf0x4]['profile']['last_name'] = _0xdbf0x12['response'][_0xdbf0x38]['last_name'];
        window['friends'][_0xdbf0x4]['profile']['photo_50'] = _0xdbf0x12['response'][_0xdbf0x38]['photo_50'];
        window['friends'][_0xdbf0x4]['profile']['sex'] = _0xdbf0x12['response'][_0xdbf0x38]['sex']
      }
    }
  };
  vk_search_supply_out(_0xdbf0x2c)
}

function vk_search_supply(_0xdbf0x12) {
  var _0xdbf0x2c = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x12['response']['items']['length']; _0xdbf0x38++) {
      if (_0xdbf0x12['response']['items'][_0xdbf0x38]['id'] == window['friends'][_0xdbf0x4]['id'] && window['friends'][_0xdbf0x4]['supply_send'] != 1) {
        _0xdbf0x2c['push'](_0xdbf0x12['response']['items'][_0xdbf0x38]['id']);
        window['friends'][_0xdbf0x4]['profile'] = {};
        window['friends'][_0xdbf0x4]['profile']['first_name'] = _0xdbf0x12['response']['items'][_0xdbf0x38]['first_name'];
        window['friends'][_0xdbf0x4]['profile']['last_name'] = _0xdbf0x12['response']['items'][_0xdbf0x38]['last_name'];
        window['friends'][_0xdbf0x4]['profile']['photo_50'] = _0xdbf0x12['response']['items'][_0xdbf0x38]['photo_50'];
        window['friends'][_0xdbf0x4]['profile']['sex'] = _0xdbf0x12['response']['items'][_0xdbf0x38]['sex']
      }
    }
  };
  vk_search_supply_out(_0xdbf0x2c)
}

function vk_search_supply_out(_0xdbf0x2c) {
  var _0xdbf0x55 = document['getElementsByClassName']('send_supply_scroll_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  _0xdbf0x55['dataset']['checked'] = 0;
  document['getElementById']('btn_supply_send')['className'] = 'button button_dark';
  if (_0xdbf0x2c['length'] > 0) {
    _0xdbf0x55['style']['display'] = 'block';
    document['getElementsByClassName']('send_supply_scroll_search')[0]['style']['display'] = 'none';
    var _0xdbf0x15 = 0;
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x2c['length']; _0xdbf0x38++) {
        if (_0xdbf0x2c[_0xdbf0x38] == window['friends'][_0xdbf0x4]['id'] && window['friends'][_0xdbf0x4]['id'] != window['game_login'] && window['friends'][_0xdbf0x4]['supply_send'] != 1) {
          _0xdbf0x15++;
          var _0xdbf0x3dc = document['createElement']('div');
          _0xdbf0x3dc['dataset']['id'] = window['friends'][_0xdbf0x4]['id'];
          var _0xdbf0x9c = document['createElement']('input');
          _0xdbf0x9c['type'] = 'checkbox';
          _0xdbf0x9c['id'] = 'ssfi_' + _0xdbf0x4;
          _0xdbf0x9c['onchange'] = check_send_supply_friend;
          _0xdbf0x3dc['appendChild'](_0xdbf0x9c);
          var _0xdbf0xca = document['createElement']('label');
          _0xdbf0xca['htmlFor'] = 'ssfi_' + _0xdbf0x4;
          _0xdbf0xca['className'] = 'checkbox';
          _0xdbf0x3dc['appendChild'](_0xdbf0xca);
          var _0xdbf0xca = document['createElement']('label');
          _0xdbf0xca['htmlFor'] = 'ssfi_' + _0xdbf0x4;
          _0xdbf0xca['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + ' ' + window['friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x3dc['appendChild'](_0xdbf0xca);
          _0xdbf0x3dc['className'] = 'send_supply_friend';
          _0xdbf0x55['appendChild'](_0xdbf0x3dc)
        }
      }
    };
    if (_0xdbf0x15 <= 10) {
      _0xdbf0x55['style']['overflowY'] = 'hidden'
    } else {
      _0xdbf0x55['style']['overflowY'] = 'auto'
    }
  } else {
    _0xdbf0x55['style']['display'] = 'none';
    var _0xdbf0x3f2 = document['getElementsByClassName']('send_supply_scroll_search')[0];
    _0xdbf0x3f2['style']['display'] = 'block';
    _0xdbf0x3f2['getElementsByTagName']('span')[0]['innerHTML'] = document['getElementsByClassName']('send_supply_search')[0]['getElementsByTagName']('input')[0]['value']
  }
}

function input_search_friends() {
  var _0xdbf0x3db = [];
  var _0xdbf0x26 = parseInt(this['value']);
  if (_0xdbf0x26 >= 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      if (String(window['friends'][_0xdbf0x4]['id'])['indexOf'](String(_0xdbf0x26)) > -1) {
        _0xdbf0x3db['push'](window['friends'][_0xdbf0x4]['id'])
      }
    }
  } else {
    if ((this['value']['indexOf']('id') == 0 && this['value']['length'] > 2) || (this['value']['indexOf']('шв') == 0 && this['value']['length'] > 2)) {
      _0xdbf0x26 = this['value']['substring'](2);
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
        var _0xdbf0x75 = 'id' + String(window['friends'][_0xdbf0x4]['id']);
        var _0xdbf0x3ee = 'id' + _0xdbf0x26;
        if (_0xdbf0x75['indexOf'](_0xdbf0x3ee) > -1) {
          _0xdbf0x3db['push'](window['friends'][_0xdbf0x4]['id'])
        }
      }
    }
  };
  if (_0xdbf0x3db['length'] > 0) {
    VK['api']('users.get', {
      user_ids: _0xdbf0x3db['join'](','),
      fields: 'photo_50,sex'
    }, vk_search_id)
  } else {
    VK['api']('friends.search', {
      q: this['value'],
      fields: 'photo_50,sex',
      count: 1000
    }, vk_search)
  }
}

function send_supply() {
  if (window['supply_send_mode'] == 0) {
    var _0xdbf0x3db = [];
    var _0xdbf0x1a = [];
    var _0xdbf0xd5 = 500 - expiring_resources(window['player']['expiring_resources']['supply_send'], 1, 86400);
    var _0xdbf0x22 = 100;
    if (_0xdbf0xd5 < _0xdbf0x22) {
      _0xdbf0x22 = _0xdbf0xd5
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      if (window['friends'][_0xdbf0x4]['supply_send'] != 1 && window['friends'][_0xdbf0x4]['id'] != window['game_login'] && _0xdbf0x3db['length'] < _0xdbf0x22) {
        _0xdbf0x3db['push'](window['friends'][_0xdbf0x4]['id']);
        _0xdbf0x1a['push'](window['friends'][_0xdbf0x4]['sign'])
      }
    };
    if (_0xdbf0x3db['length'] > 0) {
      play_effect('click.mp3');
      var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_send'], 1, 86400);
      _0xdbf0xd5 += _0xdbf0x3db['length'];
      window['player']['expiring_resources']['supply_send']['amount'] = _0xdbf0xd5;
      window['player']['expiring_resources']['supply_send']['time'] = get_current_timestamp();
      update_send_supply(_0xdbf0xd5);
      update_send_supply_friends(_0xdbf0x3db, _0xdbf0xd5);
      server_action('supply.send', {
        "count": window['supply_send_type'],
        "friends": _0xdbf0x3db['join'](','),
        "signs": _0xdbf0x1a['join'](',')
      })
    }
  } else {
    var _0xdbf0x55 = document['getElementsByClassName']('send_supply_scroll_list')[0];
    if (parseInt(_0xdbf0x55['dataset']['checked']) > 0) {
      var _0xdbf0x14 = _0xdbf0x55['getElementsByClassName']('send_supply_friend');
      var _0xdbf0x3db = [];
      var _0xdbf0x1a = [];
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
        for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x14['length']; _0xdbf0x38++) {
          if (_0xdbf0x14[_0xdbf0x38]['getElementsByTagName']('input')[0]['checked'] && _0xdbf0x14[_0xdbf0x38]['dataset']['id'] == window['friends'][_0xdbf0x4]['id']) {
            _0xdbf0x3db['push'](_0xdbf0x14[_0xdbf0x38]['dataset']['id']);
            _0xdbf0x1a['push'](window['friends'][_0xdbf0x4]['sign'])
          }
        }
      };
      if (_0xdbf0x3db['length'] > 0) {
        play_effect('click.mp3');
        var _0xdbf0xd5 = expiring_resources(window['player']['expiring_resources']['supply_send'], 1, 86400);
        _0xdbf0xd5 += _0xdbf0x3db['length'];
        window['player']['expiring_resources']['supply_send']['amount'] = _0xdbf0xd5;
        window['player']['expiring_resources']['supply_send']['time'] = get_current_timestamp();
        update_send_supply(_0xdbf0xd5);
        update_send_supply_friends(_0xdbf0x3db, _0xdbf0xd5);
        server_action('supply.send', {
          "count": window['supply_send_type'],
          "friends": _0xdbf0x3db['join'](','),
          "signs": _0xdbf0x1a['join'](',')
        })
      }
    }
  }
}

function update_send_supply(_0xdbf0xd5) {
  var _0xdbf0x3ea = document['getElementsByClassName']('send_supply_text')[0];
  if (_0xdbf0xd5 < 500) {
    _0xdbf0x3ea['getElementsByTagName']('span')[0]['innerHTML'] = 'Отправлено сегодня: ';
    _0xdbf0x3ea['getElementsByTagName']('span')[1]['innerHTML'] = _0xdbf0xd5 + '/500'
  } else {
    _0xdbf0x3ea['getElementsByTagName']('span')[0]['innerHTML'] = 'Доступно через';
    _0xdbf0x3ea['getElementsByTagName']('span')[1]['innerHTML'] = '12ч 26м';
    document['getElementsByClassName']('send_supply_scroll_list')[0]['style']['display'] = 'none';
    if (window['supply_send_mode'] == 1) {
      document['getElementsByClassName']('send_supply_scroll_limit')[0]['style']['display'] = 'block'
    };
    document['getElementsByClassName']('send_supply_search')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('send_supply_text')[0]['style']['display'] = 'block'
  }
}

function update_send_supply_friends(_0xdbf0x3f7, _0xdbf0xd5) {
  document['getElementsByClassName']('send_supply_scroll_list')[0]['dataset']['checked'] = 0;
  document['getElementById']('btn_supply_send')['className'] = 'button button_dark';
  var _0xdbf0x55 = document['getElementsByClassName']('send_supply_scroll_list')[0];
  var _0xdbf0x14 = _0xdbf0x55['getElementsByClassName']('send_supply_friend');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x14['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x3f7['length']; _0xdbf0x38++) {
      if (_0xdbf0x3f7[_0xdbf0x38] == _0xdbf0x14[_0xdbf0x4]['dataset']['id']) {
        _0xdbf0x55['removeChild'](_0xdbf0x14[_0xdbf0x4])
      }
    }
  };
  var _0xdbf0x15 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x3f7['length']; _0xdbf0x38++) {
      if (_0xdbf0x3f7[_0xdbf0x38] == window['friends'][_0xdbf0x4]['id']) {
        window['friends'][_0xdbf0x4]['supply_send'] = 1
      }
    };
    if (window['friends'][_0xdbf0x4]['supply_send'] != 1 && window['friends'][_0xdbf0x4]['id'] != window['game_login']) {
      _0xdbf0x15++
    }
  };
  if (_0xdbf0x15 == 0 && window['supply_send_mode'] == 1) {
    document['getElementsByClassName']('send_supply_scroll_list')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('send_supply_scroll_empty')[0]['style']['display'] = 'block';
    var _0xdbf0x3ea = document['getElementsByClassName']('send_supply_text')[0];
    _0xdbf0x3ea['getElementsByTagName']('span')[0]['innerHTML'] = 'Отправлено сегодня: ';
    _0xdbf0x3ea['getElementsByTagName']('span')[1]['innerHTML'] = _0xdbf0xd5 + '/500';
    document['getElementsByClassName']('send_supply_search')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('send_supply_text')[0]['style']['display'] = 'block'
  } else {
    if (_0xdbf0x15 > 0 && _0xdbf0xd5 < 500) {
      if (_0xdbf0x15 <= 10) {
        document['getElementsByClassName']('send_supply_scroll_list')[0]['style']['overflowY'] = 'hidden'
      } else {
        document['getElementsByClassName']('send_supply_scroll_list')[0]['style']['overflowY'] = 'auto'
      };
      if (window['supply_send_mode'] == 0) {
        setTimeout(enable_btn_supply_send, 500)
      }
    }
  }
}

function enable_btn_supply_send() {
  document['getElementById']('btn_supply_send')['className'] = 'button button_red'
}

function show_modal(_0xdbf0x71, _0xdbf0x3fa) {
  if (window['view_modal'] == 0) {
    document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
    var _0xdbf0x35 = document['getElementById']('modal');
    _0xdbf0x35['style']['display'] = 'block';
    _0xdbf0x35['style']['width'] = _0xdbf0x3fa + 'px';
    _0xdbf0x35['style']['left'] = ((1000 - _0xdbf0x3fa) / 2) + 'px';
    var _0xdbf0x39c = document['getElementById']('modal_close');
    _0xdbf0x39c['onclick'] = function() {
      play_effect('click.mp3');
      hide_modal(_0xdbf0x71)
    };
    _0xdbf0x35['getElementsByClassName'](_0xdbf0x71)[0]['style']['display'] = 'block';
    window['view_modal'] = 1
  }
}

function hide_modal(_0xdbf0x71) {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementById']('modal');
  _0xdbf0x35['style']['display'] = 'none';
  var _0xdbf0x39c = document['getElementById']('modal_close');
  _0xdbf0x39c['onclick'] = '';
  _0xdbf0x35['getElementsByClassName'](_0xdbf0x71)[0]['style']['display'] = 'none';
  window['view_modal'] = 0
}

function show_modal2() {
  play_effect('click.mp3');
  if (window['view_modal'] == 0) {
    document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
    var _0xdbf0x35 = document['getElementById']('modal2');
    _0xdbf0x35['style']['display'] = 'block';
    var _0xdbf0x9c = _0xdbf0x35['getElementsByTagName']('input')[0];
    _0xdbf0x9c['onfocus'] = function() {
      document['getElementsByClassName']('search_friend')[0]['getElementsByClassName']('fa-search')[0]['style']['color'] = '#801717'
    };
    _0xdbf0x9c['onblur'] = function() {
      document['getElementsByClassName']('search_friend')[0]['getElementsByClassName']('fa-search')[0]['style']['color'] = '#61605c'
    };
    _0xdbf0x9c['focus']();
    _0xdbf0x9c['oninput'] = input_search_friends;
    document['getElementById']('modal_close2')['onclick'] = function() {
      hide_modal2(0)
    };
    window['view_modal'] = 1;
    var _0xdbf0x22 = 10;
    if (window['friends']['length'] < _0xdbf0x22) {
      _0xdbf0x22 = window['friends']['length']
    };
    document['getElementsByClassName']('search_no_result')[0]['style']['display'] = 'none';
    var _0xdbf0x3fd = document['getElementsByClassName']('search_friend_scroll')[0];
    _0xdbf0x3fd['style']['display'] = 'block';
    _0xdbf0x3fd['style']['overflowY'] = 'auto';
    while (_0xdbf0x3fd['firstChild']) {
      _0xdbf0x3fd['removeChild'](_0xdbf0x3fd['firstChild'])
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x22; _0xdbf0x4++) {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'search_friend_item d-flex';
      _0xdbf0x8e['dataset']['id'] = window['friends'][_0xdbf0x4]['id'];
      _0xdbf0x8e['dataset']['wid'] = _0xdbf0x4;
      var _0xdbf0x3fe = document['createElement']('div');
      _0xdbf0x3fe['className'] = 'search_friend_avatar';
      var _0xdbf0x236 = document['createElement']('img');
      _0xdbf0x236['src'] = window['friends'][_0xdbf0x4]['profile']['photo_50'];
      _0xdbf0x3fe['dataset']['fid'] = window['friends'][_0xdbf0x4]['id'];
      _0xdbf0x3fe['onclick'] = search_click;
      _0xdbf0x3fe['appendChild'](_0xdbf0x236);
      _0xdbf0x8e['appendChild'](_0xdbf0x3fe);
      var _0xdbf0x179 = document['createElement']('div');
      _0xdbf0x179['className'] = 'search_friend_name';
      var _0xdbf0x137 = document['createElement']('span');
      _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + '\x0A' + window['friends'][_0xdbf0x4]['profile']['last_name'];
      _0xdbf0x137['dataset']['fid'] = window['friends'][_0xdbf0x4]['id'];
      _0xdbf0x137['onclick'] = search_click;
      _0xdbf0x179['appendChild'](_0xdbf0x137);
      _0xdbf0x8e['appendChild'](_0xdbf0x179);
      _0xdbf0x3fd['appendChild'](_0xdbf0x8e)
    }
  }
}

function input_search_friends() {
  var _0xdbf0x3db = [];
  var _0xdbf0x26 = parseInt(this['value']);
  if (_0xdbf0x26 >= 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      if (String(window['friends'][_0xdbf0x4]['id'])['indexOf'](String(_0xdbf0x26)) > -1) {
        _0xdbf0x3db['push'](window['friends'][_0xdbf0x4]['id'])
      }
    }
  } else {
    if ((this['value']['indexOf']('id') == 0 && this['value']['length'] > 2) || (this['value']['indexOf']('шв') == 0 && this['value']['length'] > 2)) {
      _0xdbf0x26 = this['value']['substring'](2);
      for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
        var _0xdbf0x75 = 'id' + String(window['friends'][_0xdbf0x4]['id']);
        var _0xdbf0x3ee = 'id' + _0xdbf0x26;
        if (_0xdbf0x75['indexOf'](_0xdbf0x3ee) > -1) {
          _0xdbf0x3db['push'](window['friends'][_0xdbf0x4]['id'])
        }
      }
    }
  };
  if (_0xdbf0x3db['length'] > 0) {
    VK['api']('users.get', {
      user_ids: _0xdbf0x3db['join'](','),
      fields: 'photo_50,sex'
    }, vk_search_id)
  } else {
    VK['api']('friends.search', {
      q: this['value'],
      fields: 'photo_50,sex',
      count: 1000
    }, vk_search)
  }
}

function vk_search_id(_0xdbf0x12) {
  var _0xdbf0x2c = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x12['response']['length']; _0xdbf0x38++) {
      if (_0xdbf0x12['response'][_0xdbf0x38]['id'] == window['friends'][_0xdbf0x4]['id'] && window['friends'][_0xdbf0x4]['id'] != window['game_login']) {
        _0xdbf0x2c['push'](_0xdbf0x12['response'][_0xdbf0x38]['id']);
        window['friends'][_0xdbf0x4]['profile'] = {};
        window['friends'][_0xdbf0x4]['profile']['first_name'] = _0xdbf0x12['response'][_0xdbf0x38]['first_name'];
        window['friends'][_0xdbf0x4]['profile']['last_name'] = _0xdbf0x12['response'][_0xdbf0x38]['last_name'];
        window['friends'][_0xdbf0x4]['profile']['photo_50'] = _0xdbf0x12['response'][_0xdbf0x38]['photo_50'];
        window['friends'][_0xdbf0x4]['profile']['sex'] = _0xdbf0x12['response'][_0xdbf0x38]['sex']
      }
    }
  };
  vk_search_out(_0xdbf0x2c)
}

function vk_search(_0xdbf0x12) {
  var _0xdbf0x2c = [];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x12['response']['items']['length']; _0xdbf0x38++) {
      if (_0xdbf0x12['response']['items'][_0xdbf0x38]['id'] == window['friends'][_0xdbf0x4]['id']) {
        _0xdbf0x2c['push'](_0xdbf0x12['response']['items'][_0xdbf0x38]['id']);
        window['friends'][_0xdbf0x4]['profile'] = {};
        window['friends'][_0xdbf0x4]['profile']['first_name'] = _0xdbf0x12['response']['items'][_0xdbf0x38]['first_name'];
        window['friends'][_0xdbf0x4]['profile']['last_name'] = _0xdbf0x12['response']['items'][_0xdbf0x38]['last_name'];
        window['friends'][_0xdbf0x4]['profile']['photo_50'] = _0xdbf0x12['response']['items'][_0xdbf0x38]['photo_50'];
        window['friends'][_0xdbf0x4]['profile']['sex'] = _0xdbf0x12['response']['items'][_0xdbf0x38]['sex']
      }
    }
  };
  vk_search_out(_0xdbf0x2c)
}

function search_click() {
  hide_modal2(1);
  show_homeland();
  var _0xdbf0x9a = parseInt(this['dataset']['fid']);
  if (_0xdbf0x9a != window['game_login']) {
    show_friend_help(_0xdbf0x9a)
  } else {
    show_my_profile()
  }
}

function vk_search_out(_0xdbf0x2c) {
  if (_0xdbf0x2c['length'] > 0) {
    document['getElementsByClassName']('search_no_result')[0]['style']['display'] = 'none';
    var _0xdbf0x3fd = document['getElementsByClassName']('search_friend_scroll')[0];
    _0xdbf0x3fd['style']['display'] = 'block';
    while (_0xdbf0x3fd['firstChild']) {
      _0xdbf0x3fd['removeChild'](_0xdbf0x3fd['firstChild'])
    };
    if (_0xdbf0x2c['length'] < 7) {
      _0xdbf0x3fd['style']['overflowY'] = 'hidden'
    } else {
      _0xdbf0x3fd['style']['overflowY'] = 'auto'
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
      for (var _0xdbf0x38 = 0; _0xdbf0x38 < _0xdbf0x2c['length']; _0xdbf0x38++) {
        if (_0xdbf0x2c[_0xdbf0x38] == window['friends'][_0xdbf0x4]['id']) {
          var _0xdbf0x8e = document['createElement']('div');
          _0xdbf0x8e['className'] = 'search_friend_item d-flex';
          _0xdbf0x8e['dataset']['id'] = _0xdbf0x2c[_0xdbf0x38];
          _0xdbf0x8e['dataset']['wid'] = _0xdbf0x4;
          var _0xdbf0x3fe = document['createElement']('div');
          _0xdbf0x3fe['className'] = 'search_friend_avatar';
          var _0xdbf0x236 = document['createElement']('img');
          _0xdbf0x236['src'] = window['friends'][_0xdbf0x4]['profile']['photo_50'];
          _0xdbf0x3fe['dataset']['fid'] = _0xdbf0x2c[_0xdbf0x38];
          _0xdbf0x3fe['onclick'] = search_click;
          _0xdbf0x3fe['appendChild'](_0xdbf0x236);
          _0xdbf0x8e['appendChild'](_0xdbf0x3fe);
          var _0xdbf0x179 = document['createElement']('div');
          _0xdbf0x179['className'] = 'search_friend_name';
          var _0xdbf0x137 = document['createElement']('span');
          _0xdbf0x137['innerHTML'] = window['friends'][_0xdbf0x4]['profile']['first_name'] + '\x0A' + window['friends'][_0xdbf0x4]['profile']['last_name'];
          _0xdbf0x137['dataset']['fid'] = _0xdbf0x2c[_0xdbf0x38];
          _0xdbf0x137['onclick'] = search_click;
          _0xdbf0x179['appendChild'](_0xdbf0x137);
          _0xdbf0x8e['appendChild'](_0xdbf0x179);
          _0xdbf0x3fd['appendChild'](_0xdbf0x8e)
        }
      }
    };
    _0xdbf0x3fd['scrollTo'](0, 0)
  } else {
    var _0xdbf0x3fd = document['getElementsByClassName']('search_friend_scroll')[0];
    _0xdbf0x3fd['style']['display'] = 'none';
    while (_0xdbf0x3fd['firstChild']) {
      _0xdbf0x3fd['removeChild'](_0xdbf0x3fd['firstChild'])
    };
    var _0xdbf0x403 = document['getElementsByClassName']('search_no_result')[0];
    _0xdbf0x403['style']['display'] = 'block';
    var _0xdbf0x9c = document['getElementById']('modal2')['getElementsByTagName']('input')[0];
    _0xdbf0x403['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0x9c['value']
  }
}

function hide_modal2(_0xdbf0x10f) {
  if (_0xdbf0x10f != 1) {
    play_effect('click.mp3')
  };
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x35 = document['getElementById']('modal2');
  _0xdbf0x35['style']['display'] = 'none';
  _0xdbf0x35['getElementsByTagName']('input')[0]['value'] = '';
  var _0xdbf0x39c = document['getElementById']('modal_close2');
  _0xdbf0x39c['onclick'] = '';
  window['view_modal'] = 0
}

function friends_click() {
  show_homeland();
  var _0xdbf0x9a = parseInt(this['dataset']['fid']);
  if (_0xdbf0x9a != window['game_login']) {
    show_friend_help(_0xdbf0x9a)
  } else {
    show_my_profile()
  }
}

function show_friend_help(_0xdbf0x9a) {
  show_loader();
  var _0xdbf0x250 = 0;
  var _0xdbf0x135 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (_0xdbf0x9a == window['friends'][_0xdbf0x4]['id']) {
      _0xdbf0x250 = 1;
      if (window['friends'][_0xdbf0x4]['profile']) {
        _0xdbf0x135 = 1
      }
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
    if (_0xdbf0x9a == window['other_friends'][_0xdbf0x4]['id'] && window['other_friends'][_0xdbf0x4]['profile']) {
      _0xdbf0x135 = 1
    }
  };
  if (_0xdbf0x135 == 0) {
    if (_0xdbf0x250 == 1) {
      VK['api']('users.get', {
        user_ids: _0xdbf0x9a,
        fields: 'photo_50,sex'
      }, get_social_friend_next)
    } else {
      VK['api']('users.get', {
        user_ids: _0xdbf0x9a,
        fields: 'photo_50,sex'
      }, get_social_not_friend_next)
    }
  } else {
    server_action_fast('friends.view', {
      "friend": _0xdbf0x9a
    }, 'friend_view')
  }
}

function get_social_friend_next(_0xdbf0x12) {
  friends_vk_load_window(_0xdbf0x12);
  server_action_fast('friends.view', {
    "friend": _0xdbf0x12['response'][0]['id']
  }, 'friend_view')
}

function get_social_not_friend_next(_0xdbf0x12) {
  friends_vk_load_otwindow(_0xdbf0x12);
  server_action_fast('friends.view', {
    "friend": _0xdbf0x12['response'][0]['id']
  }, 'friend_view')
}

function friend_view(_0xdbf0x12) {
  hide_loader();
  show_friend_profile(_0xdbf0x12)
}

function show_loader() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'block';
  var _0xdbf0x36 = document['getElementsByClassName']('modal_loader')[0];
  _0xdbf0x36['style']['display'] = 'block'
}

function show_loader_no_shadow() {
  var _0xdbf0x36 = document['getElementsByClassName']('modal_loader')[0];
  _0xdbf0x36['style']['display'] = 'block'
}

function hide_loader() {
  document['getElementsByClassName']('modal_shadow')[0]['style']['display'] = 'none';
  var _0xdbf0x36 = document['getElementsByClassName']('modal_loader')[0];
  _0xdbf0x36['style']['display'] = 'none'
}

function show_friend_profile(_0xdbf0x12) {
  play_music('background.mp3');
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'none';
  var _0xdbf0x36 = document['getElementsByClassName']('friend_profile')[0];
  _0xdbf0x36['style']['display'] = 'block';
  _0xdbf0x36['getElementsByClassName']('modal_close')[0]['onclick'] = hide_friend_profile;
  var _0xdbf0x9a = -1;
  for (var _0xdbf0x7d in _0xdbf0x12['friends']) {
    _0xdbf0x9a = _0xdbf0x7d
  };
  var _0xdbf0x10a = null;
  var _0xdbf0x346 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friends']['length']; _0xdbf0x4++) {
    if (_0xdbf0x9a == window['friends'][_0xdbf0x4]['id'] && window['friends'][_0xdbf0x4]['profile']) {
      _0xdbf0x346 = 1;
      _0xdbf0x10a = window['friends'][_0xdbf0x4]['profile']
    }
  };
  if (_0xdbf0x346 == 0) {
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['other_friends']['length']; _0xdbf0x4++) {
      if (_0xdbf0x9a == window['other_friends'][_0xdbf0x4]['id'] && window['other_friends'][_0xdbf0x4]['profile']) {
        _0xdbf0x346 = 1;
        _0xdbf0x10a = window['other_friends'][_0xdbf0x4]['profile']
      }
    }
  };
  if (_0xdbf0x346 == 1) {
    var _0xdbf0x12 = _0xdbf0x12['friends'][_0xdbf0x9a];
    window['friend_profile'] = _0xdbf0x12;
    window['friend_profile']['id'] = parseInt(_0xdbf0x9a);
    var _0xdbf0x55 = _0xdbf0x36['getElementsByTagName']('a');
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
      _0xdbf0x55[_0xdbf0x4]['href'] = 'https://vk.com/id' + _0xdbf0x9a
    };
    var _0xdbf0xe4 = window['system']['time_resources']['new_day'] - 86400;
    if (_0xdbf0x12['time_resources']['login_time'] > _0xdbf0xe4) {
      var _0xdbf0x2c = 'Был';
      if (_0xdbf0x10a['sex'] == 1) {
        _0xdbf0x2c += 'а'
      };
      _0xdbf0x2c += ' в игре сегодня'
    } else {
      _0xdbf0xe4 -= 86400;
      if (_0xdbf0x12['time_resources']['login_time'] > _0xdbf0xe4) {
        var _0xdbf0x2c = 'Был';
        if (_0xdbf0x10a['sex'] == 1) {
          _0xdbf0x2c += 'а'
        };
        _0xdbf0x2c += ' в игре вчера'
      } else {
        _0xdbf0xe4 -= 86400 * 6;
        if (_0xdbf0x12['time_resources']['login_time'] > _0xdbf0xe4) {
          var _0xdbf0x2c = 'Был';
          if (_0xdbf0x10a['sex'] == 1) {
            _0xdbf0x2c += 'а'
          };
          _0xdbf0x2c += ' в игре недавно'
        } else {
          var _0xdbf0x2c = 'Давно не был';
          if (_0xdbf0x10a['sex'] == 1) {
            _0xdbf0x2c += 'а'
          };
          _0xdbf0x2c += ' в игре'
        }
      }
    };
    _0xdbf0x36['getElementsByClassName']('friend_profile_login')[0]['setAttribute']('tooltipfriend', _0xdbf0x2c);
    var _0xdbf0x3d = _0xdbf0x36['getElementsByClassName']('friend_profile_name')[0];
    _0xdbf0x3d['getElementsByClassName']('friend_profile_firstname')[0]['innerHTML'] = _0xdbf0x10a['first_name'];
    _0xdbf0x3d['getElementsByClassName']('friend_profile_lastname')[0]['innerHTML'] = _0xdbf0x10a['last_name'];
    _0xdbf0x36['getElementsByClassName']('friend_profile_avatar_img')[0]['getElementsByTagName']('img')[0]['src'] = _0xdbf0x10a['photo_50'];
    _0xdbf0x36['getElementsByClassName']('friend_profile_level')[0]['innerHTML'] = _0xdbf0x12['static_resources']['level'];
    _0xdbf0x36['getElementsByClassName']('friend_profile_sut')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0x12['static_resources']['sut'];
    _0xdbf0x36['getElementsByClassName']('friend_profile_talents')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0x12['static_resources']['used_talents'];
    var _0xdbf0x10b = _0xdbf0x36['getElementsByClassName']('friend_profile_menu')[0];
    _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_help')[0]['onclick'] = change_friend_profile_menu_0;
    _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_collection')[0]['onclick'] = change_friend_profile_menu_1;
    _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_hangar')[0]['onclick'] = change_friend_profile_menu_2;
    var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('friend_profile_achievements_scroll')[0];
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    };
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['achievements']['length']; _0xdbf0x4++) {
      var _0xdbf0x8e = document['createElement']('div');
      _0xdbf0x8e['className'] = 'friend_profile_achievements_item d-flex';
      var _0xdbf0x8f = document['createElement']('div');
      _0xdbf0x8f['className'] = 'friend_profile_achievements_item_icon';
      var _0xdbf0x90 = document['createElement']('img');
      if (window['achievements'][_0xdbf0x4]['type'] == 'boss') {
        _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/boss_' + window['achievements'][_0xdbf0x4]['boss'] + '.png';
        var _0xdbf0x40e = 'bosses'
      } else {
        if (window['achievements'][_0xdbf0x4]['type'] == 'weapon') {
          _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/weapon_' + (window['achievements'][_0xdbf0x4]['weapon'] + 4) + '.png';
          var _0xdbf0x40e = 'weapons'
        } else {
          if (window['achievements'][_0xdbf0x4]['type'] == 'other') {
            _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/other_' + window['achievements'][_0xdbf0x4]['action'] + '.png';
            if (window['achievements'][_0xdbf0x4]['action'] == 1) {
              var _0xdbf0x40e = 'sut'
            };
            if (window['achievements'][_0xdbf0x4]['action'] == 3) {
              var _0xdbf0x40e = 'exchange_collections'
            } else {
              if (window['achievements'][_0xdbf0x4]['action'] == 4 || window['achievements'][_0xdbf0x4]['action'] == 5) {
                var _0xdbf0x40e = 'send_help'
              } else {
                if (window['achievements'][_0xdbf0x4]['action'] == 6) {
                  var _0xdbf0x40e = 'damage'
                } else {
                  if (window['achievements'][_0xdbf0x4]['action'] == 7) {
                    var _0xdbf0x40e = 'open_package'
                  }
                }
              }
            }
          } else {
            if (window['achievements'][_0xdbf0x4]['type'] == 'mission') {
              _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/mission_' + window['achievements'][_0xdbf0x4]['front'] + '_' + window['achievements'][_0xdbf0x4]['mission'] + '.png';
              var _0xdbf0x40e = 'missions'
            } else {
              if (window['achievements'][_0xdbf0x4]['type'] == 'resourse') {
                _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/resourse_' + window['achievements'][_0xdbf0x4]['resourse'] + '.png';
                if (window['achievements'][_0xdbf0x4]['resourse'] == 0) {
                  var _0xdbf0x40e = 'coins'
                } else {
                  if (window['achievements'][_0xdbf0x4]['resourse'] == 2) {
                    var _0xdbf0x40e = 'tokens'
                  } else {
                    if (window['achievements'][_0xdbf0x4]['resourse'] == 3) {
                      var _0xdbf0x40e = 'encryptions'
                    } else {
                      if (window['achievements'][_0xdbf0x4]['resourse'] == 4) {
                        var _0xdbf0x40e = 'tickets'
                      }
                    }
                  }
                }
              } else {
                if (window['achievements'][_0xdbf0x4]['type'] == 'boxes') {
                  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/icons/achievements/box_' + window['achievements'][_0xdbf0x4]['box'] + '.png';
                  var _0xdbf0x40e = 'boxes'
                }
              }
            }
          }
        }
      };
      _0xdbf0x8f['appendChild'](_0xdbf0x90);
      _0xdbf0x8e['appendChild'](_0xdbf0x8f);
      var _0xdbf0x10c = document['createElement']('div');
      _0xdbf0x10c['className'] = 'friend_profile_achievements_item_flag';
      _0xdbf0x8e['appendChild'](_0xdbf0x10c);
      var _0xdbf0x3d = document['createElement']('div');
      _0xdbf0x3d['innerHTML'] = window['achievements'][_0xdbf0x4]['title'];
      _0xdbf0x3d['className'] = 'friend_profile_achievements_item_name';
      _0xdbf0x8e['appendChild'](_0xdbf0x3d);
      var _0xdbf0x10d = window['achievements'][_0xdbf0x4]['param'];
      var _0xdbf0xa6 = document['createElement']('div');
      var _0xdbf0x4f = window['achievements_friend'][_0xdbf0x40e][_0xdbf0x12['achievements'][_0xdbf0x10d]];
      var _0xdbf0x1e = _0xdbf0x4f.toString();
      var _0xdbf0x2da = reverse_string(_0xdbf0x1e);
      var _0xdbf0x1e = _0xdbf0x2da['replace'](/000/gi, 'k');
      var _0xdbf0x2c = reverse_string(_0xdbf0x1e);
      if (parseInt(_0xdbf0x4f) > 0) {
        _0xdbf0x2c += '+'
      };
      _0xdbf0xa6['innerHTML'] = _0xdbf0x2c;
      _0xdbf0xa6['className'] = 'friend_profile_achievements_item_count';
      _0xdbf0x8e['appendChild'](_0xdbf0xa6);
      _0xdbf0x55['appendChild'](_0xdbf0x8e)
    };
    change_friend_profile_menu_0()
  }
}

function reverse_string(_0xdbf0x1e) {
  var _0xdbf0x2c = '';
  for (var _0xdbf0x4 = _0xdbf0x1e['length'] - 1; _0xdbf0x4 >= 0; _0xdbf0x4--) {
    _0xdbf0x2c += _0xdbf0x1e[_0xdbf0x4]
  };
  return _0xdbf0x2c
}

function change_friend_profile_menu_0() {
  change_friend_profile_menu(0)
}

function change_friend_profile_menu_1() {
  change_friend_profile_menu(1)
}

function change_friend_profile_menu_2() {
  change_friend_profile_menu(2)
}

function change_friend_profile_menu(_0xdbf0x9a) {
  play_effect('click.mp3');
  var _0xdbf0x36 = document['getElementsByClassName']('friend_profile')[0];
  var _0xdbf0x10b = _0xdbf0x36['getElementsByClassName']('friend_profile_menu')[0];
  var _0xdbf0x131 = _0xdbf0x36['getElementsByClassName']('friend_profile_info')[0];
  if (_0xdbf0x9a == 0) {
    friend_gifts();
    _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_hangar')[0]['className'] = 'friend_profile_menu_hangar';
    _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_collection')[0]['className'] = 'friend_profile_menu_collection';
    _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_help')[0]['className'] = 'friend_profile_menu_help active';
    _0xdbf0x131['getElementsByClassName']('friend_profile_info_hangar')[0]['style']['display'] = 'none';
    _0xdbf0x131['getElementsByClassName']('friend_profile_info_collection')[0]['style']['display'] = 'none';
    _0xdbf0x131['getElementsByClassName']('friend_profile_info_help')[0]['style']['display'] = 'block'
  } else {
    if (_0xdbf0x9a == 1) {
      friend_collections();
      _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_hangar')[0]['className'] = 'friend_profile_menu_hangar';
      _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_collection')[0]['className'] = 'friend_profile_menu_collection active';
      _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_help')[0]['className'] = 'friend_profile_menu_help';
      _0xdbf0x131['getElementsByClassName']('friend_profile_info_hangar')[0]['style']['display'] = 'none';
      _0xdbf0x131['getElementsByClassName']('friend_profile_info_collection')[0]['style']['display'] = 'block';
      _0xdbf0x131['getElementsByClassName']('friend_profile_info_help')[0]['style']['display'] = 'none'
    } else {
      if (_0xdbf0x9a == 2) {
        friend_hangar();
        _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_hangar')[0]['className'] = 'friend_profile_menu_hangar active';
        _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_collection')[0]['className'] = 'friend_profile_menu_collection';
        _0xdbf0x10b['getElementsByClassName']('friend_profile_menu_help')[0]['className'] = 'friend_profile_menu_help';
        _0xdbf0x131['getElementsByClassName']('friend_profile_info_hangar')[0]['style']['display'] = 'block';
        _0xdbf0x131['getElementsByClassName']('friend_profile_info_collection')[0]['style']['display'] = 'none';
        _0xdbf0x131['getElementsByClassName']('friend_profile_info_help')[0]['style']['display'] = 'none'
      }
    }
  }
}

function friend_gifts() {
  var _0xdbf0x36 = document['getElementsByClassName']('friend_profile_info_help')[0];
  var _0xdbf0x137 = _0xdbf0x36['getElementsByClassName']('friend_profile_info_help_limit')[0]['getElementsByTagName']('span')[0];
  var _0xdbf0x415 = expiring_resources(window['player']['expiring_resources']['sended_help'], 1, 43200);
  _0xdbf0x137['innerHTML'] = _0xdbf0x415 + ' / ' + window['limit_send_help_general'];
  var _0xdbf0x416 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friend_profile']['send_help']['length']; _0xdbf0x4++) {
    if ((window['friend_profile']['send_help'][_0xdbf0x4] + 86400) > get_current_timestamp()) {
      _0xdbf0x416++
    }
  };
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('friend_profile_info_help_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'friend_profile_info_help_item';
  var _0xdbf0x8f = document['createElement']('div');
  _0xdbf0x8f['className'] = 'friend_profile_info_help_item_icon';
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/profile/help_icon_1.jpg';
  _0xdbf0x8f['appendChild'](_0xdbf0x90);
  _0xdbf0x8e['appendChild'](_0xdbf0x8f);
  var _0xdbf0x186 = document['createElement']('div');
  _0xdbf0x186['className'] = 'friend_profile_info_help_item_frame';
  _0xdbf0x8e['appendChild'](_0xdbf0x186);
  var _0xdbf0x15 = document['createElement']('div');
  _0xdbf0x15['innerHTML'] = 'x1';
  _0xdbf0x15['className'] = 'friend_profile_info_help_item_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x15);
  var _0xdbf0xf8 = document['createElement']('div');
  _0xdbf0xf8['innerHTML'] = 'Стоимость: Бесплатно';
  _0xdbf0xf8['className'] = 'friend_profile_info_help_item_price';
  _0xdbf0x8e['appendChild'](_0xdbf0xf8);
  var _0xdbf0x9f = document['createElement']('div');
  if (_0xdbf0x416 > 0 || _0xdbf0x415 >= window['limit_send_help_general']) {
    _0xdbf0x9f['innerHTML'] = 'Недоступно';
    _0xdbf0x9f['className'] = 'friend_profile_info_help_item_button button button_dark'
  } else {
    _0xdbf0x9f['innerHTML'] = 'Отправить';
    _0xdbf0x9f['className'] = 'friend_profile_info_help_item_button button button_orange';
    _0xdbf0x9f['dataset']['hid'] = 0;
    _0xdbf0x9f['onclick'] = send_help
  };
  _0xdbf0x8e['appendChild'](_0xdbf0x9f);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  var _0xdbf0x8e = document['createElement']('div');
  _0xdbf0x8e['className'] = 'friend_profile_info_help_item';
  var _0xdbf0x8f = document['createElement']('div');
  _0xdbf0x8f['className'] = 'friend_profile_info_help_item_icon';
  var _0xdbf0x90 = document['createElement']('img');
  _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/profile/help_icon_2.jpg';
  _0xdbf0x8f['appendChild'](_0xdbf0x90);
  _0xdbf0x8e['appendChild'](_0xdbf0x8f);
  var _0xdbf0x186 = document['createElement']('div');
  _0xdbf0x186['className'] = 'friend_profile_info_help_item_frame';
  _0xdbf0x8e['appendChild'](_0xdbf0x186);
  var _0xdbf0x15 = document['createElement']('div');
  _0xdbf0x15['innerHTML'] = 'x1';
  _0xdbf0x15['className'] = 'friend_profile_info_help_item_count';
  _0xdbf0x8e['appendChild'](_0xdbf0x15);
  var _0xdbf0xf8 = document['createElement']('div');
  _0xdbf0xf8['innerHTML'] = 'Стоимость: Бесплатно';
  _0xdbf0xf8['className'] = 'friend_profile_info_help_item_price';
  _0xdbf0x8e['appendChild'](_0xdbf0xf8);
  var _0xdbf0x9f = document['createElement']('div');
  if (_0xdbf0x416 > 0 || _0xdbf0x415 >= window['limit_send_help_general']) {
    _0xdbf0x9f['innerHTML'] = 'Недоступно';
    _0xdbf0x9f['className'] = 'friend_profile_info_help_item_button button button_dark'
  } else {
    _0xdbf0x9f['innerHTML'] = 'Отправить';
    _0xdbf0x9f['className'] = 'friend_profile_info_help_item_button button button_orange';
    _0xdbf0x9f['dataset']['hid'] = 1;
    _0xdbf0x9f['onclick'] = send_help
  };
  _0xdbf0x8e['appendChild'](_0xdbf0x9f);
  _0xdbf0x55['appendChild'](_0xdbf0x8e);
  var _0xdbf0x417 = ['https://cdn.bravegames.space/regiment/images/icons/encryptions_1.png', 'https://cdn.bravegames.space/regiment/images/icons/supply_6.png', 'https://cdn.bravegames.space/regiment/images/icons/tickets_1.png', 'https://cdn.bravegames.space/regiment/images/icons/coin_4.png', 'https://cdn.bravegames.space/regiment/images/icons/tokens_2.png', 'https://cdn.bravegames.space/regiment/images/weapons/shop/w8-3.png', ''];
  for (var _0xdbf0x4 = 0; _0xdbf0x4 <= 6; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'friend_profile_info_help_item';
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'friend_profile_info_help_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    var _0xdbf0xb = window['player']['static_resources']['help_' + _0xdbf0x4];
    if (_0xdbf0xb < 5) {
      var _0xdbf0x418 = 'icons/supply_' + _0xdbf0xb + '.png'
    } else {
      if (_0xdbf0xb < 10) {
        var _0xdbf0x418 = 'icons/tokens_' + (_0xdbf0xb - 5) + '.png'
      } else {
        if (_0xdbf0xb < 15) {
          var _0xdbf0x418 = 'icons/coin_' + (_0xdbf0xb - 10) + '.png'
        } else {
          if (_0xdbf0xb < 20) {
            var _0xdbf0x418 = 'icons/encryptions_' + (_0xdbf0xb - 15) + '.png'
          } else {
            if (_0xdbf0xb < 25) {
              var _0xdbf0x418 = 'weapons/shop/w10-' + (_0xdbf0xb - 20) + '.png'
            } else {
              if (_0xdbf0xb < 30) {
                var _0xdbf0x418 = 'weapons/shop/w9-' + (_0xdbf0xb - 25) + '.png'
              } else {
                if (_0xdbf0xb < 35) {
                  var _0xdbf0x418 = 'weapons/shop/w8-' + (_0xdbf0xb - 30) + '.png'
                } else {
                  var _0xdbf0x418 = 'weapons/shop/w7-' + (_0xdbf0xb - 35) + '.png'
                }
              }
            }
          }
        }
      }
    };
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/' + _0xdbf0x418;
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x8f);
    var _0xdbf0x186 = document['createElement']('div');
    _0xdbf0x186['className'] = 'friend_profile_info_help_item_frame';
    _0xdbf0x8e['appendChild'](_0xdbf0x186);
    var _0xdbf0x15 = document['createElement']('div');
    _0xdbf0x15['innerHTML'] = 'x' + window['material_help'][_0xdbf0xb]['amount'];
    _0xdbf0x15['className'] = 'friend_profile_info_help_item_count';
    _0xdbf0x8e['appendChild'](_0xdbf0x15);
    var _0xdbf0xf8 = document['createElement']('div');
    _0xdbf0xf8['innerHTML'] = 'Стоимость: ' + word_form(window['material_help'][_0xdbf0xb]['price'], 'талон', 'талона', 'талонов');
    _0xdbf0xf8['className'] = 'friend_profile_info_help_item_price';
    _0xdbf0x8e['appendChild'](_0xdbf0xf8);
    var _0xdbf0x9f = document['createElement']('div');
    if (window['player']['static_resources']['tickets'] < window['material_help'][_0xdbf0xb]['price']) {
      _0xdbf0x9f['innerHTML'] = 'Недоступно';
      _0xdbf0x9f['className'] = 'friend_profile_info_help_item_button button button_dark'
    } else {
      _0xdbf0x9f['innerHTML'] = 'Отправить';
      _0xdbf0x9f['className'] = 'friend_profile_info_help_item_button button button_orange';
      _0xdbf0x9f['dataset']['hid'] = _0xdbf0xb;
      _0xdbf0x9f['onclick'] = send_material_help
    };
    _0xdbf0x8e['appendChild'](_0xdbf0x9f);
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  }
}

function send_bnt_return(_0xdbf0xa2) {
  _0xdbf0xa2['style']['display'] = 'none';
  _0xdbf0xa2['style']['opacity'] = 0;
  _0xdbf0xa2['style']['left'] = '0';
  _0xdbf0xa2['style']['display'] = 'block';
  animation(_0xdbf0xa2, 'opacity', 0, 1, 0, 200, 'friend_gifts')
}

function send_material_help() {
  animation(this['parentNode'], 'left', 0, 600, 1, 200, 'send_bnt_return');
  play_effect('click.mp3');
  var _0xdbf0x9a = parseInt(this['dataset']['hid']);
  var _0xdbf0x41b = window['material_help'][_0xdbf0x9a];
  if (window['player']['static_resources']['tickets'] >= _0xdbf0x41b['price']) {
    window['player']['static_resources']['tickets'] -= _0xdbf0x41b['price'];
    update_static_resources_tickets();
    server_action('friends.material_help', {
      "help": +_0xdbf0x9a,
      "friend": window['friend_profile']['id']
    })
  } else {
    show_modal_no_tickets()
  }
}

function send_help() {
  window['friend_profile']['send_help']['push'](get_current_timestamp());
  animation(this['parentNode'], 'left', 0, 600, 1, 200, 'send_bnt_return');
  play_effect('click.mp3');
  var _0xdbf0x9a = parseInt(this['dataset']['hid']);
  var _0xdbf0x415 = expiring_resources(window['player']['expiring_resources']['sended_help'], 1, 43200);
  _0xdbf0x415++;
  window['player']['expiring_resources']['sended_help']['amount'] = _0xdbf0x415;
  window['player']['expiring_resources']['sended_help']['time'] = get_current_timestamp();
  if (_0xdbf0x9a == 0) {
    window['player']['achievements']['send_airstrike']++
  } else {
    if (_0xdbf0x9a == 1) {
      window['player']['achievements']['send_ammunition']++
    }
  };
  server_action('friends.help', {
    "help": _0xdbf0x9a,
    "friend": window['friend_profile']['id']
  })
}

function friend_collections() {
  var _0xdbf0x36 = document['getElementsByClassName']('friend_profile_info_collection')[0];
  var _0xdbf0x41e = _0xdbf0x36['getElementsByClassName']('friend_profile_info_collection_limits')[0]['getElementsByTagName']('span');
  var _0xdbf0x415 = expiring_resources(window['player']['expiring_resources']['sended_collection'], 1, 86400);
  _0xdbf0x41e[0]['innerHTML'] = _0xdbf0x415 + ' / ' + window['limit_send_collection_general'];
  var _0xdbf0x416 = 0;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friend_profile']['send_collection']['length']; _0xdbf0x4++) {
    if ((window['friend_profile']['send_collection'][_0xdbf0x4] + 86400) > get_current_timestamp()) {
      _0xdbf0x416++
    }
  };
  _0xdbf0x41e[1]['innerHTML'] = _0xdbf0x416 + ' / ' + window['limit_send_collection_personal'];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('friend_profile_info_collection_resourse_list')[0];
  while (_0xdbf0x55['firstChild']) {
    _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < window['friend_profile']['wish_list']['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    if (window['player']['collections'][window['friend_profile']['wish_list'][_0xdbf0x4]]['amount'] > 0) {
      _0xdbf0x8e['className'] = 'friend_profile_info_collection_resourse_item available'
    } else {
      _0xdbf0x8e['className'] = 'friend_profile_info_collection_resourse_item notavailable'
    };
    var _0xdbf0xc8 = document['createElement']('div');
    _0xdbf0xc8['className'] = 'friend_profile_info_collection_resourse_item_image';
    var _0xdbf0x8f = document['createElement']('div');
    _0xdbf0x8f['className'] = 'friend_profile_info_collection_resourse_item_icon';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/collection/' + window['friend_profile']['wish_list'][_0xdbf0x4] + '.png';
    _0xdbf0x8f['appendChild'](_0xdbf0x90);
    _0xdbf0xc8['appendChild'](_0xdbf0x8f);
    var _0xdbf0x15 = document['createElement']('div');
    _0xdbf0x15['innerHTML'] = window['player']['collections'][window['friend_profile']['wish_list'][_0xdbf0x4]]['amount'];
    _0xdbf0x15['className'] = 'friend_profile_info_collection_resourse_item_count';
    if (window['player']['collections'][window['friend_profile']['wish_list'][_0xdbf0x4]]['amount'] > 0) {
      _0xdbf0x15['style']['filter'] = 'grayscale(0) opacity(1)'
    };
    _0xdbf0xc8['appendChild'](_0xdbf0x15);
    _0xdbf0x8e['appendChild'](_0xdbf0xc8);
    var _0xdbf0x9f = document['createElement']('div');
    if (window['player']['collections'][window['friend_profile']['wish_list'][_0xdbf0x4]]['amount'] > 0 && _0xdbf0x415 < window['limit_send_collection_general'] && _0xdbf0x416 < window['limit_send_collection_personal']) {
      _0xdbf0x9f['innerHTML'] = 'Отправить';
      _0xdbf0x9f['className'] = 'friend_profile_info_collection_button button button_green';
      _0xdbf0x9f['dataset']['cid'] = window['friend_profile']['wish_list'][_0xdbf0x4];
      _0xdbf0x9f['onclick'] = send_colllection
    } else {
      _0xdbf0x9f['innerHTML'] = 'Недоступно';
      _0xdbf0x9f['className'] = 'friend_profile_info_collection_button button button_dark';
      _0xdbf0x9f['onclick'] = ''
    };
    _0xdbf0x8e['appendChild'](_0xdbf0x9f);
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  };
  if (window['friend_profile']['wish_list']['length'] == 0) {
    _0xdbf0x55['style']['display'] = 'none';
    _0xdbf0x36['getElementsByClassName']('friend_profile_info_collection_resourse_no_list')[0]['style']['display'] = 'grid'
  } else {
    _0xdbf0x55['style']['display'] = 'grid';
    _0xdbf0x36['getElementsByClassName']('friend_profile_info_collection_resourse_no_list')[0]['style']['display'] = 'none'
  }
}

function send_colllection() {
  play_effect('click.mp3');
  var _0xdbf0x9a = parseInt(this['dataset']['cid']);
  var _0xdbf0x415 = expiring_resources(window['player']['expiring_resources']['sended_collection'], 1, 86400);
  _0xdbf0x415++;
  window['player']['expiring_resources']['sended_collection']['amount'] = _0xdbf0x415;
  window['player']['expiring_resources']['sended_collection']['time'] = get_current_timestamp();
  window['player']['collections'][_0xdbf0x9a]['amount']--;
  window['friend_profile']['send_collection']['push'](get_current_timestamp());
  friend_collections();
  server_action('friends.send_colllection', {
    "collection": _0xdbf0x9a,
    "friend": window['friend_profile']['id']
  })
}

function friend_hangar() {
  var _0xdbf0x36 = document['getElementsByClassName']('friend_profile_info_hangar')[0];
  var _0xdbf0x55 = _0xdbf0x36['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_type')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = '';
    _0xdbf0x55[_0xdbf0x4]['onclick'] = window['set_type_friend_hangar_' + _0xdbf0x4]
  };
  var _0xdbf0x55 = document['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_country')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = '';
    _0xdbf0x55[_0xdbf0x4]['onclick'] = window['set_country_friend_hangar_' + _0xdbf0x4]
  };
  var _0xdbf0x297 = _0xdbf0x36['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_card')[0];
  var _0xdbf0x55 = _0xdbf0x297['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = '';
    _0xdbf0x55[_0xdbf0x4]['onclick'] = window['sort_friend_hangar_' + _0xdbf0x4]
  };
  _0xdbf0x55[0]['className'] = 'active';
  _0xdbf0x297['getElementsByTagName']('label')[0]['innerHTML'] = 'Сортировка по времени';
  var _0xdbf0x9f = document['getElementById']('sort_friend_hangar');
  _0xdbf0x9f['onclick'] = friend_hangar_btn_sort_type;
  var _0xdbf0x9c = _0xdbf0x36['getElementsByClassName']('friend_profile_info_hangar_sort_select search_card')[0]['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '';
  _0xdbf0x9c['oninput'] = friend_hangar_search_input;
  _0xdbf0x36['getElementsByClassName']('clear')[0]['style']['display'] = 'none';
  window['friend_hangar_next'] = 0;
  out_friend_hangar_card(1, 0, 1, -1)
}

function friend_hangar_search_input() {
  var _0xdbf0x36 = document['getElementsByClassName']('friend_profile_info_hangar_sort_select search_card')[0];
  var _0xdbf0x9c = _0xdbf0x36['getElementsByTagName']('input')[0];
  if (_0xdbf0x9c['value']['length'] > 0) {
    var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('clear')[0];
    _0xdbf0x9f['style']['display'] = 'inline';
    _0xdbf0x9f['onclick'] = clear_search_input_friend
  } else {
    _0xdbf0x36['getElementsByClassName']('clear')[0]['style']['display'] = 'none'
  };
  window['friend_hangar_next'] = 0;
  out_friend_hangar_card(1, 0, 1, -1)
}

function clear_search_input_friend() {
  play_effect('click.mp3');
  var _0xdbf0x9c = document['getElementsByClassName']('friend_profile_info_hangar_sort_select search_card')[0]['getElementsByTagName']('input')[0];
  _0xdbf0x9c['value'] = '';
  friend_hangar_search_input()
}

function friend_hangar_btn_sort_type() {
  play_effect('click.mp3');
  var _0xdbf0x9f = document['getElementById']('sort_friend_hangar');
  if (_0xdbf0x9f['className'] == 'sort_up') {
    _0xdbf0x9f['className'] = 'sort_down'
  } else {
    if (_0xdbf0x9f['className'] == 'sort_down') {
      _0xdbf0x9f['className'] = 'sort_up'
    }
  };
  window['friend_hangar_next'] = 0;
  out_friend_hangar_card(1, 0, 1, -1)
}

function sort_friend_hangar_0() {
  sort_friend_hangar(0)
}

function sort_friend_hangar_1() {
  sort_friend_hangar(1)
}

function sort_friend_hangar_2() {
  sort_friend_hangar(2)
}

function sort_friend_hangar_3() {
  sort_friend_hangar(3)
}

function sort_friend_hangar(_0xdbf0x5d) {
  play_effect('click.mp3');
  var _0xdbf0x55 = document['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_card')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    _0xdbf0x55[_0xdbf0x4]['className'] = ''
  };
  _0xdbf0x55[_0xdbf0x5d]['className'] = 'active';
  var _0xdbf0xca = document['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_card')[0]['getElementsByTagName']('label')[0];
  if (_0xdbf0x5d == 0) {
    _0xdbf0xca['innerHTML'] = 'Сортировка по времени'
  } else {
    if (_0xdbf0x5d == 1) {
      _0xdbf0xca['innerHTML'] = 'Сортировка по уровню'
    } else {
      if (_0xdbf0x5d == 2) {
        _0xdbf0xca['innerHTML'] = 'Сортировка по названию'
      }
    }
  };
  window['friend_hangar_next'] = 0;
  out_friend_hangar_card(1, 0, 1, -1)
}

function set_country_friend_hangar_0() {
  set_country_friend_hangar(0)
}

function set_country_friend_hangar_1() {
  set_country_friend_hangar(1)
}

function set_country_friend_hangar_2() {
  set_country_friend_hangar(2)
}

function set_country_friend_hangar_3() {
  set_country_friend_hangar(3)
}

function set_country_friend_hangar_4() {
  set_country_friend_hangar(4)
}

function set_country_friend_hangar_5() {
  set_country_friend_hangar(5)
}

function set_country_friend_hangar_6() {
  set_country_friend_hangar(6)
}

function set_country_friend_hangar_7() {
  set_country_friend_hangar(7)
}

function set_country_friend_hangar_8() {
  set_country_friend_hangar(8)
}

function set_country_friend_hangar_9() {
  set_country_friend_hangar(9)
}

function set_country_friend_hangar_10() {
  set_country_friend_hangar(10)
}

function set_country_friend_hangar_11() {
  set_country_friend_hangar(11)
}

function set_country_friend_hangar_12() {
  set_country_friend_hangar(12)
}

function set_country_friend_hangar(_0xdbf0x9a) {
  play_effect('click.mp3');
  var _0xdbf0x55 = document['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_country')[0]['getElementsByTagName']('li');
  if (_0xdbf0x55[_0xdbf0x9a]['className'] == '') {
    _0xdbf0x55[_0xdbf0x9a]['className'] = 'active'
  } else {
    _0xdbf0x55[_0xdbf0x9a]['className'] = ''
  };
  window['hangar_next'] = 0;
  out_friend_hangar_card(1, 0, 1, -1)
}

function set_type_friend_hangar_0() {
  set_type_friend_hangar(0)
}

function set_type_friend_hangar_1() {
  set_type_friend_hangar(1)
}

function set_type_friend_hangar_2() {
  set_type_friend_hangar(2)
}

function set_type_friend_hangar(_0xdbf0x9a) {
  play_effect('click.mp3');
  var _0xdbf0x55 = document['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_type')[0]['getElementsByTagName']('li');
  if (_0xdbf0x55[_0xdbf0x9a]['className'] == '') {
    _0xdbf0x55[_0xdbf0x9a]['className'] = 'active'
  } else {
    _0xdbf0x55[_0xdbf0x9a]['className'] = ''
  };
  window['friend_hangar_next'] = 0;
  out_friend_hangar_card(1, 0, 1, -1)
}

function out_friend_hangar_card(_0xdbf0x22a, _0xdbf0x22b, _0xdbf0x22c, _0xdbf0x22d) {
  var _0xdbf0x1e0 = [];
  var _0xdbf0x55 = document['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_type')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0, _0xdbf0x38 = 1; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++, _0xdbf0x38++) {
    if (_0xdbf0x55[_0xdbf0x4]['className'] == 'active') {
      for (var _0xdbf0x7d in window['friend_profile']['hangar'][_0xdbf0x38]) {
        var _0xdbf0x1e2 = window['friend_profile']['hangar'][_0xdbf0x38][_0xdbf0x7d];
        _0xdbf0x1e2['type'] = _0xdbf0x38;
        _0xdbf0x1e2['id'] = _0xdbf0x7d;
        _0xdbf0x1e2['name'] = window['cards'][_0xdbf0x38][_0xdbf0x7d]['name'];
        _0xdbf0x1e2['country'] = window['cards'][_0xdbf0x38][_0xdbf0x7d]['country'];
        _0xdbf0x1e0['push'](_0xdbf0x1e2)
      }
    }
  };
  if (_0xdbf0x1e0['length'] == 0) {
    for (var _0xdbf0x4 = 1; _0xdbf0x4 <= 3; _0xdbf0x4++) {
      for (var _0xdbf0x7d in window['friend_profile']['hangar'][_0xdbf0x4]) {
        var _0xdbf0x1e2 = window['friend_profile']['hangar'][_0xdbf0x4][_0xdbf0x7d];
        _0xdbf0x1e2['type'] = _0xdbf0x4;
        _0xdbf0x1e2['id'] = _0xdbf0x7d;
        _0xdbf0x1e2['name'] = window['cards'][_0xdbf0x4][_0xdbf0x7d]['name'];
        _0xdbf0x1e2['country'] = window['cards'][_0xdbf0x4][_0xdbf0x7d]['country'];
        _0xdbf0x1e0['push'](_0xdbf0x1e2)
      }
    }
  };
  var _0xdbf0x22e = [];
  var _0xdbf0x192 = ['ussr', 'germany', 'usa', 'china', 'france', 'britain', 'japan', 'czech', 'sweden', 'poland', 'italy', 'other'];
  var _0xdbf0x55 = document['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_country')[0]['getElementsByTagName']('li');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['className'] == 'active') {
      _0xdbf0x22e['push'](_0xdbf0x192[_0xdbf0x4])
    }
  };
  if (_0xdbf0x22e['length'] > 0) {
    var _0xdbf0x22f = [];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
      if (in_array(_0xdbf0x1e0[_0xdbf0x4]['country'], _0xdbf0x22e)) {
        _0xdbf0x22f['push'](_0xdbf0x1e0[_0xdbf0x4])
      }
    };
    _0xdbf0x1e0 = _0xdbf0x22f
  };
  var _0xdbf0x55 = document['getElementsByClassName']('friend_profile_info_hangar_sort_select sort_card')[0]['getElementsByTagName']('li');
  var _0xdbf0x183 = -1;
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x55['length']; _0xdbf0x4++) {
    if (_0xdbf0x55[_0xdbf0x4]['className'] == 'active') {
      _0xdbf0x183 = _0xdbf0x4
    }
  };
  var _0xdbf0x9f = document['getElementById']('sort_friend_hangar');
  if (_0xdbf0x9f['className'] == 'sort_up') {
    var _0xdbf0x230 = 0
  } else {
    var _0xdbf0x230 = 1
  };
  if (_0xdbf0x183 == 0) {
    if (_0xdbf0x230 == 0) {
      _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
        if (_0xdbf0x8c['last_get_time'] < _0xdbf0x8d['last_get_time']) {
          return 1
        } else {
          if (_0xdbf0x8c['last_get_time'] > _0xdbf0x8d['last_get_time']) {
            return -1
          } else {
            return 0
          }
        }
      })
    } else {
      if (_0xdbf0x230 == 1) {
        _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
          if (_0xdbf0x8c['last_get_time'] < _0xdbf0x8d['last_get_time']) {
            return -1
          } else {
            if (_0xdbf0x8c['last_get_time'] > _0xdbf0x8d['last_get_time']) {
              return 1
            } else {
              return 0
            }
          }
        })
      }
    }
  } else {
    if (_0xdbf0x183 == 1) {
      if (_0xdbf0x230 == 0) {
        _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
          if (_0xdbf0x8c['level'] < _0xdbf0x8d['level']) {
            return 1
          } else {
            if (_0xdbf0x8c['level'] > _0xdbf0x8d['level']) {
              return -1
            } else {
              return 0
            }
          }
        })
      } else {
        if (_0xdbf0x230 == 1) {
          _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
            if (_0xdbf0x8c['level'] < _0xdbf0x8d['level']) {
              return -1
            } else {
              if (_0xdbf0x8c['level'] > _0xdbf0x8d['level']) {
                return 1
              } else {
                return 0
              }
            }
          })
        }
      }
    } else {
      if (_0xdbf0x183 == 2) {
        if (_0xdbf0x230 == 0) {
          _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
            if (_0xdbf0x8c['name'] < _0xdbf0x8d['name']) {
              return 1
            } else {
              if (_0xdbf0x8c['name'] > _0xdbf0x8d['name']) {
                return -1
              } else {
                return 0
              }
            }
          })
        } else {
          if (_0xdbf0x230 == 1) {
            _0xdbf0x1e0['sort'](function(_0xdbf0x8c, _0xdbf0x8d) {
              if (_0xdbf0x8c['name'] < _0xdbf0x8d['name']) {
                return -1
              } else {
                if (_0xdbf0x8c['name'] > _0xdbf0x8d['name']) {
                  return 1
                } else {
                  return 0
                }
              }
            })
          }
        }
      }
    }
  };
  var _0xdbf0x9c = document['getElementsByClassName']('friend_profile_info_hangar_sort_select search_card')[0]['getElementsByTagName']('input')[0];
  if (_0xdbf0x9c['value']['length'] > 0) {
    var _0xdbf0x22f = [];
    for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
      if (_0xdbf0x1e0[_0xdbf0x4]['name']['toLocaleUpperCase']()['indexOf'](_0xdbf0x9c['value']['toLocaleUpperCase']()) > -1) {
        _0xdbf0x22f['push'](_0xdbf0x1e0[_0xdbf0x4])
      }
    };
    _0xdbf0x1e0 = _0xdbf0x22f
  };
  if (_0xdbf0x1e0['length'] > 0) {
    document['getElementsByClassName']('friend_profile_info_hangar_scroll')[0]['style']['display'] = 'grid';
    document['getElementsByClassName']('friend_profile_info_hangar_no_scroll')[0]['style']['display'] = 'none'
  } else {
    document['getElementsByClassName']('friend_profile_info_hangar_scroll')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('friend_profile_info_hangar_no_scroll')[0]['style']['display'] = 'grid'
  };
  document['getElementsByClassName']('friend_profile_info_count_card')[0]['getElementsByTagName']('span')[0]['innerHTML'] = _0xdbf0x1e0['length'];
  var _0xdbf0x233 = _0xdbf0x1e0;
  if (_0xdbf0x22d == -1) {
    var _0xdbf0x234 = _0xdbf0x22b + 23 + window['friend_hangar_next'];
    window['friend_hangar_next'] = 1
  } else {
    var _0xdbf0x234 = _0xdbf0x22d - 1
  };
  _0xdbf0x1e0 = _0xdbf0x1e0['slice'](_0xdbf0x22b, _0xdbf0x234);
  var _0xdbf0x55 = document['getElementsByClassName']('friend_profile_info_hangar_scroll')[0];
  if (_0xdbf0x22c == 1) {
    while (_0xdbf0x55['firstChild']) {
      _0xdbf0x55['removeChild'](_0xdbf0x55['firstChild'])
    }
  };
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x1e0['length']; _0xdbf0x4++) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['className'] = 'friend_profile_info_hangar_item deck_type_' + _0xdbf0x1e0[_0xdbf0x4]['type'];
    var _0xdbf0x43c = document['createElement']('div');
    _0xdbf0x43c['className'] = 'friend_profile_info_hangar_item_flag';
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/' + window['cards'][_0xdbf0x1e0[_0xdbf0x4]['type']][_0xdbf0x1e0[_0xdbf0x4]['id']]['country'] + '.png';
    _0xdbf0x43c['appendChild'](_0xdbf0x90);
    _0xdbf0x8e['appendChild'](_0xdbf0x43c);
    var _0xdbf0x236 = document['createElement']('div');
    _0xdbf0x236['className'] = 'friend_profile_info_hangar_item_image';
    var _0xdbf0x237 = document['createElement']('div');
    var _0xdbf0x90 = document['createElement']('img');
    _0xdbf0x90['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/' + _0xdbf0x1e0[_0xdbf0x4]['type'] + '/' + _0xdbf0x1e0[_0xdbf0x4]['id'] + '.png';
    _0xdbf0x237['appendChild'](_0xdbf0x90);
    _0xdbf0x236['appendChild'](_0xdbf0x237);
    _0xdbf0x8e['appendChild'](_0xdbf0x236);
    var _0xdbf0x23a = document['createElement']('div');
    _0xdbf0x23a['className'] = 'friend_profile_info_hangar_item_type';
    var _0xdbf0x195 = document['createElement']('img');
    _0xdbf0x195['src'] = 'https://cdn.bravegames.space/regiment/images/hangar/type_' + _0xdbf0x1e0[_0xdbf0x4]['type'] + '.png';
    _0xdbf0x23a['appendChild'](_0xdbf0x195);
    _0xdbf0x8e['appendChild'](_0xdbf0x23a);
    var _0xdbf0x239 = document['createElement']('div');
    _0xdbf0x239['className'] = 'friend_profile_info_hangar_item_level';
    _0xdbf0x239['innerHTML'] = _0xdbf0x1e0[_0xdbf0x4]['level'] + 1;
    _0xdbf0x8e['appendChild'](_0xdbf0x239);
    var _0xdbf0x179 = document['createElement']('div');
    _0xdbf0x179['className'] = 'friend_profile_info_hangar_item_name';
    _0xdbf0x179['innerHTML'] = window['cards'][_0xdbf0x1e0[_0xdbf0x4]['type']][_0xdbf0x1e0[_0xdbf0x4]['id']]['name'];
    _0xdbf0x8e['appendChild'](_0xdbf0x179);
    _0xdbf0x55['appendChild'](_0xdbf0x8e);
    _0xdbf0x8e['dataset']['ttype'] = _0xdbf0x1e0[_0xdbf0x4]['type'];
    _0xdbf0x8e['dataset']['tid'] = _0xdbf0x1e0[_0xdbf0x4]['id'];
    if (_0xdbf0x22a == 1 && _0xdbf0x4 == 0) {
      _0xdbf0x8e['scrollTo']()
    }
  };
  var _0xdbf0x56 = document['getElementsByClassName']('friend_profile_info_hangar_scroll')[0]['getElementsByClassName']('friend_profile_info_hangar_item');
  if (_0xdbf0x233['length'] > _0xdbf0x56['length']) {
    var _0xdbf0x8e = document['createElement']('div');
    _0xdbf0x8e['innerHTML'] = 'Показать еще';
    _0xdbf0x8e['className'] = 'friend_profile_info_hangar_item_add';
    _0xdbf0x8e['onclick'] = function() {
      out_friend_hangar_card(0, _0xdbf0x22b + _0xdbf0x1e0['length'], 0, -1);
      var _0xdbf0x1f0 = event['target'];
      _0xdbf0x1f0['parentNode']['removeChild'](_0xdbf0x1f0)
    };
    _0xdbf0x55['appendChild'](_0xdbf0x8e)
  }
}

function hide_friend_profile() {
  play_effect('click.mp3');
  document['getElementsByClassName']('friend_profile')[0]['style']['display'] = 'none';
  document['getElementsByClassName']('main_menu')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('footer')[0]['style']['display'] = 'block'
}

function renewable_resources(_0xdbf0x76, _0xdbf0xa6, _0xdbf0x43f, _0xdbf0x440) {
  var _0xdbf0x441 = 300;
  var _0xdbf0x442 = window['limit_supply_max'];
  if (_0xdbf0x43f > 0) {
    _0xdbf0x442 += _0xdbf0x43f
  };
  if (_0xdbf0x440 > 0) {
    _0xdbf0x441 -= _0xdbf0x440
  };
  var _0xdbf0x15 = Math['floor']((get_current_timestamp() - _0xdbf0x76) / _0xdbf0x441);
  if (_0xdbf0xa6 == 0 && (_0xdbf0x442 < _0xdbf0x15)) {
    _0xdbf0x15 = _0xdbf0x442
  };
  if (_0xdbf0x442 > _0xdbf0xa6) {
    if (_0xdbf0x442 < (_0xdbf0xa6 + _0xdbf0x15)) {
      var _0xdbf0x32 = _0xdbf0x442
    } else {
      var _0xdbf0x32 = _0xdbf0xa6 + _0xdbf0x15
    }
  } else {
    var _0xdbf0x32 = _0xdbf0xa6
  };
  return _0xdbf0x32
}

function expiring_resources(_0xdbf0x444, _0xdbf0xd7, _0xdbf0x76) {
  var _0xdbf0x4c = _0xdbf0xd7;
  while (_0xdbf0x4c < get_current_timestamp()) {
    _0xdbf0x4c += _0xdbf0x76
  };
  var _0xdbf0x22b = _0xdbf0x4c - _0xdbf0x76;
  var _0xdbf0x234 = _0xdbf0x4c;
  if (_0xdbf0x444['time'] >= _0xdbf0x22b && _0xdbf0x444['time'] < _0xdbf0x234) {
    return _0xdbf0x444['amount']
  } else {
    return 0
  }
}

function change_type_supply() {
  play_effect('click.mp3');
  var _0xdbf0x3e9 = document['getElementsByClassName']('send_supply_scroll')[0]['getElementsByClassName']('send_supply_item');
  for (var _0xdbf0x4 = 0; _0xdbf0x4 < _0xdbf0x3e9['length']; _0xdbf0x4++) {
    _0xdbf0x3e9[_0xdbf0x4]['className'] = 'send_supply_item'
  };
  window['supply_send_type'] = this['dataset']['id'];
  this['className'] = 'send_supply_item active'
}

function show_tutorial(index) {
  if (index == 0 || index == 31 || index == 33) {
    document['getElementsByClassName']('button_tutorial_yes')[0]['style']['display'] = 'none';
    document['getElementsByClassName']('button_tutorial_no')[0]['style']['display'] = 'none'
  } else {
    if (index == 1 || index == 5 || index == 11 || index == 17 || index == 22) {
      document['getElementsByClassName']('game_karkass')[0]['style']['pointerEvents'] = 'none';
      document['getElementsByClassName']('help_interface')[0]['style']['pointerEvents'] = 'auto';
      document['getElementsByClassName']('music_interface')[0]['style']['pointerEvents'] = 'auto';
      document['getElementsByClassName']('sound_interface')[0]['style']['pointerEvents'] = 'auto';
      document['getElementsByClassName']('full_interface')[0]['style']['pointerEvents'] = 'auto';
      if (index == 11) {
        server_action('tutorial.reset', {
          "step": 2
        });
        window['player']['boxes'] = [];
        window['player']['boxes']['push']({
          "id": 0,
          "open_time": 0,
          "type": 0
        });
        window['player']['boxes']['push']({
          "id": 1,
          "open_time": get_current_timestamp(),
          "type": 7
        });
        window['player']['boxes']['push']({
          "id": 2,
          "open_time": 0,
          "type": 3
        });
        window['player']['static_resources']['boxes_id'] = 3
      } else {
        if (index == 5) {
          server_action('tutorial.reset', {
            "step": 1
          });
          delete window['player']['raid']['boss'];
          delete window['player']['raid']['finish_time'];
          delete window['player']['raid']['health'];
          delete window['player']['raid']['top']
        }
      }
    }
  };
  var tutorialElement = document['getElementsByClassName']('tutorial')[0];
  tutorialElement['style']['display'] = 'block';
  if (index == 20) {
    tutorialElement['style']['zIndex'] = '7'
  } else {
    tutorialElement['style']['zIndex'] = '4'
  };
  tutorialElement['dataset']['mode'] = index;
  tutorialElement['style']['background'] = 'rgba(0,0,0,0.8)';
  var marinaElement = tutorialElement['getElementsByClassName']('tutorial_marina')[0];
  marinaElement['style']['display'] = 'block';
  animation(marinaElement, 'left', -284, -5, 1, 500, 'show_tutorial_text_frame')
}

function show_tutorial_text_frame() {
  var element = document['getElementsByClassName']('tutorial_text_frame')[0];
  element['style']['display'] = 'block';
  animation(element, 'width', 0, 672, 1, 500, 'show_tutorial_print_text')
}

function show_tutorial_print_text(_0xdbf0x42) {
  var index = parseInt(_0xdbf0x42['parentNode']['dataset']['mode']);
  var _0xdbf0x36 = document['getElementsByClassName']('tutorial_text')[0];
  var phrases = ['Здравия желаю, товарищ генерал! Вы желаете пройти инструктаж?', 'Нам срочно нужна боевая поддержка на поле боя против Третьего рейха.', 'Отправляйтесь на фронт, чтобы выполнить приказ из штаба.', 'Уничтожьте в деревне укрепившийся вражеский отряд.', 'Поздравляю с успешным выполнением приказа, генерал!', 'Срочная информация! Отправляйтесь на фронт, чтобы выполнить новый приказ из штаба.', 'Появились секретные данные, где скрывается генерал-полковник Эрвин Йенеке.', '', 'Используйте фугасный снаряд из вашего арсенала.', '', 'Превосходный бой! Верховное командование поручает Вам уничтожение элиты Третьего рейха! Рекомендую идти на их штурм в команде проверенных боевых товарищей.', 'После сложного боя, необходимо восполнить ресурсы армии и получить заслуженную награду.', 'За победу над боссом выпадают два ящика: один с техникой, другой - с ресурсами. Не забывайте, что количество мест для хранения ящиков ограничено!', 'Ящики с техникой всегда доступны для вскрытия. Давайте откроем один из них.', '', '', 'Превосходная работа! Количество техники в ангаре увеличено.', 'Для более эффективного сражения, необходимо улучшить огневую мощь боевых снарядов.', 'Давайте применим сортировку техники и найдём ту, которую мы можем улучшить.', '', 'Здесь происходит улучшение техники и отображается изменение урона от боевых снарядов.', 'Отличная работа! Огневая мощь боевых снарядов увеличена.', 'Враг наступает со всех сторон. Нам не обойтись без помощи боевых товарищей, генерал!', 'Больше нет времени на разговоры, враг на подходе. Вперёд на защиту Родины, генерал!', '', '', '', '', '', '', '', 'Вы осознаёте необратимые последствия после ваших действий?', '', 'Генерал! Теперь Вам доступен раздел "Таланты", где Вы можете улучшить свои боевые характеристики. Для этого Вам потребуются очки талантов.', 'Добыть таланты Вы сможете в битве с выдающимся военным стратегом генералом-полковником Хайнцем Гудерианом.', 'Важная информация! В бою с боссом, Вам не стоит рассчитывать на помощь от боевых товарищей и придётся встретиться с врагом лицом к лицу на поле боя.', 'Перед нападением убедитесь в своей боевой готовности, генерал.'];
  var _0xdbf0x1e = phrases[index];
  if (index != 0 && index != 31) {
    if (window['player']['settings']['music'] == 1) {
      play_effect_down_volume('tutorial_' + index + '.mp3')
    } else {
      play_effect('tutorial_' + index + '.mp3')
    }
  };
  var _0xdbf0x44a = [0, 1500, 1000, 1000, 1000, 1500, 1500, 0, 1500, 0, 1500, 1000, 2000, 1500, 0, 0, 1000, 1000, 1000, 0, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1500, 1500, 1500, 1500];
  print_tutorial(Array['from'](_0xdbf0x1e), _0xdbf0x36, 50, 'show_tutorial_final_' + index, _0xdbf0x44a[index], index)
}

function print_tutorial(_0xdbf0x168, _0xdbf0x36, _0xdbf0x44c, _0xdbf0x1d, _0xdbf0x44d, _0xdbf0x5d) {
  if (_0xdbf0x168['length'] > 0) {
    _0xdbf0x36['innerHTML'] += _0xdbf0x168[0];
    setTimeout(function() {
      print_tutorial(_0xdbf0x168['splice'](1), _0xdbf0x36, _0xdbf0x44c, _0xdbf0x1d, _0xdbf0x44d, _0xdbf0x5d)
    }, _0xdbf0x44c)
  } else {
    if (_0xdbf0x5d == 0 || _0xdbf0x5d == 31) {
      var _0xdbf0x9f = document['getElementsByClassName']('button_tutorial_yes')[0];
      _0xdbf0x9f['style']['display'] = 'block';
      animation(_0xdbf0x9f, 'opacity', 0, 1, 0, 200, '');
      var _0xdbf0x9f = document['getElementsByClassName']('button_tutorial_no')[0];
      _0xdbf0x9f['style']['display'] = 'block';
      animation(_0xdbf0x9f, 'opacity', 0, 1, 0, 200, '')
    };
    setTimeout(function() {
      window[_0xdbf0x1d]();
      if (_0xdbf0x5d != 0 && _0xdbf0x5d != 31) {
        _0xdbf0x36['innerHTML'] = ''
      }
    }, _0xdbf0x44d)
  }
}

function tutorial_arrow(_0xdbf0x37b, _0xdbf0x37c, _0xdbf0x44f, _0xdbf0x10d, _0xdbf0x450) {
  window['tutorial_arrow_stoped'] = 0;
  var _0xdbf0x81 = document['getElementsByClassName']('tutorial_arrow')[0];
  _0xdbf0x81['style']['display'] = 'block';
  if (_0xdbf0x450 == 0) {
    _0xdbf0x81['style']['zIndex'] = '2'
  } else {
    if (_0xdbf0x450 == 1) {
      _0xdbf0x81['style']['zIndex'] = '4'
    } else {
      if (_0xdbf0x450 == 2) {
        _0xdbf0x81['style']['zIndex'] = '5'
      }
    }
  };
  switch (_0xdbf0x44f) {
    case 'right':
      _0xdbf0x81['style']['transform'] = 'rotate(180deg)';
      break;
    case 'left':
      _0xdbf0x81['style']['transform'] = 'rotate(0deg)';
      break;
    case 'up':
      _0xdbf0x81['style']['transform'] = 'rotate(90deg)';
      break;
    case 'down':
      _0xdbf0x81['style']['transform'] = 'rotate(270deg)';
      break
  };
  _0xdbf0x81['dataset']['start'] = _0xdbf0x37b;
  _0xdbf0x81['dataset']['finish'] = _0xdbf0x37c;
  if (_0xdbf0x44f == 'right' || _0xdbf0x44f == 'left') {
    _0xdbf0x81['style']['top'] = _0xdbf0x10d + 'px';
    tutorial_arrow_x_start(_0xdbf0x81)
  } else {
    _0xdbf0x81['style']['left'] = _0xdbf0x10d + 'px';
    tutorial_arrow_y_start(_0xdbf0x81)
  }
}

function tutorial_arrow_stop() {
  window['tutorial_arrow_stoped'] = 1;
  var _0xdbf0x81 = document['getElementsByClassName']('tutorial_arrow')[0];
  _0xdbf0x81['style']['display'] = 'none'
}

function tutorial_arrow_x_start(_0xdbf0x81) {
  if (window['tutorial_arrow_stoped'] == 0) {
    var _0xdbf0xd7 = parseInt(_0xdbf0x81['dataset']['start']);
    var _0xdbf0x453 = parseInt(_0xdbf0x81['dataset']['finish']);
    animation(_0xdbf0x81, 'left', _0xdbf0xd7, _0xdbf0x453, 1, 400, 'tutorial_arrow_x_finish')
  } else {
    window['tutorial_arrow_stoped'] = 2
  }
}

function tutorial_arrow_x_finish(_0xdbf0x81) {
  if (window['tutorial_arrow_stoped'] == 0) {
    var _0xdbf0xd7 = parseInt(_0xdbf0x81['dataset']['start']);
    var _0xdbf0x453 = parseInt(_0xdbf0x81['dataset']['finish']);
    animation(_0xdbf0x81, 'left', _0xdbf0x453, _0xdbf0xd7, 1, 400, 'tutorial_arrow_x_start')
  } else {
    window['tutorial_arrow_stoped'] = 2
  }
}

function tutorial_arrow_y_start(_0xdbf0x81) {
  if (window['tutorial_arrow_stoped'] == 0) {
    var _0xdbf0xd7 = parseInt(_0xdbf0x81['dataset']['start']);
    var _0xdbf0x453 = parseInt(_0xdbf0x81['dataset']['finish']);
    animation(_0xdbf0x81, 'top', _0xdbf0xd7, _0xdbf0x453, 1, 400, 'tutorial_arrow_y_finish')
  } else {
    window['tutorial_arrow_stoped'] = 2
  }
}

function tutorial_arrow_y_finish(_0xdbf0x81) {
  if (window['tutorial_arrow_stoped'] == 0) {
    var _0xdbf0xd7 = parseInt(_0xdbf0x81['dataset']['start']);
    var _0xdbf0x453 = parseInt(_0xdbf0x81['dataset']['finish']);
    animation(_0xdbf0x81, 'top', _0xdbf0x453, _0xdbf0xd7, 1, 400, 'tutorial_arrow_y_start')
  } else {
    window['tutorial_arrow_stoped'] = 2
  }
}

function tutorial_hide_marina(_0xdbf0x5d) {
  var _0xdbf0x36 = document['getElementsByClassName']('tutorial')[0];
  var _0xdbf0x186 = _0xdbf0x36['getElementsByClassName']('tutorial_text_frame')[0];
  var _0xdbf0x447 = _0xdbf0x36['getElementsByClassName']('tutorial_marina')[0];
  animation(_0xdbf0x447, 'top', 191, 650, 1, 300, '');
  animation(_0xdbf0x186, 'top', 316, 775, 1, 300, 'show_tutorial_finish_' + _0xdbf0x5d)
}

function tutorial_reset() {
  var _0xdbf0x36 = document['getElementsByClassName']('tutorial')[0];
  var _0xdbf0x186 = _0xdbf0x36['getElementsByClassName']('tutorial_text_frame')[0];
  var _0xdbf0x447 = _0xdbf0x36['getElementsByClassName']('tutorial_marina')[0];
  _0xdbf0x186['style']['display'] = 'none';
  _0xdbf0x186['style']['top'] = '316px';
  _0xdbf0x447['style']['display'] = 'none';
  _0xdbf0x447['style']['top'] = '191px';
  _0xdbf0x36['style']['background'] = 'none';
  _0xdbf0x36['style']['zIndex'] = 2;
  _0xdbf0x36['style']['display'] = 'none'
}

function tutorial_0_yes() {
  play_music('background.mp3');
  play_effect('click.mp3');
  window['player']['static_resources']['tutorial']++;
  tutorial_hide_marina(0)
}

function tutorial_0_no() {
  play_music('background.mp3');
  play_effect('click.mp3');
  tutorial_hide_marina(30)
}

function tutorial_0_no_yes() {
  play_effect('click.mp3');
  window['player']['static_resources']['tutorial'] = 24;
  tutorial_hide_marina(31)
}

function tutorial_0_no_no() {
  play_effect('click.mp3');
  tutorial_hide_marina(32)
}

function show_tutorial_final_0() {
  var _0xdbf0x9f = document['getElementsByClassName']('button_tutorial_yes')[0];
  _0xdbf0x9f['onclick'] = tutorial_0_yes;
  var _0xdbf0x9f = document['getElementsByClassName']('button_tutorial_no')[0];
  _0xdbf0x9f['onclick'] = tutorial_0_no
}

function show_tutorial_finish_0() {
  document['getElementsByClassName']('button_tutorial_yes')[0]['style']['opacity'] = '0';
  document['getElementsByClassName']('button_tutorial_no')[0]['style']['opacity'] = '0';
  document['getElementsByClassName']('tutorial_text')[0]['innerHTML'] = '';
  tutorial_reset();
  show_tutorial(1)
}

function show_tutorial_final_1() {
  tutorial_hide_marina(1)
}

function show_tutorial_finish_1() {
  var _0xdbf0x9f = document['getElementById']('main_missions');
  _0xdbf0x9f['style']['opacity'] = '1';
  _0xdbf0x9f['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  var _0xdbf0x351 = get_season();
  if (_0xdbf0x351 == 'autumn') {
    tutorial_arrow(730, 790, 'right', 310, 0)
  } else {
    if (_0xdbf0x351 == 'winter') {
      tutorial_arrow(160, 220, 'left', 310, 0)
    } else {
      if (_0xdbf0x351 == 'spring') {
        tutorial_arrow(200, 260, 'left', 310, 0)
      } else {
        if (_0xdbf0x351 == 'summer') {
          tutorial_arrow(150, 210, 'left', 270, 0)
        }
      }
    }
  }
}

function show_tutorial_final_2() {
  tutorial_hide_marina(2)
}

function show_tutorial_finish_2() {
  var _0xdbf0x36 = document['getElementsByClassName']('missions_map')[0];
  _0xdbf0x36['getElementsByClassName']('mission_sector')[0]['style']['pointerEvents'] = 'auto';
  _0xdbf0x36['getElementsByClassName']('mission_sector_frame')[0]['style']['background'] = 'url(https://cdn.bravegames.space/regiment/images/streak_name_hover.png) no-repeat';
  tutorial_reset();
  tutorial_arrow(295, 260, 'up', 110, 0)
}

function show_tutorial_final_3() {
  tutorial_hide_marina(3)
}

function show_tutorial_finish_3() {
  tutorial_reset();
  window['player']['static_resources']['tutorial']++
}

function show_tutorial_final_4() {
  tutorial_hide_marina(4)
}

function show_tutorial_finish_4() {
  document['getElementsByClassName']('win_button')[0]['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(365, 305, 'down', 477, 0)
}

function show_tutorial_final_5() {
  tutorial_hide_marina(5)
}

function show_tutorial_finish_5() {
  var _0xdbf0x9f = document['getElementById']('main_raids');
  _0xdbf0x9f['style']['pointerEvents'] = 'auto';
  _0xdbf0x9f['style']['opacity'] = '1';
  tutorial_reset();
  var _0xdbf0x351 = get_season();
  if (_0xdbf0x351 == 'autumn') {
    tutorial_arrow(245, 305, 'up', 690, 0)
  } else {
    if (_0xdbf0x351 == 'winter') {
      tutorial_arrow(280, 340, 'up', 770, 0)
    } else {
      if (_0xdbf0x351 == 'spring') {
        tutorial_arrow(230, 290, 'up', 680, 0)
      } else {
        if (_0xdbf0x351 == 'summer') {
          tutorial_arrow(260, 320, 'up', 655, 0)
        }
      }
    }
  }
}

function show_tutorial_final_6() {
  tutorial_hide_marina(6)
}

function show_tutorial_finish_6() {
  document['getElementsByClassName']('bosses_map_list')[0]['getElementsByClassName']('bosses_sector')[0]['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(705, 755, 'right', 363, 0)
}

function show_tutorial_final_8() {
  tutorial_hide_marina(8)
}

function show_tutorial_finish_8() {
  document['getElementsByClassName']('boss_fight_weapons_list')[0]['getElementsByClassName']('boss_fight_weapons_item')[7]['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(530, 470, 'down', 526, 1)
}

function show_tutorial_final_10() {
  tutorial_hide_marina(10)
}

function show_tutorial_finish_10() {
  var _0xdbf0x36 = document['getElementsByClassName']('bosses_map')[0];
  var _0xdbf0x9f = _0xdbf0x36['getElementsByClassName']('modal_close')[0];
  _0xdbf0x9f['style']['display'] = 'block';
  _0xdbf0x9f['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(93, 153, 'up', 950, 1)
}

function show_tutorial_final_11() {
  tutorial_hide_marina(11)
}

function show_tutorial_finish_11() {
  document['getElementById']('boxes')['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(410, 350, 'down', 736, 0)
}

function show_tutorial_final_12() {
  tutorial_hide_marina(12)
}

function show_tutorial_finish_12() {
  tutorial_reset();
  tutorial_arrow(110, 170, 'up', 85, 0);
  document['getElementsByClassName']('boxes_limit')[0]['classList']['add']('animate');
  setTimeout(tutorial_13, 3000)
}

function tutorial_13() {
  document['getElementsByClassName']('boxes_limit')[0]['classList']['remove']('animate');
  tutorial_arrow_stop();
  window['player']['static_resources']['tutorial']++;
  show_tutorial(13)
}

function show_tutorial_final_13() {
  tutorial_hide_marina(13)
}

function show_tutorial_finish_13() {
  document['getElementsByClassName']('boxes_grid_scroll')[0]['getElementsByClassName']('boxes_grid_list_item')[2]['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(370, 430, 'up', 394, 0)
}

function show_tutorial_final_16() {
  tutorial_hide_marina(16)
}

function show_tutorial_finish_16() {
  var _0xdbf0x9f = document['getElementsByClassName']('boxes_block')[0]['getElementsByClassName']('modal_close')[0];
  _0xdbf0x9f['style']['display'] = 'block';
  _0xdbf0x9f['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(107, 167, 'up', 953, 0)
}

function show_tutorial_final_17() {
  tutorial_hide_marina(17)
}

function show_tutorial_finish_17() {
  document['getElementById']('main_hangar')['style']['pointerEvents'] = 'auto';
  document['getElementById']('main_hangar')['style']['opacity'] = 1;
  tutorial_reset();
  var _0xdbf0x351 = get_season();
  if (_0xdbf0x351 == 'autumn') {
    tutorial_arrow(290, 350, 'up', 340, 0)
  } else {
    if (_0xdbf0x351 == 'winter') {
      tutorial_arrow(330, 270, 'up', 420, 0)
    } else {
      if (_0xdbf0x351 == 'spring') {
        tutorial_arrow(160, 220, 'up', 430, 0)
      } else {
        if (_0xdbf0x351 == 'summer') {
          tutorial_arrow(270, 330, 'up', 435, 0)
        }
      }
    }
  }
}

function show_tutorial_final_18() {
  tutorial_hide_marina(18)
}

function show_tutorial_finish_18() {
  var _0xdbf0x36 = document['getElementsByClassName']('hangar_block')[0];
  var _0xdbf0x42 = _0xdbf0x36['getElementsByClassName']('sort_card')[0];
  _0xdbf0x42['style']['pointerEvents'] = 'auto';
  _0xdbf0x42['onmouseover'] = tutorial_18;
  tutorial_reset();
  tutorial_arrow(105, 165, 'up', 364, 0)
}

function tutorial_18() {
  this['onmouseover'] = '';
  var _0xdbf0x216 = this['getElementsByTagName']('ul')[0];
  _0xdbf0x216['style']['display'] = 'block';
  _0xdbf0x216['style']['cursor'] = 'default';
  var _0xdbf0x55 = _0xdbf0x216['getElementsByTagName']('li');
  _0xdbf0x55[0]['style']['pointerEvents'] = 'none';
  _0xdbf0x55[1]['style']['pointerEvents'] = 'none';
  _0xdbf0x55[2]['style']['pointerEvents'] = 'none';
  _0xdbf0x55[3]['style']['pointerEvents'] = 'none';
  _0xdbf0x55[4]['style']['cursor'] = 'pointer';
  window['player']['static_resources']['tutorial']++;
  tutorial_arrow_stop();
  setTimeout(tutorial_arrow_hangar_sort, 50)
}

function tutorial_arrow_hangar_sort() {
  if (window['tutorial_arrow_stoped'] == 2) {
    tutorial_arrow(210, 150, 'right', 221, 0)
  } else {
    setTimeout(tutorial_arrow_hangar_sort, 50)
  }
}

function show_tutorial_final_20() {
  tutorial_hide_marina(20)
}

function show_tutorial_finish_20() {
  document['getElementById']('btn_upgrade')['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(455, 515, 'up', 510, 2)
}

function show_tutorial_final_21() {
  tutorial_hide_marina(21)
}

function show_tutorial_finish_21() {
  var modal = document['getElementsByClassName']('hangar_block')[0]['getElementsByClassName']('modal_close')[0];
  modal['style']['display'] = 'block';
  modal['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(103, 163, 'up', 954, 0)
}

function show_tutorial_final_22() {
  tutorial_hide_marina(22)
}

function show_tutorial_finish_22() {
  document['getElementsByClassName']('add_friend')[0]['style']['pointerEvents'] = 'auto';
  tutorial_reset();
  tutorial_arrow(850, 910, 'left', 535, 1)
}

function show_tutorial_final_23() {
  tutorial_hide_marina(23)
}

function show_tutorial_finish_23() {
  document['getElementsByClassName']('game_karkass')[0]['style']['pointerEvents'] = '';
  document['getElementById']('main_missions')['style']['pointerEvents'] = '';
  document['getElementById']('main_raids')['style']['pointerEvents'] = '';
  document['getElementById']('main_hangar')['style']['pointerEvents'] = '';
  var btnClose = document['getElementById']('btn_close');
  btnClose['classList']['remove']('button_dark');
  btnClose['classList']['add']('button_red');
  var modals = document['getElementsByClassName']('modal_close');
  for (var i = 0; i < modals['length']; i++) {
    modals[i]['style']['display'] = ''
  };
  document['getElementsByClassName']('boss_wiki_icon')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('missions_map')[0]['getElementsByClassName']('modal_close')[0]['style']['display'] = 'block';
  document['getElementsByClassName']('sector_map')[0]['getElementsByClassName']('modal_close')[0]['style']['display'] = 'block';
  tutorial_reset();
  server_action('tutorial.finish', {});
  show_daily_reward()
}

function show_tutorial_finish_30() {
  document['getElementsByClassName']('button_tutorial_yes')[0]['style']['opacity'] = '0';
  document['getElementsByClassName']('button_tutorial_no')[0]['style']['opacity'] = '0';
  document['getElementsByClassName']('tutorial_text')[0]['innerHTML'] = '';
  tutorial_reset();
  show_tutorial(31)
}

function show_tutorial_final_31() {
  var yesButton = document['getElementsByClassName']('button_tutorial_yes')[0];
  yesButton['onclick'] = tutorial_0_no_yes;
  var noButton = document['getElementsByClassName']('button_tutorial_no')[0];
  noButton['onclick'] = tutorial_0_no_no
}

function show_tutorial_finish_31() {
  tutorial_reset();
  document['getElementsByClassName']('tutorial_text')[0]['innerHTML'] = '';
  server_action('tutorial.finish', {});
  show_daily_reward()
}

function show_tutorial_finish_32() {
  document['getElementsByClassName']('tutorial_text')[0]['innerHTML'] = '';
  tutorial_reset();
  show_tutorial(0)
}

function show_tutorial_final_33() {
  tutorial_hide_marina(33)
}

function show_tutorial_finish_33() {
  tutorial_reset();
  show_tutorial(34)
}

function show_tutorial_final_34() {
  tutorial_hide_marina(34)
}

function show_tutorial_finish_34() {
  tutorial_reset();
  show_tutorial(35)
}

function show_tutorial_final_35() {
  tutorial_hide_marina(35)
}

function show_tutorial_finish_35() {
  tutorial_reset();
  show_tutorial(36)
}

function show_tutorial_final_36() {
  tutorial_hide_marina(36)
}

function show_tutorial_finish_36() {
  tutorial_reset();
  server_action('talents.tutorial', {});
  window['player']['static_resources']['tutorial_talents'] = 1;
  var headerElement = document['getElementsByClassName']('header')[0];
  headerElement['style']['pointerEvents'] = '';
  headerElement['getElementsByClassName']('music_interface')[0]['style']['pointerEvents'] = '';
  headerElement['getElementsByClassName']('sound_interface')[0]['style']['pointerEvents'] = ''
}

function random(seed) {
  var _0xdbf0x494 = Math['sin'](seed);
  var _0xdbf0x495 = Math['round'](_0xdbf0x494 * 4294967296);
  var _0xdbf0x496 = _0xdbf0x495 & 65535;
  var output = _0xdbf0x496 / 65536;
  return output
}