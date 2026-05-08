const forgotPasswordTemplate =({name,otp}) => {
    return `
    <div>
     <p> Dear, ${name}</p>
     <p> You have requested a password reset.Please use following OTP code to reset your password</p>
     <div style="background-color: #f8f8f8; padding: 10px; font-size: 20px; width: 50%; margin: 0 auto;">
        ${otp}
     </div>
        <p> If you did not request a password reset, please ignore this email</p>
        <p>This OTP is valid for only 1 hour </p>
        </br>
        <p>Thanks</p>
        <p>Blinkit Team</p>
    </div>
    `
}


export default forgotPasswordTemplate;