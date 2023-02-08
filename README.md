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
