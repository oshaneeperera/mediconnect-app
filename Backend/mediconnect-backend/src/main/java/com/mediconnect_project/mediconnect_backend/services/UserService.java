package com.mediconnect_project.mediconnect_backend.services;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.mediconnect_project.mediconnect_backend.models.AvailabilityStatus;
import com.mediconnect_project.mediconnect_backend.models.Dispensary;
import com.mediconnect_project.mediconnect_backend.models.User;
import com.mediconnect_project.mediconnect_backend.models.UserRole;
import com.mediconnect_project.mediconnect_backend.repositories.DispensaryRepository;
import com.mediconnect_project.mediconnect_backend.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;
	private final DispensaryRepository dispensaryRepository;

	public User registerUser(User user, Dispensary dispensaryDetails) {
		User savedUser = userRepository.save(user);
		if (savedUser.getRole() == UserRole.DOCTOR) {
			Dispensary dispensary = dispensaryDetails != null ? dispensaryDetails : new Dispensary();
			dispensary.setDoctorUserId(savedUser.getId());
			dispensary.setDoctorName(savedUser.getName());
			if (dispensary.getName() == null || dispensary.getName().isBlank()) {
				dispensary.setName(savedUser.getName() + " Dispensary");
			}
			if (dispensary.getAvailabilityStatus() == null) {
				dispensary.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
			}
			dispensaryRepository.save(dispensary);
		}
		return savedUser;
	}

	public Optional<User> login(String email, String password) {
		return userRepository.findByEmail(email)
				.filter(user -> user.getPassword() != null && user.getPassword().equals(password));
	}
}
