/**
 * Recover from Vite content-hashed chunks removed by a GitHub Pages deployment.
 * GitHub Pages atomically replaces dist/, while open tabs may still be running
 * an older entry script that references assets from the previous deployment.
 */
const RECOVERY_KEY = "raym:asset-recovery-v1";
const RETRY_WINDOW_MS = 120_000;

export function isChunkLoadError(error) {
    const message = String(error?.message || error || "");
    return /Failed to fetch dynamically imported module|Importing a module script failed|Failed to load module script|Loading (?:CSS )?chunk [\w-]+ failed|ChunkLoadError|error loading dynamically imported module/i.test(message);
}

export function buildRecoveryUrl(href, routePath, nonce) {
    const url = new URL(href);
    url.searchParams.set("__raym_recover", String(nonce));
    if (routePath?.startsWith("/")) url.hash = "#" + routePath;
    return url.toString();
}

function showRecoveryNotice(routePath) {
    if (document.getElementById("raym-asset-recovery-notice")) return;

    const box = document.createElement("div");
    box.id = "raym-asset-recovery-notice";
    box.setAttribute("role", "alert");
    box.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:99999;max-width:min(360px,calc(100vw - 40px));padding:18px;border:1px solid #58bceb;border-radius:14px;background:#0b151d;color:#eaf6ff;box-shadow:0 16px 42px rgba(0,0,0,.35);font:14px/1.6 system-ui,sans-serif;";

    const title = document.createElement("strong");
    title.textContent = "页面资源加载失败";
    title.style.cssText = "display:block;margin-bottom:6px;font-size:15px;";

    const description = document.createElement("p");
    description.textContent = "网站可能刚刚更新。当前页面引用的旧资源已失效，请刷新以加载最新版本。";
    description.style.cssText = "margin:0 0 12px;color:#b7c8dc;";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "重新加载最新版本";
    button.style.cssText = "border:0;border-radius:8px;padding:8px 12px;background:#78cff6;color:#041018;font:600 13px system-ui,sans-serif;cursor:pointer;";
    button.addEventListener("click", () => {
        try { window.sessionStorage.removeItem(RECOVERY_KEY); } catch { /* ignore */ }
        window.location.replace(buildRecoveryUrl(window.location.href, routePath, Date.now()));
    });

    box.append(title, description, button);
    document.body.appendChild(box);
}

export function installChunkRecovery(router) {
    let recovering = false;
    let pendingRoute = null;

    router.beforeEach((to) => {
        pendingRoute = to.fullPath;
    });
    router.afterEach(() => {
        pendingRoute = null;
    });

    function recover(routePath) {
        if (recovering) return;
        recovering = true;

        // Avoid reload loops when the CDN or deployment itself is still broken.
        let lastRetry;
        try {
            lastRetry = Number(window.sessionStorage.getItem(RECOVERY_KEY) || 0);
        } catch {
            showRecoveryNotice(routePath);
            return;
        }

        if (Date.now() - lastRetry < RETRY_WINDOW_MS) {
            showRecoveryNotice(routePath);
            return;
        }

        try {
            window.sessionStorage.setItem(RECOVERY_KEY, String(Date.now()));
        } catch {
            showRecoveryNotice(routePath);
            return;
        }

        window.location.replace(buildRecoveryUrl(window.location.href, routePath, Date.now()));
    }

    // Vite emits this event when a preloaded dynamic chunk is no longer present.
    window.addEventListener("vite:preloadError", (event) => {
        if (!isChunkLoadError(event.payload)) return;
        event.preventDefault();
        recover(pendingRoute);
    });

    // Vue Router reports failures for any page loaded via () => import(...).
    router.onError((error, to) => {
        if (isChunkLoadError(error)) {
            recover(to?.fullPath ?? null);
        } else {
            console.error("Router navigation failed:", error);
        }
    });
}
