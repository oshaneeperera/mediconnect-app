package com.mediconnect_project.mediconnect_backend.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import com.mediconnect_project.mediconnect_backend.models.AvailabilityStatus;
import com.mediconnect_project.mediconnect_backend.models.Dispensary;
import com.mediconnect_project.mediconnect_backend.models.QueueStatus;
import com.mediconnect_project.mediconnect_backend.repositories.DispensaryRepository;
import com.mediconnect_project.mediconnect_backend.repositories.QueueRepository;
import com.mediconnect_project.mediconnect_backend.services.dto.DispensaryWithWaitTime;

@Service
@RequiredArgsConstructor
public class DispensaryService {
	private final DispensaryRepository dispensaryRepository;
	private final QueueRepository queueRepository;

	public List<DispensaryWithWaitTime> getAllDispensariesWithWaitTime() {
		return dispensaryRepository.findAll().stream()
				.map(dispensary -> new DispensaryWithWaitTime(dispensary, mockAverageWait(dispensary.getId())))
				.collect(Collectors.toList());
	}

	public List<Dispensary> getAllDispensaries() {
		return dispensaryRepository.findAll();
	}

	public List<Dispensary> searchDispensariesByName(String name) {
		return dispensaryRepository.findByNameContainingIgnoreCase(name);
	}

	public Optional<Dispensary> getDispensaryById(String id) {
		return dispensaryRepository.findById(id);
	}

	public Optional<Dispensary> getDispensaryByDoctorId(String doctorId) {
		return dispensaryRepository.findByDoctorUserId(doctorId);
	}

	public List<Dispensary> getNearbyDispensaries(double lat, double lon) {
		Point location = new Point(lon, lat);
		Distance radius = new Distance(5, Metrics.KILOMETERS);
		return dispensaryRepository.findByLocationNear(location, radius);
	}

	public Optional<Dispensary> updateAvailability(String doctorId, String status) {
		AvailabilityStatus availability = AvailabilityStatus.valueOf(status.toUpperCase());
		return dispensaryRepository.findByDoctorUserId(doctorId).map(dispensary -> {
			dispensary.setAvailabilityStatus(availability);
			return dispensaryRepository.save(dispensary);
		});
	}

	private Integer mockAverageWait(String dispensaryId) {
		long waitingCount = queueRepository.countByDispensaryIdAndStatus(dispensaryId, QueueStatus.WAITING);
		return Math.toIntExact(waitingCount * 5);
	}
}
