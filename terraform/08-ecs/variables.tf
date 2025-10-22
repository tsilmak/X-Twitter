# ============================================================================
# ECS Module Variables
# ============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "private_app_subnet_id" {
  description = "ID of private app subnet (Main App)"
  type        = string
}

variable "private_microservice_subnet_id" {
  description = "ID of private microservice subnet (Username Check)"
  type        = string
}

variable "ecs_security_group_id" {
  description = "Security group ID for ECS"
  type        = string
}

variable "main_app_target_group_arn" {
  description = "ARN of main app target group"
  type        = string
}

variable "username_check_target_group_arn" {
  description = "ARN of username check target group"
  type        = string
}

variable "app_port" {
  description = "Port for main application"
  type        = number
  default     = 3000
}

variable "microservice_port" {
  description = "Port for username check microservice"
  type        = number
  default     = 8080
}

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

variable "db_endpoint" {
  description = "RDS database endpoint"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "elasticache_endpoint" {
  description = "ElastiCache endpoint"
  type        = string
}

