/* global io, SOCKET_URL */

import { app, bouncerRotate, bouncerSling, bouncerJump, bouncerSpread, changePalette } from './lib/visual';

document.addEventListener('mousemove', (e) => {
  const x = (e.pageX / window.innerWidth) - 0.5;
  let y = (e.pageY / window.innerHeight) - 0.5;
  y *= -1;
  bouncerSling(y);
  bouncerSpread(x);
});

document.addEventListener('click', () => {
  bouncerJump(0.1);
  changePalette();
});

// const FREQ_CHANGE_PALETTE = 10 * 1000;
// setInterval(changePalette, FREQ_CHANGE_PALETTE);
