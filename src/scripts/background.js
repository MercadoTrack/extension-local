chrome.runtime.onMessage.addListener(function (event) {
  if (event.type === "authenticate") {
    // scope
    //  - openid if you want an id_token returned
    //  - offline_access if you want a refresh_token returned
    // device
    //  - required if requesting the offline_access scope.
    let options = {
      scope: "openid profile email offline_access",
      device: "chrome-extension",
    };

    new Auth0Chrome(env.AUTH0_DOMAIN, env.AUTH0_CLIENT_ID)
      .authenticate(options)
      .then(function (authResult) {
        localStorage.authResult = JSON.stringify(authResult);
        // chrome.notifications.create({
        //   type: 'basic',
        //   iconUrl: 'images/icon_128.png',
        //   title: 'Login Successful',
        //   message: 'You can use the app now'
        // });
      })
      .catch(function (err) {
        console.log(err);
        // chrome.notifications.create({
        //   type: 'basic',
        //   title: 'Login Failed',
        //   message: err.message,
        //   iconUrl: 'images/icon_128.png'
        // });
      });
  }
});
