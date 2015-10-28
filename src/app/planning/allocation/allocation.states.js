'use strict'

angular.module('planning')
  .config(function ($stateProvider, authProvider) {
    $stateProvider.state('planning.allocation', {
      url: '/allocation/:roundId',
      templateUrl: 'app/planning/allocation/index.html',
      controller: 'DeliveryAllocationCtrl',
      controllerAs: 'daCtrl',
      resolve: {
        authorization: function ($q, authService, $stateParams) {
          var role = authService.roundToStateRole($stateParams.roundId)
          var auth = authProvider.requireUserWithRoles([role])
          return auth(authService, $q)
        },
        presentations: function (productPresentationService, log) {
          return productPresentationService.getAll()
            .catch(function (err) {
              log.error('productPresentionError', err)
              return []
            })
        },
        deliveryRound: function (log, planningService, $stateParams) {
          function handleError (err) {
            log.error('deliveryRoundNotFound', err)
            throw err // block $state transition
          }
          return planningService.getByRoundId($stateParams.roundId)
            .catch(handleError)
        },
        facilityAllocationInfo: function (deliveryAllocationService, $stateParams) {
          function handleError () {
            return {
              rows: [],
              productList: [],
              lgaList: [],
              presentationsByProduct: {}
            } // default value
          }
          return deliveryAllocationService.getAllocationBy($stateParams.roundId)
            .catch(handleError)
        },
        allocationTemplates: function (assumptionService) {
          return assumptionService.getAll()
            .catch(function () {
              return []
            })
        }
      }
    })
  })
