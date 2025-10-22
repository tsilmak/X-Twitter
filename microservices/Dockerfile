# Use Rust official image for building
FROM rust:1.90-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the username_availability_check service
COPY username_availability_check/ .

# Build the Rust application
RUN cargo build --release

# Use a minimal runtime image
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the built binary
COPY --from=builder /app/target/release/username_availability_check /usr/local/bin/

# Expose port 80
EXPOSE 80

# Set environment variables
ENV PORT=80

# Run the application
CMD ["username_availability_check"]
