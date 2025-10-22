# ============================================================================
# S3 Module - Static Content Storage
# ============================================================================
# Creates S3 bucket for static content (images, assets, etc.)
# Integrated with CloudFront for content delivery
# ============================================================================

terraform {
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

# ============================================================================
# Random Suffix for Globally Unique Bucket Name
# ============================================================================
resource "random_id" "s3_suffix" {
  byte_length = 4
}

# ============================================================================
# S3 Bucket - Static Content
# ============================================================================
resource "aws_s3_bucket" "static" {
  bucket = "${var.s3_bucket_prefix}-${var.environment}-${random_id.s3_suffix.hex}"

  tags = {
    Name        = "${var.project_name}-static-content"
    Environment = var.environment
  }
}

# ============================================================================
# S3 Bucket Versioning
# ============================================================================
resource "aws_s3_bucket_versioning" "static" {
  bucket = aws_s3_bucket.static.id

  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Suspended"
  }
}

# ============================================================================
# S3 Bucket Public Access Block
# ============================================================================
# Block all public access - content served through CloudFront only
resource "aws_s3_bucket_public_access_block" "static" {
  bucket                  = aws_s3_bucket.static.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================================================
# S3 Bucket Server-Side Encryption
# ============================================================================
resource "aws_s3_bucket_server_side_encryption_configuration" "static" {
  bucket = aws_s3_bucket.static.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ============================================================================
# CloudFront Origin Access Control
# ============================================================================
resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.project_name}-s3-oac"
  description                       = "Origin Access Control for S3 static content"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ============================================================================
# S3 Bucket Policy - Allow CloudFront Access
# ============================================================================
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
            "AWS:SourceArn" = var.cloudfront_distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.static]
}

