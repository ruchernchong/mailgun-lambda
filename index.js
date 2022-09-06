const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const dotenv = require("dotenv");
dotenv.config();

const getResponseHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
});

exports.handler = async (event, context, callback) => {
  try {
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
      url: "https://api.eu.mailgun.net",
    });

    const data = {
      from: "Contact <contact@ruchern.xyz>",
      to: ["hello@ruchern.xyz"],
      subject: "Hello",
      text: "Testing some Mailgun awesomness!",
      html: `<h1>Testing some Mailgun awesomeness!</h1>`,
    };

    const response = await mg.messages.create(
      process.env.MAILGUN_DOMAIN_NAME,
      data
    );

    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        message: "OK",
      }),
    };
  } catch (e) {
    console.error(e.message);

    return {
      statusCode: e.statusCode || 500,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        error: e.name ?? "Exception",
        message: e.message ?? "Unknown error",
      }),
    };
  }
};
