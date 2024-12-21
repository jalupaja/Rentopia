package com.othr.rentopia.api;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.security.GeneralSecurityException;

import com.google.api.client.auth.oauth2.*;
// import com.google.auth.oauth2.AuthorizationCodeFlow;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
// import com.google.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.util.store.FileDataStoreFactory;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.Clock;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.util.store.MemoryDataStoreFactory;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

import com.othr.rentopia.config.DotenvHelper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Collections;
import java.util.Properties;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

@Service
public class EmailService {

    private static final String IMAP_HOST = "imap.gmail.com";
    private static final String IMAP_PORT = "993";
    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final String SMTP_PORT = "587";
    private static final String CLIENT_ID = DotenvHelper.get("OAuthClientId");
    private static final String CLIENT_SECRET = DotenvHelper.get("OAuthClientSecret");
    private static final String GmailUsername = DotenvHelper.get("GoogleEmail");
    private static final String GmailPassword = DotenvHelper.get("GooglePassword");

    private Session session;

    public EmailService() {
        Properties properties = System.getProperties();

        // Properties properties = System.getProperties();
        properties.setProperty("mail.store.protocol", "imaps");
        properties.put("mail.imaps.host", IMAP_HOST);
        properties.put("mail.imaps.port", IMAP_PORT);
        properties.put("mail.imaps.ssl.enable", "true");
        properties.put("mail.imaps.ssl.required", "true");
        properties.put("mail.transport.protocol", "smtp");
        properties.put("mail.smtp.host", SMTP_HOST);
        properties.put("mail.smtp.port", SMTP_PORT);
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.starttls.required", "true");

        session = Session.getInstance(properties, null);
    }

    public List<Email> fetchEmails() {
        List<Email> emails = new ArrayList<>();

        try {
            Store store = session.getStore("imaps");
            store.connect(IMAP_HOST, GmailUsername, GmailPassword);

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);

            Message[] messages = inbox.getMessages();
            for (Message message : messages) {
                if (message instanceof MimeMessage) {
                    MimeMessage mimeMessage = (MimeMessage) message;
                    String from = ((InternetAddress) mimeMessage.getFrom()[0]).getAddress();
                    String subject = mimeMessage.getSubject();
                    String body = mimeMessage.getContent().toString();
                    emails.add(new Email(from, null, subject, body));
                }
            }

            inbox.close(false);
            store.close();
        } catch (MessagingException | java.io.IOException e) {
            e.printStackTrace();
        }

        return emails;
    }

    public void sendEmail(Email email) {
        // TODO use nice html mail with logo, footer, ...
        System.out.println(GmailPassword);
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(GmailUsername));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(email.getTo()));
            message.setSubject(email.getSubject());
            message.setText(email.getBody());

            Transport transport = session.getTransport("smtp");
            transport.connect(SMTP_HOST, GmailUsername, GmailPassword);


            transport.sendMessage(message, message.getAllRecipients());
            transport.close();
        } catch (AuthenticationFailedException e) {
            System.err.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public static class Email {
        private String to;
        private String from;
        private String subject;
        private String body;

        public Email(String from, String to, String subject, String body) {
            this.from = from;
            this.to = to;
            this.subject = subject;
            this.body = body;
        }

        public String getFrom() {
            return from;
        }

        public String getTo() {
            return to;
        }

        public String getSubject() {
            return subject;
        }

        public String getBody() {
            return body;
        }

        @Override
        public String toString() {
            return "Email{" +
                "from='" + (from != null ? from : "this") + '\'' +
                "to='" + (to != null ? to : "this") + '\'' +
                ", subject='" + subject + '\'' +
                ", body='" + body + '\'' +
                '}';
        }
    }

    public static void renewToken() {
        try {
            List<String> SCOPES = Arrays.asList(
                                                "https://www.googleapis.com/auth/gmail.send",
                                                "https://www.googleapis.com/auth/gmail.readonly"
                                                );
            JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
            // Step 1: Create the authorization code flow
            GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                                                                                       GoogleNetHttpTransport.newTrustedTransport(),
                                                                                       JSON_FACTORY,
                                                                                       CLIENT_ID,
                                                                                       CLIENT_SECRET,
                                                                                       SCOPES)
                .build();

            Credential credential = flow.loadCredential("user");

            if (credential != null && credential.getAccessToken() != null) {
                boolean isTokenValid = verifyToken(credential.getAccessToken());
                if (isTokenValid) {
                    System.out.println("Existing token is valid: " + credential.getAccessToken());
                    return;
                } else {
                    System.out.println("Token is invalid or expired. Refreshing...");
                    credential.refreshToken();
                    System.out.println("New access token: " + credential.getAccessToken());
                    return;
                }
            }

            String authorizationUrl = flow.newAuthorizationUrl()
                .setRedirectUri("http://localhost:3000")
                .build();

            System.out.println("Please visit the following URL to authorize the application:");
            System.out.println(authorizationUrl);

            Scanner scanner = new Scanner(System.in);
            System.out.print("Enter the authorization code: ");
            String authorizationCode = scanner.nextLine();

            GoogleTokenResponse tokenResponse = flow.newTokenRequest(authorizationCode)
                .setRedirectUri("http://localhost:3000")
                .execute();

            credential = flow.createAndStoreCredential(tokenResponse, "user");
            String token = credential.getAccessToken();
            System.out.println("New access token: " + token);

            if (verifyToken(token)) {
                System.out.println("TOKEN IS VALID");
            } else {
                System.out.println("TOKEN IS INVALID");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static boolean verifyToken(String accessToken) {
        System.out.println("verifying acc: " + accessToken);
        JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                                                                               JSON_FACTORY)
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();

            GoogleIdToken idToken = verifier.verify(accessToken);
            System.out.println("idToken: " + idToken);
            return idToken != null;
        } catch (GeneralSecurityException | IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
