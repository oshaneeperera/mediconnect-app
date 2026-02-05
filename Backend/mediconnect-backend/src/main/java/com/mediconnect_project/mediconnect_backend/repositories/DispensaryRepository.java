package com.mediconnect_project.mediconnect_backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.mediconnect_project.mediconnect_backend.models.Dispensary;

public interface DispensaryRepository extends MongoRepository<Dispensary, String> {
	List<Dispensary> findByLocationNear(Point location, Distance distance);
	Optional<Dispensary> findByDoctorUserId(String doctorUserId);
	List<Dispensary> findByNameContainingIgnoreCase(String name);
}
