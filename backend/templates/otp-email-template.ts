export function getOtpEmailHtml(
  email: string,
  otp: string,
  website_url: string,
  privacy_policy: string,
  support_url: string,
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Verification Code - Referr</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        /* Base styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        /* Header */
        .header {
            background-color: #ffffff;
            padding: 24px 32px;
            border-bottom: 1px solid #e2e8f0;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .logo-icon {
            width: 32px;
            height: 32px;
            background-color: #000000;
            border-radius: 6px;
            color: #ffffff;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            line-height: 32px; /* Same as height */
            vertical-align: middle;
            display: inline-block;
            font-family: Arial, sans-serif;
        }



        .logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin: 0;
        }

        /* Main content */
        .content {
            padding: 48px 32px;
            text-align: center;
        }

        .title {
            font-size: 28px;
            font-weight: bold;
            color: #1e293b;
            margin: 0 0 16px 0;
            line-height: 1.2;
        }

        .subtitle {
            font-size: 16px;
            color: #64748b;
            margin: 0 0 32px 0;
            line-height: 1.5;
        }

        /* OTP Code */
        .otp-container {
            background-color: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 32px;
            margin: 32px 0;
        }

        .otp-label {
            font-size: 14px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #1e293b;
            letter-spacing: 8px;
            margin: 0;
            font-family: 'Courier New', monospace;
        }

        .otp-validity {
            font-size: 14px;
            color: #ef4444;
            margin-top: 12px;
            font-weight: 500;
        }

        /* Instructions */
        .instructions {
            background-color: #fefce8;
            border-left: 4px solid #eab308;
            padding: 16px 20px;
            margin: 32px 0;
            text-align: left;
        }

        .instructions-title {
            font-size: 16px;
            font-weight: 600;
            color: #92400e;
            margin: 0 0 8px 0;
        }

        .instructions-text {
            font-size: 14px;
            color: #a16207;
            margin: 0;
            line-height: 1.5;
        }

        /* Security notice */
        .security-notice {
            background-color: #fef2f2;
            border-radius: 8px;
            padding: 20px;
            margin: 32px 0;
            text-align: left;
        }

        .security-title {
            font-size: 14px;
            font-weight: 600;
            color: #dc2626;
            margin: 0 0 8px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .security-text {
            font-size: 14px;
            color: #7f1d1d;
            margin: 0;
            line-height: 1.5;
        }

        /* Footer */
        .footer {
            background-color: #f8fafc;
            padding: 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }

        .footer-text {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 16px 0;
            line-height: 1.5;
        }

        .footer-links {
            margin: 16px 0 0 0;
        }

        .footer-link {
            color: #3b82f6;
            text-decoration: none;
            font-size: 14px;
            margin: 0 16px;
        }

        .footer-link:hover {
            text-decoration: underline;
        }

        .copyright {
            font-size: 12px;
            color: #94a3b8;
            margin: 24px 0 0 0;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            
            .header, .content, .footer {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }
            
            .title {
                font-size: 24px !important;
            }
            
            .otp-code {
                font-size: 28px !important;
                letter-spacing: 4px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-container">
                <div class="logo-icon" style="margin-right: 10px;">R</div>
                <h1 class="logo-text">Referr</h1>
            </div>
        </div>

        <!-- Main Content -->
        <div class="content">

            <h1 class="title">Verify Your Email</h1>
            <p class="subtitle">
                We've received a request to access your Referr account. Use the verification code below to continue.
            </p>

            <!-- OTP Code -->
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <p class="otp-code">${otp}</p>
                <div class="otp-validity">⏰ Expires in 15 minutes</div>
            </div>

            <!-- Instructions -->
            <div class="instructions">
                <div class="instructions-title">📋 How to use this code:</div>
                <p class="instructions-text">
                    1. Return to the Referr login page<br>
                    2. Enter this 6-digit code in the verification field<br>
                    3. Click "Access Dashboard" to continue
                </p>
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
                <div class="security-title">
                    🔒 Security Notice
                </div>
                <p class="security-text">
                    If you didn't request this code, please ignore this email. Never share your verification codes with anyone. Referr will never ask for your codes via phone or email.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                This email was sent to <strong>${email}</strong> because you requested access to your Referr account.
            </p>

            <p class="copyright">
                © 2025 Referr. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `;
}
