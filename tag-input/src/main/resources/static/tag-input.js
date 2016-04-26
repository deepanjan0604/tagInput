    var testApp = angular.module('tag-input', []);
testApp.controller('FormCtrl', function($scope) {
 
  $scope.list1 = [];
  return $scope.users = ["AngularJS", "Javascript", "Java", "Spring", "PHP", "Ruby"];
   
});

testApp.directive('dhTag', function() {
  return {
    restrict: 'E',
    scope: {
      inputTags: '=taglist',
      autocomplete: '=autocomplete'
    },
    link: function($scope, element, attrs) {
      $scope.defaultWidth = 490;
      $scope.tagText = [];
      $scope.placeholder = attrs.placeholder;
      

      if ($scope.autocomplete) {
        $scope.autocompleteFocus = function(event, ui) {
          $(element).find('input').val(ui.item.value);
          return false;
        };
        $scope.autocompleteSelect = function(event, ui) {
          $scope.$apply('tagText=\'' + ui.item.value + '\'');
          $scope.$apply('addTag()');
          return false;
        };
        $(element).find('input').autocomplete({
          minLength: 1,
          source: function(request, response) {
            var item;
            return response(function() {
              var i, len, ref, results;
              ref = $scope.autocomplete;
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {

                item = ref[i];
                if (item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1) {
                  results.push(item);
                }
              }

              return results;
            }());
          },
          focus: function(_this) {
            return function(event, ui) {
              return $scope.autocompleteFocus(event, ui);
            };
          }(this),
          select: function(_this) {
            return function(event, ui) {
              return $scope.autocompleteSelect(event, ui);
            };
          }(this)
        });
      }

      $scope.tagArray = function() {
        if ($scope.inputTags === undefined) {
          return [];
        }
        return $scope.inputTags.toString().split(',').filter(function(tag) {
         return tag !== "";
        });
      };
      $scope.addTag = function() {
    
        var tagArray;
        if ($scope.tagText.length === 0) {
          return;
        }
        tagArray = $scope.tagArray();
        tagArray.push($scope.tagText);
        $scope.inputTags = tagArray.join(',');
        return $scope.tagText = [];
      // return $scope.tagText=tagArray;
      };
      $scope.deleteTag = function(key) { 
        var tagArray;
        tagArray = $scope.tagArray();
        if (tagArray.length > 0 && $scope.tagText.length === 0 && key === undefined) {
          tagArray.pop();
        } else {
          if (key !== undefined) {
            tagArray.splice(key, 1);
          }
        }
       return $scope.inputTags = tagArray.join(',');
    // return $scope.inputTags=tagArray;
      };



      $scope.$watch('tagText', function(newVal, oldVal) {
        var temp;
        if (!(newVal === oldVal && newVal === undefined)) {
         //temp = $("<span>" + newVal + "</span>").appendTo("body");
          $scope.inputWidth = temp.width() ;
          if ($scope.inputWidth < $scope.defaultWidth) {
            $scope.inputWidth = $scope.defaultWidth;
          }
          return temp.remove();
        }
      });



      element.bind("keydown", function(e) {
        var key;
        key = e.which;
        if (key === 9 || key === 13) {
          e.preventDefault();
        }
        if (key === 8) {
        //  $("div").find('.dh-tag-ctn .input-tag').css({"background-color":"red"});
        // alert("Delete a tag");
          if (key === 8) {
            return $scope.$apply('deleteTag()');
          }
        }
      });

      element.bind("keyup", function(e) {
        var key;
        key = e.which;
        if (key === 9 || key === 13 || key === 188) {
          e.preventDefault();
          return $scope.$apply('addTag()');
        }
      });
     },
      //templateUrl: "tagInputTemplate.html",
     template: "<div class='dh-tag-ctn'>" +
      "<div class='input-tag' data-ng-repeat=\"tag in tagArray() track by $index\" ng-class='tag' ><span>{{tag}}</span>" +
       "<div class='delete-tag' data-ng-click='deleteTag($index)'>&times;</div></div>" +
      "<input type='text' data-ng-style='{width: inputWidth}' data-ng-model='tagText' placeholder='{{placeholder}}' /></div>"
  };
});