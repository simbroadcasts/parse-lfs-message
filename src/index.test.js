const parseLFSMessage = require('./index');

describe('parseLFSMessage', () => {
  it('should parse LFS messages', () => {
    Object.entries({
      '^72^45 ^7B2^J^4Ï^1 Ayoub': '^72^45 ^7B2^4ﾏ^1 Ayoub',
    }).forEach(([key, value]) => expect(parseLFSMessage(Buffer.from(key, "binary"))).toEqual(value))
  });
});
