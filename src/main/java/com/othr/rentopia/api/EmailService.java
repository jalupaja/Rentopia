package com.othr.rentopia.api;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
<<<<<<< HEAD
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Properties;

import com.othr.rentopia.config.DotenvHelper;

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
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(GmailUsername));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(email.getTo()));
            message.setSubject(email.getSubject());
            // message.setText(email.getBody());
            message.setContent(email.getBody(), "text/html; charset=utf-8");

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

        public void loadTemplate(String subject, String body) {
            String template;

            try {
                template = new String(Files.readAllBytes(Paths.get("src/main/java/com/othr/rentopia/api/EmailTemplate.html")));

            } catch (IOException e) {
                e.printStackTrace();
                template = null;
            }

            if (template != null) {
                template = template.replace("{{SUBJECT}}", subject);
                template = template.replace("{{BODY}}", body);
                this.subject = subject;
                this.body = template;
            }
        }
    }
}
