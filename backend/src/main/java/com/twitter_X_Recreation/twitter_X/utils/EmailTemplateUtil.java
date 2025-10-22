package com.twitter_X_Recreation.twitter_X.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class EmailTemplateUtil {

    public static String getVerificationEmail(String verificationCode) {
        try {
            // Load the template file from the resources folder
            String templatePath = "templates/email-verification-code-template.html";
            String htmlTemplate = new String(
                    Files.readAllBytes(Paths.get(
                            EmailTemplateUtil.class.getClassLoader().getResource(templatePath).toURI()
                    ))
            );

            // Replace the placeholder with the actual verification code
            return htmlTemplate.replace("{VERIFICATION_CODE}", verificationCode);
        } catch (IOException | NullPointerException e) {
            throw new RuntimeException("Failed to load email template", e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while processing email template", e);
        }
    }
}