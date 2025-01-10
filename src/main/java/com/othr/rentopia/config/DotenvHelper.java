package com.othr.rentopia.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvException;

public class DotenvHelper {
    private static Dotenv dotenv;

    static {
        try {
            dotenv = Dotenv.configure()
                    .directory("Frontend")
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();
        } catch (DotenvException e) {
            System.err.println("Error loading .env file: " + e.getMessage());
        }
    }

    // Get environment variable value
    public static String get(String key) {
        return dotenv.get(key);
    }
}
