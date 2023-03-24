// Import parse-lfs-message module
import parseLFSMessage from "../dist/index.esm.js";

// Simulate receiving messages from a buffer
const msg1 = Buffer.from("^72^45 ^7B2^J^4Ï^1 Ayoub", "binary");
const msg2 = Buffer.from("^405 ^J¢^7Ï§^4£ ^7TJ", "binary");

// Parse messages
const parsedMsg1 = parseLFSMessage(msg1);
const parsedMsg2 = parseLFSMessage(msg2);

console.log(parsedMsg1);
// ^72^45 ^7B2^4ﾏ ^1Ayoub

console.log(parsedMsg2);
// ^405 ｢^7ﾏｧ^4｣ ^7TJ
