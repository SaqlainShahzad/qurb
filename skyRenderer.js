(function(){
  var canvas = document.getElementById('skyCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  
  var particles = [];
  var stars = [];
  var w, h;
  
  function resize(){
    var rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    // Handle high DPI displays for crispness
    var dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    
    // Init stars if empty
    if(stars.length === 0){
      for(var i=0; i<60; i++){
        stars.push({
          x: Math.random()*w,
          y: Math.random()*h,
          r: Math.random()*1.5 + 0.5,
          blinkOffset: Math.random()*Math.PI*2,
          speed: Math.random()*0.02 + 0.01
        });
      }
    }
  }
  
  window.addEventListener('resize', resize);
  setTimeout(resize, 0);

  // Time to fractional hours (0-24)
  function getHours(d){
    return d.getHours() + d.getMinutes()/60 + d.getSeconds()/3600;
  }

  // Parse time string 'HH:MM AM/PM' to fractional hours
  function parseTimeStr(arr){
    if(!arr) return null;
    return arr[0] + arr[1]/60;
  }

  // Determine current phase based on local prayers
  function getCurrentPhase(){
    var d = new Date();
    var currentH = getHours(d);
    
    // Default fallback times
    var fajrH = 5.0, sunH = 6.5, maghribH = 18.0, ishaH = 19.5;
    
    try {
      if(window.todayTimes){
         var t = window.todayTimes(d);
         if(t){
           fajrH = parseTimeStr(t.fajr) || fajrH;
           var s = window.exactSpecialTimes ? window.exactSpecialTimes(d) : null;
           if(s && s.sunrise) {
             sunH = getHours(s.sunrise.start);
           }
           maghribH = parseTimeStr(t.maghrib) || maghribH;
           ishaH = parseTimeStr(t.isha) || ishaH;
         }
      }
    } catch(e){}

    // Dawn: Fajr -> Sunrise
    // Day: Sunrise -> Maghrib
    // Dusk: Maghrib -> Isha
    // Night: Isha -> Fajr
    
    // We create smooth blends between phases by returning fractional phase
    // 0 = Dawn, 1 = Day, 2 = Dusk, 3 = Night
    
    // For simplicity, we just snap to the target colors but we can lerp!
    // Actually, animated gradient lerping is cheap if done carefully.
    
    var phase = 'night';
    if(currentH >= fajrH && currentH < sunH) phase = 'dawn';
    else if(currentH >= sunH && currentH < maghribH) phase = 'day';
    else if(currentH >= maghribH && currentH < ishaH) phase = 'dusk';
    else phase = 'night';
    
    return phase;
  }

  var time = 0;
  function loop(){
    time += 1;
    if(!w || !h) {
      requestAnimationFrame(loop);
      return;
    }
    
    var phase = getCurrentPhase();
    
    // Gradients
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    if(phase === 'dawn'){
      grad.addColorStop(0, '#4a6b8c'); // Deep soft blue
      grad.addColorStop(1, '#d48a56'); // Golden amber
    } else if(phase === 'day'){
      grad.addColorStop(0, '#2d73b9'); // Sky blue
      grad.addColorStop(1, '#6eb2df'); // Light blue
    } else if(phase === 'dusk'){
      grad.addColorStop(0, '#2c223c'); // Deep purple
      grad.addColorStop(1, '#a65440'); // Terracotta
    } else { // Night
      grad.addColorStop(0, '#0b101e'); // Charcoal navy
      grad.addColorStop(1, '#1b253b'); // Deep slate
    }
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    
    // Particles / Elements
    if(phase === 'night' || phase === 'dusk'){
      // Draw stars
      ctx.fillStyle = '#ffffff';
      stars.forEach(function(s){
        var alpha = (Math.sin(time * s.speed + s.blinkOffset) + 1) / 2;
        if(phase==='dusk') alpha *= 0.3; // dimmer in dusk
        ctx.globalAlpha = alpha * 0.8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      
      // Soft crescent moon aesthetic glow in night
      if(phase === 'night'){
        var mg = ctx.createRadialGradient(w-40, 40, 0, w-40, 40, 40);
        mg.addColorStop(0, 'rgba(255,255,255,0.15)');
        mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.fillRect(w-80, 0, 80, 80);
      }
    }
    
    if(phase === 'dawn' || phase === 'day'){
      // Shimmer ambient light / floating particles
      if(particles.length < 15 && Math.random()<0.05) {
        particles.push({
          x: Math.random()*w, y: h + 10,
          vx: (Math.random()-0.5)*0.5, vy: -Math.random()*0.5 - 0.2,
          life: 1.0
        });
      }
      
      for(var i=particles.length-1; i>=0; i--){
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;
        if(p.life <= 0){
          particles.splice(i, 1);
          continue;
        }
        
        ctx.globalAlpha = p.life * 0.4;
        ctx.fillStyle = phase==='dawn' ? '#ffdfaa' : '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      
      // Soft sun glow for dawn/day
      var sg = ctx.createRadialGradient(w/2, h, 0, w/2, h, h);
      sg.addColorStop(0, phase==='dawn' ? 'rgba(255,180,100,0.3)' : 'rgba(255,255,255,0.15)');
      sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, w, h);
    }
    
    requestAnimationFrame(loop);
  }
  
  requestAnimationFrame(loop);
})();
