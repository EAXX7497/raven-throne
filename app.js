'use strict';
(() => {
 const $ = id => document.getElementById(id);
 const log = $('log');
 function line(message, kind='line') { const el=document.createElement('div');el.className='line '+kind;el.textContent=message;log.appendChild(el);log.scrollTop=log.scrollHeight; }
 function tab(name){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===name));}
 document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>tab(b.dataset.tab)));
 const help='Commands: help, status, modules, opsec, clear, search <public query>, note <text>, export, erase';
 function execute(raw){const s=raw.trim();if(!s)return;line('RT> '+s,'prompt');const [cmd,...rest]=s.split(/\s+/);const arg=rest.join(' ');switch(cmd.toLowerCase()){
 case 'help':line(help,'ok');break;
 case 'status':line('RAVEN THRONE v0.3 | Standalone static app | Network API disabled | Session notes in memory','ok');break;
 case 'modules':line('RAVEN CORE / BLACKFEATHER / CRYPT / SENTINEL','ok');break;
 case 'opsec':tab('sentinel');line('Opened SENTINEL. Public source code is not a secret vault.','ok');break;
 case 'clear':log.replaceChildren();break;
 case 'search':if(!arg){line('Usage: search <public query>','error');break;} $('target').value=arg;tab('blackfeather');line('Target staged in BLACKFEATHER. Choose a source to initiate a search.','ok');break;
 case 'note':if(!arg){line('Usage: note <text>','error');break;} $('caseNotes').value += ($('caseNotes').value?'\n':'')+arg;line('Added to session notes. Export before closing the page.','ok');break;
 case 'export':exportNotes();break;
 case 'erase':tab('crypt');line('Use ERASE SESSION in CRYPT to confirm deletion.','ok');break;
 default:line('Unknown command. Type help.','error');}}
 $('commandForm').addEventListener('submit',e=>{e.preventDefault();const v=$('cmd').value;$('cmd').value='';execute(v);});document.querySelectorAll('[data-command]').forEach(b=>b.addEventListener('click',()=>execute(b.dataset.command)));
 const sources={google:q=>'https://www.google.com/search?q='+encodeURIComponent(q),github:q=>'https://github.com/search?q='+encodeURIComponent(q)+'&type=users',reddit:q=>'https://www.reddit.com/search/?q='+encodeURIComponent(q),youtube:q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q),bing:q=>'https://www.bing.com/search?q='+encodeURIComponent(q),duckduckgo:q=>'https://duckduckgo.com/?q='+encodeURIComponent(q)};
 document.querySelectorAll('[data-source]').forEach(b=>b.addEventListener('click',()=>{const q=$('target').value.trim();if(!q){$('target').focus();return;}const url=sources[b.dataset.source](q);window.open(url,'_blank','noopener,noreferrer');}));
 function exportNotes(){const obj={format:'raven-throne-case',version:1,exportedAt:new Date().toISOString(),title:$('caseTitle').value,notes:$('caseNotes').value};const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='raven-throne-case-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('caseStatus').textContent='Export requested. Verify the file was saved before leaving this page.';}
 $('exportBtn').addEventListener('click',exportNotes);
 $('importBtn').addEventListener('click',()=>$('importFile').click());
 $('importFile').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;if(f.size>100000){$('caseStatus').textContent='Import rejected: file exceeds 100 KB.';return;}try{const obj=JSON.parse(await f.text());if(obj?.format!=='raven-throne-case'||obj.version!==1||typeof obj.title!=='string'||typeof obj.notes!=='string'||obj.title.length>120||obj.notes.length>50000)throw Error('Invalid case format');if(!confirm('Replace current unsaved notes with imported notes?'))return;$('caseTitle').value=obj.title;$('caseNotes').value=obj.notes;$('caseStatus').textContent='Imported into session memory only.';}catch{$('caseStatus').textContent='Import failed: invalid or unsupported case file.';}});
 $('eraseBtn').addEventListener('click',()=>{if(!confirm('Permanently clear this page’s current case notes and terminal log? Export first if needed.'))return;$('caseTitle').value='';$('caseNotes').value='';$('target').value='';log.replaceChildren();$('caseStatus').textContent='Session cleared. Downloaded exports are not deleted.';});
 line('RAVEN THRONE // CORE INITIALIZED','ok');line('Standalone mode. No backend connection. No persistent case storage.');line('Type help to begin.');
})();
