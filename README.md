# parse-lfs-message

[![NPM Version](https://img.shields.io/npm/v/parse-lfs-message?style=flat-square)](https://www.npmjs.com/package/parse-lfs-message) ![Node.js CI](https://github.com/simbroadcasts/parse-lfs-message/actions/workflows/.github/workflows/node.js.yml/badge.svg)

Convert a [Live for Speed](https://lfs.net) message to UTF-8

This module is designed to be used with NodeJS on the server with [xi4n](https://github.com/theangryangel/XI4N) or as middleware for other LFS InSim applications. This module will parse any LFS message (chat message, nickname, server name etc.), converting encoded Windows codepage characters to UTF-8. This module leaves message colour encodings intact for processing later.

## Install

```bash
# Install with Yarn
yarn add parse-lfs-message

# Install with NPM
npm i parse-lfs-message
```

## Usage Example

You can run the example with `yarn example` or `npm run example`.

```javascript
// Require parse-lfs-message module
const parseLFSMessage = require("parse-lfs-message");

// Simulate receiving messages from a buffer
const msg1 = Buffer.from("^72^45 ^7B2^J^4Ï^1 Ayoub", "binary");
const msg2 = Buffer.from("^405 ^J¢^7Ï§^4£ ^7TJ", "binary");

// Parse messages
const parsedMsg1 = parseLFSMessage(msg1);
const parsedMsg2 = parseLFSMessage(msg2);

console.log(parsedMsg1);
// Output: ^72^45 ^7B2^4ﾏ ^1Ayoub

console.log(parsedMsg2);
// Output: ^405 ｢^7ﾏｧ^4｣ ^7TJ
```

## Options

`parseLFSMessage` accepts an optional second argument.

### `originalCodepage`

LFS messages can contain an `^8` control character, meaning "return to original colour and code page". The `originalCodepage` option tells the parser which code page to switch back to when it encounters `^8`. In the output, `^8` is always rendered as `^9`, since they render as the same colour in LFS.

If not provided, it defaults to Latin-1 (`"L"`).

For LFS output messages, the original code page can be read from the `MSOData` property of the `IS_MSO` packet.

```javascript
const parsedMsg = parseLFSMessage(msg, { originalCodepage: "J" });
```

Valid values are:

| Value | Code page                  |
| ----- | -------------------------- |
| `L`   | Latin-1 (CP1252)           |
| `G`   | Greek (CP1253)             |
| `C`   | Cyrillic (CP1251)          |
| `E`   | Central Europe (CP1250)    |
| `T`   | Turkish (CP1254)           |
| `B`   | Baltic (CP1257)            |
| `J`   | Japanese (Shift-JIS)       |
| `H`   | Traditional Chinese (Big5) |
| `S`   | Simplified Chinese (GBK)   |
| `K`   | Korean (EUC-KR)            |
