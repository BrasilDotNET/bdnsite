function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

(function() {
  var stamplay_appid = "brasildotnet";
  var stamplay_webhookid = "invites";
  var $form = document.querySelectorAll('#signup-form')[0];
  var $submit = document.querySelectorAll('#signup-form button[type="submit"]')[0];
  var $email = document.querySelectorAll('#signup-form #email')[0];
  var $message = document.querySelectorAll('#signup-form #message')[0];
  $email.value = getParameterByName('email');

  $message._show = function(success, text) {
    $message.innerHTML = text;
    if (success) {
      $message.style.color = '#27ae60';
    } else {
      $message.style.color = '#e74c3c';
    }
    $message.style.visibility = 'visible';
    window.setTimeout(function() {
      $message._hide();
    }, 7000);
  };

  $message._hide = function() {
    $message.style.visibility = 'hidden';
  };
  Stamplay.init(stamplay_appid);
  $form.addEventListener('submit', function(event) {
    event.stopPropagation();
    event.preventDefault();
    $message._hide();
    $submit.disabled = true;
    var webhook = new Stamplay.Webhook(stamplay_webhookid);
    var regExp = new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$");
    var valid = regExp.test($email.value);
    if (valid) {
      var data = {
        email: $email.value
      }
      webhook.post(data).then(function(response) {
        $form.reset();
        $submit.disabled = false;
        $message._show(true, 'O convite foi enviado');
      });
    } else {
      $form.reset();
      $submit.disabled = false;
      $message._show(false, 'Ops. O e-mail é inválido');
    }
  });
})();
