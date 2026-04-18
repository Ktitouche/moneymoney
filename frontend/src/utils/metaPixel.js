const META_PIXEL_ID = process.env.REACT_APP_META_PIXEL_ID;
const META_CURRENCY = process.env.REACT_APP_META_CURRENCY || 'DZD';

const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const getItemPrice = (item) => toNumber(item?.prixPromo || item?.prix);

export const getCartMetaPayload = (cart = []) => {
    const contents = cart.map((item) => ({
        id: String(item?._id || ''),
        quantity: toNumber(item?.quantity || 1),
        item_price: getItemPrice(item)
    }));

    const value = contents.reduce((sum, content) => (
        sum + (content.item_price * content.quantity)
    ), 0);

    return {
        content_ids: contents.map((content) => content.id).filter(Boolean),
        contents,
        content_type: 'product',
        value,
        currency: META_CURRENCY
    };
};

export const initMetaPixel = () => {
    if (!META_PIXEL_ID || typeof window === 'undefined') return;
    if (window.fbq) return;

    ; (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', META_PIXEL_ID);
};

export const trackMetaEvent = (eventName, payload) => {
    if (typeof window === 'undefined') return;
    if (!META_PIXEL_ID) return;

    initMetaPixel();
    if (!window.fbq) return;

    if (payload) {
        window.fbq('track', eventName, payload);
        return;
    }

    window.fbq('track', eventName);
};
