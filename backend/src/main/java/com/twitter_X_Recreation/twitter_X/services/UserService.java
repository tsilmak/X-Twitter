package com.twitter_X_Recreation.twitter_X.services;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.twitter_X_Recreation.twitter_X.exceptions.*;
import com.twitter_X_Recreation.twitter_X.models.ApplicationUser;
import com.twitter_X_Recreation.twitter_X.models.RegistrationObject;
import com.twitter_X_Recreation.twitter_X.models.Role;
import com.twitter_X_Recreation.twitter_X.repositories.RoleRepository;
import com.twitter_X_Recreation.twitter_X.repositories.UserRepository;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.twitter_X_Recreation.twitter_X.utils.EmailTemplateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final EmailSenderService emailSenderService;

    private final PasswordEncoder passwordEncoder;

    private final String jwtSecret;

    private final boolean cookieSecure;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository, EmailSenderService emailSenderService, PasswordEncoder passwordEncoder, @Value("${jwt.secret}") String jwtSecret, @Value("${app.cookie.secure}") boolean cookieSecure) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailSenderService = emailSenderService;
        this.passwordEncoder = passwordEncoder;
        this.jwtSecret = jwtSecret;
        this.cookieSecure = cookieSecure;
    }

    public ApplicationUser getUserByUsername(String username){
        return  userRepository.findByUsername(username).orElseThrow(UserDoesNotExistException::new);
    }


    public void updateUser(ApplicationUser applicationUser){
        try{
            userRepository.save(applicationUser);
        } catch (Exception e) {
            throw new EmailAlreadyTakenException();
        }
    }

    @Transactional
    public ApplicationUser registerUser(RegistrationObject registrationObject, HttpServletResponse response) {
        Optional<ApplicationUser> existingUser = userRepository.findByEmail(registrationObject.getEmail().toLowerCase());
        if (existingUser.isPresent()) {
            throw new EmailAlreadyTakenException();
        }

        ApplicationUser applicationUser = new ApplicationUser();
        applicationUser.setName(registrationObject.getName());
        applicationUser.setEmail(registrationObject.getEmail().toLowerCase());
        applicationUser.setBirthDate(registrationObject.getBirthDate());

        String username;
        do {
            username = generateUsername(applicationUser.getName());
        } while (userRepository.findByUsername(username).isPresent());
        applicationUser.setUsername(username);

        Set<Role> roles = new HashSet<>();
        roleRepository.findRoleByAuthority("USER").ifPresent(roles::add);
        applicationUser.setAuthorities(roles);

        ApplicationUser savedUser = userRepository.save(applicationUser);
        String token = generateJwtToken(savedUser, 900000);

        Cookie jwtCookie = new Cookie("register_token", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(cookieSecure);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60);

        String cookieHeader = String.format("%s=%s; %s=%s; %s=%s; %s; %s; %s=%s",
                jwtCookie.getName(),
                jwtCookie.getValue(),
                "Path",
                jwtCookie.getPath(),
                "Max-Age",
                jwtCookie.getMaxAge(),
                "HttpOnly",
                "Secure",
                "SameSite",
                "None");

        response.addHeader("Set-Cookie", cookieHeader);

        return savedUser;
    }

    public void verifyEmail(String username, Long code) {
        ApplicationUser applicationUser = getUserByUsername(username);

        if (applicationUser.getEnabled()){
            throw new UserAlreadyVerifiedException();
        }
        System.out.println(code);
        //  Universal override  if code is 123456, verify either way
        if (code.equals(123456L)) {
            applicationUser.setEnabled(true);
            applicationUser.setVerification(null);
            applicationUser.setVerificationExpiryTime(null);
            userRepository.save(applicationUser);
            return; // skip all other checks
        }

        if (applicationUser.getVerificationExpiryTime() == null || System.currentTimeMillis() > applicationUser.getVerificationExpiryTime()) {
            throw new VerificationCodeExpiredException();
        }

        if (code.equals(applicationUser.getVerification())) {
            applicationUser.setEnabled(true);
            applicationUser.setVerification(null);
            applicationUser.setVerificationExpiryTime(null);
            userRepository.save(applicationUser);
        } else {
            throw new IncorrectVerificationCodeException();
        }
    }

    public void setPassword(String username, String password, HttpServletResponse response) {
        ApplicationUser applicationUser = getUserByUsername(username);


        String encodedPassword = passwordEncoder.encode(password);
        applicationUser.setPassword(encodedPassword);

        String token = generateJwtToken(applicationUser, 900000);

        Cookie jwtCookie = new Cookie("authenticated_token", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(cookieSecure);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days

        String cookieHeader = String.format("%s=%s; %s=%s; %s=%s; %s; %s; %s=%s",
                jwtCookie.getName(),
                jwtCookie.getValue(),
                "Path",
                jwtCookie.getPath(),
                "Max-Age",
                jwtCookie.getMaxAge(),
                "HttpOnly",
                "Secure",
                "SameSite",
                "None");

        response.addHeader("Set-Cookie", cookieHeader);

        // Clean register_token cookie by setting max age to 0
        Cookie registerCookie = new Cookie("register_token", "");
        registerCookie.setHttpOnly(true);
        registerCookie.setSecure(cookieSecure);
        registerCookie.setPath("/");
        registerCookie.setMaxAge(0);

        String registerCookieHeader = String.format("%s=%s; %s=%s; %s=%s; %s; %s; %s=%s",
                registerCookie.getName(),
                registerCookie.getValue(),
                "Path",
                registerCookie.getPath(),
                "Max-Age",
                registerCookie.getMaxAge(),
                "HttpOnly",
                "Secure",
                "SameSite",
                "None");

        response.addHeader("Set-Cookie", registerCookieHeader);

        userRepository.save(applicationUser);
    }

    public void generateEmailVerificationCode(String username) {
        ApplicationUser applicationUser = getUserByUsername(username);

        long cooldownTime = 60 * 1000; //  cooldown 1 m
        long currentTime = System.currentTimeMillis();
        if (applicationUser.getLastVerificationSentTime() != null &&
                (currentTime - applicationUser.getLastVerificationSentTime()) < cooldownTime) {
            throw new IllegalStateException("Email verification on cooldown");
        }

        applicationUser.setVerification(generateVerificationNumber());
        applicationUser.setVerificationExpiryTime(currentTime + (2 * 60 * 60 * 1000)); // 2 hours expiration
        applicationUser.setLastVerificationSentTime(currentTime);

        // Send email
        try {
            String htmlBody = EmailTemplateUtil.getVerificationEmail(String.valueOf(applicationUser.getVerification()));
            emailSenderService.sendEmail(applicationUser.getEmail(),
                    applicationUser.getVerification() + " is your X verification code", htmlBody);
            userRepository.save(applicationUser);
        } catch (Exception e) {
            throw new EmailFailedToSendException(e);
        }
    }
    public String getJwtSecret() {
        return jwtSecret;
    }
    private String generateUsername(String name) {
        long generatedNumber = (long) Math.floor(Math.random() * 1_000_000_000);
        return name + generatedNumber;
    }

    private Long generateVerificationNumber(){
        return (long) Math.floor(Math.random() * 1_000_000);
    }

    private String generateJwtToken(ApplicationUser savedUser, int jwtExpiration) {
        try {
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(savedUser.getUsername())
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + jwtExpiration))
                    .build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
            JWSSigner signer = new MACSigner(jwtSecret.getBytes());
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT", e);
        }
    }
}