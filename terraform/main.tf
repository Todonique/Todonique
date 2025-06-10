provider "aws" {
  region = var.aws_region
}

<<<<<<< Updated upstream

# -----------------------------
# IAM for GitHub Actions
# -----------------------------
resource "aws_iam_user" "github_actions" {
  name = "github-actions"
}

resource "aws_iam_access_key" "github_actions_key" {
  user = aws_iam_user.github_actions.name
}

resource "aws_iam_policy" "github_deploy_policy" {
  name        = "github-deploy-policy"
  description = "Allow deploys via GitHub Actions"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["ecs:*", "ecr:*", "s3:*", "cloudfront:*", "logs:*", "iam:PassRole"],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "github_actions_attach" {
  user       = aws_iam_user.github_actions.name
  policy_arn = aws_iam_policy.github_deploy_policy.arn
}

output "github_aws_access_key_id" {
  value     = aws_iam_access_key.github_actions_key.id
  sensitive = true
}

output "github_aws_secret_access_key" {
  value     = aws_iam_access_key.github_actions_key.secret
  sensitive = true
}

# -----------------------------
# VPC + Subnet + SG
# -----------------------------
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "af-south-1a"
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "ecs_sg" {
  name   = "ecs-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# -----------------------------
# ECR + ECS (Cluster, Task, Service)
# -----------------------------
resource "aws_ecr_repository" "backend" {
  name = "todonique-backend"
}

resource "aws_ecs_cluster" "main" {
  name = "todonique-cluster"
}

# IAM role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "todonique-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "todonique-api",
      image     = "${aws_ecr_repository.backend.repository_url}:latest",
      portMappings = [
        {
          containerPort = 3000,
          hostPort      = 3000
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "backend" {
  name            = "todonique-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.public_1.id]
    assign_public_ip = true
    security_groups = [aws_security_group.ecs_sg.id]
  }
}

# -----------------------------
# S3 + CloudFront for frontend
# -----------------------------
resource "aws_s3_bucket" "frontend" {
  bucket         = "todonique-frontend"
  acl            = "public-read"
  force_destroy  = true

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.website_endpoint
    origin_id   = "frontendS3"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "frontendS3"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
=======
module "iam" {
  source       = "./modules/iam"
  project_name = var.project_name
}

module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
  aws_region   = var.aws_region
  public_subnet_count = 2
}

module "internet_gateway" {
  source           = "./modules/internet_gateway"
  project_name     = var.project_name
  vpc_id           = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
}

module "ec2" {
  source         = "./modules/ec2"
  project_name   = var.project_name
  subnet_ids     = module.vpc.public_subnet_ids
  instance_count = var.ec2_instance_count
  aws_region     = var.aws_region
  security_group_id = module.vpc.default_security_group_id
  iam_instance_profile = module.iam.iam_instance_profile_name
  key_name = var.key_name
}

module "rds" {
  source                 = "./modules/rds"
  project_name           = var.project_name
  subnet_ids             = module.vpc.public_subnet_ids
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  aws_region             = var.aws_region
  enabled                = var.rds_enabled
  db_password            = var.db_password
  db_username            = var.db_username
  db_name                = var.db_name
  publicly_accessible    = true
}
>>>>>>> Stashed changes
