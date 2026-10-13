(function(){
        var drop=document.getElementById('drop'), fileInput=document.getElementById('file');
        var msg=document.getElementById('msg'), go=document.getElementById('go');
        var preview=document.getElementById('preview'), fname=document.getElementById('fname');
        var chosen=null;
        var URL_CONVERT=go.getAttribute("data-url");

        function say(cls,text){ msg.className=cls; msg.textContent=text; }
        function pick(f){
            if(!f){ return; }
            if(!/^image\//.test(f.type)){ say('err','Please choose an image file.'); return; }
            if(f.size>10*1024*1024){ say('err','File too large (max 10 MB).'); return; }
            chosen=f; say('','');
            fname.textContent='Selected: '+f.name;
            preview.src=URL.createObjectURL(f); preview.style.display='block';
        }
        drop.addEventListener('click',function(){ fileInput.click(); });
        drop.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fileInput.click(); } });
        fileInput.addEventListener('change',function(){ pick(fileInput.files[0]); });
        drop.addEventListener('dragover',function(e){ e.preventDefault(); drop.classList.add('over'); });
        drop.addEventListener('dragleave',function(){ drop.classList.remove('over'); });
        drop.addEventListener('drop',function(e){ e.preventDefault(); drop.classList.remove('over'); pick(e.dataTransfer.files[0]); });

        go.addEventListener('click',async function(){
            if(!chosen){ say('err','Please choose an image first.'); return; }
            if(!document.getElementById('excel').checked && !document.getElementById('word').checked){ say('err','Tick Excel, Word, or both.'); return; }
            var fd=new FormData();
            fd.append('file',chosen);
            ['excel','word','colors','objects'].forEach(function(k){ fd.append(k,document.getElementById(k).checked); });
            go.disabled=true; say('busy','Working\u2026 this can take 10\u201330 seconds.');
            try{
                var r=await fetch(URL_CONVERT,{method:'POST',body:fd});
                if(!r.ok){ var t=r.statusText; try{ t=(await r.json()).error||t; }catch(e){} throw new Error(t); }
                var blob=await r.blob();
                var m=/filename="?([^";]+)"?/.exec(r.headers.get('content-disposition')||'');
                var a=document.createElement('a'); a.href=URL.createObjectURL(blob);
                a.download=m?m[1]:'converted.zip'; document.body.appendChild(a); a.click(); a.remove();
                say('ok','Done \u2014 your download has started.');
            }catch(e){ say('err','Error: '+e.message); }
            go.disabled=false;
        });
    })();
