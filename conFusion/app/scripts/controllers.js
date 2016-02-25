'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

  $scope.tab = 1;
  $scope.filtText = '';
  $scope.showDetails = false;
  $scope.showMenu = false;
  $scope.message = "Loading ...";

  menuFactory.getDishes().query(
    function(response) {
      $scope.dishes = response;
      console.log($scope.dishes);
      $scope.showMenu = true;
    },
    function(response) {
      $scope.message = "Error: "+response.status + " " + response.statusText;
    });

  $scope.select = function(setTab) {
    $scope.tab = setTab;

    if (setTab === 2) {
      $scope.filtText = "appetizer";
    } else if (setTab === 3) {
      $scope.filtText = "mains";
    } else if (setTab === 4) {
      $scope.filtText = "dessert";
    } else {
      $scope.filtText = "";
    }
  };

  $scope.isSelected = function(checkTab) {
    return ($scope.tab === checkTab);
  };

  $scope.toggleDetails = function() {
    $scope.showDetails = !$scope.showDetails;
  };
}])

.controller('ContactController', ['$scope', function($scope) {

  $scope.feedback = {
    mychannel: "",
    firstName: "",
    lastName: "",
    agree: false,
    email: ""
  };

  var channels = [{
    value: "tel",
    label: "Tel."
  }, {
    value: "Email",
    label: "Email"
  }];

  $scope.channels = channels;
  $scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {

  $scope.sendFeedback = function() {

    console.log($scope.feedback);

    if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
      $scope.invalidChannelSelection = true;
      console.log('incorrect');
    } else {
      $scope.invalidChannelSelection = false;

      feedbackFactory.sendFeedback().save($scope.feedback, function(){
        console.log('feedback sent!');
      });

      $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
      };
      $scope.feedback.mychannel = "";
      $scope.feedbackForm.$setPristine();
    }
  };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

  $scope.dish = {};
  $scope.showDish = false;
  $scope.message = "Loading ...";

  menuFactory.getDishes().get({id:parseInt($stateParams.id, 10)}).$promise.then(
    function(response){
      $scope.dish = response;
      $scope.showDish = true;
    },
    function(response){
      $scope.message = "Error: " + response.status + " " + response.statusText;
    }
  );

}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {

  $scope.input = { name:"", rating:"5", comment:""};

  $scope.submitComment = function() {

    var today = new Date().toISOString();

    console.log($scope.input);

    $scope.mycomment = {
      rating: $scope.input.rating,
      comment: $scope.input.comment,
      author: $scope.input.name,
      date: today
    };

    $scope.dish.comments.push($scope.mycomment);

    menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);

    $scope.commentForm.$setPristine();

    $scope.input = { name:"", rating:"5", comment:""};
  };
}])

// implement the IndexController and About Controller here
.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory){

  $scope.showDish = false;
  $scope.showPromotion = false;
  $scope.showChef = false;

  $scope.dishMessage = "Loading dish...";
  $scope.promotionMessage = "Loading promotion ...";
  $scope.chefMessage = "Loading chef ...";

  menuFactory.getDishes().get({id:0}).$promise.then(
    function(response) {
      $scope.featuredDish = response;
      $scope.showDish = true;
    },
    function(response){
      $scope.dishMessage = "Error: " + response.status + " " + response.statusText;
    }
  );

  menuFactory.getPromotions().get({id:0}).$promise.then(
    function(response) {
      $scope.promotion = response;
      $scope.showPromotion = true;
    },
    function(response){
      $scope.promotionMessage = "Error: " + response.status + " " + response.statusText;
    }
  );

  corporateFactory.getLeaders().get({id:3}).$promise.then(
    function(response){
      $scope.executiveChef = response;
      $scope.showChef = true;
    },
    function(response){
      $scope.chefMessage = "Error: " + response.status + " " + response.statusText;
    }
  );
}])

.controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory){

  $scope.showLeader = false;
  $scope.leaderMessage = "Loading leadership...";

  corporateFactory.getLeaders().query().$promise.then(
    function(response){
      $scope.leaders = response;
      $scope.showLeader = true;
    },
    function(response){
      $scope.leaderMessage = "Error: " + response.status + " " + response.statusText;
    }
  );

  console.log($scope.leaders);
}])

;
