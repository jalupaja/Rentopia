package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.DeviceImage;

public interface DeviceImageService {
    public void saveDeviceImage(DeviceImage deviceImage);
    public String getFirstDeviceImage(Long deviceId);
    public List<String> getAllDeviceImages(Long deviceId);
    public void removeDeviceImage(String deviceImage);
    public void removeAllDeviceImages(Long deviceId);
    public Long getDeviceId(String deviceImage);
}
