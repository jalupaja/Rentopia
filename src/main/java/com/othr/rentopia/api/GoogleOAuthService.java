package com.othr.rentopia.api;

import org.springframework.stereotype.Service;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.othr.rentopia.config.DotenvHelper;
import java.util.Collections;

@Service
public class GoogleOAuthService {

    private GoogleIdTokenVerifier verifier;
    private final String CLIENT_ID = DotenvHelper.get("OAuthClientId");


    public GoogleOAuthService() {
        HttpTransport transport = new NetHttpTransport();

        // Create a JSON factory (use JacksonFactory)
        JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

        // Initialize the GoogleIdTokenVerifier with the transport and jsonFactory
        this.verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
            .setAudience(Collections.singletonList(CLIENT_ID)) // Set the audience as your CLIENT_ID
            .build();

        if (this.verifier == null) {
            throw new RuntimeException("GoogleIdTokenVerifier could not be initialized");
        }
    }

    public String getEmail(String token) {
        try {
            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                return payload.getEmail();
            } else {
                throw new Exception("Invalid token");
            }
        } catch (Exception e) {
            // Handle the case where verification fails
            System.out.println("FAILED getting mail: " + e.getMessage());
            throw new RuntimeException("Token verification failed", e);
        }
    }
}
