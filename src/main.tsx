import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles.css'

function showFatalErrorUI(message: string, details = '') {
  const rootElement = document.getElementById('root')
  if (!rootElement) return
  const safeDetails = details
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  rootElement.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,-apple-system,sans-serif;background:#f5f5f5;padding:20px;">
      <div style="text-align:center;padding:24px;background:#fff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,.1);max-width:520px;">
        <h1 style="margin:0 0 10px;color:#d32f2f;font-size:22px;font-weight:700">Failed to load</h1>
        <p style="margin:0 0 16px;color:#444;font-size:15px">${message}</p>
        ${safeDetails ? `<details style="text-align:left"><summary style="cursor:pointer;color:#666;font-size:13px">Technical details</summary><pre style="background:#f5f5f5;padding:10px;border-radius:4px;overflow:auto;color:#d32f2f;font-size:12px;margin:8px 0 0">${safeDetails}</pre></details>` : ''}
        <button onclick="location.reload()" style="margin-top:16px;background:#1d4ed8;color:#fff;border:0;padding:10px 18px;border-radius:6px;cursor:pointer;font-size:15px">Reload</button>
      </div>
    </div>`
}

window.addEventListener('error', (e) => {
  console.error('[CJ] Global error:', e.error || e.message)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('[CJ] Unhandled rejection:', e.reason)
})

function initializeApp() {
  try {
    const rootElement = document.getElementById('root')
    if (!rootElement) {
      showFatalErrorUI('The application container is missing from the page.')
      return
    }
    const router = getRouter()
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </React.StrictMode>,
    )
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack || '' : ''
    showFatalErrorUI('The application encountered a critical error during initialization.', `${msg}\n\n${stack}`)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp, { once: true })
} else {
  initializeApp()
}
