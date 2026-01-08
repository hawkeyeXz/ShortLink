resource "aws_autoscaling_group" "app_asg" {
    name                = "ShortLink-asg"
    vpc_zone_identifier = module.vpc.private_subnets

    min_size            = 1
    max_size            = 5
    desired_capacity    = 1

    health_check_type           = "ELB"
    health_check_grace_period   = 300

    instance_refresh {
        strategy = "Rolling"
        preferences {
            min_healthy_percentage = 50
        }
        triggers = ["tag"]
    }


    launch_template {
        id      = aws_launch_template.app_lt.id
        version = "$Latest"
    }
    target_group_arns    = [aws_lb_target_group.app_tg.arn]

    tag {
        key                 = "Role"
        value               = "AppServer"
        propagate_at_launch = true
    }

}

#trigger

resource "aws_autoscaling_policy" "cpu_policy" {
  name                   = "cpu-scaling-policy"
  policy_type            = "TargetTrackingScaling"
  autoscaling_group_name = aws_autoscaling_group.app_asg.name

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 20.0
  }
}