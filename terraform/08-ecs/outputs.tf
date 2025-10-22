# ============================================================================
# ECS Module Outputs
# ============================================================================

output "cluster_id" {
  description = "ID of the ECS cluster"
  value       = aws_ecs_cluster.main.id
}

output "cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.main.arn
}

output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "main_app_service_id" {
  description = "ID of the main app service"
  value       = aws_ecs_service.main_app.id
}

output "main_app_service_name" {
  description = "Name of the main app service"
  value       = aws_ecs_service.main_app.name
}

output "username_check_service_id" {
  description = "ID of the username check service"
  value       = aws_ecs_service.username_check.id
}

output "username_check_service_name" {
  description = "Name of the username check service"
  value       = aws_ecs_service.username_check.name
}

output "task_execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "task_role_arn" {
  description = "ARN of the ECS task role"
  value       = aws_iam_role.ecs_task.arn
}

