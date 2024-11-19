package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.Device;

public interface DeviceService {
    public void saveDevice(Device device);
    public List<Device> getDevicesByOwner(Long ownerId);
    public List<Device> getDevicesByCategory(Long categoryId);
    public void removeDevice(Long deviceId);
}
