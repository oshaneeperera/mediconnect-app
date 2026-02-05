package com.mediconnect_project.mediconnect_backend.repositories;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.mediconnect_project.mediconnect_backend.models.User;

public interface UserRepository extends MongoRepository<User, String> {
	Optional<User> findByEmail(String email);
}
