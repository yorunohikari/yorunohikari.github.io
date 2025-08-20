const MAX_VISIBLE = 5;

function createAnimeSection(title, entries) {
  const section = document.createElement('div');
  section.classList.add('anime-section');

  const header = document.createElement('h3');
  header.textContent = title;
  section.appendChild(header);

  const list = document.createElement('ul');
  list.classList.add('anime-ul');

  entries.slice(0, MAX_VISIBLE).forEach(entry => {
    const item = document.createElement('li');
    const a = document.createElement('a');
    a.href = entry.link;
    a.target = "_blank";
    a.textContent = entry.name;
    item.appendChild(a);
    list.appendChild(item);
  });

  section.appendChild(list);

  if (entries.length > MAX_VISIBLE) {
    const expandBtn = document.createElement('button');
    expandBtn.textContent = 'Show All';
    expandBtn.classList.add('anime-expand-btn');
    expandBtn.addEventListener('click', () => {
      list.innerHTML = '';
      entries.forEach(entry => {
        const item = document.createElement('li');
        const a = document.createElement('a');
        a.href = entry.link;
        a.target = "_blank";
        a.textContent = entry.name;
        item.appendChild(a);
        list.appendChild(item);
      });
      expandBtn.remove();
    });
    section.appendChild(expandBtn);
  }

  return section;
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('animelist.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('anime-list-container');
      ['Watching', 'Completed', 'On-Hold', 'Dropped'].forEach(status => {
        if (data[status]) {
          const section = createAnimeSection(status, data[status]);
          container.appendChild(section);
        }
      });
    })
    .catch(err => {
      console.error('Failed to load animelist.json', err);
      document.getElementById('anime-list-container').innerHTML = '<p style="color:#999">Failed to load anime list.</p>';
    });
});
