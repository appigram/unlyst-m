starterControllers

.controller('AddHomeCtrl', ['$scope', '$rootScope', '$http', '$state', '$firebase', 'fireBaseData', 'homeSchema',
  'geocoding', '$timeout', function ($scope, $rootScope, $http, $state, $firebase, fireBaseData, homeSchema, geocoding, $timeout) {

    var homesDB = fireBaseData.refHomes();
    //var homesRef = $firebase(homesDB).$asArray();
    if (!fireBaseData.ref().getAuth()) {
      $state.go('login');
      $rootScope.notify('Please login to add your home.');
    }

    $scope.homeSchema = homeSchema;
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
      lat: '',
      lng: ''
    };
    $scope.getGeo = function () {
      if (!$scope.home.address || $scope.home.address.trim() === '') {
        return;
      }
      geocoding.getData($scope.home.address, function (addressInfo) {
        $scope.home.postalCode = addressInfo.postal_code;
        $scope.home.neighborhood = addressInfo.neighborhood;
        $scope.home.lat = addressInfo.lat;
        $scope.home.lng = addressInfo.lng;
        $scope.$apply();
      });
    };
    $scope.uploadFiles = [];
    //set houseID for new home
    $scope.home.houseId = -1;
    homesDB.child('maxHomeID').on("value", function(snapshot) {
      $scope.home.houseId = snapshot.val() + 1;
    });

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
              console.log("OK", data);

              $scope.home.img[data.index] = {
                "caption": "",
                "url": data.url
              };
              count++;
              console.log("i: " + count + " of" + ($scope.uploadFiles.length  ));
              if (count === ($scope.uploadFiles.length)) {
                homesDB.child($scope.home.houseId).set($scope.home);
                homesDB.child('maxHomeID').set($scope.home.houseId);
                //homesRef.$add($scope.home).then(function (ref) {
                //  console.log("return is:  " + ref);
                //});
                //console.log('fake upload.....');
                $state.go('addHome.success');
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
      $state.go('addHome1');
    };

    $scope.goToPg2 = function (validForm) {
      if (validForm) {
        $state.go('addHome2');
      } else {
        $scope.returnErrorMsg = true;
      }
    };
    $scope.goToPg3 = function () {
      $state.go('addHome3');
    };
    $scope.goToPg4 = function () {
      $state.go('addHome4');
    };
    $scope.addhome = function () {
      $state.go('addHome1');
    };
    $scope.goToHome = function () {
      $state.go('home');
    }

  }]);