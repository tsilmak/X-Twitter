# ============================================================================
# Root Variables - X-Twitter Recreation Infrastructure
# ============================================================================

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "x"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

# ============================================================================
# Network Variables
# ============================================================================

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["eu-west-3a","eu-west-3b"]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs (ALB, NAT Gateway)"
  type        = list(string)
  default     = ["10.0.1.0/24","10.0.6.0/24"]
}

variable "private_app_subnet_cidrs" {
  description = "Private app subnet CIDRs (Main App)"
  type        = list(string)
  default     = ["10.0.2.0/24"]
}

variable "private_microservice_subnet_cidrs" {
  description = "Private microservice subnet CIDRs (Username Check)"
  type        = list(string)
  default     = ["10.0.3.0/24"]
}

variable "database_subnet_cidrs" {
  description = "Database subnet CIDRs (RDS, ElastiCache)"
  type        = list(string)
  default     = ["10.0.4.0/24","10.0.5.0/24"]
}

# ============================================================================
# Application Variables
# ============================================================================

variable "app_port" {
  description = "Main application port"
  type        = number
  default     = 8080
}

variable "microservice_port" {
  description = "Microservice port"
  type        = number
  default     = 8080
}

variable "certificate_arn" {
  description = "ARN of SSL certificate for HTTPS"
  type        = string
  default     = ""
}

# ============================================================================
# S3 and CloudFront Variables
# ============================================================================

variable "s3_bucket_prefix" {
  description = "Prefix for S3 bucket name"
  type        = string
  default     = "x-twitter-static"
}

variable "enable_versioning" {
  description = "Enable S3 versioning"
  type        = bool
  default     = true
}

variable "cloudfront_default_ttl" {
  description = "CloudFront default TTL (seconds)"
  type        = number
  default     = 3600
}

variable "cloudfront_max_ttl" {
  description = "CloudFront max TTL (seconds)"
  type        = number
  default     = 86400
}

# Additional CloudFront controls
variable "cloudfront_api_path_pattern" {
  description = "Path pattern for API requests routed via CloudFront to the ALB"
  type        = string
  default     = "/api/*"
}

variable "cloudfront_origin_protocol_policy_to_alb" {
  description = "Protocol policy for CloudFront when connecting to the ALB origin (https-only | http-only | match-viewer)"
  type        = string
  default     = "http-only"
}

# ============================================================================
# RDS Variables
# ============================================================================

variable "db_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "17.4"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage (GB)"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "xtwitter"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

// removed valkey_auth_token variable; not prompting for it anymore

variable "rds_multi_az" {
  description = "Enable Multi-AZ for RDS"
  type        = bool
  default     = false
}

variable "rds_backup_retention_period" {
  description = "Backup retention period (days)"
  type        = number
  default     = 7
}

variable "rds_deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = false
}

variable "rds_skip_final_snapshot" {
  description = "Skip final snapshot on deletion"
  type        = bool
  default     = true
}

# ============================================================================
# ElastiCache Variables
# ============================================================================

variable "valkey_engine_version" {
  description = "Valkey engine version"
  type        = string
  default     = "7.2"
}

variable "valkey_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t4g.micro"
}

variable "valkey_num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

# ============================================================================
# ECS Variables
# ============================================================================

variable "main_app_image" {
  description = "Docker image for main app"
  type        = string
  default     = "nginx:latest"
}

variable "username_check_image" {
  description = "Docker image for username check microservice"
  type        = string
  default     = "nginx:latest"
}

variable "main_app_cpu" {
  description = "CPU units for main app"
  type        = number
  default     = 512
}

variable "main_app_memory" {
  description = "Memory for main app (MB)"
  type        = number
  default     = 1024
}

variable "microservice_cpu" {
  description = "CPU units for microservice"
  type        = number
  default     = 256
}

variable "microservice_memory" {
  description = "Memory for microservice (MB)"
  type        = number
  default     = 512
}

variable "main_app_desired_count" {
  description = "Desired count of main app tasks"
  type        = number
  default     = 1
}

variable "microservice_desired_count" {
  description = "Desired count of microservice tasks"
  type        = number
  default     = 1
}

