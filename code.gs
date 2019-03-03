function listLabels() {
  var response = Gmail.Users.Labels.list('me');
  if (response.labels.length == 0) {
    Logger.log('No labels found.');
  } else {
    Logger.log('Labels:');
    for (var i = 0; i < response.labels.length; i++) {
      var label = response.labels[i];
      Logger.log('- %s', label.name);
    }
  }
}

function getScore(e) {
  var response = Gmail.Users.Drafts.list('me');
  if (response.drafts.length == 0) {
    Logger.log('No drafts found.');
  } else {
    Logger.log('Drafts:');
    for (var i = 0; i < response.drafts.length; i++) {
      var draft = response.drafts[i];
      
      Logger.log('%s', draft.id);
      
       

      /*var parsed = JSON.parse(text);*/
      /*text = text['message']['payload'];
      var parsed = JSON.parse(text)['parts'];*/
      
      /*var text = Gmail.Users.Drafts.get('me', draft.id,
                                        {"format" : "raw"});
      var messageData = text['message']['raw'];
      var message = String.fromCharCode.apply(String, messageData);
      Logger.log('%s', message);*/
      
      
      var text = Gmail.Users.Drafts.get('me', draft.id);
      var bodyData = text['message']['payload']['parts'];
      var decodedData = [];
      for(o in bodyData) {
        
        var messageData = bodyData[o]['body']['data'];
        var message = String.fromCharCode.apply(String, messageData);

        decodedData.push(message);
      }
      Logger.log('%s', decodedData[0]);
      /*for (var i = 0; i < messageData.length; i++) {
        Logger.log('%s', text[i]);
      }*/

    }
  } 
}
