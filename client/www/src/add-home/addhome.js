starterControllers

.controller('AddHomeCtrl', ['$scope', '$rootScope', '$http', '$state', '$firebase', 'fireBaseData', 'homeSchema',
  'geocoding', function ($scope, $rootScope, $http, $state, $firebase, fireBaseData, homeSchema, geocoding) {

    if (!$rootScope.authData) {
      $state.go('login');
      $rootScope.notify('Please login to add your home.');
    }

    var homesDB = fireBaseData.refHomes();
    var homesRef = $firebase(homesDB).$asArray();
    //put upload function and inside promise
    homesRef.$loaded().then(function () {

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
        buildName: "",
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
        img: [],
        lat:'',
        lng:''
      };
      $scope.getGeo = function () {
        if(!$scope.home.address || $scope.home.address.trim()===''){
          return;
        }
        geocoding.getData($scope.home.address, function(addressInfo){
          $scope.home.postalCode = addressInfo.postal_code;
          $scope.home.neighborhood = addressInfo.neighborhood;
          $scope.home.lat = addressInfo.lat;
          $scope.home.lng = addressInfo.lng;
          $scope.$apply();
        });
      };
      $scope.uploadFiles = [];

      console.log("load homeref ....");
      var length = homesRef.length;
      var id = homesRef[length - 1].houseId;
      if (id >= length - 1) {
        //set houseID for new home
        $scope.home.houseId = id + 1;

        //prepare for image upload
        var imgFiles = [];
        $scope.imgPaths = [];

        //save each file in order and get thumbnails for them
        $scope.uploadFile = function (files, index) {
          if (files[0]) {
            imgFiles[index] = files[0];
            var fileReader = new FileReader();
            var file = files[0];

            fileReader.onloadend = function (e) {
              $scope.$apply(function () {
                $scope.imgPaths[index] = fileReader.result;
              });
            };
            if (file) {
              fileReader.readAsDataURL(files[0]);
            } else {
              $scope.imgPaths[index] = '';
            }
          }
        };

        $scope.removeImg = function (index) {
          if (index > -1 && imgFiles[index] && $scope.imgPaths[index]) {
            imgFiles.splice(index, 1, '');
            $scope.imgPaths.splice(index, 1, '');
          } else {
            console.log("Error: failed ro remove image");
          }
        };

        $scope.submitForm = function () {
          //remove Toronto from the address, need a better way to handle multiple cities
          $scope.home.address = $scope.home.address.split(',')[0];
          // handel convert to formdata
          for (var j = 0; j < imgFiles.length; j++) {
            if (imgFiles[j]) {
              var fd = new FormData();
              fd.append("file", imgFiles[j]);
              fd.append("houseId", $scope.home.houseId);
              fd.append("imageNum", j);
              $scope.uploadFiles.push(fd);
            }
          }

          var count = 0;
          if ($scope.uploadFiles.length > 0) {

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
                    homesDB.child($scope.home.houseId).set($scope.home);
                    //homesRef.$add($scope.home).then(function (ref) {
                    //  console.log("return is:  " + ref);
                    //});
                    //console.log('fake upload.....');
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
      $scope.toggleSelection = function (item, selectionArr) {
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
        if (validForm) {
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
      $scope.clickMe = function() {
          console.log("clickme!");
      }

    });
  }]);