package com.othr.rentopia.config;

import java.beans.BeanProperty;
import java.util.Arrays;
import java.util.Collections;

import com.othr.rentopia.service.AccountServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import static com.othr.rentopia.model.Account.Role.ADMIN;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    protected SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests
						//.requestMatchers(HttpMethod.POST, "/api/orders").hasAnyAuthority(ADMIN, USER)
						//.requestMatchers(HttpMethod.GET, "/api/users/me").hasAnyAuthority(ADMIN, USER)
						//.requestMatchers("/api/orders", "/api/orders/**").hasAuthority(ADMIN)
						.requestMatchers("/api/user/me").authenticated()
						.requestMatchers("/api/**").permitAll()
						//.requestMatchers("/", "/error", "/csrf", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/**").permitAll()
						.anyRequest().authenticated())
				.addFilterBefore(new JwtTokenValidator(), UsernamePasswordAuthenticationFilter.class)
				.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(AbstractHttpConfigurer::disable);

		return http.build();
    }

	private CorsConfigurationSource corsConfigurationSource() {
		return new CorsConfigurationSource() {
			@Override
			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
				CorsConfiguration ccfg = new CorsConfiguration();
				ccfg.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
				ccfg.setAllowedMethods(Collections.singletonList("*"));
				ccfg.setAllowCredentials(true);
				ccfg.setAllowedHeaders(Collections.singletonList("*"));
				ccfg.setExposedHeaders(Arrays.asList("Authorization"));
				ccfg.setMaxAge(3600L);
				return ccfg;

			}
		};

	}

    @Bean
    public UserDetailsService userDetailsService() {
	// TODO just for testing
	    UserDetails user = User.builder()
		.username("user")
		.password(passwordEncoder().encode("user"))
		.roles("USER")
		.build();
	return new AccountServiceImpl();

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
	return new  BCryptPasswordEncoder();
    }
}
