'use strict'

angular.module('allocations')
  .config(function ($stateProvider) {
    $stateProvider
      .state('configurations.allocations.calculations', {
        parent: 'configurations.allocations',
        url: '/calculations',
        templateUrl: 'app/configurations/allocations/calculations/index.html',
        controller: 'CalculationsController',
        controllerAs: 'calculationsController',
        resolve: {
          products: function (productService) {
            return productService.getAll()
              .then(function (productList) {
                return productList.map(function (item) {
                  return item._id
                })
              })
              .catch(function () {
                return []
              })
          },
          locationStates: function (locationService) {
            var keys = []
            keys.push(['2', 'NG']) // TODO: get this from auth
            return locationService.getByLevelAndAncestor(keys)
              .catch(function () {
                return []
              })
          },
          assumptionList: function (assumptionService) {
            return assumptionService.getAssumptions()
              .catch(function () {
                return []
              })
          }
        }
      })
  })
