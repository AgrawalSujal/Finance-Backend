const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

const renderApiPage = ({ title, subtitle, content, showBack = true }) => `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
        :root {
            --bg: #f4efe8;
            --card: #fffaf3;
            --text: #1f1f1f;
            --muted: #5f5a54;
            --accent: #0f766e;
            --accent-2: #b45309;
            --ring: rgba(15, 118, 110, 0.25);
            --border: #e8dccf;
            --danger: #b91c1c;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: "Segoe UI", "Trebuchet MS", sans-serif;
            color: var(--text);
            background:
                radial-gradient(1100px 500px at 5% -10%, #d8efe6 0%, transparent 55%),
                radial-gradient(900px 420px at 95% 0%, #ffe9d0 0%, transparent 52%),
                linear-gradient(145deg, #f8f1e9 0%, var(--bg) 100%);
            display: grid;
            place-items: center;
            padding: 24px;
        }

        .wrap {
            width: min(980px, 100%);
            animation: rise .55s ease-out;
        }

        .hero {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 22px;
            box-shadow: 0 20px 55px rgba(0, 0, 0, 0.08);
            padding: clamp(20px, 4vw, 40px);
            overflow: hidden;
            position: relative;
        }

        .hero::before,
        .hero::after {
            content: "";
            position: absolute;
            border-radius: 999px;
            opacity: 0.16;
            pointer-events: none;
        }

        .hero::before {
            width: 260px;
            height: 260px;
            background: var(--accent);
            top: -90px;
            right: -60px;
        }

        .hero::after {
            width: 200px;
            height: 200px;
            background: var(--accent-2);
            bottom: -95px;
            left: -55px;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #dcfce7;
            color: #14532d;
            border: 1px solid #86efac;
            border-radius: 999px;
            padding: 7px 12px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 14px;
        }

        h1 {
            margin: 0 0 10px;
            font-size: clamp(28px, 5vw, 46px);
            letter-spacing: -0.02em;
            line-height: 1.08;
            max-width: 18ch;
        }

        p {
            margin: 0;
            color: var(--muted);
            font-size: clamp(15px, 2vw, 18px);
            max-width: 66ch;
            line-height: 1.6;
        }

        .content {
            margin-top: 20px;
            display: grid;
            gap: 12px;
            position: relative;
            z-index: 1;
        }

        .panel {
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 14px;
        }

        input, textarea {
            width: 100%;
            padding: 10px 11px;
            border: 1px solid var(--border);
            border-radius: 10px;
            font: inherit;
            margin-top: 8px;
            background: #fff;
        }

        button, .btn {
            margin-top: 10px;
            border: 0;
            border-radius: 10px;
            padding: 10px 14px;
            font-weight: 600;
            font: inherit;
            cursor: pointer;
            background: var(--accent);
            color: #fff;
            box-shadow: 0 8px 20px var(--ring);
            text-decoration: none;
            display: inline-block;
        }

        pre {
            margin: 8px 0 0;
            background: #0f172a;
            color: #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            overflow: auto;
            font-size: 12px;
            line-height: 1.5;
        }

        .error {
            color: var(--danger);
            font-size: 13px;
            margin-top: 8px;
            font-weight: 600;
        }

        .back {
            margin-top: 12px;
        }

        footer {
            margin-top: 14px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }

        @keyframes rise {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <main class="wrap">
        <section class="hero">
            <span class="badge">API Online</span>
            <h1>${title}</h1>
            <p>${subtitle}</p>
            <div class="content">${content}</div>
            ${showBack ? '<div class="back"><a class="btn" href="/">Back To Home</a></div>' : ''}
        </section>
        <footer>Finance Dashboard Backend API • ${new Date().getFullYear()}</footer>
    </main>
</body>
</html>`;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:'],
            connectSrc: ["'self'"],
        },
    },
}));

