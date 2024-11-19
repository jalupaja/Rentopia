package com.othr.rentopia.service;

import com.othr.rentopia.model.Bookmark;

import java.util.List;

public interface BookmarkService {
    public void saveBookmark(Bookmark bookmark);
    public List<Bookmark> getBookmarksByOwner(Long ownerId);
    public void removeBookmark(Long bookmarkId);
}
