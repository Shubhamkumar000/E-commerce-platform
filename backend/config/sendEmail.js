import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if(!process.env.RESEND_API){
    console.error("RESEND_API is missing")
}

const resend = new Resend(process.env.RESEND_API);
const fromEmail = process.env.FROM_EMAIL || "no-reply@shubhamkumar.codes";

const sendEmail = async({sendTo, subject, html}) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `Blinkit <${fromEmail}>`,
            to: sendTo,
            subject: subject,
            html: html,
          });

          if(error) {
            return console.error({error})
          }
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail;
