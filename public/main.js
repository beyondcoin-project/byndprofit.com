let app = angular.module('app-calculator', []);

app.controller('mainController', function($scope, $http){

    $scope.reward = 50;
    $scope.difficulty = 311;

    $scope.hashingPower = 35;
    $scope.machineWattage = 150;
    $scope.powerCost = 0.12;

    $scope.beyondcoin = {
        time: Date.now(),
        exchangerates: {
            usd: 0.00029481,
            gbp: 0.00023,
            eur: 0.00027
        }
    };

    $scope.hashingUnitOptions = {
        availablehashingUnits: [
            {value: 1, name: 'H/s'},
            {value: 1000, name: 'KH/s'},
            {value: 1000000, name: 'MH/s'},
            {value: 1000000000, name: 'GH/s'},
            {value: 1000000000000, name: 'TH/s'},

        ],
        selectedHashingUnit: {value: 1000, name: 'KH/s'}
    };

    $http.get('https://api.coingecko.com/api/v3/simple/price?ids=beyondcoin&vs_currencies=usd%2Cgbp%2Ceur').then(function (response) {

        let cgko = response.data;

        $scope.beyondcoin.exchangerates.usd = parseFloat(cgko.beyondcoin.usd.replace(',',''));
        $scope.beyondcoin.exchangerates.gbp = parseFloat(cgko.beyondcoin.gbp.replace(',',''));
        $scope.beyondcoin.exchangerates.eur = parseFloat(cgko.beyondcoin.eur.replace(',',''));

    });

    $http.get('http://byndexplorer.com/api/getdifficulty').then(function (response) {
        $scope.difficulty = parseFloat(response.data);
    });

    $scope.getBYNDPerDay_Exact = function () {
        return 86400 / ($scope.difficulty * (Math.pow(2,48)/65535) / ($scope.hashingPower * $scope.hashingUnitOptions.selectedHashingUnit.value)) * $scope.reward;
    };

    $scope.getBYNDPerDay = function () {
        let temp = $scope.getBYNDPerDay_Exact();
        return temp.toPrecision(2);
    };

    $scope.getUSDPerDay = function () {
        let temp = $scope.getBYNDPerDay_Exact();
        temp *= $scope.beyondcoin.exchangerates.usd;
        return temp.toFixed(2);
    };

    $scope.getGBPPerDay = function () {
        let temp = $scope.getBYNDPerDay_Exact();
        temp *= $scope.beyondcoin.exchangerates.gbp;
        return temp.toFixed(2);
    };

    $scope.getEURPerDay = function () {
        let temp = $scope.getBYNDPerDay_Exact();
        temp *= $scope.beyondcoin.exchangerates.eur;
        return temp.toFixed(2);
    };

    $scope.getPowerCostPerDay = function () {
        let temp = $scope.machineWattage * $scope.powerCost / 1000 * 24;
        return temp.toFixed(2);
    };

    $scope.getProfitPerDay = function () {
        let temp = $scope.getUSDPerDay() - $scope.getPowerCostPerDay();
        return temp.toFixed(2);
    };

});
