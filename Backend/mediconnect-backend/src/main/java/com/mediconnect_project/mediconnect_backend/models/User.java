package com.mediconnect_project.mediconnect_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
	@Id
	private String id;
	private String email;
	private String password;
	private UserRole role;
	private String name;
	private String address;
	private String phoneNumber;
	private Integer age;
	private String profilePictureUrl;
}
