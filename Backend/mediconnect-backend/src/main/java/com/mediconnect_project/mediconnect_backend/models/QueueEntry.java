package com.mediconnect_project.mediconnect_backend.models;

import java.time.Instant;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "queue_entries")
public class QueueEntry {
	@Id
	private String id;
	private String patientId;
	private String dispensaryId;
	private Integer tokenNumber;
	private QueueStatus status;
	private Instant joinedAt;
}
