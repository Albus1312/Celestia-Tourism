const fs = require('fs');
const w = 1200;
const h = 40;
let p = [];
for (let i = 0; i <= w; i += 5) {
  p.push(i + ',' + (Math.random() * 10 + 20));
}
p.push(w + ',' + h, '0,' + h);
let c = '';
for (let i = 0; i < 200; i++) {
  c += `<circle cx="${Math.random() * w}" cy="${Math.random() * 20 + 5}" r="${Math.random() * 4 + 1}" fill="#fafafa" opacity="${Math.random() * 0.7 + 0.3}"/>`;
}
// Add some rough polygons for brush strokes
for(let i=0; i<30; i++) {
  let bx = Math.random() * w;
  let by = Math.random() * 15 + 10;
  let bw = Math.random() * 30 + 10;
  let bh = Math.random() * 10 + 5;
  c += `<ellipse cx="${bx}" cy="${by}" rx="${bw}" ry="${bh}" fill="#fafafa" transform="rotate(${Math.random()*20-10} ${bx} ${by})" opacity="${Math.random()*0.8+0.2}"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
<polygon points="${p.join(' ')}" fill="#fafafa"/>
${c}
</svg>`;

console.log('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'));
