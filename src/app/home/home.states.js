'use strict'

angular.module('home')
  .config(function (
    $stateProvider,
    config,
    authProvider
  ) {
    $stateProvider.state('home', {
      parent: 'index',
      url: '/',
      controller: 'HomeCtrl',
      controllerAs: 'homeCtrl',
      templateUrl: 'app/home/home.html',
      resolve: {
        authentication: authProvider.requireAuthenticatedUser,
        roundReport: function (deliveryRoundService, userStateService, authService) {
          var key = ''
          var roundInfo = []
          return authService.getCurrentUser()
            .then(function(user){
              var state = userStateService.getUserSelectedState(user.userCtx.name)
              return deliveryRoundService.getLatestBy(state)
            })
            .then(function (ri) {
              roundInfo = ri
              key = roundInfo.latestRoundId
              return deliveryRoundService.getReport(key)
                .then(function (rndReport) {
                  rndReport.deliveryRoundID = key
                  rndReport.roundInfo = roundInfo
                  return rndReport
                })
            })
            .catch(function () {
              var defaultReport = deliveryRoundService.getDefaultReport()
              defaultReport.deliveryRoundID = key
              defaultReport.status = []
              defaultReport.roundInfo = roundInfo
              return defaultReport
            })
        }
      },
      data: {
        label: 'Home',
        roles: config.roles.admin.roles.concat(config.roles.user.roles)
      }
    })
  })
