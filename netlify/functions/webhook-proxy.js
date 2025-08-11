// Netlify function for HubSpot form submission
// Save this file as: netlify/functions/webhook-proxy.js
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse form data
    const body = JSON.parse(event.body);
    
    // HubSpot Portal ID (to be replaced with actual ID)
    const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID || 'YOUR_HUBSPOT_PORTAL_ID';
    const HUBSPOT_FORM_ID = process.env.HUBSPOT_FORM_ID || 'YOUR_HUBSPOT_FORM_ID';
    
    // Prepare HubSpot submission
    const hubspotData = {
      fields: [
        {
          name: 'firstname',
          value: body.full_name ? body.full_name.split(' ')[0] : ''
        },
        {
          name: 'lastname', 
          value: body.full_name ? body.full_name.split(' ').slice(1).join(' ') : ''
        },
        {
          name: 'email',
          value: body.email
        },
        {
          name: 'phone',
          value: body.phone
        },
        {
          name: 'message',
          value: body.notes || ''
        }
      ],
      context: {
        pageUri: event.headers.referer || 'https://cityplacebnb.com',
        pageName: 'CityPlace BnB Lead Form'
      }
    };

    // Submit to HubSpot
    const hubspotResponse = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hubspotData),
      }
    );

    if (hubspotResponse.ok) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ success: true, message: 'Form submitted successfully' }),
      };
    } else {
      throw new Error('HubSpot submission failed');
    }

  } catch (error) {
    console.error('Form submission error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Form submission failed' }),
    };
  }
};