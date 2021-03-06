var playerHand;
var dealerHand;
var gameRules;
var newDeck;

var Card = function(suit, number) {
  var suit = suit;
  var number = number;
  this.getNumber = function() {
    return number;
  };

  this.getSuit = function() {
    var suitName = "";
    switch(suit) {
      case 1:
      suitName = 'hearts';
      break;
      case 2:
      suitName = 'diamonds';
      break;
      case 3:
      suitName = 'clubs';
      break;
      case 4:
      suitName = 'spades';
      break;
    }
    return suitName;
  };

  this.getName = function() {
    var cardName = "";
    switch(number) {
      case 1:
      cardName = "ace";
      break;
      case 11:
      cardName = "jack";
      break;
      case 12:
      cardName = "queen";
      break;
      case 13:
      cardName = "king";
      break;
      default:
      cardName = number;
      break;
    }
    return cardName + "_of_" + this.getSuit();
  };

  this.getValue = function() {
    if (number > 10) {
      return 10;
    }
    else if (number === 1) {
      return 11;
    }
    else {
      return number;
    }
  };
};

var Deck = function() {

  this.deckIndex = [];

  this.createDeck = function() {
    var suit = "";
    var number = "";
    for (var i = 0; i < 52 ;i++) {
      suit = (i % 4) + 1;
      number = (i % 13) +1;
      this.deckIndex.push(new Card(suit,number));
    }
    return this.deckIndex;
  }

  this.dealCard = function() {
    var randIndex = Math.floor(Math.random() * this.deckIndex.length);
    var dealtCard = this.deckIndex[randIndex];
    this.deckIndex.splice(randIndex, 1);
    return dealtCard;
  }
};

var Hand = function() {

  var cardScores = [];

  this.getHand = function() {
    return cardScores;
  };

  this.totalScore = function() {
    var sumScores = 0;
    var aces = 0;
    for (var i = 0; i < cardScores.length; i++) {
      if (cardScores[i] === 11) {
        aces += 1;
      }
      sumScores = sumScores + cardScores[i];
    }
    while(sumScores > 21 && aces !== 0) {
      sumScores -= 10;
      aces -= 1;
    }
    return sumScores;
  };

  this.cardCount = function() {
    return cardScores.length;
  };

  this.addCard = function(newCard) {
    if (cardScores.length > 5) {
    } else {
      cardScores.push(newCard);
    }
  };
};

/*After each deal and each hit, checkForEndGame.gameRules(new endGame). gameRules
will initially have endGameBoolean set to false but is changed to true if game should end.
i.e. if any of the conditions hold, the player is unable to hit anymore and
go straight to outcome of game.
*/

$(document).ready(function() {

  $("#deal").hover(function() {
        $(this).css('cursor','pointer');
    });
    $("#hit").hover(function() {
          $(this).css('cursor','pointer');
      });
      $("#stick").hover(function() {
        $(this).css('cursor','pointer');
    });

  newDeck = new Deck();

  $("#deal").on('click', function() {

    gameRules = new endGame();
    newDeck.createDeck();
    playerHand = new Hand();
    dealerHand = new Hand();

    var playerCardIndex1 = newDeck.dealCard();
    var playerCard1 = playerCardIndex1.getName();
    var pCard1Score = playerCardIndex1.getValue();
    playerHand.addCard(pCard1Score);
    var dealerCardIndex1 = newDeck.dealCard();
    var dealerCard1 = dealerCardIndex1.getName();
    var dCard1Score = dealerCardIndex1.getValue();
    dealerHand.addCard(dCard1Score);
    var playerCardIndex2 = newDeck.dealCard();
    var playerCard2 = playerCardIndex2.getName();
    var pCard2Score = playerCardIndex2.getValue();
    playerHand.addCard(pCard2Score);
    var dealerCardIndex2 = newDeck.dealCard();
    var dealerCard2 = dealerCardIndex2.getName();
    var dCard2Score = dealerCardIndex2.getValue();
    dealerHand.addCard(dCard2Score);

    $("#playerCard1").append('<img src="assets/images/' + playerCard1 + '.png" width="130" height="180" />');
    $("#playerCard2").append('<img src="assets/images/' + playerCard2 + '.png" width="130" height="180" />');
    $("#dealerCard1").append('<img src="assets/images/' + dealerCard1 + '.png" width="130" height="180" />');
    $("#dealerCard2").append('<img src="assets/images/' + dealerCard2 + '.png" width="130" height="180" />');
    $("#deal").off('click');

    gameRules.checkForEndGame();
  });
  // Make it so that once the deal button has been clicked, it cannot be clicked again until
  //there is an outcome for the game. Also that the hit and stick buttons can only be pressed
  //once there is a game in play. i.e. after the deal button has been clicked.

  $("#hit").on('click', function() {
    //var gameTable = $("#game-table");
    var pNewCard = $("<div class='card'></div>");
    var hitCardIndex = newDeck.dealCard();
    var hitCard = hitCardIndex.getName();
    var hitCardScore = hitCardIndex.getValue();

    playerHand.addCard(hitCardScore);
    pNewCard.append('<img src="assets/images/' + hitCard + '.png" width="130" height="180" />');
    pNewCard.appendTo(players);
    gameRules.checkForEndGame();
  });

  $("#stick").on('click', function() {
    gameRules.setGameOver();
    gameRules.checkForEndGame();
  });
});

var endGame = function() {

  this.endGameBoolean = false; //changed to true if the game is over

  this.setGameOver = function(){
    this.endGameBoolean = true;
  }

  this.checkForEndGame = function() {
    //This function is to check if any game ending conditions have been met and end the game if they have
    if (playerHand.totalScore() >= 21) {
      this.setGameOver();  //If player has less than or equal 21 and player has 5 cards, set endGameBoolean to true
    } else if (playerHand.cardCount() >= 5) {
      this.setGameOver(); //If player has over 21, set endGameBoolean to true
    }
    gameRules.gameResult();
  };

  this.gameResult = function(){
    //This function checks if the endGameBoolean has been set to true and if it has,
    //deal the dealer his remaining cards and then check scores with winner function
    if(this.endGameBoolean === true){

      // make second dealer card face up

      $("#hit").off('click');
      $("#stick").off('click')

      while (dealerHand.totalScore() < 17 && dealerHand.cardCount() < 5 && playerHand.totalScore() <= 21) {
        var dNewCard = $("<div class='card'></div>");
        var dHitCardIndex = newDeck.dealCard();
        var dHitCard = dHitCardIndex.getName();
        var dHitCardScore = dHitCardIndex.getValue();
        dealerHand.addCard(dHitCardScore);
        dNewCard.append('<img src="assets/images/' + dHitCard + '.png" width="130" height="180" />');
        dNewCard.appendTo(dealers);
        }
      this.winner();
    }
    this.winner = function() {
      var playerScore = playerHand.totalScore();
      var dealerScore = dealerHand.totalScore();
      this.outcome = "";
      if (playerScore > 21 || dealerScore === 21) {
        this.outcome = "You lose!";
      }
      else if (playerScore <= 21 && playerHand.cardCount() === 5) {
        this.outcome = "5 card trick! You win!";
      }
      else if (dealerScore > 21 || playerScore === 21 || playerScore > dealerScore) {
        this.outcome = "You win!"
      }
      else if (playerScore < dealerScore) {
        this.outcome = "You lose!";
      }
      else if (playerScore === dealerScore) {
        this.outcome = "It's a tie!";
      }else{
        this.outcome = "Thanks for playing";
      }
      $("#deal").on('click', function() {
         location.reload();
      });
      $("#outcome").append(this.outcome);
    }
  };
}
