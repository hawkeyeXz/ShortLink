data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "app_sg" {
  name        = "ShortLink-Server-SG"
  description = "Allow HTTP, HTTPS, and SSH"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    # security_groups = [aws_security_group.nginx_lb_sg.id]
    security_groups = [aws_security_group.lb_sg.id]

  }



  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "aws-sl-key"
  public_key = file(pathexpand("~/.ssh/aws-sl.pub"))
}

