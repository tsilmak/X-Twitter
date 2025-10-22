package com.twitter_X_Recreation.twitter_X.services;

import com.twitter_X_Recreation.twitter_X.exceptions.EmailFailedToSendException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import sibApi.TransactionalEmailsApi;
import sibModel.CreateSmtpEmail;
import sibModel.SendSmtpEmail;
import sibModel.SendSmtpEmailSender;
import sibModel.SendSmtpEmailTo;

import java.util.Collections;

@Service
public class EmailSenderService {


    private final String MY_EMAIL_ADDRESS ;


    private final String BREVO_API_KEY ;

    public EmailSenderService(@Value("${smtp.my.email}") String myEmailAddress, @Value("${brevo.api.key}") String brevoApiKey) {
        MY_EMAIL_ADDRESS = myEmailAddress;
        BREVO_API_KEY = brevoApiKey;
    }

    public void sendEmail(String toAddress, String subject, String content) throws EmailFailedToSendException {

        try {
            // Configure Brevo API client
            TransactionalEmailsApi apiInstance = new TransactionalEmailsApi();
            apiInstance.getApiClient().setApiKey(BREVO_API_KEY);

            // Set up the email sender
            SendSmtpEmailSender sender = new SendSmtpEmailSender();
            sender.setEmail(MY_EMAIL_ADDRESS);
            sender.setName("Twitter X Recreation");

            // Set up the email recipient
            SendSmtpEmailTo recipient = new SendSmtpEmailTo();
            recipient.setEmail(toAddress);

            // Create the email object
            SendSmtpEmail sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.setSender(sender);
            sendSmtpEmail.setTo(Collections.singletonList(recipient));
            sendSmtpEmail.setSubject(subject);
            sendSmtpEmail.setHtmlContent(content); // Set content as HTML

            // Send the email and log the response
            CreateSmtpEmail response = apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (Exception e) {
            throw new EmailFailedToSendException(e);
        }
    }
}