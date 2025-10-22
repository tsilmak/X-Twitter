# ============================================================================
# ALB Module Variables
# ============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "IDs of public subnets for ALB (at least two in different AZs)"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security group ID for ALB"
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

variable "enable_deletion_protection" {
  description = "Enable deletion protection on ALB"
  type        = bool
  default     = false
}

variable "certificate_arn" {
  description = "ARN of SSL/TLS certificate for HTTPS"
  type        = string
  default     = ""
}

