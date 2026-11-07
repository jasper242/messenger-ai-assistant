import { useState } from 'react';
import { Bot, Copy, MessageCircle, Send, Sparkles } from 'lucide-react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default function App() {
 const [message,setMessage]=useState(''),[context,setContext]=useState(''),[tone,setTone]=useState('Friendly'),[reply,setReply]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const [history,setHistory]=useState(()=>JSON.parse(localStorage.getItem('drafts')||'[]'));
 async function generate(){
  if(!message.trim()||busy)return; setBusy(true);setError('');setReply('');
  try{
   const r=await fetch(`${API}/api/reply`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,context,tone})});
   const data=await r.json();if(!r.ok)throw new Error(data.error||'Request failed');setReply(data.reply);
   const next=[{message,reply:data.reply,at:new Date().toISOString()},...history].slice(0,8);setHistory(next);localStorage.setItem('drafts',JSON.stringify(next));
  }catch(e){setError(e.message||'Something went wrong.')}finally{setBusy(false)}
 }
 return <main className="shell">
  <header className="top"><div className="brand"><span className="logo"><Bot/></span><div><b>ReplyMate</b><small>MESSENGER AI ASSISTANT</small></div></div><span className="status">● Draft mode</span></header>
  <section className="hero"><small>✦ YOUR AI WRITING COMPANION</small><h1>Replies that sound<br/><em>like you.</em></h1><p>Paste a message, choose your tone, and get a thoughtful reply in seconds.</p></section>
  <section className="grid">
   <div className="panel"><h2><MessageCircle/> New reply</h2><p className="muted">What did they send you?</p>
    <label>INCOMING MESSAGE</label><textarea rows="5" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Paste the Messenger message here..."/>
    <label>CONVERSATION CONTEXT <small>OPTIONAL</small></label><textarea rows="2" value={context} onChange={e=>setContext(e.target.value)} placeholder="Who is this person? What should the reply know?"/>
    <label>REPLY TONE</label><div className="tones">{['Friendly','Casual','Professional','Warm','Short'].map(t=><button className={tone===t?'active':''} onClick={()=>setTone(t)} key={t}>{t}</button>)}</div>
    <button className="generate" disabled={!message.trim()||busy} onClick={generate}><Sparkles size={17}/>{busy?'Generating...':'Generate reply'}<Send size={16}/></button>{error&&<p className="error">{error}</p>}
   </div>
   <div className="panel result"><h2><Sparkles/> AI-generated reply</h2><p className="muted">Your draft will appear here</p>
    {reply?<><div className="reply">{reply}</div><button className="copy" onClick={()=>navigator.clipboard.writeText(reply)}><Copy size={16}/> Copy reply</button><p className="muted">Review the draft before sending it in Messenger.</p></>:<div className="empty"><Bot size={34}/><b>Your reply is waiting</b><p>Enter a message and hit generate. Your draft will show up here.</p></div>}
   </div>
  </section>
  <section className="history"><h3>Recent drafts <small>{history.length} saved locally</small></h3>{history.slice(0,5).map((x,i)=><button key={i} onClick={()=>{setMessage(x.message);setReply(x.reply)}}>{x.message}<small>{new Date(x.at).toLocaleString()}</small></button>)}</section>
  <footer>Independent drafting tool · Not affiliated with Meta · Nothing is sent automatically</footer>
 </main>
}
