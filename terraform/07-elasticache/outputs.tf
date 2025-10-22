# ============================================================================
# ElastiCache Module Outputs
# ============================================================================

output "replication_group_id" {
  description = "ID of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.valkey.id
}

output "replication_group_arn" {
  description = "ARN of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.valkey.arn
}

output "primary_endpoint" {
  description = "Primary endpoint address"
  value       = aws_elasticache_replication_group.valkey.primary_endpoint_address
}

output "reader_endpoint" {
  description = "Reader endpoint address"
  value       = aws_elasticache_replication_group.valkey.reader_endpoint_address
}

output "port" {
  description = "Port number"
  value       = aws_elasticache_replication_group.valkey.port
}

output "configuration_endpoint" {
  description = "Configuration endpoint (for cluster mode)"
  value       = aws_elasticache_replication_group.valkey.configuration_endpoint_address
}

