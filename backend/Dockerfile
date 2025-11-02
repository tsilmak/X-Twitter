
# Multi-stage build for better optimization
FROM ubuntu:22.04 AS builder

# Install Java 25 and build tools
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    findutils \
    && rm -rf /var/lib/apt/lists/*

# Download and install Java 25 from Eclipse Temurin
RUN wget https://github.com/adoptium/temurin25-binaries/releases/download/jdk-25%2B36/OpenJDK25U-jdk_x64_linux_hotspot_25_36.tar.gz \
    && tar -xzf OpenJDK25U-jdk_x64_linux_hotspot_25_36.tar.gz \
    && mv jdk-25+36 /opt/java25 \
    && rm OpenJDK25U-jdk_x64_linux_hotspot_25_36.tar.gz

# Set Java 25 as default
ENV JAVA_HOME=/opt/java25
ENV PATH=$JAVA_HOME/bin:$PATH

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files first (these change less frequently)
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy source code last (this changes most frequently)
COPY src src

# Add a cache-busting argument that can be passed during build
ARG CACHE_BUST=1

# Make gradlew executable
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew clean bootJar

# Runtime stage
FROM ubuntu:22.04

# Install Java 25 and required packages
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Download and install Java 25 from Eclipse Temurin
RUN wget https://github.com/adoptium/temurin25-binaries/releases/download/jdk-25%2B36/OpenJDK25U-jdk_x64_linux_hotspot_25_36.tar.gz \
    && tar -xzf OpenJDK25U-jdk_x64_linux_hotspot_25_36.tar.gz \
    && mv jdk-25+36 /opt/java25 \
    && rm OpenJDK25U-jdk_x64_linux_hotspot_25_36.tar.gz

# Set Java 25 as default
ENV JAVA_HOME=/opt/java25
ENV PATH=$JAVA_HOME/bin:$PATH

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
