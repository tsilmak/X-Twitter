# ============================================================================
# VPC and Network Infrastructure
# ============================================================================
# This module creates the network infrastructure matching the AWS diagram:
# - VPC (10.0.0.0/16)
# - Public Subnet (10.0.1.0/24) - ALB, NAT Gateway
# - Private Subnet A1 (10.0.2.0/24) - Main App ECS Fargate
# - Private Subnet A1 (10.0.3.0/24) - Username Check Microservice ECS Fargate
# - Private Subnet (10.0.4.0/24) - RDS PostgreSQL, ElastiCache Valkey
# ============================================================================

# ============================================================================
# VPC (Virtual Private Cloud)
# ============================================================================
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# ============================================================================
# Internet Gateway
# ============================================================================
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# ============================================================================
# Public Subnets - One per AZ (ALB, NAT Gateway)
# ============================================================================
# Hosts: Application Load Balancer, NAT Gateway (in first public subnet)
resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet-${count.index + 1}"
    Type = "Public"
    CIDR = var.public_subnet_cidrs[count.index]
  }
}

# ============================================================================
# Private Subnet A1 (10.0.2.0/24) - Main App
# ============================================================================
# Hosts: Main Application ECS Fargate Tasks
resource "aws_subnet" "private_app" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.private_app_subnet_cidrs[0]
  availability_zone       = var.availability_zones[0]
  map_public_ip_on_launch = false

  tags = {
    Name    = "${var.project_name}-private-subnet-a1-app"
    Type    = "Private"
    Purpose = "Main App ECS Fargate"
    CIDR    = var.private_app_subnet_cidrs[0]
  }
}

# ============================================================================
# Private Subnet A1 (10.0.3.0/24) - Username Check Microservice
# ============================================================================
# Hosts: Username Check Microservice ECS Fargate Tasks
resource "aws_subnet" "private_microservice" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.private_microservice_subnet_cidrs[0]
  availability_zone       = var.availability_zones[0]
  map_public_ip_on_launch = false

  tags = {
    Name    = "${var.project_name}-private-subnet-a1-microservice"
    Type    = "Private"
    Purpose = "Username Check Microservice ECS Fargate"
    CIDR    = var.private_microservice_subnet_cidrs[0]
  }
}

# ============================================================================
# Database Subnets (10.0.4.0/24 and 10.0.5.0/24) - RDS, ElastiCache
# ============================================================================
# Hosts: RDS PostgreSQL, ElastiCache Valkey
resource "aws_subnet" "database" {
  count = length(var.database_subnet_cidrs)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.database_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = false

  tags = {
    Name    = "${var.project_name}-private-subnet-database-${count.index + 1}"
    Type    = "Private"
    Purpose = "RDS PostgreSQL, ElastiCache Valkey"
    CIDR    = var.database_subnet_cidrs[count.index]
  }
}

# ============================================================================
# Elastic IP for NAT Gateway
# ============================================================================
resource "aws_eip" "nat" {
  domain = "vpc"

  depends_on = [aws_internet_gateway.main]

  tags = {
    Name = "${var.project_name}-nat-eip"
  }
}

# ============================================================================
# NAT Gateway (in Public Subnet)
# ============================================================================
# Allows private subnets to access internet for outbound traffic
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  depends_on = [aws_internet_gateway.main]

  tags = {
    Name = "${var.project_name}-nat-gateway"
  }
}

# ============================================================================
# Public Route Table
# ============================================================================
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-public-route-table"
  }
}

# ============================================================================
# Public Route - Internet Gateway
# ============================================================================
resource "aws_route" "public_internet_gateway" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
}

# ============================================================================
# Public Subnet Route Table Association
# ============================================================================
resource "aws_route_table_association" "public" {
  count = length(aws_subnet.public)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ============================================================================
# Private Route Table (for all private subnets)
# ============================================================================
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-private-route-table"
  }
}

# ============================================================================
# Private Route - NAT Gateway
# ============================================================================
resource "aws_route" "private_nat_gateway" {
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.main.id
}

# ============================================================================
# Private App Subnet Route Table Associations
# ============================================================================
resource "aws_route_table_association" "private_app" {
  subnet_id      = aws_subnet.private_app.id
  route_table_id = aws_route_table.private.id
}

# ============================================================================
# Private Microservice Subnet Route Table Associations
# ============================================================================
resource "aws_route_table_association" "private_microservice" {
  subnet_id      = aws_subnet.private_microservice.id
  route_table_id = aws_route_table.private.id
}

# ============================================================================
# Database Subnet Route Table Associations
# ============================================================================
resource "aws_route_table_association" "database" {
  count = length(aws_subnet.database)

  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.private.id
}

# ============================================================================
# DB Subnet Group for RDS
# ============================================================================
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.database[*].id

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# ============================================================================
# ElastiCache Subnet Group for Valkey/Redis
# ============================================================================
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-elasticache-subnet-group"
  subnet_ids = aws_subnet.database[*].id

  tags = {
    Name = "${var.project_name}-elasticache-subnet-group"
  }
}
