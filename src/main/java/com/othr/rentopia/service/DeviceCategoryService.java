package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.DeviceCategory;

public interface DeviceCategoryService {
    public void saveDeviceCategory(DeviceCategory deviceCategory);
    public List<String> getAllDeviceCategories();
    public void removeDeviceCategory(String deviceCategory);
}
