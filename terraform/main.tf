# ============================================================================
# Root Terraform Configuration - X-Twitter Recreation
# ============================================================================
# This file orchestrates all modules for the infrastructure
# ============================================================================

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# ============================================================================
# Module 01: Network Infrastructure (VPC, Subnets, NAT, IGW)
# ============================================================================
module "network" {
  source = "./01-network"

  project_name                      = var.project_name
  vpc_cidr                          = var.vpc_cidr
  availability_zones                = var.availability_zones
  public_subnet_cidrs               = var.public_subnet_cidrs
  private_app_subnet_cidrs          = var.private_app_subnet_cidrs
  private_microservice_subnet_cidrs = var.private_microservice_subnet_cidrs
  database_subnet_cidrs             = var.database_subnet_cidrs
}

# ============================================================================
# Module 02: Security Groups
# ============================================================================
module "security" {
  source = "./02-security"

  project_name = var.project_name
  vpc_id       = module.network.vpc_id
  app_port     = var.app_port

  depends_on = [module.network]
}

# ============================================================================
# Module 03: S3 Static Content Storage
# ============================================================================
# Note: S3 bucket policy is applied separately to avoid circular dependency

resource "aws_s3_bucket" "static" {
  bucket_prefix = "${var.s3_bucket_prefix}-${var.environment}-"

  tags = {
    Name        = "${var.project_name}-static-content"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "static" {
  bucket = aws_s3_bucket.static.id

  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Suspended"
  }
}

resource "aws_s3_bucket_public_access_block" "static" {
  bucket                  = aws_s3_bucket.static.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static" {
  bucket = aws_s3_bucket.static.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.project_name}-s3-oac"
  description                       = "Origin Access Control for S3 static content"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ============================================================================
# Module 04: CloudFront Distribution
# ============================================================================
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} - Static Content Distribution"
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id                = "S3-${var.project_name}-static"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id

    connection_attempts = 3
    connection_timeout  = 10
  }

  # ----------------------------------------------------------------------------
  # ALB Origin - Dynamic API traffic
  # ----------------------------------------------------------------------------
  origin {
    domain_name = module.alb.alb_dns_name
    origin_id   = "ALB-${var.project_name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = var.cloudfront_origin_protocol_policy_to_alb
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_name}-static"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }

      headers = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = var.cloudfront_default_ttl
    max_ttl                = var.cloudfront_max_ttl
    compress               = true
  }

  # ----------------------------------------------------------------------------
  # Ordered behavior for API → route through ALB origin
  # ----------------------------------------------------------------------------
  ordered_cache_behavior {
    path_pattern     = var.cloudfront_api_path_pattern
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "ALB-${var.project_name}"

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }

      headers = [
        "Authorization",
        "Content-Type",
        "Origin",
        "Accept",
        "Accept-Language",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
      ]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
  }

  # ----------------------------------------------------------------------------
  # Ordered behavior for Actuator endpoints → route through ALB origin
  # ----------------------------------------------------------------------------
  ordered_cache_behavior {
    path_pattern     = "/actuator/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "ALB-${var.project_name}"

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }

      headers = [
        "Authorization",
        "Content-Type",
        "Origin",
        "Accept",
        "Accept-Language",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
      ]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  tags = {
    Name        = "${var.project_name}-cloudfront"
    Environment = var.environment
  }
}

# S3 Bucket Policy - Applied after CloudFront creation
resource "aws_s3_bucket_policy" "static" {
  bucket = aws_s3_bucket.static.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.static.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.static, aws_cloudfront_distribution.main]
}

# ============================================================================
# Module 05: Application Load Balancer
# ============================================================================
module "alb" {
  source = "./05-alb"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.network.vpc_id
  public_subnet_ids     = module.network.public_subnet_ids
  alb_security_group_id = module.security.alb_security_group_id
  app_port              = var.app_port
  microservice_port     = var.microservice_port
  certificate_arn       = var.certificate_arn

  depends_on = [module.network, module.security]
}

# ============================================================================
# Module 06: RDS PostgreSQL Database
# ============================================================================
module "rds" {
  source = "./06-rds"

  project_name            = var.project_name
  environment             = var.environment
  db_subnet_group_name    = module.network.db_subnet_group_name
  rds_security_group_id   = module.security.rds_security_group_id
  db_engine_version       = var.db_engine_version
  db_instance_class       = var.db_instance_class
  db_allocated_storage    = var.db_allocated_storage
  db_name                 = var.db_name
  db_username             = var.db_username
  db_password             = var.db_password
  multi_az                = var.rds_multi_az
  backup_retention_period = var.rds_backup_retention_period
  deletion_protection     = var.rds_deletion_protection
  skip_final_snapshot     = var.rds_skip_final_snapshot

  depends_on = [module.network, module.security]
}

# ============================================================================
# Module 07: ElastiCache Valkey
# ============================================================================
module "elasticache" {
  source = "./07-elasticache"

  project_name                  = var.project_name
  environment                   = var.environment
  elasticache_subnet_group_name = module.network.elasticache_subnet_group_name
  elasticache_security_group_id = module.security.elasticache_security_group_id
  valkey_engine_version         = var.valkey_engine_version
  valkey_node_type              = var.valkey_node_type
  num_cache_nodes               = var.valkey_num_cache_nodes

  depends_on = [module.network, module.security]
}

# ============================================================================
# ECR Repository for Java App
# ============================================================================
resource "aws_ecr_repository" "java_app" {
  name                 = "${var.project_name}-java-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.project_name}-java-app"
    Environment = var.environment
  }
}

# ============================================================================
# ECR Lifecycle Policy
# ============================================================================
resource "aws_ecr_lifecycle_policy" "java_app" {
  repository = aws_ecr_repository.java_app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# ============================================================================
# Module 08: ECS Fargate Services
# ============================================================================
module "ecs" {
  source = "./08-ecs"

  project_name                    = var.project_name
  environment                     = var.environment
  aws_region                      = var.aws_region
  vpc_id                          = module.network.vpc_id
  private_app_subnet_id           = module.network.private_app_subnet_id
  private_microservice_subnet_id  = module.network.private_microservice_subnet_id
  ecs_security_group_id           = module.security.ecs_security_group_id
  main_app_target_group_arn       = module.alb.main_app_target_group_arn
  username_check_target_group_arn = module.alb.username_check_target_group_arn
  app_port                        = var.app_port
  microservice_port               = var.microservice_port
  main_app_image                  = "${aws_ecr_repository.java_app.repository_url}:latest"
  username_check_image            = var.username_check_image
  main_app_cpu                    = var.main_app_cpu
  main_app_memory                 = var.main_app_memory
  microservice_cpu                = var.microservice_cpu
  microservice_memory             = var.microservice_memory
  main_app_desired_count          = var.main_app_desired_count
  microservice_desired_count      = var.microservice_desired_count
  db_endpoint                     = module.rds.db_address
  db_name                         = var.db_name
  db_username                     = var.db_username
  db_password                     = var.db_password
  elasticache_endpoint            = module.elasticache.primary_endpoint

  depends_on = [module.network, module.security, module.alb, module.rds, module.elasticache, aws_ecr_repository.java_app]
}
