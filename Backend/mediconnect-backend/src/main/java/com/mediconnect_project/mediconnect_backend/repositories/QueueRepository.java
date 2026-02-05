package com.mediconnect_project.mediconnect_backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.mediconnect_project.mediconnect_backend.models.QueueEntry;
import com.mediconnect_project.mediconnect_backend.models.QueueStatus;

public interface QueueRepository extends MongoRepository<QueueEntry, String> {
	List<QueueEntry> findByDispensaryIdAndStatusIn(String dispensaryId, List<QueueStatus> statuses);
	Optional<QueueEntry> findFirstByPatientIdAndStatusIn(String patientId, List<QueueStatus> statuses);
	long countByDispensaryIdAndStatus(String dispensaryId, QueueStatus status);
	Optional<QueueEntry> findTopByDispensaryIdOrderByTokenNumberDesc(String dispensaryId);
	Optional<QueueEntry> findFirstByDispensaryIdAndStatusOrderByTokenNumberAsc(String dispensaryId, QueueStatus status);
	List<QueueEntry> findByDispensaryIdAndStatusOrderByTokenNumberAsc(String dispensaryId, QueueStatus status);
}
