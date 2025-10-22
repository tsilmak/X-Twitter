# ============================================================================
# CloudFront Module - Content Delivery Network
# ============================================================================
# Creates CloudFront distribution for:
# - S3 static content delivery (images, assets)
# - ALB as origin for dynamic content
# ============================================================================

# ============================================================================
# CloudFront Distribution
# ============================================================================
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} - Static Content Distribution"
  default_root_object = "index.html"
  price_class         = var.cloudfront_price_class

  # ============================================================================
  # S3 Origin - Static Content
  # ============================================================================
  origin {
    domain_name              = var.s3_bucket_regional_domain_name
    origin_id                = "S3-${var.project_name}-static"
    origin_access_control_id = var.cloudfront_oac_id

    connection_attempts = 3
    connection_timeout  = 10
  }

  # ============================================================================
  # Default Cache Behavior - S3 Static Content
  # ============================================================================
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

  # ============================================================================
  # Restrictions
  # ============================================================================
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # ============================================================================
  # SSL/TLS Certificate
  # ============================================================================
  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  tags = {
    Name        = "${var.project_name}-cloudfront"
    Environment = var.environment
  }
}

