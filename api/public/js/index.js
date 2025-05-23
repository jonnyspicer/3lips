function toggle_button(button) {
  button.classList.toggle('active');
  var pressed = button.getAttribute('aria-pressed') === 'false' ? 'true' : 'false';
  button.setAttribute('aria-pressed', pressed);

  // fix button states
  if (pressed === 'true') {
    button.classList.add("btn-success");
    button.classList.remove("btn-secondary");

    // Add the hidden input when the button is pressed
    var serverUrl = button.getAttribute('value');
    var inputExists = document.querySelector('input[name="server"][value="' + serverUrl + '"]');

    if (!inputExists) {
      var hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'server');
      hiddenInput.setAttribute('value', serverUrl);
      document.querySelector('form').appendChild(hiddenInput);
    }
  } else {
    button.classList.add("btn-secondary");
    button.classList.remove("btn-success");

    // Remove the corresponding hidden input when the button is deselected
    var serverUrl = button.getAttribute('value');
    var hiddenInputs = document.querySelectorAll('input[name="server"][value="' + serverUrl + '"]');

    hiddenInputs.forEach(function (input) {
      // Check if the input element exists before removing it
      if (input && input.parentNode) {
        input.parentNode.removeChild(input);
      }
    });
  }
}

// redirect to map with REST API
document.getElementById('buttonMap').addEventListener('click', function () {
  // Get the form values
  var servers = document.querySelectorAll('.toggle-button.active');
  var associator = document.querySelector('[name="associator"]').value;
  var localisation = document.querySelector('[name="localisation"]').value;
  var adsb = document.querySelector('[name="adsb"]').value;

  // Construct the URL with the form values
  var apiUrl = '?server=' + Array.from(servers).map(server => server.value).join('&server=');
  var mapUrl = '/map/index.html' + apiUrl + '&associator=' + associator + '&localisation=' + localisation + '&adsb=' + adsb;
  
  if (window.APP_CONFIG) {
    const configParam = encodeURIComponent(JSON.stringify(window.APP_CONFIG));
    mapUrl += '&config=' + configParam;
  } else {
    console.error('No APP_CONFIG available when clicking map button');
  }
  // Redirect to the constructed URL
  window.location.href = mapUrl;
});