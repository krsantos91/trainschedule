// Initialize Firebase
var config = {
  apiKey: "AIzaSyDnjRX2b8XC6nXxeW7wMlvCM5gla26cxQo",
  authDomain: "train-info-app.firebaseapp.com",
  databaseURL: "https://train-info-app.firebaseio.com",
  projectId: "train-info-app",
  storageBucket: "train-info-app.appspot.com",
  messagingSenderId: "311432020281"
};
firebase.initializeApp(config);
var database = firebase.database();

$("#SubmitTrain").on("click",function(){

  event.preventDefault();
  var name = $("#currentTrainName").val().trim();
  var destination = $("#currentDestination").val().trim();
  var firsttrain = $("#currentFirstTrain").val().trim();
  var frequency = $("#currentFrequency").val().trim(); 
  $("input").val("");

  database.ref().push({
    name: name,
    destination: destination,
    firsttrain: firsttrain,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

database.ref().on("child_added", function(snapshot){
  var firstTrainConverted = moment(snapshot.val().firsttrain,"hh:mm");
  var timeSinceFirstTrain = moment().diff(firstTrainConverted,"minutes");
  var minutesSinceLastTrain = timeSinceFirstTrain % parseInt(snapshot.val().frequency);
  var minutesTilNextTrain = parseInt(snapshot.val().frequency) - minutesSinceLastTrain;
  var nextArrival = moment().add(minutesTilNextTrain, "m");
  $("#TrainName").append('<div class="row">'+ snapshot.val().name +'</div>');
  $("#Destination").append('<div class="row">'+ snapshot.val().destination +'</div>');
  $("#Frequency").append('<div class="row">'+ snapshot.val().frequency +'</div>');
  $("#NextArrival").append('<div class="row">'+ nextArrival.format("hh:mm A") +'</div>');
  $("#MinutesAway").append('<div class="row">'+ minutesTilNextTrain +'</div>');
});

