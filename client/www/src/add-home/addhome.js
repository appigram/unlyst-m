starterControllers

.controller('AddHomeCtrl', ['$scope', '$http', '$state', '$firebase', 'fireBaseData', 'homeSchema', function ($scope, $http, $state, $firebase, fireBaseData, homeSchema) {
        console.log("AddHomeCtrl");
        var homesDB = fireBaseData.refHomes();
        var homesRef = $firebase(homesDB).$asArray();
  //put upload function and inside promise
  homesRef.$loaded().then(function() {
      $scope.numbers = [1, 2, 3, 4, 5, 6];
      //$state.go("addHome.addHome1");
      $scope.homeSchema = homeSchema;
      console.log(homeSchema);
      $scope.home = {
          address: "",
          suiteNumber: "",
          city: "Toronto",
          province: "ON",
          postalCode: "",
          neighborhood: "",
          hideAddress: false,
          ownerCertify: false,
          homeType: $scope.homeSchema.homeTypes[0].value,
          buildingType: $scope.homeSchema.buildingTypes[0].value,
          buildingName: "",
          size: '',
          bedroomNum: $scope.homeSchema.bedRooms[0],
          bathroomNum: $scope.homeSchema.bathRooms[0],
          additionalSpace: [],
          parkingType: $scope.homeSchema.parkingType[0].value,
          parkingSpace: 0,
          outdoorSpace: [],
          orientation: [],
          amenity: [],
          yearBuilt: '',
          maintenanceFee: '',
          unlystPrice: '',
          houseId: -1,
          img: []
      };

      $scope.uploadFiles = [];

      $scope.uploadFile = function (files) {
          console.log(files[0]);
          var fd = new FormData();
          fd.append("file", files[0]);
          $scope.uploadFiles.push(fd);
      };

    console.log("load homeref ....");
    var length = homesRef.length;
    var id = homesRef[length-1].houseId;
    if (id >= length-1 ){
      //set houseID for new home
      $scope.home.houseId  = id + 1;
      //prepare for image upload
      $scope.uploadFile = function(files, name){
        console.log(files);
        console.log("houseID: " + $scope.home.houseId);
        console.log("files[0]: "+ files[0]);
          if (files[0]) {
              var fileReader = new FileReader();
              var file = files[0];
              fileReader.onload = function(e) {
                  $scope.$apply(function(){
                      $scope.imageSrc=fileReader.result;
                      console.log("res: " + fileReader.result)
                  });
              };
              if (file) {
                  console.log("readAsdata...");
                  fileReader.readAsDataURL(files[0]);
              } else {
                  $scope.imageSrc = '';
              }
              console.log("src: " + $scope.imageSrc);
          }

        var fd = new FormData();
        fd.append("file", files[0]);
        fd.append("houseId", $scope.home.houseId);
        fd.append("imageNum",name);
        $scope.uploadFiles.push(fd);
      };

      $scope.submitForm = function () {
          var count = 0;
        if ($scope.uploadFiles.length >0 ) {

            for (var i = 0; i < $scope.uploadFiles.length; i++) {
                var file = $scope.uploadFiles[i];
                if (file) {
                    var req = {
                        url: '/upload',
                        data: file,
                        method: 'POST',
                        withCredentials: true,
                        headers: {'Content-Type': undefined},
                        transformRequest: angular.identity
                    };

                    $http(req).success(function (data) {
                        var imgObj = {
                            caption: '',
                            url: ''
                        };
                        console.log("OK", data);
                        imgObj.url = data;
                        $scope.home.img.push({
                            "caption": "",
                            "url": data
                        });
                        count++;
                        console.log("i: " + count + " of" + ($scope.uploadFiles.length - 1 ));
                        if (count === ($scope.uploadFiles.length)) {
                            homesRef.$add($scope.home).then(function (ref) {
                                console.log("return is:  " + ref);
                            });
                        }
                    }).error(function (err) {
                        console.log(err);
                    });
                } else {
                    alert('empty File Selected');
                }
            }
        } else {
            alert('No File Selected');
        }
      };
    } else {
      console.log("Error: house ID is not correct!")
    }
      $scope.toggleSelection = function(item, selectionArr) {
          var idx = selectionArr.indexOf(item);
          // is currently selected
          if (idx > -1) {
              selectionArr.splice(idx, 1);
          }
          // is newly selected
          else {
              selectionArr.push(item)
          }
      };
      $scope.returnErrorMsg = false;
      $scope.goToPg1 = function () {
          console.log("gotopage1");
          $state.go('addHome.addHome1');
      };

      $scope.goToPg2 = function (validForm) {
          console.log("gotopage2");
          if(validForm) {
              $state.go('addHome.addHome2');
          } else {
              $scope.returnErrorMsg = true;
          }
      };
      $scope.goToPg3 = function () {
          console.log("goto hom3");
          $state.go('addHome.addHome3');
      };
      $scope.goToPg4 = function () {
          console.log("goto hom4");
          $state.go('addHome.addHome4');
      };
      $scope.addhome = function () {
          console.log("add home");
          $state.go('addHome.addHome1');
      };

  });
}]);