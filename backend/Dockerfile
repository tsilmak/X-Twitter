
# Multi-stage build for better optimization
FROM openjdk:25-jdk-slim AS builder

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
RUN ./gradlew clean bootJar

# Runtime stage
FROM openjdk:25-jre-slim

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/build/libs/twitter-X-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=production
ENV SERVER_PORT=8080

# Database Configuration (will be overridden by ECS task definition)
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/twitterx
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=password
ENV JPA_HIBERNATE_DDL=update

# API Configuration (will be overridden by ECS task definition)
ENV BREVO_API_KEY=your-brevo-api-key
ENV SMTP_MY_EMAIL=your-email@example.com

# CORS Configuration (will be overridden by ECS task definition)
ENV ORIGIN_BASEURL=http://localhost:3000

# JWT Configuration (will be overridden by ECS task definition)
ENV JWT_SECRET=your-jwt-secret-key-change-this-in-production
ENV JWT_EXPIRATION=86400000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
CMD ["java", "-jar", "app.jar"]
