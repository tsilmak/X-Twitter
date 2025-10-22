# ============================================================================
# Application Load Balancer Module
# ============================================================================
# Creates ALB in public subnet to route traffic to:
# - Main App ECS Fargate (private subnet 10.0.2.0/24)
# - Username Check Microservice ECS Fargate (private subnet 10.0.3.0/24)
# ============================================================================

# ============================================================================
# Application Load Balancer
# ============================================================================
resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection       = var.enable_deletion_protection
  enable_http2                     = true
  enable_cross_zone_load_balancing = true

  tags = {
    Name        = "${var.project_name}-alb"
    Environment = var.environment
  }
}

# ============================================================================
# Target Group - Main App
# ============================================================================
resource "aws_lb_target_group" "main_app" {
  name        = "${var.project_name}-main-app-tg"
  port        = var.app_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/actuator/health"
    protocol            = "HTTP"
    matcher             = "200"
  }

  deregistration_delay = 30

  tags = {
    Name        = "${var.project_name}-main-app-tg"
    Environment = var.environment
  }
}

# ============================================================================
# Target Group - Username Check Microservice
# ============================================================================
resource "aws_lb_target_group" "username_check" {
  name        = "${var.project_name}-username-check-tg"
  port        = var.microservice_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/actuator/health"
    protocol            = "HTTP"
    matcher             = "200"
  }

  deregistration_delay = 30

  tags = {
    Name        = "${var.project_name}-username-check-tg"
    Environment = var.environment
  }
}

# ============================================================================
# ALB Listener - HTTP (Port 80)
# ============================================================================
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main_app.arn
  }
}



# ============================================================================
# ALB Listener Rule - Username Check API
# ============================================================================
resource "aws_lb_listener_rule" "username_check" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.username_check.arn
  }

  condition {
    path_pattern {
      values = ["/api/username-check*"]
    }
  }

  tags = {
    Name = "${var.project_name}-username-check-rule"
  }
}

