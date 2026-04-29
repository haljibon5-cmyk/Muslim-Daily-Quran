export interface BookmarkItem {
    id: string;
    type: 'quran' | 'hadith';
    title: string;
    subtitle: string;
    payload: any;
    timestamp: number;
}

export const getBookmarks = (): BookmarkItem[] => {
    try {
        const item = localStorage.getItem('user_bookmarks');
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
}

export const setBookmarks = (list: BookmarkItem[]) => {
    localStorage.setItem('user_bookmarks', JSON.stringify(list));
}

export const addBookmark = (bookmark: BookmarkItem) => {
    const list = getBookmarks();
    if (!list.find(b => b.id === bookmark.id)) {
        list.push(bookmark);
        setBookmarks(list);
    }
}

export const removeBookmark = (id: string) => {
    const list = getBookmarks();
    const updated = list.filter(b => b.id !== id);
    setBookmarks(updated);
}

export const isBookmarked = (id: string) => {
    return getBookmarks().some(b => b.id === id);
}

export const toggleBookmark = (bookmark: BookmarkItem) => {
    if (isBookmarked(bookmark.id)) {
        removeBookmark(bookmark.id);
        return false;
    } else {
        addBookmark(bookmark);
        return true;
    }
}
