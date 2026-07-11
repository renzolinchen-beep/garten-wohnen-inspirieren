export async function loadPosts() {
  const response = await fetch("data/posts.json");

  if (!response.ok) {
    throw new Error("Beiträge konnten nicht geladen werden.");
  }

  const posts = await response.json();

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}
