# ============================================================================
# Security Groups Module
# ============================================================================
# This module creates security groups for different layers:
# - ALB (Application Load Balancer)
# - ECS (Application services)
# - RDS (Database)
# - ElastiCache (Redis)
# ============================================================================

# ============================================================================
# ALB Security Group
# ============================================================================
# Allows HTTP/HTTPS traffic from the internet to the load balancer
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = var.vpc_id

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

# ============================================================================
# ALB Ingress Rules
# ============================================================================

# Allow HTTP traffic from internet
resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow HTTP from internet"

  from_port   = 80
  to_port     = 80
  ip_protocol = "tcp"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow HTTP"
  }
}

# Allow HTTPS traffic from internet
resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow HTTPS from internet"

  from_port   = 443
  to_port     = 443
  ip_protocol = "tcp"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow HTTPS"
  }
}

# ============================================================================
# ALB Egress Rules
# ============================================================================

# Allow all outbound traffic
resource "aws_vpc_security_group_egress_rule" "alb_all_traffic" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow all outbound traffic"

  ip_protocol = "-1"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow all egress"
  }
}

# ============================================================================
# ECS/Fargate Security Group
# ============================================================================
# Allows traffic from ALB to application containers
resource "aws_security_group" "ecs" {
  name        = "${var.project_name}-ecs-sg"
  description = "Security group for ECS Fargate tasks"
  vpc_id      = var.vpc_id

  tags = {
    Name = "${var.project_name}-ecs-sg"
  }
}

# ============================================================================
# ECS Ingress Rules
# ============================================================================

# Allow traffic from ALB on app port (3000)
resource "aws_vpc_security_group_ingress_rule" "ecs_from_alb" {
  security_group_id = aws_security_group.ecs.id
  description       = "Allow traffic from ALB"

  from_port                    = var.app_port
  to_port                      = var.app_port
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.alb.id

  tags = {
    Name = "Allow ALB traffic"
  }
}

# Allow ECS tasks to communicate with each other
resource "aws_vpc_security_group_ingress_rule" "ecs_from_ecs" {
  security_group_id = aws_security_group.ecs.id
  description       = "Allow inter-ECS communication"

  from_port                    = 0
  to_port                      = 65535
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.ecs.id

  tags = {
    Name = "Allow inter-ECS traffic"
  }
}

# ============================================================================
# ECS Egress Rules
# ============================================================================

# Allow all outbound traffic (needed for downloading images, external APIs)
resource "aws_vpc_security_group_egress_rule" "ecs_all_traffic" {
  security_group_id = aws_security_group.ecs.id
  description       = "Allow all outbound traffic"

  ip_protocol = "-1"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow all egress"
  }
}

# ============================================================================
# RDS Security Group
# ============================================================================
# Allows PostgreSQL traffic from ECS tasks only
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS database"
  vpc_id      = var.vpc_id

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

# ============================================================================
# RDS Ingress Rules
# ============================================================================

# Allow PostgreSQL (port 5432) from ECS tasks
resource "aws_vpc_security_group_ingress_rule" "rds_from_ecs" {
  security_group_id = aws_security_group.rds.id
  description       = "Allow PostgreSQL from ECS"

  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.ecs.id

  tags = {
    Name = "Allow PostgreSQL from ECS"
  }
}

# ============================================================================
# RDS Egress Rules
# ============================================================================

# Allow minimal egress (databases typically don't need outbound access)
resource "aws_vpc_security_group_egress_rule" "rds_all_traffic" {
  security_group_id = aws_security_group.rds.id
  description       = "Allow all outbound traffic"

  ip_protocol = "-1"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow all egress"
  }
}

# ============================================================================
# ElastiCache Security Group
# ============================================================================
# Allows Redis traffic from ECS tasks only
resource "aws_security_group" "elasticache" {
  name        = "${var.project_name}-elasticache-sg"
  description = "Security group for ElastiCache Redis"
  vpc_id      = var.vpc_id

  tags = {
    Name = "${var.project_name}-elasticache-sg"
  }
}

# ============================================================================
# ElastiCache Ingress Rules
# ============================================================================

# Allow Redis (port 6379) from ECS tasks
resource "aws_vpc_security_group_ingress_rule" "elasticache_from_ecs" {
  security_group_id = aws_security_group.elasticache.id
  description       = "Allow Redis from ECS"

  from_port                    = 6379
  to_port                      = 6379
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.ecs.id

  tags = {
    Name = "Allow Redis from ECS"
  }
}

# ============================================================================
# ElastiCache Egress Rules
# ============================================================================

# Allow minimal egress (cache typically doesn't need outbound access)
resource "aws_vpc_security_group_egress_rule" "elasticache_all_traffic" {
  security_group_id = aws_security_group.elasticache.id
  description       = "Allow all outbound traffic"

  ip_protocol = "-1"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow all egress"
  }
}
