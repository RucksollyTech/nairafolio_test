const EmailerVerifyBank = async (data) => {
    const secret = "A9X7L3Q2M5N8";
    const {email, code }= data
    const sendEmail = async () => {
        try {
            const response = await fetch('https://nairafolio.vercel.app/api/send-emailjs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: code,
                    token: secret,
                }),
            });
        
            const contentType = response.headers.get('content-type');

            let datas;
            if (contentType && contentType.includes('application/json')) {
                datas = await response.json();
            } else {
                datas = await response.text(); 
            }

            if (response.ok) {
                // console.log('Email sent successfully:', datas);
            } else {
                console.error('Failed to send email:', datas.error);
            }
            return response.ok;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };
    await sendEmail();
      
};
  
export default EmailerVerifyBank;
  