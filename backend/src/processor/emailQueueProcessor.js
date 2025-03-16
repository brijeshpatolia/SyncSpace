import mailQueue from "../queues/mailQueue.js";

import mailer from "../config/mailConfig.js";

mailQueue.process(async (job) => {
    const emailData = job.data;
    // send email using email service
    console.log(`[INFO] Sending email to ${emailData.to} with subject: ${emailData.subject}`);
    try{
            const response = await mailer.sendMail(emailData);
            console.log('[INFO] Email sent successfully:', response.messageId);
    }
    catch(error){
        console.log('error processing mail:', error);
    }
    });