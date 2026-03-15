
// Initial works data for the platform
// This replaces the database for a static/frontend-only deployment

export const INITIAL_WORKS = [];

// Helper functions to manage data in localStorage
const STORAGE_KEY = 'tn_webtoon_works_v2';

export function getWorks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WORKS));
    return INITIAL_WORKS;
  }
  return JSON.parse(stored);
}

export function saveWork(work: any) {
  const works = getWorks();
  const newWork = {
    ...work,
    id: Date.now(),
    views: 0,
    created_at: new Date().toISOString(),
    avg_rating: 0,
    total_ratings: 0
  };
  const updatedWorks = [newWork, ...works];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorks));
  return newWork;
}

export function incrementView(id: number) {
  const works = getWorks();
  const updatedWorks = works.map((w: any) => 
    w.id === id ? { ...w, views: (w.views || 0) + 1 } : w
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorks));
}

export function getWorkDetails(id: number) {
  const works = getWorks();
  const work = works.find((w: any) => w.id === id);
  if (!work) return null;

  // Mock pages and comments for static version
  // In a real app, these could also be in localStorage
  const pagesKey = `tn_pages_${id}`;
  const storedPages = localStorage.getItem(pagesKey);
  const pages = storedPages ? JSON.parse(storedPages) : [];

  const commentsKey = `tn_comments_${id}`;
  const storedComments = localStorage.getItem(commentsKey);
  const comments = storedComments ? JSON.parse(storedComments) : [];

  return { work, pages, comments };
}

export function savePages(workId: number, pages: string[]) {
  const pagesKey = `tn_pages_${workId}`;
  localStorage.setItem(pagesKey, JSON.stringify(pages.map((content, i) => ({
    id: Date.now() + i,
    work_id: workId,
    page_number: i + 1,
    content
  }))));
}

export function addComment(workId: number, userId: number, email: string, content: string) {
  const commentsKey = `tn_comments_${workId}`;
  const stored = localStorage.getItem(commentsKey);
  const comments = stored ? JSON.parse(stored) : [];
  const newComment = {
    id: Date.now(),
    work_id: workId,
    user_id: userId,
    user_email: email,
    content,
    created_at: new Date().toISOString()
  };
  localStorage.setItem(commentsKey, JSON.stringify([newComment, ...comments]));
  return newComment;
}

export function addRating(workId: number, userId: number, rating: number) {
  const works = getWorks();
  const updatedWorks = works.map((w: any) => {
    if (w.id === workId) {
      const total = (w.total_ratings || 0) + 1;
      const avg = ((w.avg_rating || 0) * (w.total_ratings || 0) + rating) / total;
      return { ...w, total_ratings: total, avg_rating: avg };
    }
    return w;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorks));
}
