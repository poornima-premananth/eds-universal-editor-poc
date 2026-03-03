export default function decorate(block) {
  const config = {};
  const rows = block.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length === 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      config[key] = value;
    }
  });  
  const { author_name, role, date, image } = config;
  block.innerHTML = `
    <div class="author-card">
      ${image ? `<img src="${image}" alt="${author_name}" />` : ''}
      <div class="author-details">
        <h4>${author_name || ''}</h4>
        <p>${role || ''}</p>
        <span>${date || ''}</span>
      </div>
    </div>
  `;
}