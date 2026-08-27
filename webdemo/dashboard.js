(function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || '';
  var content = document.getElementById('profileContent');

  fetch('/api/profile?id=' + encodeURIComponent(id), { credentials: 'same-origin' })
    .then(function (res) {
      if (!res.ok) throw new Error('not found');
      return res.json();
    })
    .then(function (profile) {
      var html = '';
      html += '<div class="profile-row"><span class="label">Name:</span>' + profile.name + '</div>';
      html += '<div class="profile-row"><span class="label">Role:</span>' + profile.role + '</div>';
      html += '<div class="profile-row"><span class="label">Student/Staff ID:</span>' + id + '</div>';
      html += '<h2>Private note</h2>';
      html += '<div class="note-box">' + profile.note + '</div>';
      content.innerHTML = html;
    })
    .catch(function () {
      content.innerHTML = '<p class="error">Profile not found for ID "' + id + '", or you are not logged in.</p>';
    });

  // The portal remembers your role in a plain cookie the server set at
  // login -- but nothing stops you from editing it in DevTools
  // (Application/Storage tab, or document.cookie in the console).
  var adminCard = document.getElementById('adminToolsCard');
  var adminNoteEl = document.getElementById('adminNote');
  var adminUnlocked = false;

  function checkAdminCookie() {
    var isAdmin = /(?:^|; )role=admin(?:;|$)/.test(document.cookie);

    if (isAdmin && !adminUnlocked) {
      fetch('/api/admin-note', { credentials: 'same-origin' })
        .then(function (res) {
          if (!res.ok) throw new Error('forbidden');
          return res.json();
        })
        .then(function (data) {
          adminUnlocked = true;
          adminNoteEl.textContent = data.note;
          adminCard.style.display = 'block';
        })
        .catch(function () {});
    } else if (!isAdmin && adminUnlocked) {
      adminUnlocked = false;
      adminCard.style.display = 'none';
    }
  }

  // No native "cookie changed" event exists in every browser, so this polls
  // -- meaning the Admin Tools panel appears live after you edit the cookie
  // in DevTools, no page reload needed.
  checkAdminCookie();
  setInterval(checkAdminCookie, 800);
})();
