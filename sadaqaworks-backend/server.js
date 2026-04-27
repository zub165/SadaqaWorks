const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Django is the source-of-truth backend for persistence
const DJANGO_BASE = process.env.DJANGO_BASE || 'http://127.0.0.1:3015';
const DJANGO_API_PREFIX = '/api/sadaqaworks';

async function proxyToDjango(req, res, { upstreamPath, transformJson }) {
    try {
        const url = new URL(DJANGO_BASE + DJANGO_API_PREFIX + upstreamPath);
        if (req.url.includes('?')) {
            // Preserve query params
            const idx = req.url.indexOf('?');
            url.search = req.url.slice(idx);
        }

        const method = req.method.toUpperCase();
        const headers = { 'Accept': 'application/json' };
        // Pass through auth token if present
        const auth = req.headers['authorization'] || req.headers['Authorization'];
        if (auth) headers['Authorization'] = auth;
        let body;
        if (method !== 'GET' && method !== 'HEAD') {
            headers['Content-Type'] = 'application/json';
            // Frontend uses camelCase keys; Django serializers may expect snake_case.
            const raw = req.body ?? {};
            const mapped = { ...raw };
            if (Object.prototype.hasOwnProperty.call(mapped, 'paymentMethod') && !Object.prototype.hasOwnProperty.call(mapped, 'payment_method')) {
                mapped.payment_method = mapped.paymentMethod;
            }
            body = JSON.stringify(mapped);
        }

        const resp = await fetch(url.toString(), { method, headers, body });
        const contentType = resp.headers.get('content-type') || '';
        let payloadText = await resp.text();

        // Try to normalize to JSON if possible (frontend expects legacy shapes)
        if (contentType.includes('application/json')) {
            try {
                const json = JSON.parse(payloadText || 'null');
                const out = typeof transformJson === 'function' ? transformJson(json, resp) : json;
                return res.status(resp.status).json(out);
            } catch (_) {
                // Fall through and return raw text
            }
        }

        res.status(resp.status);
        res.setHeader('Content-Type', contentType || 'text/plain');
        return res.send(payloadText);
    } catch (e) {
        console.error('Proxy error:', e);
        return res.status(502).json({ message: 'Failed to reach Django backend' });
    }
}

// Routes
app.get('/projects', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/projects/',
        transformJson: (json) => Array.isArray(json) ? json : (json?.results || []),
    });
});

app.post('/projects', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/projects/',
        transformJson: (json) => ({ message: 'Project added successfully!', project: json }),
    });
});

// New route for dashboard statistics
app.get('/dashboard-stats', (req, res) => {
    return proxyToDjango(req, res, { upstreamPath: '/dashboard-stats/' });
});

// Update project progress
app.put('/projects/:id/progress', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: `/projects/${encodeURIComponent(req.params.id)}/progress/`,
        transformJson: (json) => json,
    });
});

// Delete project
app.delete('/projects/:id', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: `/projects/${encodeURIComponent(req.params.id)}/`,
        transformJson: () => ({ message: 'Project deleted successfully!' }),
    });
});

// Volunteer Routes
app.post('/volunteers', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/volunteers/',
        transformJson: (json) => ({ message: 'Volunteer registered successfully!', volunteer: json }),
    });
});

app.get('/volunteers', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/volunteers/',
        transformJson: (json) => Array.isArray(json) ? json : (json?.results || []),
    });
});

// Workers CRUD
app.post('/workers', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/workers/',
        transformJson: (json) => ({ message: 'Worker registered successfully!', worker: json }),
    });
});

app.get('/workers', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/workers/',
        transformJson: (json) => Array.isArray(json) ? json : (json?.results || []),
    });
});

app.get('/available-workers', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/available-workers/',
        transformJson: (json) => Array.isArray(json) ? json : (json?.results || []),
    });
});

app.post('/assign-project', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/assign-project/',
        transformJson: (json) => json,
    });
});

// Donations
app.post('/donations', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/donations/',
        transformJson: (json) => ({ message: 'Donation recorded successfully!', donation: json }),
    });
});

app.get('/donations', (req, res) => {
    return proxyToDjango(req, res, {
        upstreamPath: '/donations/',
        transformJson: (json) => Array.isArray(json) ? json : (json?.results || []),
    });
});

// Auth proxy (UI expects same-origin)
app.post('/auth/register', (req, res) => {
    return proxyToDjango(req, res, { upstreamPath: '/auth/register/' });
});

app.post('/auth/login', (req, res) => {
    return proxyToDjango(req, res, { upstreamPath: '/auth/login/' });
});

app.post('/auth/password-reset/request', (req, res) => {
    return proxyToDjango(req, res, { upstreamPath: '/auth/password-reset/request/' });
});

app.post('/auth/password-reset/confirm', (req, res) => {
    return proxyToDjango(req, res, { upstreamPath: '/auth/password-reset/confirm/' });
});

// Admin: create users (Worker/Contractor/Donor/Donor Receiver)
app.post('/admin/users', (req, res) => {
    return proxyToDjango(req, res, { upstreamPath: '/admin/users/' });
});

// Payments
app.post('/payments/checkout', (req, res) => {
    return proxyToDjango(req, res, { upstreamPath: '/payments/checkout/' });
});

// Stripe webhook must not require auth; forward raw body.
app.post('/webhooks/stripe', express.raw({ type: '*/*' }), async (req, res) => {
    try {
        const url = new URL(DJANGO_BASE + DJANGO_API_PREFIX + '/webhooks/stripe/');
        const headers = {
            'Accept': 'application/json',
            'Content-Type': req.headers['content-type'] || 'application/json',
        };
        const sig = req.headers['stripe-signature'];
        if (sig) headers['Stripe-Signature'] = sig;
        const resp = await fetch(url.toString(), { method: 'POST', headers, body: req.body });
        const text = await resp.text();
        res.status(resp.status);
        res.setHeader('Content-Type', resp.headers.get('content-type') || 'application/json');
        return res.send(text);
    } catch (e) {
        console.error('Stripe webhook proxy error:', e);
        return res.status(502).json({ message: 'Failed to reach Django backend' });
    }
});

// SPA fallback (so /myprojects and other deep links work)
// Express v5 routing is stricter; use middleware instead of a "*" route pattern.
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 