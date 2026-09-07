import { env } from 'cloudflare:workers';
export async function POST(request: Request) {
 const reply=(body:object,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
 if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return reply({error:'Request not allowed.'},403);
 if(Number(request.headers.get('content-length')||0)>2048)return reply({error:'Request too large.'},413);
 let data;try{const text=await request.text();if(text.length>2048)return reply({error:'Request too large.'},413);data=JSON.parse(text);}catch{return reply({error:'Invalid request.'},400);}
 if(!data || typeof data!=='object')return reply({error:'Invalid request.'},400);
 if(data.website)return reply({error:'Unable to subscribe.'},400);
 const email=typeof data.email==='string'?data.email.trim().toLowerCase():'';
 if(email.length>254 || !/^[a-z0-9][a-z0-9.!#$%&'*+/=?^_`{|}~-]*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email) || data.consent!==true)return reply({error:'Please enter a valid email address and agree to receive updates.'},400);
 const config=env as unknown as Record<string,string>;
 const endpoint=config.NEWSLETTER_SCRIPT_URL;const secret=config.NEWSLETTER_SECRET;
 if(!endpoint||!secret)return reply({error:'Newsletter signup is opening soon. Please check back shortly.'},503);
 if(!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint))return reply({error:'Signup is temporarily unavailable.'},503);
 try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,secret,consent:true}),signal:AbortSignal.timeout(15000)});const result=await response.json() as {ok?:boolean};if(!response.ok||result.ok!==true)throw new Error('Save failed');return reply({ok:true});}catch{return reply({error:'We couldn’t confirm your signup. Please try again in a moment.'},502);}
}
