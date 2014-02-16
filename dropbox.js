var Dropbox = require("dropbox");
var client = new Dropbox.Client({
    key: "enter your app key here",
    secret: "enter your secret key here"
});

client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));
client.authenticate(function(error, client) {
  if (error) {
    // Replace with a call to your own error-handling code.
    //
    // Don't forget to return from the callback, so you don't execute the code
    // that assumes everything went well.
    return showError(error);
  }

  // Replace with a call to your own application code.
  //
  // The user authorized your app, and everything went well.
  // client is a Dropbox.Client instance that you can use to make API calls.
  client.readdir("/", function(error, entries) {
  if (error) {
    return showError(error);  // Something went wrong.
  }

  console.log("Your Dropbox contains " + entries.join(", "));
});

});
