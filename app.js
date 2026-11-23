(function() {
    var APPS = window.APPS || [];
    var WA = 'https://whatsapp.com/channel/0029Vb9HMKTJf05TqvWPpc0k';
    var $ = function(s, r) {
        return (r || document).querySelector(s);
    };
    var $$ = function(s, r) {
        return Array.prototype.slice.call((r || document).querySelectorAll(s));
    };

    var TABS = [{
        key: 'all',
        label: 'Apps',
        on: 'ri-apps-2-fill',
        off: 'ri-apps-2-line'
    }];
    var BANNERS = [
        {
                "id": "uvstudyx",
                "tag": "Featured App",
                "title": "UVstudyX BOOKS",
                "sub": "Explore Uvstudyx Books on UVstudyX."
        },
        {
                "id": "pw",
                "tag": "Featured App",
                "title": "PHYSICS WALLAH",
                "sub": "Explore Physics Wallah on UVstudyX."
        },
        {
                "id": "pwbooks",
                "tag": "Featured App",
                "title": "PW DIGITAL BOOKS",
                "sub": "Explore Pw Digital Books on UVstudyX."
        },
        {
                "id": "pi",
                "tag": "Featured App",
                "title": "PI",
                "sub": "Explore Pi on UVstudyX."
        },
        {
                "id": "nt",
                "tag": "Featured App",
                "title": "NEXT TOPPER",
                "sub": "Explore Next Topper on UVstudyX."
        },
        {
                "id": "mj",
                "tag": "Featured App",
                "title": "MISSION JEET",
                "sub": "Explore Mission Jeet on UVstudyX."
        },
        {
                "id": "un",
                "tag": "Featured App",
                "title": "UNACADEMY",
                "sub": "Explore Unacademy on UVstudyX."
        },
        {
                "id": "unoffline",
                "tag": "Featured App",
                "title": "UNACADEMY OFFLINE",
                "sub": "Explore Unacademy Offline on UVstudyX."
        },
        {
                "id": "table",
                "tag": "Featured App",
                "title": "PERIODIC TABLE",
                "sub": "Explore Periodic Table on UVstudyX."
        },
        {
                "id": "sf",
                "tag": "Featured App",
                "title": "SCIENCE AND FUN",
                "sub": "Explore Science And Fun on UVstudyX."
        },
        {
                "id": "rwa",
                "tag": "Featured App",
                "title": "ROJGAR WITH ANKIT",
                "sub": "Explore Rojgar With Ankit on UVstudyX."
        },
        {
                "id": "padhle",
                "tag": "Featured App",
                "title": "PADHLE AKSHAY",
                "sub": "Explore Padhle Akshay on UVstudyX."
        }
];
    var ABOUT = {};

    var state = {
        tab: 'all',
        q: '',
        slide: 0,
        timer: null
    };

    function byId(id) {
        return APPS.filter(function(a) {
            return a.id === id;
        })[0];
    }

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function(c) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[c];
        });
    }

    function toast(msg) {
        var t = $('#toast');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toast.t);
        toast.t = setTimeout(function() {
            t.classList.remove('show');
        }, 2200);
    }

    function iconHTML(a, cls) {
        cls = cls || '';
        if (a.icon) return '<img class="app-ico ' + cls + '" src="' + a.icon + '" alt="" loading="lazy" width="68" height="68">';
        var ri = a.ri || 'ri-book-open-fill';
        return '<div class="app-ico ph ' + cls + '" style="--c:' + a.color + '"><i class="' + ri + '"></i></div>';
    }

    function aboutText(a) {
        if (ABOUT[a.id]) return ABOUT[a.id];
        return a.name.split(' ').map(function(w) {
                return w.length <= 3 ? w : w.charAt(0) + w.slice(1).toLowerCase();
            }).join(' ') +
            ' on 𝑼𝑽𝒔𝒕𝒖𝒅𝒚𝑿 brings its batches, lectures and notes together in one fast, free web app. Pick a batch, start the lecture and keep every note a tap away. It works on phone and desktop, and you can install it to your home screen for a full-screen experience.';
    }

    /* ---------- tabs ---------- */
    function renderTabs() {
        var html = TABS.map(function(t) {
            var on = state.tab === t.key;
            return '<button class="tab' + (on ? ' on' : '') + '" data-tab="' + t.key + '"><i class="' + (on ? t.on : t.off) + '"></i>' + t.label + '</button>';
        }).join('');
        if ($('.tabbar')) $('.tabbar').innerHTML = html;
        $('.sidenav').innerHTML = html;
        $$('[data-tab]').forEach(function(b) {
            b.onclick = function() {
                state.tab = b.getAttribute('data-tab');
                if (location.hash !== '#/') location.hash = '#/';
                renderTabs();
                renderList();
            };
        });
    }

    /* ---------- banner ---------- */
    function renderBanner() {
        var items = BANNERS.filter(function(b) {
            return byId(b.id);
        });
        $('.slides').innerHTML = items.map(function(b) {
            var a = byId(b.id);
            return '<div class="slide" data-id="' + a.id + '" style="--c:' + a.color + '">' +
                (a.icon ? '<img class="big" src="' + a.icon + '" alt="">' : '<div class="big app-ico ph" style="--c:' + a.color + ';font-size:90px"><i class="' + (a.ri || 'ri-book-open-fill') + '"></i></div>') +
                '<div><span class="tag">' + esc(b.tag) + '</span><h3>' + esc(b.title) + '</h3><p>' + esc(b.sub) + '</p></div></div>';
        }).join('');
        $('.dots').innerHTML = items.map(function(_, i) {
            return '<i' + (i === 0 ? ' class="on"' : '') + '></i>';
        }).join('');
        $$('.slide').forEach(function(s) {
            s.onclick = function() {
                location.hash = '#/app/' + s.getAttribute('data-id');
            };
        });
        state.n = items.length;
        go(0);
        clearInterval(state.timer);
        state.timer = setInterval(function() {
            go((state.slide + 1) % state.n);
        }, 4800);
    }

    function go(i) {
        state.slide = i;
        $('.slides').style.transform = 'translateX(-' + i * 100 + '%)';
        $$('.dots i').forEach(function(d, k) {
            d.classList.toggle('on', k === i);
        });
    }
    (function swipe() {
        var el = $('#banner'),
            x0 = null;
        el.addEventListener('touchstart', function(e) {
            x0 = e.touches[0].clientX;
        }, {
            passive: true
        });
        el.addEventListener('touchend', function(e) {
            if (x0 === null) return;
            var dx = e.changedTouches[0].clientX - x0;
            x0 = null;
            if (Math.abs(dx) > 40) go((state.slide + (dx < 0 ? 1 : state.n - 1)) % state.n);
        });
    })();

    /* ---------- list ---------- */
    function renderList() {
        var q = state.q.trim().toLowerCase();
        var list = APPS.filter(function(a) {
            var m = !q || a.name.toLowerCase().indexOf(q) > -1 || a.cat.toLowerCase().indexOf(q) > -1;
            return m;
        });
        $('#secTitle').innerHTML = '<span>🔥</span> Top Free Apps';
        $('#secCount').textContent = list.length + ' apps';
        $('#list').innerHTML = list.map(function(a) {
            var action = a.url ? '<span class="get">OPEN</span><small>Web App</small>' : '<span class="get">UPCOMING</span><small>Coming soon</small>';
            var meta = esc(a.cat) + ' <span>·</span> ' + esc(a.installs) + ' <span>·</span> <span class="st">★</span> ' + a.rating;
            return '<div class="card" data-id="' + a.id + '" tabindex="0" role="link">' +
                '<div class="ico-wrap">' + iconHTML(a) + '</div>' +
                '<div class="info"><h3>' + esc(a.name) + '</h3><div class="dev">𝑼𝑽𝒔𝒕𝒖𝒅𝒚𝑿 <i class="ri-verified-badge-fill"></i></div><div class="meta">' + meta + '</div></div>' +
                '<div class="act">' + action + '</div></div>';
        }).join('');
        $$('.card').forEach(function(c) {
            var open = function() {
                location.hash = '#/app/' + c.getAttribute('data-id');
            };
            c.onclick = open;
            c.onkeydown = function(e) {
                if (e.key === 'Enter') open();
            };
        });
        var empty = !list.length;
        $('#empty').hidden = !empty;
        $('#emptyMsg').textContent = 'Try a different search.';
        $('#clearBtn').style.display = '';
    }

    /* ---------- detail ---------- */
    function openApp(a) {
        if (!a.url) { toast('Coming soon'); return; }
        toast('Opening ' + a.name + '...');
        setTimeout(function() {
            window.open(a.url, '_blank', 'noopener');
        }, 500);
    }

    function renderDetail(a) {
        var cta = a.url
            ? '<button class="cta alt" id="visitBtn"><i class="ri-global-line"></i> Visit Website</button>'
            : '<div class="cta alt upcoming-label" aria-label="Coming soon"><i class="ri-time-line"></i> Upcoming</div>';
        $('#view-detail').innerHTML =
            '<div class="dhead"><button id="backBtn"><i class="ri-arrow-left-s-line"></i> Apps</button>' +
            '<div class="r"><button id="shareBtn" aria-label="Share"><i class="ri-share-forward-line"></i></button></div></div>' +
            '<div class="hero">' + iconHTML(a) + '<div><h2>' + esc(a.name) + '</h2><div class="dev" style="font-size:15px;margin-top:6px">𝑼𝑽𝒔𝒕𝒖𝒅𝒚𝑿 <i class="ri-verified-badge-fill"></i></div>' +
            '<div class="chips"><span class="chip">' + esc(a.cat) + '</span><span class="chip">Web App</span>' + '<span class="chip hi">★ ' + a.rating + '</span>' + '</div></div></div>' +
            cta +
            '<div class="stats"><div class="stat"><small>Rating</small><b>' + a.rating + '</b><span>★★★★★</span></div><div class="stat"><small>Users</small><b>' + esc(a.installs) + '</b><span>Students</span></div><div class="stat"><small>Price</small><b>Free</b><span>Always</span></div></div>' +
            '<div class="dsec"><h3>About This App</h3><div class="about">' + esc(aboutText(a)) + '</div></div>';
        $('#backBtn').onclick = function() {
            if (history.length > 1) history.back();
            else location.hash = '#/';
        };
        $('#shareBtn').onclick = function() {
            var url = a.url || (location.origin + location.pathname + '#/app/' + a.id),
                data = {
                    title: a.name,
                    text: 'Check out ' + a.name + ' on 𝑼𝑽𝒔𝒕𝒖𝒅𝒚𝑿!',
                    url: url
                };
            if (navigator.share) navigator.share(data).catch(function() {});
            else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function() {
                toast('Link copied');
            });
        };
        if (a.url && $('#visitBtn')) {
            $('#visitBtn').onclick = function() { openApp(a); };
        }
    }

    /* ---------- routing ---------- */
    function route() {
        var m = location.hash.match(/^#\/app\/([\w-]+)/),
            a = m && byId(m[1]);
        $('#view-home').hidden = !!a;
        $('#view-detail').hidden = !a;
        if (a) {
            renderDetail(a);
            window.scrollTo(0, 0);
        } else {
            renderList();
        }
    }
    window.addEventListener('hashchange', route);

    /* ---------- search ---------- */
    $$('.q').forEach(function(inp) {
        inp.addEventListener('input', function() {
            state.q = inp.value;
            $$('.q').forEach(function(o) {
                if (o !== inp) o.value = inp.value;
            });
            if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
            else renderList();
        });
    });
    $('#clearBtn').onclick = function() {
        state.q = '';
        state.tab = 'all';
        $$('.q').forEach(function(i) {
            i.value = '';
        });
        renderTabs();
        renderList();
    };

    /* ---------- join-channel popup: show on every page load ---------- */
    (function joinPopup() {
        var el = $('#joinPop');
        if (!el) return;

        function close() {
            el.hidden = true;
            document.body.style.overflow = '';
        }
        $('#jpClose').onclick = close;
        el.addEventListener('click', function(e) {
            if (e.target === el) close();
        });
        $$('.jp-btn', el).forEach(function(b) {
            b.addEventListener('click', close);
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !el.hidden) close();
        });
        setTimeout(function() {
            el.hidden = false;
            document.body.style.overflow = 'hidden';
        }, 1900); // show after the splash screen on every page load/refresh
    })();

    /* ---------- no zoom on tap / pinch, no image save on press ---------- */
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(function(n) {
        document.addEventListener(n, function(e) {
            e.preventDefault();
        });
    });
    document.addEventListener('dblclick', function(e) {
        e.preventDefault();
    }, {
        passive: false
    });
    document.addEventListener('touchmove', function(e) {
        if (e.touches && e.touches.length > 1) e.preventDefault();
    }, {
        passive: false
    });
    document.addEventListener('contextmenu', function(e) {
        if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('dragstart', function(e) {
        if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });

    /* ---------- init ---------- */
    renderTabs();
    renderBanner();
    route();
    setTimeout(function() {
        $('#splash').classList.add('out');
    }, 1500);
})();