// CORS configuration allowing requests from the frontend URL in production and all origins in development
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    credentials: true,
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// Body parsing middleware with increased limits to handle large payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/auth/login', (req, res) => {
    const html = renderApiPage({
        title: 'Auth Login Endpoint',
        subtitle: 'Use this page to test the POST /api/auth/login endpoint from your browser.',
        content: `
                    <div class="panel">
                        <label>Email
                            <input id="email" type="email" placeholder="admin@example.com" value="admin@example.com" />
                        </label>
                        <label>Password
                            <input id="password" type="password" placeholder="Enter password" value="admin123" />
                        </label>
                        <button id="loginBtn" type="button">Login</button>
                        <div id="error" class="error"></div>
                    </div>
                    <div class="panel">
                        <strong>Response</strong>
                        <pre id="output">No request yet.</pre>
                    </div>
                    <script>
                        const loginBtn = document.getElementById('loginBtn');
                        const output = document.getElementById('output');
                        const errorEl = document.getElementById('error');

                        loginBtn.addEventListener('click', async () => {
                            errorEl.textContent = '';
                            output.textContent = 'Loading...';

                            const email = document.getElementById('email').value.trim();
                            const password = document.getElementById('password').value;

                            try {
                                const res = await fetch('/api/auth/login', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                                    body: JSON.stringify({ email, password })
                                });
                                const data = await res.json();

                                if (!res.ok) {
                                    errorEl.textContent = data.message || 'Login failed';
                                } else if (data && data.token) {
                                    localStorage.setItem('apiToken', data.token);
                                }

                                output.textContent = JSON.stringify(data, null, 2);
                            } catch (err) {
                                errorEl.textContent = err.message;
                                output.textContent = 'Request failed';
                            }
                        });
                    </script>
                `,
    });

    res.status(200).send(html);
});

app.get('/api/dashboard/summary', (req, res, next) => {
    const wantsHtml = (req.headers.accept || '').includes('text/html');
    const hasAuth = Boolean(req.headers.authorization);
    const wantsRawJson = req.query.format === 'json';

    if (hasAuth || wantsRawJson || !wantsHtml) {
        return next();
    }

    const html = renderApiPage({
        title: 'Dashboard Summary Endpoint',
        subtitle: 'Use a Bearer token to fetch GET /api/dashboard/summary directly from this page.',
        content: `
                    <div class="panel">
                        <label>Timeframe
                            <input id="timeframe" type="text" value="month" placeholder="week | month | year" />
                        </label>
                        <label>Bearer Token
                            <textarea id="token" rows="3" placeholder="Paste JWT token here"></textarea>
                        </label>
                        <button id="fetchBtn" type="button">Fetch Summary</button>
                        <div id="error" class="error"></div>
                    </div>
                    <div class="panel">
                        <strong>Response</strong>
                        <pre id="output">No request yet.</pre>
                    </div>
                    <script>
                        const tokenEl = document.getElementById('token');
                        const cached = localStorage.getItem('apiToken');
                        if (cached) tokenEl.value = cached;

                        const fetchBtn = document.getElementById('fetchBtn');
                        const output = document.getElementById('output');
                        const errorEl = document.getElementById('error');

                        fetchBtn.addEventListener('click', async () => {
                            errorEl.textContent = '';
                            output.textContent = 'Loading...';

                            const timeframe = document.getElementById('timeframe').value.trim() || 'month';
                            const token = tokenEl.value.trim();

                            if (!token) {
                                errorEl.textContent = 'Bearer token is required.';
                                output.textContent = 'No token provided';
                                return;
                            }

                            try {
                                const res = await fetch('/api/dashboard/summary?format=json&timeframe=' + encodeURIComponent(timeframe), {
                                    headers: {
                                        'Authorization': 'Bearer ' + token,
                                        'Accept': 'application/json'
                                    }
                                });
                                const data = await res.json();

                                if (!res.ok) {
                                    errorEl.textContent = data.message || 'Request failed';
                                }

                                output.textContent = JSON.stringify(data, null, 2);
                            } catch (err) {
                                errorEl.textContent = err.message;
                                output.textContent = 'Request failed';
                            }
                        });
                    </script>
                `,
    });

    return res.status(200).send(html);
});

