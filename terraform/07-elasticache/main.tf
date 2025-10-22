# ============================================================================
# ElastiCache Valkey/Redis Module
# ============================================================================
# Creates ElastiCache Valkey cluster in private subnet (10.0.4.0/24)
# Provides caching for Main App and Username Check Microservice
# ============================================================================

# ============================================================================
# ElastiCache Replication Group (Valkey-compatible Redis)
# ============================================================================
resource "aws_elasticache_replication_group" "valkey" {
  replication_group_id = "${var.project_name}-valkey"
  description          = "ElastiCache Valkey for ${var.project_name}"

  engine               = "valkey"
  engine_version       = var.valkey_engine_version
  node_type            = var.valkey_node_type
  port                 = 6379
  parameter_group_name = aws_elasticache_parameter_group.valkey.name

  num_cache_clusters         = var.num_cache_nodes
  automatic_failover_enabled = var.num_cache_nodes > 1 ? true : false
  multi_az_enabled           = var.num_cache_nodes > 1 ? true : false

  subnet_group_name  = var.elasticache_subnet_group_name
  security_group_ids = [var.elasticache_security_group_id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  transit_encryption_mode    = "preferred"

  snapshot_retention_limit = var.snapshot_retention_limit
  snapshot_window          = "03:00-05:00"
  maintenance_window       = "sun:05:00-sun:07:00"

  auto_minor_version_upgrade = true
  apply_immediately          = true

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.valkey_slow_log.name
    destination_type = "cloudwatch-logs"
    log_format       = "text"
    log_type         = "slow-log"
  }

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.valkey_engine_log.name
    destination_type = "cloudwatch-logs"
    log_format       = "text"
    log_type         = "engine-log"
  }

  tags = {
    Name        = "${var.project_name}-valkey"
    Environment = var.environment
  }
}

# ============================================================================
# Parameter Group
# ============================================================================
resource "aws_elasticache_parameter_group" "valkey" {
  name   = "${var.project_name}-valkey-params"
  family = "valkey7"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  tags = {
    Name        = "${var.project_name}-valkey-params"
    Environment = var.environment
  }
}

# ============================================================================
# CloudWatch Log Groups
# ============================================================================
resource "aws_cloudwatch_log_group" "valkey_slow_log" {
  name              = "/aws/elasticache/${var.project_name}/slow-log"
  retention_in_days = 7

  tags = {
    Name        = "${var.project_name}-valkey-slow-log"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "valkey_engine_log" {
  name              = "/aws/elasticache/${var.project_name}/engine-log"
  retention_in_days = 7

  tags = {
    Name        = "${var.project_name}-valkey-engine-log"
    Environment = var.environment
  }
}

