package com.mediconnect_project.mediconnect_backend.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.mediconnect_project.mediconnect_backend.models.QueueEntry;
import com.mediconnect_project.mediconnect_backend.models.QueueStatus;
import com.mediconnect_project.mediconnect_backend.repositories.QueueRepository;
import com.mediconnect_project.mediconnect_backend.repositories.UserRepository;
import com.mediconnect_project.mediconnect_backend.services.dto.DoctorQueuePatient;
import com.mediconnect_project.mediconnect_backend.services.dto.DoctorQueueResponse;
import com.mediconnect_project.mediconnect_backend.services.dto.QueueStatusResponse;

@Service
@RequiredArgsConstructor
public class QueueService {
	private final QueueRepository queueRepository;
	private final UserRepository userRepository;

	public QueueEntry joinQueue(String patientId, String dispensaryId) {
		List<QueueStatus> activeStatuses = List.of(QueueStatus.WAITING, QueueStatus.WITH_DOCTOR);
		Optional<QueueEntry> existing = queueRepository.findFirstByPatientIdAndStatusIn(patientId, activeStatuses);
		if (existing.isPresent()) {
			throw new IllegalStateException("Patient is already in an active queue");
		}

		int nextToken = queueRepository.findTopByDispensaryIdOrderByTokenNumberDesc(dispensaryId)
				.map(entry -> entry.getTokenNumber() + 1)
				.orElse(1);

		QueueEntry entry = new QueueEntry();
		entry.setPatientId(patientId);
		entry.setDispensaryId(dispensaryId);
		entry.setTokenNumber(nextToken);
		entry.setStatus(QueueStatus.WAITING);
		entry.setJoinedAt(Instant.now());
		return queueRepository.save(entry);
	}

	public QueueStatusResponse getQueueStatus(String dispensaryId) {
		Optional<QueueEntry> currentServing = queueRepository
				.findFirstByDispensaryIdAndStatusOrderByTokenNumberAsc(dispensaryId, QueueStatus.WITH_DOCTOR);

		List<QueueEntry> waiting = queueRepository
				.findByDispensaryIdAndStatusOrderByTokenNumberAsc(dispensaryId, QueueStatus.WAITING);

		List<String> anonymousPatients = waiting.stream()
				.map(entry -> "Token " + entry.getTokenNumber())
				.collect(Collectors.toList());

		Integer currentToken = currentServing.map(QueueEntry::getTokenNumber).orElse(null);
		long totalWaiting = waiting.size();

		return new QueueStatusResponse(currentToken, totalWaiting, anonymousPatients);
	}

	public DoctorQueueResponse getDoctorQueue(String dispensaryId) {
	Optional<QueueEntry> current = queueRepository
				.findFirstByDispensaryIdAndStatusOrderByTokenNumberAsc(dispensaryId, QueueStatus.WITH_DOCTOR);

	List<QueueEntry> waiting = queueRepository
				.findByDispensaryIdAndStatusOrderByTokenNumberAsc(dispensaryId, QueueStatus.WAITING);

	DoctorQueuePatient currentPatient = current
				.map(this::mapQueuePatient)
				.orElse(null);

	List<DoctorQueuePatient> waitingPatients = waiting.stream()
				.map(this::mapQueuePatient)
				.collect(Collectors.toList());

	return new DoctorQueueResponse(currentPatient, waitingPatients);
	}

	private DoctorQueuePatient mapQueuePatient(QueueEntry entry) {
	return userRepository.findById(entry.getPatientId())
				.map(user -> new DoctorQueuePatient(entry.getPatientId(), user.getName(), user.getAge(), entry.getTokenNumber()))
				.orElseGet(() -> new DoctorQueuePatient(entry.getPatientId(), "Unknown", null, entry.getTokenNumber()));
	}

	public void leaveQueue(String patientId) {
		List<QueueStatus> activeStatuses = List.of(QueueStatus.WAITING, QueueStatus.WITH_DOCTOR);
		queueRepository.findFirstByPatientIdAndStatusIn(patientId, activeStatuses)
				.ifPresent(queueRepository::delete);
	}

	public Optional<QueueEntry> getActiveEntryForPatient(String patientId) {
		List<QueueStatus> activeStatuses = List.of(QueueStatus.WAITING, QueueStatus.WITH_DOCTOR);
		return queueRepository.findFirstByPatientIdAndStatusIn(patientId, activeStatuses);
	}

	public Optional<QueueEntry> callNextPatient(String dispensaryId) {
		queueRepository.findFirstByDispensaryIdAndStatusOrderByTokenNumberAsc(dispensaryId, QueueStatus.WITH_DOCTOR)
				.ifPresent(entry -> {
					entry.setStatus(QueueStatus.COMPLETED);
					queueRepository.save(entry);
				});

		Optional<QueueEntry> nextWaiting = queueRepository
				.findFirstByDispensaryIdAndStatusOrderByTokenNumberAsc(dispensaryId, QueueStatus.WAITING);

		nextWaiting.ifPresent(entry -> {
			entry.setStatus(QueueStatus.WITH_DOCTOR);
			queueRepository.save(entry);
		});

		return nextWaiting;
	}
}
