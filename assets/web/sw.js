const CACHE_NAME = 'namaz-swat-v8';
const APP_SHELL = ['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./kaaba.glb'];

self.addEventListener('install',(event)=>event.waitUntil(
  caches.open(CACHE_NAME)
    .then(cache=>cache.addAll(APP_SHELL))
    .then(()=>self.skipWaiting())
));

self.addEventListener('activate',(event)=>event.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
    .then(()=>self.clients.matchAll({type:'window',includeUncontrolled:true}))
    .then(clients=>clients.forEach(c=>c.postMessage({type:'APP_UPDATED'})))
));

// Instant startup for repeat visits: serve the cached app shell immediately,
// then refresh it in the background. API/POST requests are never intercepted here.
self.addEventListener('fetch',(event)=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;

  const isNavigation=req.mode==='navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/qurb/');
  const isApi=url.pathname.includes('/api/');

  if(isNavigation){
    event.respondWith(
      caches.match('./index.html').then(cached=>{
        const refresh=fetch(req).then(res=>{
          if(res && res.ok) caches.open(CACHE_NAME).then(c=>c.put('./index.html',res.clone()));
          return res;
        }).catch(()=>cached);
        return cached || refresh;
      })
    );
    return;
  }

  if(isApi){
    // Keep API behavior unchanged; only fall back to cache when offline.
    event.respondWith(fetch(req).catch(()=>caches.match(req)));
    return;
  }

  // Static same-origin assets: cache-first for speed, background refresh when online.
  event.respondWith(
    caches.match(req).then(cached=>{
      const refresh=fetch(req).then(res=>{
        if(res && res.ok) caches.open(CACHE_NAME).then(c=>c.put(req,res.clone()));
        return res;
      }).catch(()=>cached);
      return cached || refresh;
    })
  );
});

self.addEventListener('push',(event)=>{
  let data={};
  try{data=event.data?event.data.json():{};}catch(e){data={title:'Salah',body:event.data?event.data.text():'Prayer reminder'};}
  const title=data.title||'🕌 Salah Prayer Reminder';
  const options={body:data.body||'Prayer time reminder',icon:data.icon||'./icons/icon-192.png',badge:data.badge||'./icons/icon-192.png',tag:data.tag||'salah-prayer',renotify:data.renotify!==false,vibrate:data.vibrate||[180,80,180],data:data.data||{url:'./'}};
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',(event)=>{
  event.notification.close();
  const target=(event.notification.data&&event.notification.data.url)||'./';
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{
    for(const client of clients){
      if('focus' in client){return client.focus().then(()=>('navigate' in client?client.navigate(target):undefined));}
    }
    if(self.clients.openWindow)return self.clients.openWindow(target);
  }));
});

self.addEventListener('message',(event)=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();});
