package com.twitter_X_Recreation.twitter_X;

import com.twitter_X_Recreation.twitter_X.models.Role;
import com.twitter_X_Recreation.twitter_X.services.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.twitter_X_Recreation.twitter_X.repositories.RoleRepository;
import com.twitter_X_Recreation.twitter_X.repositories.UserRepository;

import java.util.Optional;

@SpringBootApplication
public class TwitterXApplication {

	public static void main(String[] args) {
		SpringApplication.run(TwitterXApplication.class, args);
	}

	@Bean
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, UserService userService) {
		return args -> {
			// Step 1: Create USER and ADMIN roles if they don’t exist
			Optional<Role> userRole = roleRepository.findRoleByAuthority("USER");
			if (userRole.isEmpty()) {
				Role role = new Role();
				role.setAuthority("USER");
				roleRepository.save(role);
				System.out.println("Created USER role");
			}

			Optional<Role> adminRole = roleRepository.findRoleByAuthority("ADMIN");
			if (adminRole.isEmpty()) {
				Role role = new Role();
				role.setAuthority("ADMIN");
				roleRepository.save(role);
				System.out.println("Created ADMIN role");
			}

		};
	}
}

