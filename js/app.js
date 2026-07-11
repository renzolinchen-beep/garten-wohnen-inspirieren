import { loadPosts } from "./blog.js";
import { renderPosts, getCategories } from "./blog-module.js";
import {
  getFavorites,
  toggleFavorite,
  applySavedTheme,
  getTheme,
  setTheme
} from "./storage.js";

let allPosts = [];

document.addEventListener("DOMContentLoaded", async () => {
  applySavedTheme();

  const postsContainer = document.getElementById("posts");
  const searchInput = document.getElementById("search");
  const categoryContainer = document.getElementById("categories");
  const themeToggle = document.getElementById("themeToggle");

  try {
    allPosts = await loadPosts();
    updateView();

    const categories = getCategories(allPosts);

    categoryContainer.innerHTML = `
      <button class="category-btn active" data-category="Alle">Alle</button>
      ${categories
        .map(cat => `<button class="category-btn" data-category="${cat}">${cat}</button>`)
        .join("")}
    `;

    categoryContainer.addEventListener("click", event => {
      const btn = event.target.closest(".category-btn");
      if (!btn) return;

      categoryContainer.querySelectorAll(".category-btn")
        .forEach(el => el.classList.remove("active"));

      btn.classList.add("active");
      updateView();
    });

    searchInput.addEventListener("input", updateView);

    postsContainer.addEventListener("click", event => {
      const btn = event.target.closest(".favorite-btn");
      if (!btn) return;

      toggleFavorite(Number(btn.dataset.id));
      updateView();
    });

    themeToggle.addEventListener("click", () => {
      const nextTheme = getTheme() === "light" ? "dark" : "light";
      setTheme(nextTheme);
    });

  } catch (error) {
    postsContainer.innerHTML = `
      <div class="card empty-state">
        <h3>Fehler</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
});

function updateView() {
  const postsContainer = document.getElementById("posts");
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const activeCategory = document.querySelector(".category-btn.active")?.dataset.category || "Alle";

  let filtered = allPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm);

    const matchesCategory =
      activeCategory === "Alle" || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const favs=getFavorites();
  renderPosts(filtered, postsContainer, favs);
  const favGrid=document.getElementById("favorite-grid");
  if(favGrid){
    const list=allPosts.filter(post=>favs.includes(post.id));
    favGrid.innerHTML=list.length?list.map(post=>`<div class="card favorite-card">
<h3>${post.title}</h3>
<p>${post.excerpt}</p>
<button class="favorite-btn" data-id="${post.id}">★ Entfernen</button>
</div>`).join(""):"<p>Noch keine Favoriten gespeichert.</p>";
favGrid.querySelectorAll(".favorite-btn").forEach(btn=>btn.addEventListener("click",()=>{toggleFavorite(Number(btn.dataset.id));updateView();}));
  }
}


// Sprint 34 placeholder for favorites
window.projectVersion="4.8 Sprint 72";


window.sharePost = async function(title,url){
  try{
    if(navigator.share){
      await navigator.share({title:title||document.title,url:url||location.href});
    }else if(navigator.clipboard){
      await navigator.clipboard.writeText(url||location.href);
      alert('Link wurde in die Zwischenablage kopiert.');
    }else{
      prompt('Link kopieren:', url||location.href);
    }
  }catch(e){}
};


// Sprint 65
export function sharePost(url,title){
 if(navigator.share){return navigator.share({title,url});}
 if(navigator.clipboard){return navigator.clipboard.writeText(url).then(()=>alert('Link kopiert.'));}
 return Promise.resolve();
}
