async function bypassLink() {
    const link = document.getElementById('linkInput').value.trim();
    const resultDiv = document.getElementById('result');
    const finalLinkDiv = document.getElementById('finalLink');
    const autoRedirect = document.getElementById('autoRedirectCheckbox').checked;
    resultDiv.innerHTML = 'Обработка...';
    resultDiv.classList.add('processing');
    resultDiv.classList.remove('success');
    finalLinkDiv.innerHTML = '';

    if (!link) {
        resultDiv.innerHTML = 'Пожалуйста, вставь ссылку!';
        resultDiv.classList.remove('processing');
        return;
    }

    const supportedDomains = [
        'linkvertise', 'sub2get', 'lootlinks', 'adfoc.us', 'boost.ink', 
        'boostfusedgt', 'leasurepartment.xyz', 'letsboost', 'mboost.me', 
        'rekonise', 'shorte.st', 'sub2unlock.com', 'sub2unlock.net', 
        'v.gd', 'dragonslayer', 'tinyurl.com', 'bit.ly', 'is.gd', 
        'rebrand.ly', 'empebau.eu', 'socialwolvez.com', 'sub1s.com', 
        'tinylink.onl', 'google-url', 'justpaste.it', 'subfinal', 
        'ad-maven', 't.ly', 'cutt.ly', 'ow.ly', 'adf.ly', 'bc.vc',
        'api.ksstorage.org', 'bstlar.com', 'ksstorage.org', 'keyguardian.org',
        'daughablelea.com', 'go.linkify.ru'
    ];

    const isSupported = supportedDomains.some(domain => link.includes(domain));
    if (!isSupported) {
        resultDiv.innerHTML = 'Эта ссылка не поддерживается!';
        resultDiv.classList.remove('processing');
        return;
    }

    try {
        const finalUrl = await tryServiceBypass(link);
        resultDiv.classList.remove('processing');
        if (finalUrl) {
            finalLinkDiv.innerHTML = `Готовая ссылка: <a href="${finalUrl}" target="_blank">${finalUrl}</a>`;
            if (autoRedirect) {
                resultDiv.innerHTML = 'Перенаправление...';
                console.log(`Перенаправляем на: ${finalUrl}`);
                setTimeout(() => {
                    window.location.href = finalUrl;
                }, 1000);
            } else {
                resultDiv.innerHTML = 'Ссылка успешно обработана!';
                resultDiv.classList.add('success');
            }
        } else {
            resultDiv.innerHTML = 'Не удалось обойти ссылку автоматически.';
            finalLinkDiv.innerHTML = '';
        }
    } catch (error) {
        resultDiv.classList.remove('processing');
        finalLinkDiv.innerHTML = '';
        console.error('Ошибка:', error);
        resultDiv.innerHTML = `Ошибка при обработке ссылки: ${error.message}`;
    }
}

