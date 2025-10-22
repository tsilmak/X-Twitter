# ============================================================================
# ElastiCache Module Variables
# ============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "elasticache_subnet_group_name" {
  description = "Name of ElastiCache subnet group"
  type        = string
}

variable "elasticache_security_group_id" {
  description = "Security group ID for ElastiCache"
  type        = string
}

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

variable "num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "snapshot_retention_limit" {
  description = "Number of days to retain backups"
  type        = number
  default     = 5
}

variable "apply_immediately" {
  description = "Apply changes immediately"
  type        = bool
  default     = false
}

variable "valkey_auth_token" {
  description = "Auth token for ElastiCache (optional)"
  type        = string
  default     = null
}

