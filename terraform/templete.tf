resource "aws_launch_template" "app_lt" {
    name_prefix   = "ShortLink-lt-"
    image_id      = "resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
    instance_type = "t3.micro"
    key_name = aws_key_pair.deployer.key_name

    vpc_security_group_ids = [aws_security_group.app_sg.id]

    user_data = base64encode(templatefile("setup.sh",{
        nginx_config          = file("../nginx/nginx.conf")
        docker_compose_config = file("../docker-compose.yml")
        foot_terminfo         = file("foot.terminfo.tpl")
        alert_config          = file("../alert_rules.yml")
        prometheus_config     = file("../prometheus.yml")

        domain_name           = var.domain_name
        app_port              = var.app_port
        redis_url             = var.redis_url
        grafana_url           = var.grafana_url
        grafana_user          = var.grafana_user
        grafana_password      = var.grafana_password
    }))

    lifecycle{
        create_before_destroy = true
    }

    iam_instance_profile {
        name = aws_iam_instance_profile.app_profile.name
    }
}