async function tryServiceBypass(link) {
    console.log(`Пробуем обойти: ${link}`);

    if (link.includes('daughablelea.com')) {
        const urlParams = new URLSearchParams(link.split('?')[1]);
        let finalUrl = urlParams.get('url') || urlParams.get('u') || urlParams.get('destination');
        if (finalUrl) {
            finalUrl = decodeURIComponent(finalUrl);
            console.log(`daughablelea.com: параметр найден — ${finalUrl}`);
            return finalUrl;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'HEAD', 
                redirect: 'follow', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            if (response.url && response.url !== link) {
                console.log(`daughablelea.com: HEAD-запрос вернул — ${response.url}`);
                return response.url;
            }
        } catch (e) {
            console.log('HEAD-запрос для daughablelea.com не сработал:', e);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            });
            clearTimeout(timeoutId);
            const text = await response.text();

            const match = text.match(/href=["'](.*?)["']/i) || 
                        text.match(/window\.location\s*=\s*["'](.*?)["']/i) || 
                        text.match(/location\.href\s*=\s*["'](.*?)["']/i) || 
                        text.match(/window\.open\(["'](.*?)["']/i) || 
                        text.match(/url\s*:\s*["'](.*?)["']/i) || 
                        text.match(/["']((?:https?:\/\/)[^"']+)["']/i);
            if (match && match[1]) {
                const foundUrl = match[1];
                if (!foundUrl.includes('daughablelea.com')) {
                    console.log(`daughablelea.com: найдено через парсинг — ${foundUrl}`);
                    return foundUrl;
                }
            }

            const metaMatch = text.match(/<meta\s+http-equiv=["']refresh["']\s+content=["']\d+;\s*url=["']?(.*?)["']?/i);
            if (metaMatch && metaMatch[1]) {
                console.log(`daughablelea.com: найдено в meta refresh — ${metaMatch[1]}`);
                return metaMatch[1];
            }
        } catch (e) {
            console.log('Ошибка парсинга daughablelea.com:', e);
        }

        console.log('daughablelea.com: не удалось найти ссылку');
        return null;
    }

    if (link.includes('go.linkify.ru')) {
        const urlParams = new URLSearchParams(link.split('?')[1]);
        let finalUrl = urlParams.get('url') || urlParams.get('u') || urlParams.get('destination');
        if (finalUrl) {
            finalUrl = decodeURIComponent(finalUrl);
            console.log(`go.linkify.ru: параметр найден — ${finalUrl}`);
            return finalUrl;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'HEAD', 
                redirect: 'follow', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            if (response.url && response.url !== link) {
                console.log(`go.linkify.ru: HEAD-запрос вернул — ${response.url}`);
                return response.url;
            }
        } catch (e) {
            console.log('HEAD-запрос для go.linkify.ru не сработал:', e);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            });
            clearTimeout(timeoutId);
            const text = await response.text();

            const match = text.match(/href=["'](.*?)["']/i) || 
                        text.match(/window\.location\s*=\s*["'](.*?)["']/i) || 
                        text.match(/location\.href\s*=\s*["'](.*?)["']/i) || 
                        text.match(/window\.open\(["'](.*?)["']/i) || 
                        text.match(/url\s*:\s*["'](.*?)["']/i) || 
                        text.match(/["']((?:https?:\/\/)[^"']+)["']/i);
            if (match && match[1]) {
                const foundUrl = match[1];
                if (!foundUrl.includes('go.linkify.ru')) {
                    console.log(`go.linkify.ru: найдено через парсинг — ${foundUrl}`);
                    return foundUrl;
                }
            }

            const metaMatch = text.match(/<meta\s+http-equiv=["']refresh["']\s+content=["']\d+;\s*url=["']?(.*?)["']?/i);
            if (metaMatch && metaMatch[1]) {
                console.log(`go.linkify.ru: найдено в meta refresh — ${metaMatch[1]}`);
                return metaMatch[1];
            }
        } catch (e) {
            console.log('Ошибка парсинга go.linkify.ru:', e);
        }

        console.log('go.linkify.ru: не удалось найти ссылку');
        return null;
    }

    if (link.includes('keyguardian.org')) {
        const urlParams = new URLSearchParams(link.split('?')[1]);
        let finalUrl = urlParams.get('url') || urlParams.get('u') || urlParams.get('destination') || urlParams.get('link');
        if (finalUrl) {
            finalUrl = decodeURIComponent(finalUrl);
            console.log(`keyguardian.org: параметр найден — ${finalUrl}`);
            return finalUrl;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'HEAD', 
                redirect: 'follow', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            if (response.url && response.url !== link) {
                console.log(`keyguardian.org: HEAD-запрос вернул — ${response.url}`);
                return response.url;
            }
        } catch (e) {
            console.log('HEAD-запрос для keyguardian.org не сработал:', e);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            });
            clearTimeout(timeoutId);
            const text = await response.text();

            const match = text.match(/href=["'](.*?)["']/i) || 
                        text.match(/window\.location\s*=\s*["'](.*?)["']/i) || 
                        text.match(/location\.href\s*=\s*["'](.*?)["']/i) || 
                        text.match(/window\.open\(["'](.*?)["']/i) || 
                        text.match(/url\s*:\s*["'](.*?)["']/i) || 
                        text.match(/["']((?:https?:\/\/)[^"']+)["']/i);
            if (match && match[1]) {
                const foundUrl = match[1];
                if (!foundUrl.includes('keyguardian.org')) {
                    console.log(`keyguardian.org: найдено через парсинг — ${foundUrl}`);
                    return foundUrl;
                }
            }

            const metaMatch = text.match(/<meta\s+http-equiv=["']refresh["']\s+content=["']\d+;\s*url=["']?(.*?)["']?/i);
            if (metaMatch && metaMatch[1]) {
                console.log(`keyguardian.org: найдено в meta refresh — ${metaMatch[1]}`);
                return metaMatch[1];
            }
        } catch (e) {
            console.log('Ошибка парсинга keyguardian.org:', e);
        }

        console.log('keyguardian.org: не удалось найти ссылку');
        return null;
    }

    if (link.includes('bstlar.com')) {
        const urlParams = new URLSearchParams(link.split('?')[1]);
        let finalUrl = urlParams.get('url') || urlParams.get('u') || urlParams.get('destination');
        if (finalUrl) {
            finalUrl = decodeURIComponent(finalUrl);
            console.log(`bstlar.com: параметр найден — ${finalUrl}`);
            return finalUrl;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'HEAD', 
                redirect: 'follow', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            if (response.url && response.url !== link) {
                console.log(`bstlar.com: HEAD-запрос вернул — ${response.url}`);
                return response.url;
            }
        } catch (e) {
            console.log('HEAD-запрос для bstlar.com не сработал:', e);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            });
            clearTimeout(timeoutId);
            const text = await response.text();

            const match = text.match(/href=["'](.*?)["']/i) || 
                        text.match(/window\.location\s*=\s*["'](.*?)["']/i) || 
                        text.match(/location\.href\s*=\s*["'](.*?)["']/i) || 
                        text.match(/window\.open\(["'](.*?)["']/i) || 
                        text.match(/url\s*:\s*["'](.*?)["']/i) || 
                        text.match(/["']((?:https?:\/\/)[^"']+)["']/i);
            if (match && match[1]) {
                const foundUrl = match[1];
                if (!foundUrl.includes('bstlar.com')) {
                    console.log(`bstlar.com: найдено через парсинг — ${foundUrl}`);
                    return foundUrl;
                }
            }

            const metaMatch = text.match(/<meta\s+http-equiv=["']refresh["']\s+content=["']\d+;\s*url=["']?(.*?)["']?/i);
            if (metaMatch && metaMatch[1]) {
                console.log(`bstlar.com: найдено в meta refresh — ${metaMatch[1]}`);
                return metaMatch[1];
            }
        } catch (e) {
            console.log('Ошибка парсинга bstlar.com:', e);
        }

        console.log('bstlar.com: не удалось найти ссылку');
        return null;
    }

    if (link.includes('ksstorage.org') && !link.includes('api.ksstorage.org')) {
        const urlParams = new URLSearchParams(link.split('?')[1]);
        let finalUrl = urlParams.get('url') || urlParams.get('u') || urlParams.get('destination');
        if (finalUrl) {
            finalUrl = decodeURIComponent(finalUrl);
            console.log(`ksstorage.org: параметр найден — ${finalUrl}`);
            return finalUrl;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'HEAD', 
                redirect: 'follow', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            if (response.url && response.url !== link) {
                console.log(`ksstorage.org: HEAD-запрос вернул — ${response.url}`);
                return response.url;
            }
        } catch (e) {
            console.log('HEAD-запрос для ksstorage.org не сработал:', e);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            const text = await response.text();
            const match = text.match(/href=["'](.*?)["']/i) || 
                        text.match(/window\.location\s*=\s*["'](.*?)["']/i) || 
                        text.match(/url\s*=\s*["'](.*?)["']/i);
            if (match && match[1]) {
                console.log(`ksstorage.org: найдено через парсинг — ${match[1]}`);
                return match[1];
            }
        } catch (e) {
            console.log('Ошибка парсинга ksstorage.org:', e);
        }

        console.log('ksstorage.org: не удалось найти ссылку');
        return null;
    }

    if (link.includes('api.ksstorage.org')) {
        const urlParams = new URLSearchParams(link.split('?')[1]);
        let finalUrl = urlParams.get('url') || urlParams.get('destination');
        if (finalUrl) {
            finalUrl = decodeURIComponent(finalUrl);
            console.log(`api.ksstorage.org: параметр найден — ${finalUrl}`);
            return finalUrl;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);

            const redirectUrl = response.headers.get('Location');
            if (redirectUrl) {
                console.log(`api.ksstorage.org: редирект найден — ${redirectUrl}`);
                return redirectUrl;
            }

            const text = await response.text();
            try {
                const json = JSON.parse(text);
                if (json.url || json.destination) {
                    finalUrl = json.url || json.destination;
                    console.log(`api.ksstorage.org: URL из JSON — ${finalUrl}`);
                    return finalUrl;
                }
            } catch (e) {
                const match = text.match(/href=["'](.*?)["']/i) || text.match(/url=["'](.*?)["']/i);
                if (match && match[1]) {
                    console.log(`api.ksstorage.org: найдено через парсинг — ${match[1]}`);
                    return match[1];
                }
            }
        } catch (e) {
            console.log('Ошибка парсинга api.ksstorage.org:', e);
        }

        console.log('api.ksstorage.org: не удалось найти ссылку');
        return null;
    }

    if (link.includes('linkvertise')) {
        const urlParams = new URLSearchParams(link.split('?')[1]);
        let dynamicLink = urlParams.get('r') || urlParams.get('url');
        if (dynamicLink) {
            dynamicLink = decodeURIComponent(dynamicLink);
            console.log(`Linkvertise: параметр найден — ${dynamicLink}`);
            return dynamicLink;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            const text = await response.text();
            const match = text.match(/destination\s*=\s*["'](.*?)["']/i) || 
                        text.match(/href\s*=\s*["'](.*?)["']/i) || 
                        text.match(/window\.location\s*=\s*["'](.*?)["']/i);
            if (match && match[1]) {
                console.log(`Linkvertise: найдено через парсинг — ${match[1]}`);
                return match[1];
            }
        } catch (e) {
            console.log('Ошибка парсинга Linkvertise:', e);
        }

        console.log('Linkvertise: не удалось найти ссылку');
        return null;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(link, { 
            method: 'HEAD', 
            redirect: 'follow', 
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        clearTimeout(timeoutId);
        if (response.url && response.url !== link) {
            console.log(`HEAD-запрос вернул: ${response.url}`);
            return response.url;
        }
    } catch (e) {
        console.log('HEAD-запрос не сработал:', e);
    }

    if (link.includes('tinyurl.com') || link.includes('bit.ly') || link.includes('is.gd') || link.includes('t.ly') || link.includes('cutt.ly')) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            const text = await response.text();
            const match = text.match(/window\.location\s*=\s*["'](.*?)["']/i) || 
                        text.match(/href=["'](.*?)["']/i);
            if (match && match[1]) {
                console.log(`Сокращатель вернул: ${match[1]}`);
                return match[1];
            }
        } catch (e) {
            console.log('Ошибка парсинга сокращателя:', e);
        }
    } else if (link.includes('adf.ly') || link.includes('adfoc.us') || link.includes('shorte.st')) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            const text = await response.text();
            const match = text.match(/var\s+url\s*=\s*["'](.*?)["']/i) || 
                        text.match(/href\s*=\s*["'](.*?)["']/i) || 
                        text.match(/location\s*=\s*["'](.*?)["']/i);
            if (match && match[1]) {
                console.log(`Ad-сервис вернул: ${match[1]}`);
                return match[1];
            }
        } catch (e) {
            console.log('Ошибка парсинга ad-сервиса:', e);
        }
    } else if (link.includes('sub2unlock.com') || link.includes('sub2unlock.net')) {
        const urlParams = new URLSearchParams(link.split('?')[1]);
        const key = urlParams.get('link') || urlParams.get('u');
        if (key) {
            console.log(`Sub2Unlock: ${decodeURIComponent(key)}`);
            return decodeURIComponent(key);
        }
    } else if (link.includes('bc.vc')) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(link, { 
                method: 'GET', 
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            clearTimeout(timeoutId);
            const text = await response.text();
            const match = text.match(/go\s*:\s*["'](.*?)["']/i) || 
                        text.match(/href=["'](.*?)["']/i);
            if (match && match[1]) {
                console.log(`bc.vc вернул: ${match[1]}`);
                return match[1];
            }
        } catch (e) {
            console.log('Ошибка парсинга bc.vc:', e);
        }
    }

    console.log('Все методы провалились, возвращаем null');
    return null;
}

function toggleTheme() {
    const checkbox = document.getElementById('themeCheckbox');
    const toggleIcon = document.querySelector('.toggle-icon');
    const body = document.body;
    const container = document.querySelector('.container');
    const footer = document.querySelector('footer');

    if (checkbox.checked) {
        toggleIcon.innerHTML = '🌙';
        body.classList.add('dark-theme');
        container.style.background = 'rgba(0, 0, 0, 0.7)';
        footer.style.background = 'rgba(0, 0, 0, 0.7)';
    } else {
        toggleIcon.innerHTML = '☀️';
        body.classList.remove('dark-theme');
        container.style.background = 'rgba(212, 216, 221, 0.7)';
        footer.style.background = 'rgba(212, 216, 221, 0.7)';
    }
}