const palette = [
  {
    background: 0x7b548b,
    bouncer: [0xed5742, 0xf9c600, 0xbacf33, 0x0178ad, 0xffffff],
  },
  {
    // yellow, magenta, cyan. pair with black bg
    background: 0x000000,
    bouncer: [0xffff00, 0xff00ff, 0x00ffff],
  },
  {
    // color from http://acko.net. pair with 0x495e77
    background: 0x495e77,
    bouncer: [0xde5a33, 0x00b0d4, 0xdeebf0],
  },
  {
    // color from graffiti
    background: 0x8a6288,
    bouncer: [0xf7e73f, 0xa1dfb3, 0xea7dce],
  },
  {
    // color from graffiti
    background: 0x1d232c,
    bouncer: [0xd850c3, 0x5c02b8, 0x89ff42],
  },
  {
    // color from graffiti
    background: 0xb8ece5,
    bouncer: [0xedf9f5, 0xfa8fc0, 0x09f8f9],
  },
  {
    // color from http://www.colourlovers.com/palette/359978/w_o_r_d_l_e_s_s_
    background: 0xffffff,
    bouncer: [0xffffff, 0xCBE86B, 0x1C140D],
  },
  {
    // color from http://www.colourlovers.com/palette/937624/Dance_To_Forget
    background: 0xFF4E50,
    bouncer: [0xEDE574, 0xFC913A, 0xE1F5C4],
  },
  {
    // color from colourlovers.com
    background: 0xF0F2EB,
    bouncer: [0xF4FAD2, 0xFF4242, 0xE1EDB9, 0xD4EE5E],
  },
];

function getPalette() {
  let paletteIndex;
  const lastPaletteIndex = Number(localStorage.getItem('lastPaletteIndex'));
  if (lastPaletteIndex === null) {
    paletteIndex = Math.floor(Math.random() * palette.length);
  } else {
    // if record exists, advance index
    paletteIndex = lastPaletteIndex + 1;
    if (paletteIndex >= palette.length) paletteIndex = 0;
  }
  localStorage.setItem('lastPaletteIndex', paletteIndex);
  return palette[paletteIndex];
}

export default getPalette;
