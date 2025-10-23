
FROM openjdk:25-jdk-slim

# Install required packages
RUN apt-get update && apt-get install -y \
    findutils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src src

# Make gradlew executable
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew build

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=production
ENV SERVER_PORT=8080

# Database Configuration
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5469/Twitter-X-Recreation-DB
ENV SPRING_DATASOURCE_USERNAME=user
ENV SPRING_DATASOURCE_PASSWORD=password
ENV JPA_HIBERNATE_DDL=update

# API Configuration
ENV BREVO_API_KEY=your-brevo-api-key
ENV SMTP_MY_EMAIL=your-email@example.com

# CORS Configuration
ENV ORIGIN_BASEURL=http://localhost:3000

# JWT Configuration
ENV JWT_SECRET=your-jwt-secret-key-change-this-in-production
ENV JWT_EXPIRATION=86400000

# Run the application
CMD ["java", "-jar", "build/libs/twitter-X-0.0.1-SNAPSHOT.jar"]
