package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.Bookmark;

public interface DeviceService {
    void saveDevice(Device device);
    Device getDevice(Long deviceId);
    List<Device> getDevicesByOwner(Long ownerId);
    List<Device> getDevicesByCategory(Long categoryId);
    List<Device> getAllDevices();
    boolean removeDevice(Long deviceId);
    List<Device> getBookmarkedDevices(Long ownerId);
    void saveBookmark(Bookmark bookmark);
    boolean removeBookmark(Long ownerId, Long deviceId);
    boolean checkBookmark(Long ownerId, Long deviceId);

}
