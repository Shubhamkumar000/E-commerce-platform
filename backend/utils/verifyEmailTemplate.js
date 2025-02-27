const verifyEmailTemplate = ({ name, url }) => {
    return `
    <html>
    <body style="font-family: Arial, sans-serif; text-align: center;">
        <p>Dear ${name},</p>
        <p>Thank you for registering at Blinkit.</p>
        <p>Please verify your email by clicking the button below:</p>
        <p>
            <a href="${url}" 
                style="color: white; 
                       background-color: blue; 
                       padding: 10px 20px; 
                       border: none; 
                       border-radius: 10px; 
                       text-decoration: none; 
                       display: inline-block;">
                Verify Email
            </a>
        </p>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p><a href="${url}" style="color: blue;">${url}</a></p>
    </body>
    </html>
    `;
};

export default verifyEmailTemplate;
