const sendEmail = require("./sendEmail");

const sendOtpEmail = async (email, otp) => {
  const html = `
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f3ff; margin: 0; padding: 0;">
    <div class="wrapper" style="width: 100%; padding: 40px 0;">
        <div class="container" style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 35px rgba(124, 58, 237, 0.1); border: 1px solid #ddd6fe;">
            
            <div class="header" style="background-color: #e2ddfc; padding: 30px; text-align: center; border-bottom: 1px solid #ddd6fe;">
                <div class="brand-name" style="font-size: 22px; font-weight: 800; color: #5b21b6; letter-spacing: 1px; text-transform: uppercase;">
                    MNC BASE
                </div>
            </div>

            <div class="content" style="padding: 40px 30px; text-align: center; background-color: #f5f3ff; background-image: linear-gradient(#e0e7ff 0.5px, transparent 0.5px);">
                <h2 style="color: #1e1b4b; font-size: 24px; margin-bottom: 15px; font-weight: 700;">Verification Code</h2>
                <p style="color: #4c1d95; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                    To continue, please use the secure code below. This code is unique to your current session.
                </p>
                
                <div class="otp-box" style="background-color: #ffffff; border: 1px solid #c4b5fd; border-radius: 12px; padding: 25px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                    <div class="otp-code" style="font-size: 38px; font-weight: 900; color: #7c3aed; letter-spacing: 12px;">
                        ${otp}
                    </div>
                </div>

                <p style="font-size: 13px; font-weight: 500; color: #4c1d95;">Valid for 10 minutes only</p>
            </div>

            <div class="footer" style="background-color: #8870ff; padding: 25px; text-align: center; border-top: 1px solid #ddd6fe;">
                <div class="footer-links" style="margin-bottom: 15px;">
                    <a href="#" style="color: white; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 600;">Contact Support</a>
                    <a href="#" style="color: white; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 600;">Terms & Conditions</a>
                    <a href="#" style="color: white; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 600;">Privacy Policy</a>
                </div>
                <div class="copyright" style="font-size: 11px; color: white; opacity: 0.8; margin-top: 10px;">
                    &copy; 2025 MNC BASE GLOBAL INC.<br>
                    Securing your digital journey.
                </div>
            </div>
        </div>
    </div>
</body>
    `;

  await sendEmail(email, "Verify your email", html);
};

module.exports = sendOtpEmail;
