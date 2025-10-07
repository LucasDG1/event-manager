import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import App from './src/App'; // pad naar jouw App.tsx

const server = express();

// Statische assets (van React build)
server.use(express.static('build'));

server.get('*', (req, res) => {
  const appHtml = renderToString(<App />);
  const helmet = Helmet.renderStatic();

  res.send(`
    <!DOCTYPE html>
    <html lang="nl">
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/static/js/bundle.js"></script>
      </body>
    </html>
  `);
});

server.listen(3000, () => console.log('SSR server running op http://localhost:3000'));
