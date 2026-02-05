package com.mediconnect_project.mediconnect_backend.controllers;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.mediconnect_project.mediconnect_backend.models.User;
import com.mediconnect_project.mediconnect_backend.repositories.UserRepository;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	private final UserRepository userRepository;

	@GetMapping("/by-email")
	public ResponseEntity<User> getByEmail(@RequestParam("email") String email) {
		Optional<User> user = userRepository.findByEmail(email);
		return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}
}
