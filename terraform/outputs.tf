# ============================================================================
# Root Outputs - X-Twitter Recreation Infrastructure
# ============================================================================

# ============================================================================
# Network Outputs
# ============================================================================

output "vpc_id" {
  description = "VPC ID"
  value       = module.network.vpc_id
}

output "public_subnet_id" {
  description = "First public subnet ID"
  value       = module.network.public_subnet_ids[0]
}

output "public_subnet_ids" {
  description = "All public subnet IDs"
  value       = module.network.public_subnet_ids
}

output "private_app_subnet_id" {
  description = "Private app subnet ID"
  value       = module.network.private_app_subnet_id
}

output "private_microservice_subnet_id" {
  description = "Private microservice subnet ID"
  value       = module.network.private_microservice_subnet_id
}

output "database_subnet_id" {
  description = "Database subnet ID"
  value       = module.network.database_subnet_id
}

output "nat_gateway_public_ip" {
  description = "NAT Gateway public IP"
  value       = module.network.nat_gateway_public_ip
}

# ============================================================================
# ALB Outputs
# ============================================================================

output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = module.alb.alb_dns_name
}

output "alb_arn" {
  description = "Application Load Balancer ARN"
  value       = module.alb.alb_arn
}

# ============================================================================
# CloudFront Outputs
# ============================================================================

output "cloudfront_distribution_domain" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.main.id
}

# ============================================================================
# S3 Outputs
# ============================================================================

output "s3_bucket_name" {
  description = "S3 bucket name for static content"
  value       = aws_s3_bucket.static.id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.static.arn
}

# ============================================================================
# RDS Outputs
# ============================================================================

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "rds_address" {
  description = "RDS PostgreSQL address"
  value       = module.rds.db_address
  sensitive   = true
}

output "rds_username" {
  description = "RDS database username"
  value       = var.db_username
  sensitive   = true
}

output "rds_password" {
  description = "RDS database password"
  value       = var.db_password
  sensitive   = true
}

output "rds_database_name" {
  description = "RDS database name"
  value       = var.db_name
}

# ============================================================================
# ElastiCache Outputs
# ============================================================================

output "elasticache_primary_endpoint" {
  description = "ElastiCache primary endpoint"
  value       = module.elasticache.primary_endpoint
  sensitive   = true
}

output "elasticache_reader_endpoint" {
  description = "ElastiCache reader endpoint"
  value       = module.elasticache.reader_endpoint
  sensitive   = true
}

output "elasticache_port" {
  description = "ElastiCache port"
  value       = module.elasticache.port
}

// removed elasticache_auth_token output; no auth token is used

# ============================================================================
# ECS Outputs
# ============================================================================

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_cluster_arn" {
  description = "ECS cluster ARN"
  value       = module.ecs.cluster_arn
}

output "main_app_service_name" {
  description = "Main app ECS service name"
  value       = module.ecs.main_app_service_name
}

output "username_check_service_name" {
  description = "Username check ECS service name"
  value       = module.ecs.username_check_service_name
}

# ============================================================================
# ECR Outputs
# ============================================================================

output "ecr_repository_url" {
  description = "ECR repository URL for Java app"
  value       = aws_ecr_repository.java_app.repository_url
}

output "ecr_repository_arn" {
  description = "ECR repository ARN for Java app"
  value       = aws_ecr_repository.java_app.arn
}

