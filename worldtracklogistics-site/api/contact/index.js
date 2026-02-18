
const sgMail = require('@sendgrid/mail');
module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') { context.res = { status: 204, headers: corsHeaders() }; return; }
  try{
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const TO_EMAIL = process.env.TO_EMAIL || 'sales@worldtracklogistics.com';
    const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@worldtracklogistics.com';
    const ORIGIN = process.env.ALLOW_ORIGIN || '*';
    const { name, email, company, message } = req.body || {};
    if(!name || !email || !message){ context.res = { status:400, headers:corsHeaders(ORIGIN), body:{ ok:false, error:'Missing required fields' } }; return; }
    if(!SENDGRID_API_KEY){ context.log('SENDGRID_API_KEY not set — dev mode'); context.res = { status:200, headers:corsHeaders(ORIGIN), body:{ ok:true, dev:true } }; return; }
    sgMail.setApiKey(SENDGRID_API_KEY);
    await sgMail.send({ to:TO_EMAIL, from:FROM_EMAIL, subject:`WTL Website Contact: ${name}`, text:`From: ${name} <${email}>
Company: ${company||''}

${message}`, html:`<p><b>From:</b> ${name} &lt;${email}&gt;</p><p><b>Company:</b> ${company||''}</p><p>${(message||'').replace(/
/g,'<br>')}</p>` });
    context.res = { status:200, headers:corsHeaders(ORIGIN), body:{ ok:true } };
  }catch(err){ context.log('Error', err); context.res = { status:500, headers:corsHeaders(), body:{ ok:false } } }
}
function corsHeaders(origin='*'){ return { 'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type' } }
