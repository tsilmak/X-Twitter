package com.twitter_X_Recreation.twitter_X.controllers;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import com.twitter_X_Recreation.twitter_X.dto.UpdatePhoneRequest;
import com.twitter_X_Recreation.twitter_X.dto.UserResponseDTO;
import com.twitter_X_Recreation.twitter_X.exceptions.*;
import com.twitter_X_Recreation.twitter_X.models.ApplicationUser;
import com.twitter_X_Recreation.twitter_X.models.RegistrationObject;
import com.twitter_X_Recreation.twitter_X.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;


@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final UserService userService;

    @Autowired
    public AuthenticationController(UserService userService){
        this.userService = userService;
    }

    @ExceptionHandler({EmailAlreadyTakenException.class})
    public ResponseEntity<String> handleEmailTaken(){
        return new ResponseEntity<String>("The email you provided is already in use", HttpStatus.CONFLICT);    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationObject registrationObject, HttpServletResponse response, HttpServletRequest request) {
        try {
            ApplicationUser user = userService.registerUser(registrationObject, response);
            UserResponseDTO sanitizedUser = new UserResponseDTO(
                    user.getUsername(),
                    user.getName(),
                    user.getEmail(),
                    user.getBirthDate()
            );
            return new ResponseEntity<>(sanitizedUser, HttpStatus.CREATED);
        } catch (EmailAlreadyTakenException e) {
            throw ApiExceptionHandler.of(request, HttpStatus.CONFLICT, e);

        }
    }

    @ExceptionHandler({UserDoesNotExistException.class})
    public ResponseEntity<String> handleUserDoesNotExist() {
            return new ResponseEntity<>("The user does not exist", HttpStatus.NOT_FOUND);
        }
    @PutMapping("/update/phone")
    public ResponseEntity<?> updatePhoneNumber(@RequestBody UpdatePhoneRequest phoneUpdateRequest,
                                               @CookieValue(name = "register_token", required = false) String token,
                                               HttpServletRequest request) {
        if (token == null || token.isEmpty()) {
            throw new MissingAuthenticationTokenException();
            }

        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(userService.getJwtSecret().getBytes());

            if (!signedJWT.verify(verifier)) {
                throw new InvalidJWTException();
            }

            String usernameFromToken = signedJWT.getJWTClaimsSet().getSubject();
            ApplicationUser user = userService.getUserByUsername(phoneUpdateRequest.getUsername());

            if (!usernameFromToken.equals(user.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Username mismatch");
            }

            user.setPhoneNumber(phoneUpdateRequest.getPhoneNumber());
            userService.updateUser(user);

            Map<String, String> responseBody = new LinkedHashMap<>();
            responseBody.put("message", "Phone number updated successfully");
            return ResponseEntity.ok(responseBody);

            } catch (MissingAuthenticationTokenException | InvalidJWTException e) {
                throw ApiExceptionHandler.of(request, HttpStatus.UNAUTHORIZED, e);
            } catch (Exception e) {
                throw ApiExceptionHandler.of(request, HttpStatus.BAD_REQUEST, e);
            }
        }
    @ExceptionHandler({EmailFailedToSendException.class})
    public ResponseEntity<String> handleFailedEmail() {
        return new ResponseEntity<String>("Email failed to send, try again in a moment", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    @PostMapping("/email/code")
    public ResponseEntity<?> createEmailVerificationCode(@RequestBody LinkedHashMap<String, String> body,HttpServletRequest request,
                                                             @CookieValue(name = "register_token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            throw new MissingAuthenticationTokenException();
        }
        try {

            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(userService.getJwtSecret().getBytes());

            if (!signedJWT.verify(verifier)) {
                throw new InvalidJWTException();
            }

            String usernameFromToken = signedJWT.getJWTClaimsSet().getSubject();
            String usernameFromBody = body.get("username");

            if (!usernameFromToken.equals(usernameFromBody)) {
                return new ResponseEntity<>("Username mismatch", HttpStatus.FORBIDDEN);
            }

            userService.generateEmailVerificationCode(usernameFromBody);

            Map<String, String> responseBody = new LinkedHashMap<>();
            responseBody.put("message", "Verification code generated and email sent successfully");
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } catch (Exception e) {
            throw ApiExceptionHandler.of(request, HttpStatus.BAD_REQUEST, e);
        }
    }


    @ExceptionHandler({IncorrectVerificationCodeException.class})
    public ResponseEntity<String> incorrectCodeHandler() {
        return new ResponseEntity<String>("The code provided is incorrect, please try again.", HttpStatus.CONFLICT);
    }

    @ExceptionHandler({VerificationCodeExpiredException.class})
    public ResponseEntity<String> codeExpiredHandler() {
        return new ResponseEntity<String>("The code provided has expired, please ask for a new one.", HttpStatus.CONFLICT);
    }

    @PostMapping("/email/code/verify")
    public ResponseEntity<?> verifyEmailCode(@RequestBody LinkedHashMap<String, String> body, HttpServletRequest request,
                                             @CookieValue(name = "register_token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            throw new MissingAuthenticationTokenException();
        }
        try {

            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(userService.getJwtSecret().getBytes());

            if (!signedJWT.verify(verifier)) {
                throw new InvalidJWTException();
            }

            String usernameFromToken = signedJWT.getJWTClaimsSet().getSubject();
            String usernameFromBody = body.get("username");

            if (!usernameFromToken.equals(usernameFromBody)) {
                return new ResponseEntity<>("Username mismatch", HttpStatus.FORBIDDEN);
            }
            Long code = Long.parseLong(body.get("code"));

            userService.verifyEmail(usernameFromToken, code);

            Map<String, String> responseBody = new LinkedHashMap<>();
            responseBody.put("message", "Email verified successfully");
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } catch (Exception e) {
            throw ApiExceptionHandler.of(request, HttpStatus.BAD_REQUEST, e);
        }
    }

    @PutMapping("/update/password")
    public ResponseEntity<?> updatePassword(@RequestBody LinkedHashMap<String, String> body, HttpServletResponse response,
                                            @CookieValue(name = "register_token", required = false) String token,
                                            HttpServletRequest request) {
        if (token == null || token.isEmpty()) {
            throw new MissingAuthenticationTokenException();
        }
        try {

            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(userService.getJwtSecret().getBytes());

            if (!signedJWT.verify(verifier)) {
                throw new InvalidJWTException();
            }

            String usernameFromToken = signedJWT.getJWTClaimsSet().getSubject();
            String usernameFromBody = body.get("username");

            if (!usernameFromToken.equals(usernameFromBody)) {
                return new ResponseEntity<>("Username mismatch", HttpStatus.FORBIDDEN);
            }

            String password = body.get("password");
            userService.setPassword(usernameFromToken, password, response);

            Map<String, String> responseBody = new LinkedHashMap<>();
            responseBody.put("message", "Password updated successfully");
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } catch (Exception e) {
            throw ApiExceptionHandler.of(request, HttpStatus.BAD_REQUEST, e);
            }
        }
}