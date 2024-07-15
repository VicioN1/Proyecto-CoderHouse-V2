const nodemailer = require('nodemailer');
const config = require('../config/config.js');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD
    }
});

const mailingController = async (email, purchaseData) => {
  const htmlContent = `
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
          .container {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              width: 100%;
              margin: 20px;
          }
          h1, h2 {
              color: #333;
          }
          h1 {
              text-align: center;
              margin-bottom: 20px;
          }
          h2 {
              margin-top: 20px;
              border-bottom: 2px solid #007bff;
              padding-bottom: 5px;
          }
          ul {
              list-style-type: none;
              padding: 0;
          }
          li {
              background-color: #f1f1f1;
              margin: 5px 0;
              padding: 10px;
              border-radius: 4px;
          }
          li span {
              font-weight: bold;
          }
      </style>
      <div class="container">
          <h1>Estado de la Compra</h1>
          <h1>Precio Total: ${purchaseData.amount}</h1>
          <h2>Productos Comprados</h2>
          <ul>
              ${purchaseData.purchaser.Complete.map(producto => `
                  <li>
                      <h3>${producto.product.title}</h3>
                      <p>${producto.product.description}</p>
                      <p>Código: ${producto.product.code}</p>
                      <p>Precio: $${producto.product.price}</p>
                      <p>Cantidad: ${producto.cantcompra || producto.quantity}</p>
                  </li>
              `).join('')}
          </ul>
          <h2>Productos sin Stock</h2>
          <ul>
              ${purchaseData.purchaser.Incomplete.map(producto => `
                  <li>
                      <h3>${producto.product.title}</h3>
                      <p>${producto.product.description}</p>
                      <p>Código: ${producto.product.code}</p>
                      <p>Precio: $${producto.product.price}</p>
                  </li>
              `).join('')}
          </ul>
      </div>
  `;

    try {
        let result = await transport.sendMail({
            from: `coder test <${config.EMAIL_USER}>`,
            to: email,
            subject: 'Confirmación de compra',
            html: htmlContent,
            attachments: []
        });
        console.log('Email sent successfully');
        return 'Email sent successfully';
    } catch (error) {
        console.error('Error sending email:', error);
        return 'Error sending email';
    }
};

module.exports = {
    mailingController
};
