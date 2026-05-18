function hslToLinearRGB(h, s, l) {
  h = h/360; s = s/100; l = l/100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q-p)*6*t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q-p)*(2/3-t)*6;
      return p;
    };
    const q = l < 0.5 ? l*(1+s) : l+s-l*s;
    const p = 2*l - q;
    r = hue2rgb(p, q, h+1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h-1/3);
  }
  return [r, g, b];
}
function sRGBToLinear(c) { return c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }
function lum(h, s, l) {
  const [r, g, b] = hslToLinearRGB(h, s, l);
  return 0.2126*sRGBToLinear(r) + 0.7152*sRGBToLinear(g) + 0.0722*sRGBToLinear(b);
}
function contrast(h1,s1,l1, h2,s2,l2) {
  const a = lum(h1,s1,l1), b = lum(h2,s2,l2);
  const lighter = Math.max(a,b), darker = Math.min(a,b);
  return (lighter+0.05)/(darker+0.05);
}
console.log('142 70% 40% vs white:', contrast(142,70,40, 0,0,100).toFixed(4));
console.log('142 70% 30% vs white:', contrast(142,70,30, 0,0,100).toFixed(4));
console.log('142 70% 25% vs white:', contrast(142,70,25, 0,0,100).toFixed(4));
console.log('142 70% 20% vs white:', contrast(142,70,20, 0,0,100).toFixed(4));
console.log('142 80% 25% vs white:', contrast(142,80,25, 0,0,100).toFixed(4));
console.log('142 100% 20% vs white:', contrast(142,100,20, 0,0,100).toFixed(4));
console.log('142 76% 36% vs white:', contrast(142,76,36, 0,0,100).toFixed(4));
