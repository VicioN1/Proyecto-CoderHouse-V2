const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
require('dotenv').config();

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
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
              ${purchaseData.purchaser.Complete.map(
                (producto) => `
                  <li>
                      <h3>${producto.product.title}</h3>
                      <p>${producto.product.description}</p>
                      <p>Código: ${producto.product.code}</p>
                      <p>Precio: $${producto.product.price}</p>
                      <p>Cantidad: ${
                        producto.cantcompra || producto.quantity
                      }</p>
                  </li>
              `
              ).join("")}
          </ul>
          <h2>Productos sin Stock</h2>
          <ul>
              ${purchaseData.purchaser.Incomplete.map(
                (producto) => `
                  <li>
                      <h3>${producto.product.title}</h3>
                      <p>${producto.product.description}</p>
                      <p>Código: ${producto.product.code}</p>
                      <p>Precio: $${producto.product.price}</p>
                  </li>
              `
              ).join("")}
          </ul>
      </div>
  `;

  try {
    let result = await transport.sendMail({
      from: `coder test <${config.EMAIL_USER}>`,
      to: email,
      subject: "Confirmación de compra",
      html: htmlContent,
      attachments: [],
    });
    console.log("Email sent successfully");
    return "Email sent successfully";
  } catch (error) {
    console.error("Error sending email:", error);
    return "Error sending email";
  }
};

const deleteProductemail = async (producto, email) => {
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
          <h1>El administrador ${email} elimino el siguiente producto</h1>
          <h2>Producto</h2>
          <ul>
                  <li>
                      <h3>${producto.title}</h3>
                      <p>${producto.description}</p>
                      <p>Código: ${producto.code}</p>
                  </li>
          </ul>
      </div>
  `;

  try {
    let result = await transport.sendMail({
      from: `coder test <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Borrado de Producto",
      html: htmlContent,
      attachments: [],
    });
    console.log("Email sent successfully");
    return "Email sent successfully";
  } catch (error) {
    console.error("Error sending email:", error);
    return "Error sending email";
  }
};
const deleteUseremail = async (emailuser,emailadmin) => {
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
          <h1>El administrador ${emailadmin} elimino tu usuario por inactividad</h1>
      </div>
  `;

  try {
    let result = await transport.sendMail({
      from: `coder test <${process.env.EMAIL_USER}>`,
      to: emailuser,
      subject: "Usuario Borrado",
      html: htmlContent,
      attachments: [],
    });
    console.log("Email sent successfully");
    return "Email sent successfully";
  } catch (error) {
    console.error("Error sending email:", error);
    return "Error sending email";
  }
};

const mailing_Reset_Pass = async (email, code) => {
  try {
    await transport.sendMail({
      from: `Coder App - recuperación de contraseña <${email}>`, 
      to: email,
      subject: "Código de recuperación de tu contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
          <div style="text-align: center; padding-bottom: 20px;">
            <img src="https://yourcompanylogo.com/logo.png" alt="Company Logo" style="max-width: 150px;">
          </div>
          <h2 style="color: #333333; text-align: center;">Recuperación de Contraseña</h2>
          <p style="color: #555555;">Hola,</p>
          <p style="color: #555555;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <div style="text-align: center; padding: 20px;">
            <a href="http://localhost:8080/newpassword/${code}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
          </div>
          <p style="color: #555555;">O copia y pega el siguiente enlace en tu navegador:</p>
          <p style="color: #555555; word-break: break-all;">http://localhost:8080/newpassword/${code}</p>
          <p style="color: #555555;">El código para recuperar tu contraseña es: <strong>${code}</strong></p>
          <p style="color: #555555;">Si no fuiste tú quien solicitó el restablecimiento de la contraseña, por favor ignora este mensaje.</p>
          <p style="color: #555555;">Gracias,</p>
          <p style="color: #555555;">El equipo de Coder App</p>
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999999; font-size: 12px;">&copy; 2024 Coder App. Todos los derechos reservados.</p>
            <p style="color: #999999; font-size: 12px;">No responda a este correo electrónico. Si necesita ayuda, póngase en contacto con nuestro <a href="https://yourcompanysupport.com" style="color: #4CAF50;">equipo de soporte</a>.</p>
          </div>
        </div>
      `,
    });
    return 'Correo electrónico enviado exitosamente' 
  } catch (error) {
    return error;
  }
};



module.exports = {
  mailingController,
  mailing_Reset_Pass,
  deleteProductemail,
  deleteUseremail
};
