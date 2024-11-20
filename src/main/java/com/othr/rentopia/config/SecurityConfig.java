package com.othr.rentopia.config;

import java.beans.BeanProperty;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    protected SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	http.authorizeRequests()
	    // .anyMatchers("/api/**").permitAll()
	    .anyMatchers("/api/**").hasAuthority("USER")
	    .anyRequest().authenticated()
		.and()
	    .formLogin()
		.permitAll()
		.and()
	    .logout()
		.permitAll();

	return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
	// TODO just for testing
	    UserDetails user = User.builder()
		.username("user")
		.password(passwordEncoder().encode("user"))
		.roles("USER")
		.build();
	return new InMemoryUserDetailsManager(user);

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
	return new BCryptPasswordEncoder();
    }
}
