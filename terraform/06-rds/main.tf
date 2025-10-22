# ============================================================================
# RDS PostgreSQL Module
# ============================================================================
# Creates RDS PostgreSQL database in private subnet (10.0.4.0/24)
# Accessible by Main App and Username Check Microservice
# ============================================================================

# ============================================================================
# RDS PostgreSQL Instance
# ============================================================================
resource "aws_db_instance" "postgres" {
  identifier        = "${var.project_name}-db"
  engine            = "postgres"
  engine_version    = var.db_engine_version
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = var.db_subnet_group_name
  vpc_security_group_ids = [var.rds_security_group_id]
  publicly_accessible    = false

  multi_az                        = var.multi_az
  backup_retention_period         = var.backup_retention_period
  backup_window                   = "03:00-06:00"
  maintenance_window              = "sun:00:00-sun:03:00"
  auto_minor_version_upgrade      = true
  deletion_protection             = var.deletion_protection
  skip_final_snapshot             = var.skip_final_snapshot
  final_snapshot_identifier       = "${var.project_name}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  copy_tags_to_snapshot           = true
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  tags = {
    Name        = "${var.project_name}-postgres"
    Environment = var.environment
  }
}

