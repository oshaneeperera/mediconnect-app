package com.mediconnect_project.mediconnect_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mediconnect_project.mediconnect_backend.controllers.dto.DoctorNextRequest;
import com.mediconnect_project.mediconnect_backend.controllers.dto.DoctorUpdateStatusRequest;
import com.mediconnect_project.mediconnect_backend.controllers.dto.JoinQueueRequest;
import com.mediconnect_project.mediconnect_backend.controllers.dto.LeaveQueueRequest;
import com.mediconnect_project.mediconnect_backend.models.Dispensary;
import com.mediconnect_project.mediconnect_backend.models.QueueEntry;
import com.mediconnect_project.mediconnect_backend.services.DispensaryService;
import com.mediconnect_project.mediconnect_backend.services.QueueService;
import com.mediconnect_project.mediconnect_backend.services.dto.DoctorQueueResponse;
import com.mediconnect_project.mediconnect_backend.services.dto.QueueStatusResponse;

@RestController
@RequestMapping("/api/queue")
@RequiredArgsConstructor
public class QueueController {
	private final QueueService queueService;
	private final DispensaryService dispensaryService;

	@PostMapping("/join")
	public ResponseEntity<QueueEntry> joinQueue(@RequestBody JoinQueueRequest request) {
		try {
			QueueEntry entry = queueService.joinQueue(request.getPatientId(), request.getDispensaryId());
			return ResponseEntity.ok(entry);
		} catch (IllegalStateException ex) {
			return ResponseEntity.status(409).build();
		}
	}

	@PostMapping("/leave")
	public ResponseEntity<Void> leaveQueue(@RequestBody LeaveQueueRequest request) {
		queueService.leaveQueue(request.getPatientId());
		return ResponseEntity.ok().build();
	}

	@GetMapping("/status/{dispensaryId}")
	public QueueStatusResponse getStatus(@PathVariable String dispensaryId) {
		return queueService.getQueueStatus(dispensaryId);
	}

	@GetMapping("/patient/{patientId}")
	public ResponseEntity<QueueEntry> getPatientQueue(@PathVariable String patientId) {
		return queueService.getActiveEntryForPatient(patientId)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/doctor/list/{dispensaryId}")
	public DoctorQueueResponse getDoctorQueue(@PathVariable String dispensaryId) {
		return queueService.getDoctorQueue(dispensaryId);
	}

	@PostMapping("/doctor/next")
	public ResponseEntity<QueueEntry> callNext(@RequestBody DoctorNextRequest request) {
		return queueService.callNextPatient(request.getDispensaryId())
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.noContent().build());
	}

	@PostMapping("/doctor/update-status")
	public ResponseEntity<Dispensary> updateStatus(@RequestBody DoctorUpdateStatusRequest request) {
		return dispensaryService.updateAvailability(request.getDoctorId(), request.getStatus())
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
}
