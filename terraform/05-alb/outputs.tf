# ============================================================================
# ALB Module Outputs
# ============================================================================

output "alb_id" {
  description = "ID of the Application Load Balancer"
  value       = aws_lb.main.id
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.main.arn
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.main.zone_id
}

output "main_app_target_group_arn" {
  description = "ARN of the main app target group"
  value       = aws_lb_target_group.main_app.arn
}

output "username_check_target_group_arn" {
  description = "ARN of the username check target group"
  value       = aws_lb_target_group.username_check.arn
}

output "http_listener_arn" {
  description = "ARN of the HTTP listener"
  value       = aws_lb_listener.http.arn
}

# HTTPS listener not present when running HTTP-only configuration

