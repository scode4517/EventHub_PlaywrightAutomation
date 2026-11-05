# EventHub_PlaywrightAutomation

## Emailing Playwright reports from GitHub Actions

The workflow emails a zipped HTML report after push-triggered test runs on `main` or `master`. Pull-request runs continue to upload the report as a workflow artifact but do not send email.

Configure these repository settings under **Settings > Secrets and variables > Actions**:

Repository variables:

- `SMTP_SERVER`: SMTP server hostname (for example, `smtp.gmail.com`).
- `SMTP_PORT`: SMTP port (typically `587` for STARTTLS or `465` for implicit TLS).
- `SMTP_SECURE`: Set to `true` for implicit TLS (usually port `465`), or `false` for STARTTLS (usually port `587`).
- `REPORT_EMAIL_TO`: Recipient email address.

Repository secrets:

- `SMTP_USERNAME`: SMTP account username; also used as the sender address.
- `SMTP_PASSWORD`: SMTP password or provider-issued app password.

Keep SMTP credentials in GitHub Actions secrets, not in the workflow or repository.