output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_id" {
  value = module.vpc.public_subnet_ids[0]
}

output "ec2_public_ip" {
  value = module.ec2.public_ip
}

output "ec2_elastic_ip" {
  value = module.ec2.elastic_ip
  description = "Elastic IP address of the first EC2 instance (if any)"
}

output "rds_endpoint" {
  value       = module.rds.endpoint
  description = "RDS endpoint"
}