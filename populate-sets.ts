const fs = require('fs');
const path = require('path');

async function downloadSetIcons() {
  const res = await fetch('https://api.scryfall.com/sets');
  const { data } = await res.json();

  const iconsDir = path.join(process.cwd(), 'public', 'set_icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  for (const set of data) {
    const iconUrl = set.icon_svg_uri;
    const setCode = set.code;
    if (iconUrl) {
      try {
        const iconRes = await fetch(iconUrl);
        const svg = await iconRes.text();
        fs.writeFileSync(path.join(iconsDir, `${setCode}.svg`), svg);
        console.log(`Saved ${setCode}.svg`);
      } catch (err) {
        console.error(`Failed to save ${setCode}:`, err);
      }
    }
  }
}
downloadSetIcons();