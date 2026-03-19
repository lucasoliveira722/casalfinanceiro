# Casal Financeiro — Backend Deployment on EC2

Follow this plan when you get home. The code changes are already done and the JAR is built — you only need to do the AWS Console steps.

---

## What's already done

- Removed `@CrossOrigin` from `ExpenseController.java`
- Created `HealthController.java` — `GET /health` returns 200 OK (no auth required)
- Added `.requestMatchers("/health").permitAll()` to `SecurityConfig.java`
- JAR built at `backend/target/casalfinanceiro-0.0.1-SNAPSHOT.jar`
- RDS created — endpoint: `casalfinanceiro-db.c05w822ga4y3.us-east-1.rds.amazonaws.com`
- Security groups created: `casalfinanceiro-eb-sg` and `casalfinanceiro-rds-sg`

---

## Phase 1 — Launch an EC2 Instance

1. Go to **EC2 → Instances → Launch instances**
2. **Name:** `casalfinanceiro-backend`
3. **AMI:** Amazon Linux 2023 (free tier eligible)
4. **Instance type:** `t3.micro` (free tier eligible)
5. **Key pair:** Create a new key pair, name it `casalfinanceiro-key`, download the `.pem` file and save it somewhere safe
6. **Network settings:** Edit → select `casalfinanceiro-eb-sg` as the security group
7. Leave everything else as default → click **Launch instance**

Once running, note the **Public IPv4 address** of the instance.

---

## Phase 2 — RDS Security Group

No changes needed. `casalfinanceiro-rds-sg` already allows traffic from `casalfinanceiro-eb-sg`, which is attached to your EC2 instance.

---

## Phase 3 — Connect to EC2 and Install Java

From your terminal:

```bash
# Connect (replace with your actual IP and .pem path)
ssh -i "casalfinanceiro-key.pem" ec2-user@<EC2-PUBLIC-IP>

# Install Java 21
sudo dnf install java-21-amazon-corretto -y

# Verify
java -version
```

---

## Phase 4 — Upload and Run the JAR

From your **local machine** (new terminal window):

```bash
scp -i "casalfinanceiro-key.pem" \
  backend/target/casalfinanceiro-0.0.1-SNAPSHOT.jar \
  ec2-user@<EC2-PUBLIC-IP>:~/app.jar
```

Back in the **SSH session**:

```bash
export DB_URL=jdbc:postgresql://casalfinanceiro-db.c05w822ga4y3.us-east-1.rds.amazonaws.com:5432/casalfinanceiro
export DB_USER=postgres
export DB_PASSWORD=<your-rds-password>
export SERVER_PORT=80
export CORS_ORIGINS=*

sudo -E java -jar ~/app.jar
```

Watch the logs — look for:
```
Tomcat started on port 80
Started CasalFinanceiroApplication
```

---

## Phase 5 — Test

```bash
curl http://<EC2-PUBLIC-IP>/health
# Expected: OK
```

---

## Phase 6 — Make it Persistent (survive reboots)

```bash
sudo nano /etc/systemd/system/casalfinanceiro.service
```

Paste this (fill in your DB password):

```ini
[Unit]
Description=Casal Financeiro Backend
After=network.target

[Service]
User=ec2-user
Environment="DB_URL=jdbc:postgresql://casalfinanceiro-db.c05w822ga4y3.us-east-1.rds.amazonaws.com:5432/casalfinanceiro"
Environment="DB_USER=postgres"
Environment="DB_PASSWORD=<your-rds-password>"
Environment="SERVER_PORT=80"
Environment="CORS_ORIGINS=*"
ExecStart=/usr/bin/java -jar /home/ec2-user/app.jar
SuccessExitStatus=143
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Then enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable casalfinanceiro
sudo systemctl start casalfinanceiro
sudo systemctl status casalfinanceiro
```

---

## Phase 7 — Update Mobile App

Edit `frontend/.env`:

```
EXPO_PUBLIC_API_URL=http://<EC2-PUBLIC-IP>
```

---

## Phase 8 — Switch to Production Mode

Once everything is working, add `SPRING_PROFILES_ACTIVE=prod` to the systemd service:

```bash
sudo nano /etc/systemd/system/casalfinanceiro.service
# Add this line under [Service]:
# Environment="SPRING_PROFILES_ACTIVE=prod"

sudo systemctl daemon-reload
sudo systemctl restart casalfinanceiro
```

This switches Hibernate from `ddl-auto=update` to `validate`, which is safer for production.

---

## Quick Reference

| What | Value |
|------|-------|
| RDS endpoint | `casalfinanceiro-db.c05w822ga4y3.us-east-1.rds.amazonaws.com` |
| RDS port | `5432` |
| RDS database | `casalfinanceiro` |
| RDS user | `postgres` |
| JAR path | `backend/target/casalfinanceiro-0.0.1-SNAPSHOT.jar` |
| Health check | `GET /health` → `OK` |
