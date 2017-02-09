angular.module("myApp",["ionic","controllers"])

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider){
	//设置安卓机下面的tab选项卡，一直在下面
	$ionicConfigProvider.platform.android.tabs.position("bottom");
	$ionicConfigProvider.tabs.style('standard');

	//设置在安卓机下，头部的导航条标题一直居中
	$ionicConfigProvider.navBar.alignTitle('center');
	
	$stateProvider
	
	.state("tab",{
		url:"/tab",
		abstract:true,
		templateUrl:"template/tabs.html"
	})
	
	.state("tab.home",{
		url:"/home",
		views:{
			"tab-home":{
				templateUrl:"template/home.html",
				controller:"homeCtrl"
			}
		}	
	})
	
	.state("tab.classify",{
		url:"/classify",
		views:{
			"tab-classify":{
				templateUrl:"template/classify.html",
				controller:"classifyCtrl"
			}
		}	
	})
	
	.state("tab.cart",{
		url:"/cart",
		views:{
			"tab-cart":{
				templateUrl:"template/cart.html",
				controller:"cartCtrl"
			}
		}	
	})
	
	.state("tab.personal",{
		url:"/personal",
		views:{
			"tab-personal":{
				templateUrl:"template/personal.html",
				controller:"personalCtrl"
			}
		}	
	})
	
	.state("tab.login",{
		url:"/login",
		views:{
			"tab-personal":{
				templateUrl:"template/login.html",
				controller:"loginCtrl"
			}
		}	
	})
	
	.state("tab.register",{
		url:"/register",
		views:{
			"tab-personal":{
				templateUrl:"template/register.html",
				controller:"registerCtrl"
			}
		}	
	})
	
	.state("tab.more",{
		url:"/more",
		views:{
			"tab-more":{
				templateUrl:"template/more.html",
				controller:"moreCtrl"
			}
		}	
	})
	.state("detail",{
			url:"/detail",
			abstruct:true,
			templateUrl:"template/detail.html"
		})
		.state("detail.introduce",{
			url:"/introduce",
			views:{
				"introduce-tab":{
					templateUrl:"template/introduce.html",
					controller:"introduceController"
				}
			}
		})
		.state("detail.particular",{
			url:"/particular/:id",
			views:{
				"particular-tab":{
					templateUrl:"template/particular.html",
					controller:"particularController"
				}
			}
		})
		.state("detail.reals",{
			url:"/reals/:id",
			views:{
				"reals-tab":{
					templateUrl:"template/reals.html",
					controller:"realsController"
				}
			}
		})
	
	$urlRouterProvider.otherwise("tab/home");
})

	 .run(function($state,$rootScope,Inform){
       	  $rootScope.$on('$ionicView.beforeEnter',function(){
                 if($state.current.name == 'tab.home'){
                     $rootScope.ifShow = true;
                 }else{
                    $rootScope.ifShow = false;
               }
			   //初始化
			   //查看购物车
			   if($rootScope.data){
				   $rootScope.getData();
			   }else{
				   if($state.current.name == 'tab.cart'){
					   alert("请先登录");
				   }
			   }
          })
 })
