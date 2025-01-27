const EmailerVerifyBank = async (data) => {
    const secret = "A9X7L3Q2M5N8";
    const {email, code }= data
    const sendEmail = async () => {
        try {
            const response = await fetch('http://192.168.80.1:3000/api/send-emailjs', {
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

            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text(); 
            }

            if (response.ok) {
                // console.log('Email sent successfully:', data);
            } else {
                console.error('Failed to send email:', data.error);
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
  