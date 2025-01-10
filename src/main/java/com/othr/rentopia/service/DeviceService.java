package com.othr.rentopia.service;

import java.util.List;
import java.util.Map;

import com.othr.rentopia.model.Device;

public interface DeviceService {
	void saveDevice(Device device);

	Device getDevice(Long deviceId);

	Long getDeviceOwnerId(Long deviceId);

	List<Device> getDevicesByOwner(Long ownerId);

	List<Device> getDevicesByCategory(Long categoryId);

	List<Device> getAllDevices();

	List<Device> getDevicesSorted(Map<String, String> filterOptions);

	boolean removeDevice(Long deviceId);

	Device updateDevice(Device device);
}
