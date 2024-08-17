const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "outlook.office365.com",
  port: 587,
  secure: false,
  tls: {
    rejectUnauthorized: true,
  },
  auth: {
    user: "notifications@aquasense.tech",
    pass: "Pow21768",
  },
});

async function sendUserCredentials(credentials) {
  try {
    const mailOptions = {
      from: "notifications@aquasense.tech",
      to: credentials.email,
      subject: "Aquasense Dashboard - User Credentials",
      html: `
                <html>
                    <head>
                        <style>
                            /* Add your custom styles here */
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }
                            p {
                                margin-bottom: 15px;
                            }
                            /* Add more styles as needed */
                        </style>
                    </head>
                    <body>
                        <p>Hello ${credentials.name},</p>
                        <p>We've securely created your Aquasense account:</p>
                        <ul>
                            <li><strong>Username:</strong> ${credentials.username}</li>
                            <li><strong>Email:</strong> ${credentials.email}</li>
                            <li><strong>Password:</strong> ${credentials.password}</li>
                        </ul>
                        <p>For your security, keep your password safe and secure.</p>
                        <p>Thank you for choosing Aquasense!</p>
                        
                    </body>
                </html>
            `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendResetCredentials(credentials) {
  try {
    const mailOptions = {
      from: "notifications@aquasense.tech",
      to: credentials.email,
      subject: "Aquasense Dashboard - Reset Password",
      html: `
                <html>
                    <head>
                        <style>
                            /* Add your custom styles here */
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }
                            p {
                                margin-bottom: 15px;
                            }
                            /* Add more styles as needed */
                        </style>
                    </head>
                    <body>
                        <p>Hello</p>
                        <p>We've securely generated a new password for your Aquasense account:</p>
                        <ul>
                            <li><strong>Email:</strong> ${credentials.email}</li>
                            <li><strong>New Password:</strong> ${credentials.newPassword}</li>
                        </ul>
                      
                        <p>Thank you for choosing Aquasense!</p>
                        
                    </body>
                </html>
            `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendOrderCredentials(credentials) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: "New Order Notification",
      html: `
                <html>
                    <head>
                        <style>
                           
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }
                            h2 {
                                color: #3498db;
                            }
                           
                        </style>
                    </head>
                    <body>
                        <h2>New order received!</h2>
                        <p>Hello Admin,</p>
                        <p>We are excited to inform you that a new order has been placed:</p>
                        <ul>
                            <li><strong>Chemist Name:</strong> ${credentials.chemist}</li>
                            <li><strong>Order Id:</strong> ${credentials.orderId}</li>
                            <li><strong>Chemist Address:</strong> ${credentials.address}</li>
                          
                        </ul>
                        <p>Please take necessary actions to process the order promptly. Thank you!</p>
                    </body>
                </html>
            `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function assignedDriver(credentials) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: credentials.drivermail,
      subject: "Delivery assigned!",
      html: `
                <html>
                    <head>
                        <style>
                           
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }
                            h2 {
                                color: #3498db;
                            }
                           
                        </style>
                    </head>
                    <body>
                        <h2>New delivery assigned!</h2>
                        <p>Hello ${
                          credentials.drivername ? credentials.drivername : ""
                        },</p>
                        <p>We are excited to inform you that a new delivery has been assigned:</p>
                        <h3>Customer Details:</h3>
                        <ul>
                            <li><strong>Customer Name:</strong> ${
                              credentials.customer ? credentials.customer : ""
                            }</li>
                            <li><strong>Street Address:</strong> ${
                              credentials.customerstreetAddress
                                ? credentials.customerstreetAddress
                                : ""
                            }</li>
                            <li><strong>Province:</strong> ${
                              credentials.customerprovince
                                ? credentials.customerprovince
                                : ""
                            }</li>
                            <li><strong>City:</strong> ${
                              credentials.customercity
                                ? credentials.customercity
                                : ""
                            }</li>
                            <li><strong>Postal Code:</strong> ${
                              credentials.customerpostalCode
                                ? credentials.customerpostalCode
                                : ""
                            }</li>
                            <li><strong>Phone No.:</strong> ${
                              credentials.customerphoneNo
                                ? credentials.customerphoneNo
                                : ""
                            }</li>
                        </ul></br>
                        <h3>Chemist Details:</h3>
                        <ul>
                            <li><strong>Chemist Name:</strong> ${
                              credentials.chemist ? credentials.chemist : ""
                            }</li>
                            <li><strong>Street Address:</strong> ${
                              credentials.chemiststreetAddress
                                ? credentials.chemiststreetAddress
                                : ""
                            }</li>
                            <li><strong>Province:</strong> ${
                              credentials.chemistprovince
                                ? credentials.chemistprovince
                                : ""
                            }</li>
                            <li><strong>City:</strong> ${
                              credentials.chemistcity
                                ? credentials.chemistcity
                                : ""
                            }</li>
                            <li><strong>Postal Code:</strong> ${
                              credentials.chemistpostalCode
                                ? credentials.chemistpostalCode
                                : ""
                            }</li>
                            <li><strong>Phone No.:</strong> ${
                              credentials.chemistphoneNo
                                ? credentials.chemistphoneNo
                                : ""
                            }</li>
                        </ul>
                        <p>Please pick the order and deliver it on time. Thank you!</p>
                    </body>
                </html>
            `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = {
  sendUserCredentials,
  sendOrderCredentials,
  assignedDriver,
  sendResetCredentials,
};
