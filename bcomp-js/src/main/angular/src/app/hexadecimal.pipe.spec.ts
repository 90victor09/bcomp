import { HexadecimalPipe } from './hexadecimal.pipe';

describe('HexadecimalPipe', () => {
  it('create an instance', () => {
    const pipe = new HexadecimalPipe();
    expect(pipe).toBeTruthy();
  });
});
