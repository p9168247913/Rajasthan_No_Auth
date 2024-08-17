const puppeteer = require('puppeteer');

const generatePdf  = async () => {
    try {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Slip</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              
            }
    
            main {
                text-align: center;
               
                border-radius: 10px;
                padding: 10px;
               
                page-break-inside: avoid;
            }
    
            h1 {
                margin-bottom: 10px;
            }
    
            .date-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin: auto;
                margin-bottom: 10px;
                width: 100%;
            }
    
            .date-info {
                text-align: left;
                width: 45%;
            }
    
            .driver-info {
                text-align: right;
                width: 45%;
            }
    
            table {
                border-collapse: collapse;
                width: 100%;
                margin: auto;
                margin-top: 10px;
            }
    
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
    
            caption {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 10px;
            }
    
            tfoot {
                font-weight: bold;
            }
    
            .signature-section {
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
            }
    
            .signature-box {
                width: 45%;
                border-top: 1px solid #ddd;
                padding-top: 30px;
            }
    
            .footer {
                margin-top: 20px;
                font-size: 0.8em;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <main>
            <h1>Payment Slip Driver</h1>
    
            <div class="date-section">
                <div class="date-info">
                    <p>From Date: 22/02/2023</p>
                    <p>To Date: 22/03/2023</p>
                </div>
                <div class="driver-info">
                    <p>Driver's Name: [Driver's Name Here]</p>
                </div>
            </div>
    
            <table>
                <caption>Order Information</caption>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Chemist Name</th>
                        <th>Charges</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>John Doe</td>
                        <td>ABC Chemist</td>
                        <td class="charge">$50.00</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jane Smith</td>
                        <td>XYZ Pharmacy</td>
                        <td class="charge">$75.00</td>
                    </tr>
                    <!-- Add more rows as needed -->
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3">Total Charges:</td>
                        <td id="totalCharges">$125.00</td>
                    </tr>
                </tfoot>
            </table>
    
            <div class="signature-section">
                <div class="signature-box">
                    Owner's Signature: 
                </div>
                <div class="signature-box">
                    Driver's Signature: 
                </div>
            </div>
            <div class="footer">
                <p>Thank you for your business!</p>
            </div>
        </main>
    </body>
    </html>`

    await page.setContent(htmlContent);
    await page.pdf({
        page,
        path: 'google.pdf',
        format: 'A4',
        printBackground: true
    });

    // await page.goto('https://www.google.com')
    // await page.pdf({path: 'google.pdf', format: 'A4', printBackground: true})
 
    console.log("pdf generated successfully") ;
      await browser.close()
    } catch (error) {
        console.log(error)
    
}
}

module.exports ={
    generatePdf
}