// Simple homepage for the deployed service root
app.get('/', (req, res) => {
    res.status(200).send(`<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Finance Dashboard Backend API</title>
    <style>
        :root {
            --bg: #f4efe8;
            --card: #fffaf3;
            --text: #1f1f1f;
            --muted: #5f5a54;
            --accent: #0f766e;
            --accent-2: #b45309;
            --ring: rgba(15, 118, 110, 0.25);
            --border: #e8dccf;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: "Segoe UI", "Trebuchet MS", sans-serif;
            color: var(--text);
            background:
                radial-gradient(1100px 500px at 5% -10%, #d8efe6 0%, transparent 55%),
                radial-gradient(900px 420px at 95% 0%, #ffe9d0 0%, transparent 52%),
                linear-gradient(145deg, #f8f1e9 0%, var(--bg) 100%);
            display: grid;
            place-items: center;
            padding: 24px;
        }

        .wrap {
            width: min(980px, 100%);
            animation: rise .55s ease-out;
        }

        .hero {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 22px;
            box-shadow: 0 20px 55px rgba(0, 0, 0, 0.08);
            padding: clamp(20px, 4vw, 40px);
            overflow: hidden;
            position: relative;
        }

        .hero::before,
        .hero::after {
            content: "";
            position: absolute;
            border-radius: 999px;
            opacity: 0.16;
            pointer-events: none;
        }

        .hero::before {
            width: 260px;
            height: 260px;
            background: var(--accent);
            top: -90px;
            right: -60px;
        }

        .hero::after {
            width: 200px;
            height: 200px;
            background: var(--accent-2);
            bottom: -95px;
            left: -55px;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #dcfce7;
            color: #14532d;
            border: 1px solid #86efac;
            border-radius: 999px;
            padding: 7px 12px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 14px;
        }

        h1 {
            margin: 0 0 10px;
            font-size: clamp(28px, 5vw, 46px);
            letter-spacing: -0.02em;
            line-height: 1.08;
            max-width: 16ch;
        }

        p {
            margin: 0;
            color: var(--muted);
            font-size: clamp(15px, 2vw, 18px);
            max-width: 66ch;
            line-height: 1.6;
        }

        .actions {
            margin-top: 24px;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }

        .btn {
            text-decoration: none;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 10px 14px;
            font-weight: 600;
            font-size: 14px;
            transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
            color: var(--text);
            background: #fff;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
        }

        .btn.primary {
            background: var(--accent);
            border-color: transparent;
            color: #fff;
            box-shadow: 0 8px 20px var(--ring);
        }

        .grid {
            margin-top: 22px;
            display: grid;
            gap: 14px;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        .card {
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 14px;
            display: grid;
            gap: 6px;
        }

        .card h3 {
            margin: 0;
            font-size: 14px;
            color: #111827;
            letter-spacing: .02em;
            text-transform: uppercase;
        }

        .card code {
            font-family: Consolas, "Courier New", monospace;
            font-size: 13px;
            color: #334155;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 6px 8px;
            border-radius: 8px;
            width: fit-content;
        }

        footer {
            margin-top: 14px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }

        @keyframes rise {
            from {
                opacity: 0;
                transform: translateY(8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <main class="wrap">
        <section class="hero">
            <span class="badge">API Online</span>
            <h1>Finance Dashboard Backend</h1>
            <p>
                Secure REST API with JWT authentication, role-based access, financial record management,
                and analytics endpoints for summary, categories, and monthly trends.
            </p>

            <div class="actions">
                <a class="btn primary" href="/api/health">Check Health</a>
                <a class="btn" href="/api/auth/login">Auth Endpoint</a>
                <a class="btn" href="/api/dashboard/summary">Dashboard Endpoint</a>
            </div>

            <div class="grid">
                <article class="card">
                    <h3>Base URL</h3>
                    <code>/api</code>
                </article>
                <article class="card">
                    <h3>Health Check</h3>
                    <code>/api/health</code>
                </article>
                <article class="card">
                    <h3>Environment</h3>
                    <code>${process.env.NODE_ENV || 'development'}</code>
                </article>
            </div>
        </section>

        <footer>Finance Dashboard Backend API • ${new Date().getFullYear()}</footer>
    </main>
</body>
</html>`);
});

// Routes middleware
app.use('/api', routes);

// Handle undefined routes with a 404 error
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler to catch all errors and send a consistent response
app.use(errorHandler);

module.exports = app;