# brave-regiment-bot

## Description

Unsuccessful attempt of making bot for [**Brave Regiment**](https://vk.com/games/brave_regiment) game 

Why? Here are my thoughts:
- Developers of this game made bot for similar game in the past. Audience keeps using bot for farming and not actually playing the game (nowadays this [game](https://vk.com/games/vokope) is closed due to flash-player shutdown).
- According to the above-mentioned — developers decided to make "one-way" api which is hard to use to make bot

## API
- URL endpoint contains `game_login` and `game_token`. Both values are located inside `<script>` entity after `<iframe>` dynamic load (the only way to obtain it is to use tool like `puppeteer`). At least `game_login` is just static user id, but `game_token` is unique and dynamically generated at page startup time.
- Game makes two core requests: `init` is used to obtain `secret` and `key` values, which are needed for subsequent requests, `get` request is used to fetch user data like level, coins, etc.
- After sending custom requests (e.g., collect daily reward, attack boss, spend energy to complete mission) the only one thing you will get is response status `{"result":"ok"}`. No way to obtain current state of player, you need manually recalculate own state (which has been obtained after `get` request) or relogin. This is bad and you can't easily track things (e.g, when you gain enough energy bot needs to start mission again, or get status of current raid and start new if it was ended)
- Also its not possible to run 2 or more instances of the game at the same time - you will get authorization error (doesn't matter same browser or different devices)

## Reversing

Api request contains encoded data and its hard to say what it is doing, unless you dive into source code and investigate how does it works.

List of core functions what are needed to make requests (some of them could be replaced by official one)
- `md5(data)` — `epls.js` (node `crypto` module)
- `Base64.fromUint8Array(compressed)` — `base32.js` (node `Buffer`)
- `pako.deflate(strData, { level: 9 })` — `rar.js` (npm `pako` module)
- `JXG.decompress(data)` — `md5.js` (idk what is it)

Repo contains reversed part of `core.js`

Tools that helped me a lot:
- https://lelinhtinh.github.io/de4js/
- https://beautifier.io/


## Few samples of encoded/decoded data inside requests

<pre>
<b>secret:</b> Qh9iYq (used to obtain md5 checksum for integrity check)
</pre>

<b>init</b>
<pre>
<b>query:</b> ts=1649104540&friends={}&rnd=8397&sign=0ac7b2cd20f218848c8e26ecb8d4cafd
<b>body:</b> uZxKqPLXfJEVECPOcJvIohOoVfzbjPix/1/I3u59LVmMwR0alootSSs0yO9PjlLKm87FqJLpf1pMCzemmbLxjxWurKl5D+nIQLpm2E3acGi7
<b>Game-check:</b> a2bb30e70a39489e42bae1a1f704e52e
</pre>

<pre>
response is too big
</pre>

<b>get</b>
<pre>
<b>query:</b> ts=1649104540&rnd=8409&sign=c283068e623c14b6a8f67a0a0ab87d63
<b>body:</b> uZxZqReBtPECGdUmpXslQ31yoGkClYZC/5Zrx8ggHpxqzPPTDTYL8omo7NtL9pXsFGdOte+VdzbW4idqybi1SvEgdh2IRY==
<b>Game-check:</b> a6c38b118d88e2b22bd581a3ba413629
<b>Game-key:</b> 0s6I7Zyogi
</pre>

<pre>
response is too big
</pre>

<b>action</b>
<pre>
<b>query:</b> ts=1649104546&requests=[{"method":"daily.get_reward","params":{}}]&rnd=1527&sign=d872fb60e61c0c274e7ad59e3578238f
<b>body:</b> uZxvHdLXflEC/Am+WllFcekp/0UfdSXArfxD593RomI19SzOj6zEGX7cxAFw4fGdwjdRIj67xGU5GCBZ4sQu0tRr0PPU9gD1RURMQd5o/fY3ZOnLSRgq98KMPp2x9Zt99ITJhmIcq91D3xnnoIwouwVHciQXlYDooG4Zp895uqcA
<b>Game-check:</b> bd8e618aba754f43ad6294a58cdef538
<b>Game-key:</b> 0s6I7Zyogi
</pre>

<pre>
<b>uZyHZOdIZHVmIl2jnIeGCwIZSDUegabVbu5JESMrG7F=</b> is decoded into <b>{"result":"ok"}</b>
</pre>
