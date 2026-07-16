const w = 800;
const h = 30;
let p = [];
for (let i = 0; i <= w; i += 10) {
  p.push(i + ',' + (Math.random() * 8 + 15));
}
p.push(w + ',' + h, '0,' + h);
let c = '';
for (let i = 0; i < 40; i++) {
  c += `<circle cx="${Math.random() * w}" cy="${Math.random() * 10 + 5}" r="${Math.random() * 3 + 1}" opacity="${Math.random() * 0.7 + 0.3}"/>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polygon points="${p.join(' ')}"/>${c}</svg>`;
console.log('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'));
