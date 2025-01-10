package com.othr.rentopia.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.Device;

@Service
public class DeviceServiceImpl implements DeviceService {

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	@Transactional
	public void saveDevice(Device device) {
		try {
			entityManager.persist(device);
		} catch (PersistenceException e) {
			System.err.println("ERROR saving new Device " + e.getMessage());
		}
	}

	@Override
	public Device getDevice(Long deviceId) {
		Device device = null;

		String query = "SELECT DISTINCT d FROM Device d WHERE id = :deviceId";
		try {
			device = entityManager
					.createQuery(query, Device.class)
					.setParameter("deviceId", deviceId)
					.getSingleResult();
		} catch (NoResultException e) {
			System.err.println("No device found with id " + deviceId);
		}

		return device;
	}

	@Override
	public Long getDeviceOwnerId(Long deviceId) {
		Long ownerId = null;

		String query = "SELECT DISTINCT d.ownerId FROM Device d WHERE id = :deviceId";
		try {
			ownerId = entityManager
					.createQuery(query, Long.class)
					.setParameter("deviceId", deviceId)
					.getSingleResult();
		} catch (NoResultException e) {
			System.err.println("No device found with id " + deviceId);
		}

		return ownerId;
	}

	@Override
	public List<Device> getDevicesByOwner(Long ownerId) {
		List<Device> devices = null;

		String query = "SELECT d FROM Device d WHERE d.ownerId = :ownerId";
		try {
			devices = entityManager
					.createQuery(query, Device.class)
					.setParameter("ownerId", ownerId)
					.getResultList();
		} catch (NoResultException e) {
			System.err.println("No device found with owner id " + ownerId);
		}

		return devices;
	}

	@Override
	public List<Device> getDevicesByCategory(Long categoryId) {
		List<Device> devices = null;

		// TODO check
		String query = "SELECT d FROM Device d JOIN d.categories c WHERE c.id = :categoryId";
		try {
			devices = entityManager
					.createQuery(query, Device.class)
					.setParameter("categoryId", categoryId)
					.getResultList();
		} catch (NoResultException e) {
			System.err.println("No device found with category id " + categoryId);
		}

		return devices;
	}

	@Override
	@Transactional
	public boolean removeDevice(Long deviceId) {
		String query = "DELETE FROM Device WHERE id = :deviceId";
		try {
			entityManager.createQuery(query)
					.setParameter("deviceId", deviceId)
					.executeUpdate();
		} catch (PersistenceException e) {
			System.err.println("ERROR removing Device with ID " + deviceId + ": " + e.getMessage());
			return false;
		}
		return true;
	}

	@Override
	public List<Device> getAllDevices() {
		List<Device> devices = null;

		String query = "SELECT d FROM Device d";
		try {
			devices = entityManager
					.createQuery(query, Device.class)
					.getResultList();
		} catch (NoResultException e) {
			System.err.println("No device found");
		}

		return devices;
	}

	@Override
	public List<Device> getDevicesSorted(Map<String, String> filterOptions) {
		List<Device> devices = null;

		String title = "%" + filterOptions.get("title") + "%";
		String priceRange = filterOptions.get("priceRange");
		String postalCode = filterOptions.get("postalCode") + "%";
		String sortOption = filterOptions.get("sortOption");
		String[] priceRangeArray = priceRange.split(",");
		Integer minPrice = Integer.parseInt(priceRangeArray[0]);
		Integer maxPrice = Integer.parseInt(priceRangeArray[1]);

		String query = "SELECT d " +
				        "FROM Device d " +
				       "where d.title like :title " +
				         "and d.location.postalCode like :postalCode " +
				         "and d.price >= :minPrice and d.price <= :maxPrice ";

		if (sortOption != null && sortOption.equals("priceDesc")) {
			query = query + "order by d.price desc";
		} else if (sortOption != null && sortOption.equals("priceAsc")) {
			query = query + "order by d.price asc";
		}

		try{
			devices = entityManager
					.createQuery(query, Device.class)
					.setParameter("title", title)
					.setParameter("postalCode", postalCode)
					.setParameter("maxPrice", maxPrice)
					.setParameter("minPrice", minPrice)
					.getResultList();
		} catch (NoResultException e) {
			System.err.println("No device found");
		}

		return devices;
 }

  @Override
	@Transactional
	public Device updateDevice(Device device) {
		//TODO add categories
		String query = "UPDATE Device d SET " +
				"d.title = :title, " +
				"d.description = :description, " +
				"d.price = :price, " +
				"d.isPublic = :isPublic, " +
				"d.location = :location " +
				"WHERE d.id = :id";

		try {
			entityManager.createQuery(query)
					.setParameter("title", device.getTitle())
					.setParameter("description", device.getDescription())
					.setParameter("price", device.getPrice())
					.setParameter("location", device.getLocation())
					.setParameter("id", device.getId())
					.setParameter("isPublic", device.getIsPublic())
					.executeUpdate();
		} catch (PersistenceException e) {
			System.err.println("ERROR updating Device with ID " + device.getId() + ": " + e.getMessage());
		}

		return getDevice(device.getId());
	}
}
