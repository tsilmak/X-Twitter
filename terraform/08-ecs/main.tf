# ============================================================================
# ECS Fargate Module
# ============================================================================
# Creates ECS cluster with two services:
# 1. Main App - in private subnet 10.0.2.0/24
# 2. Username Check Microservice - in private subnet 10.0.3.0/24
# ============================================================================

# ============================================================================
# ECS Cluster
# ============================================================================
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "${var.project_name}-cluster"
    Environment = var.environment
  }
}

# ============================================================================
# CloudWatch Log Groups
# ============================================================================
resource "aws_cloudwatch_log_group" "main_app" {
  name              = "/ecs/${var.project_name}/main-app"
  retention_in_days = 7

  tags = {
    Name        = "${var.project_name}-main-app-logs"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "username_check" {
  name              = "/ecs/${var.project_name}/username-check"
  retention_in_days = 7

  tags = {
    Name        = "${var.project_name}-username-check-logs"
    Environment = var.environment
  }
}

# ============================================================================
# IAM Role - ECS Task Execution
# ============================================================================
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project_name}-ecs-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  tags = {
    Name = "${var.project_name}-ecs-task-execution"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ============================================================================
# IAM Role - ECS Task Role
# ============================================================================
resource "aws_iam_role" "ecs_task" {
  name = "${var.project_name}-ecs-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  tags = {
    Name = "${var.project_name}-ecs-task"
  }
}

# ============================================================================
# Task Definition - Main App
# ============================================================================
resource "aws_ecs_task_definition" "main_app" {
  family                   = "${var.project_name}-main-app"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.main_app_cpu
  memory                   = var.main_app_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = "main-app"
    image = var.main_app_image

    portMappings = [{
      containerPort = var.app_port
      protocol      = "tcp"
    }]

    environment = [
      {
        name  = "DATABASE_URL"
        value = "postgresql://${var.db_username}:${var.db_password}@${var.db_endpoint}/${var.db_name}"
      },
      {
        name  = "REDIS_URL"
        value = "redis://${var.elasticache_endpoint}:6379"
      },
      {
        name  = "NODE_ENV"
        value = var.environment
      },
      {
        name  = "ORIGIN_BASEURL"
        value = "https://d15qcakwqpxz8g.cloudfront.net"
      },
      {
        name  = "SPRING_PROFILES_ACTIVE"
        value = "production"
      },
      {
        name  = "SERVER_PORT"
        value = "8080"
      },
      {
        name  = "SMTP_MY_EMAIL"
        value = "noreply@example.com"
      },
      {
        name  = "SMTP_MY_PASSWORD"
        value = "your-smtp-password"
      },
      {
        name  = "SMTP_HOST"
        value = "smtp.gmail.com"
      },
      {
        name  = "SMTP_PORT"
        value = "587"
      },
      {
        name  = "BREVO_API_KEY"
        value = "your-brevo-api-key"
      },
      {
        name  = "JWT_SECRET"
        value = "your-jwt-secret-key-here"
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.main_app.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:${var.app_port}/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])

  tags = {
    Name        = "${var.project_name}-main-app"
    Environment = var.environment
  }
}

# ============================================================================
# Task Definition - Username Check Microservice
# ============================================================================
resource "aws_ecs_task_definition" "username_check" {
  family                   = "${var.project_name}-username-check"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.microservice_cpu
  memory                   = var.microservice_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = "username-check"
    image = var.username_check_image

    portMappings = [{
      containerPort = var.microservice_port
      protocol      = "tcp"
    }]

    environment = [
      {
        name  = "DATABASE_URL"
        value = "postgresql://${var.db_username}:${var.db_password}@${var.db_endpoint}/${var.db_name}"
      },
      {
        name  = "REDIS_URL"
        value = "redis://${var.elasticache_endpoint}:6379"
      },
      {
        name  = "RUST_LOG"
        value = "info"
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.username_check.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:${var.microservice_port}/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])

  tags = {
    Name        = "${var.project_name}-username-check"
    Environment = var.environment
  }
}

# ============================================================================
# ECS Service - Main App (Private Subnet A1 - 10.0.2.0/24)
# ============================================================================
resource "aws_ecs_service" "main_app" {
  name            = "${var.project_name}-main-app"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main_app.arn
  desired_count   = var.main_app_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [var.private_app_subnet_id]
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.main_app_target_group_arn
    container_name   = "main-app"
    container_port   = var.app_port
  }

  depends_on = [aws_iam_role_policy_attachment.ecs_task_execution]

  tags = {
    Name        = "${var.project_name}-main-app-service"
    Environment = var.environment
  }
}

# ============================================================================
# ECS Service - Username Check (Private Subnet A1 - 10.0.3.0/24)
# ============================================================================
resource "aws_ecs_service" "username_check" {
  name            = "${var.project_name}-username-check"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.username_check.arn
  desired_count   = var.microservice_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [var.private_microservice_subnet_id]
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.username_check_target_group_arn
    container_name   = "username-check"
    container_port   = var.microservice_port
  }

  depends_on = [aws_iam_role_policy_attachment.ecs_task_execution]

  tags = {
    Name        = "${var.project_name}-username-check-service"
    Environment = var.environment
  }
}

