package com.mediconnect_project.mediconnect_backend.models;

import java.util.List;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "dispensaries")
public class Dispensary {
	@Id
	private String id;
	private String name;
	private String doctorName;
	private String address;
	private String imageUrl;
	private List<String> facilities;
	private String openingTime;
	private String closingTime;
	private AvailabilityStatus availabilityStatus;
	private GeoJsonPoint location;
	private String doctorUserId;
}
