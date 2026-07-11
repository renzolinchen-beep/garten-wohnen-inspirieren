
// Sprint 53
export function createPostCard(post, isFavorite = false) {
  return `
    <article class="card post-card" data-id="${post.id}">
      <img src="${post.image}" alt="${post.title}" class="post-image">
      <div class="post-content">
        <div class="post-meta">
          <span class="badge">${post.category}</span>
          <span class="post-date">${post.date}</span><span class="read-time">⏱️ ${post.readTime || "5 Min."}</span>
        </div>
        <button class="share-btn" data-share="${post.id}">🔗 Teilen</button>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="post-actions">
          <button class="favorite-btn" data-id="${post.id}" aria-label="Favorit umschalten">
            ${isFavorite ? "★ Favorit" : "☆ Favorit"}
          </button>
          <a class="read-btn" href="post.html?id=${post.id}">Beitrag lesen</a>
        <button class="share-btn" data-share-url="post.html?id=${post.id}" data-share-title="${post.title}">🔗 Teilen</button></div>
      </div>
    </article>
  `;
}

export function renderPosts(posts, container, favorites = []) {
  if (!posts.length) {
    container.innerHTML = `
      <div class="card empty-state">
        <h3>Keine Beiträge gefunden</h3>
        <p>Versuche einen anderen Suchbegriff oder wähle eine andere Kategorie.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = posts
    .map(post => createPostCard(post, favorites.includes(post.id)))
    .join("");
}

export function getCategories(posts) {
  return [...new Set(posts.map(post => post.category))].sort();
}
