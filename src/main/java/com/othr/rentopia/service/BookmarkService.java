package com.othr.rentopia.service;

import com.othr.rentopia.model.Bookmark;
import com.othr.rentopia.model.Device;

import java.util.List;

public interface BookmarkService {
	void saveBookmark(Bookmark bookmark);

	boolean removeBookmark(Long ownerId, Long deviceId);

	boolean checkBookmark(Long ownerId, Long deviceId);

	List<Device> getBookmarkedDevices(Long ownerId);
}
