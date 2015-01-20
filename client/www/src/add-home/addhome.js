starterControllers

.controller('AddHomeCtrl', ['$scope', '$http', '$state', '$firebase', 'fireBaseData', 'homeSchema', function ($scope, $http, $state, $firebase, fireBaseData, homeSchema) {

  console.log("AddHomeCtrl");
  $state.go("addHome.addHome1")
  var homesDB = fireBaseData.refHomes();
  var homesRef = $firebase(fireBaseData.refHomes()).$asArray();

  $scope.homeSchema = homeSchema;

  $scope.home = {
    address: "",
    suiteNumber: "",
    city: "Toronto",
    province: "ON",
    postalCode: "",
    neighborhood: "",
    hideAddress: false,
    homeType: $scope.homeSchema.homeTypes[0].value,
    buildingType: $scope.homeSchema.buildingTypes[0].value,
    buildingName: "",
    size: '',
    bedroomNum: $scope.homeSchema.bedRooms[0],
    bathroomNum: $scope.homeSchema.bathRooms[0],
    additionalSpace: [],
    parkingType: $scope.homeSchema.parkingType[0].value,
    parkingSpace: 0,
    storageLocker: false,
    outdoorSpace: [],
    orientation: [],
    amenity: [],
    yearBuilt: '',
    maintenanceFee: '',
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

  //put upload function and inside promise
  /*homesRef.$loaded().then(function() {

   var length = homesRef.length;
   var id = homesRef[length-1].houseId;
   if (id >= length-1 ){
   //set houseID for new home
   $scope.home.houseId  = id + 1;
   //prepare for image upload
   $scope.uploadFile = function(files, name){
   console.log(files);
   console.log("houseID: " + $scope.home.houseId);
   console.log(files[0]);
   var fd = new FormData();
   fd.append("file", files[0]);
   fd.append("houseId", $scope.home.houseId);
   fd.append("imageNum",name);
   $scope.uploadFiles.push(fd);
   };

   $scope.submitForm = function () {
   for (var i = 0; i < $scope.uploadFiles.length; i++) {
   var file = $scope.uploadFiles[i];
   if(file) {
   var req = {
   url:'/upload',
   data: file,
   method: 'POST',
   withCredentials:true,
   headers: {'Content-Type': undefined},
   transformRequest: angular.identity
   };

   $http(req).success(function(data) {
   var imgObj = {
   caption:'',
   url: ''
   }
   console.log("OK", data);
   imgObj.url = data;
   $scope.home.img.push ({
   "caption" : "",
   "url" : data
   });
   }).error(function(err){
   console.log(err);
   });
   }else {
   // No File Selected
   alert('No File Selected');
   }
   }
   };

   } else {
   console.log("Error: house ID is not correct!")
   }

   });*/

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

  $scope.goToPg2 = function () {
    console.log("gotopage2");
    $state.go('addHome.addHome2');
  };
  $scope.goToPg3 = function () {
    console.log("goto hom3");
    $state.go('addHome.addHome3');
  };
  $scope.addhome = function () {
    console.log("add home");
    $state.go('addHome');
  };

  $scope.submitHomes = function () {

  };
}]);