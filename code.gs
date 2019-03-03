function getScore(e) {
  // const URL = 'http://yuebing.cs.virginia.edu:8080/api/score';
  const URL = 'http://34.73.170.90/api/score';
  const OTHER_URL = 'http://politeness.cornell.edu/score-politeness';

  var response = Gmail.Users.Drafts.list('me');
  if (response.drafts.length == 0) {
    Logger.log('No drafts found.');
  } else {
    Logger.log('Drafts:');
    var draft = response.drafts[0];

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

    var responses = UrlFetchApp.fetchAll([{
      'url': URL,
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify({'text': decodedData[0], 'email': 'naitian@umich.edu'})
    }, {
      'url': OTHER_URL,
      'method': 'post',
      'payload': {'text': decodedData[0]}
    }])

    var response = responses[0];
    var polite_score = responses[1];

    /*
    var response = UrlFetchApp.fetch(URL, {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify({'text': decodedData[0], 'email': 'naitian@umich.edu'})
    })
    */

    var polite_score

    //var polite_score = UrlFetchApp.fetch(OTHER_URL, {
    //  'method': 'post',
    //  'payload': {'text': decodedData[0]}
    //})

    // {"confidence": "84%", "isrequest": true, "label": "impolite", "text": "what the heck does that mean"}

    response = JSON.parse(response).indicators;
    polite_score = JSON.parse(polite_score);
    Logger.log(response);

    var positive_advice = {
      'feature_politeness_==1st_person==': "Try to use first person to bring yourself into the conversation. This shows that you are on the same side.",
      'feature_politeness_==Please_start==': "Please say please :)",
      'feature_politeness_==Hedges==': "Using hedges such as \"If you'd like to...\" or \"If you wouldn't mind...\" makes your request seem more polite.",
      'feature_politeness_==Deference==': "Showing deference is polite.",
      'feature_politeness_==1st_person_start==': "Try to use first person to bring yourself into the conversation. This shows that you are on the same side.",
      'feature_politeness_==Please==': "Please say please :)",
      'feature_politeness_==1st_person_pl.==': "Try to use first person to bring yourself into the conversation. This shows that you are on the same side.",
      'feature_politeness_==Gratitude==': "Remember to thank the recipient.",
      'feature_politeness_==SUBJUNCTIVE==': "Using subjunctives / hypotheticals such as \"if I were...\" makes your tone seem less harsh.",
      'feature_politeness_==Indirect_(btw)==': "Using less direct language helps you seem less accusatory or mean.",
      'feature_politeness_==Indirect_(greeting)==': "Using less direct language helps you seem less accusatory or mean."
    }

    var negative_advice = {
      'feature_politeness_==2nd_person_start==': "Starting with the second person has the potential to sound accusatory.",
      'feature_politeness_==2nd_person==': "Using the second person distances yourself from that person.",
      'feature_politeness_==Direct_question==': "Direct questions can seem blunt.",
      'feature_politeness_==Direct_start==': "Don't launch straight into the email. Try to begin with a greeting.",
      'feature_politeness_==Factuality==': "Often times, just stating facts directly isn't the best way to help your case.",
    }


    var politenessStatus = ["Don't be a jerk", "You could do better", "It's kind of hard to tell", "That's pretty good", "Great job!"]

    var politeness = parseInt(polite_score.confidence.substring(0, 2));
    if (polite_score.label === 'impolite') politeness = 100 - politeness;
    Logger.log(politeness);
    var politenessMessage = "";
    if (politeness < 20) politenessMessage = politenessStatus[0];
    else if (politeness < 40) politenessMessage = politenessStatus[1];
    else if (politeness < 60) politenessMessage = politenessStatus[2];
    else if (politeness < 80) politenessMessage = politenessStatus[3];
    else politenessMessage = politenessStatus[4];

    if (polite_score.label === 'neutral') politenessMessage = "This could really swing either way.";


    var dos = {};
    for (var key in positive_advice) {
      if (!response[key]) {
        dos[positive_advice[key]] = null;
      }
    }

    var donts = {};
    for (var key in negative_advice) {
      Logger.log(key);
      Logger.log(response[key]);
      if (!!response[key]) {
        Logger.log('asdflladsgsa');
        donts[negative_advice[key]] = null;
      }
    }

    var adviceSection = CardService.newCardSection();
    for (var wisdom in dos) {
      if (!wisdom) continue;
      adviceSection.addWidget(CardService.newTextParagraph()
                              .setText("<b>DO: </b>" + wisdom));
    }


    for (var wisdom in donts) {
      if (!wisdom) continue;
      adviceSection.addWidget(CardService.newTextParagraph()
                              .setText("<b>DON'T: </b>" + wisdom));
    }

    Logger.log(donts);

    var exampleCard = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
              .setTitle(politenessMessage))
    .addSection(adviceSection)
    .build();   // Don't forget to build the Card!
    return [exampleCard];
  }
}
