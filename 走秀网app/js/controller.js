angular.module("controllers",["services"])

.controller("myController",function($scope,Intro,$stateParams,$interval,$state,$rootScope,Inform){
		$scope.toDetail = function(id){
        	Intro.DL(id);
        	$scope.id = id;
        	$state.go('detail.introduce');
   	 	}	
   	 	Intro.DL($scope.id);
		$scope.$on("dL",function(event,data){
			$scope.dlList= data[0];	
			$scope.realData =JSON.parse(data[0].imgsUrl);
//			console.log($scope.dlList);
			if($scope.dlList.discount == 0){
				$scope.realPrice = $scope.dlList.price;
			}else{
				$scope.realPrice =parseInt($scope.dlList.price/($scope.dlList.discount/10));
			}
		})
        //倒计时
        var time=432000;
       
        var timer = $interval(function(){
        	var day=parseInt(time/86400);
	        var hour =parseInt(time/3600)%24;
	        var minute = parseInt((time%3600)/60);
	        var second = time%60;
        	$scope.codeText="距离结束时间："+day+"天"+hour+"时"+minute+"分"+second+"秒";	
        	time--;
        	if(time==0){
        		$scope.codeText="已过期";
        		$interval.cancel(timer);
        	}
        },1000)
	//获取数据
        $rootScope.getData = function(){
            $rootScope.cartList = {};
            Inform.getCart($rootScope.data.userID);
            $rootScope.$on("getCartData", function (event, data) {
                $rootScope.cartList = data;
                //总计
                $rootScope.num = $rootScope.getTotal().totalNum;
                $rootScope.strNum = $rootScope.num < 99 ? $rootScope.num : (99 + "+");
                //console.log($rootScope.num);
            })
        }
        //总计
        $rootScope.getTotal = function(){
            var totalNum = 0,totalPrice = 0;
            for(var i=0;i<$rootScope.cartList.length;i++){
                totalNum += parseInt($rootScope.cartList[i].number);
                totalPrice += $rootScope.cartList[i].number * $rootScope.cartList[i].price;
            }
            $rootScope.totalData = {
                totalNum:totalNum,
                totalPrice:totalPrice
            };
            return $rootScope.totalData;
        }
		
})

.controller("homeCtrl",function($scope,$rootScope,goods,$http,Intro,$state,Inform,$ionicSlideBoxDelegate){

	//轮播图图片的获取
        goods.banner();
        $scope.$on('ban',function(event,data){
            $scope.bannerLists = data;
			$ionicSlideBoxDelegate._instances[0].update();
            $ionicSlideBoxDelegate.loop(true);
        })

        goods.goodList();
        $scope.realPrice = [];
        $scope.$on('goods',function(event,data){
        	
        	for(var i=0;i<data.length;i++){
        		if(data[i].discount == 0){
				$scope.realPrice.push(data[i].price);
			}else{
				$scope.realPrice.push(parseInt(data[i].price/(data[i].discount/10)));
			}
        	}
            $scope.goodList = data;        
//             console.log(data);
        })	
//      console.log($scope.realPrice)
//      console.log($rootScope.data.userID);
    //加入购物车
    $scope.addToCar = function(goodid){
        if($rootScope.data){
            Inform.getCart($rootScope.data.userID);
            var num = 1;
            var CartData = $rootScope.cartList;
            for(var i=0;i<CartData.length;i++){
                if(CartData[i].goodsID == goodid && CartData[i].number<999){
                    num += parseInt(CartData[i].number);
                }
            }
            Inform.updateCart($rootScope.data.userID,goodid,num);
            $rootScope.num = $rootScope.getTotal().totalNum;
            $rootScope.strNum = $rootScope.num < 99 ? $rootScope.num : (99 + "+");
        }else{
            alert("请先登录")
        }
    }
    


})

.controller("classifyCtrl",function($scope,cls,$ionicHistory){

	cls.clsList();
        $scope.$on('clsLis',function(event,data){
            $scope.clsLists = data;
        })

        $scope.flag = true;
        $scope.icoR = false;
        $scope.icoD = true;
        $scope.showClass = function(){
           if($scope.flag){
               $scope.flag = false;
               $scope.icoR = true;
               $scope.icoD = false;
           }else{
               $scope.flag = true;
               $scope.icoR = false;
               $scope.icoD = true;
           }

        };

        //返回
        $scope.back = function(){
            $ionicHistory.goBack();

        }
	
})

.controller("cartCtrl",["$scope","$rootScope","$ionicHistory","Inform",function($scope,$rootScope,$ionicHistory,Inform){
    //点击按钮减少对应商品数量
    $scope.decBtn = function(index){
        var data = $rootScope.cartList[index];
        var num = data.number;
        if(--num <= 0){
            num = 0;
            $rootScope.cartList.splice(index,1);
        }else{
            $rootScope.cartList[index].number = num;
        }
        //更新购物车
        Inform.updateCart($rootScope.data.userID,data.goodsID,num);
        $rootScope.num = $rootScope.getTotal().totalNum;
        $rootScope.strNum = $rootScope.num < 99 ? $rootScope.num : (99 + "+");
    };
    //增加
    $scope.addBtn = function(index){
        var data = $rootScope.cartList[index];
        var num = data.number;
        if(++num>999){
            num = 999;
        }
        $rootScope.cartList[index].number = num;
        //更新购物车
        Inform.updateCart($rootScope.data.userID,data.goodsID,num);
        $rootScope.num = $rootScope.getTotal().totalNum;
        $rootScope.strNum = $rootScope.num < 99 ? $rootScope.num : (99 + "+");
    }
    //删除
    $scope.delBtn = function(index) {
        //更新购物车
        Inform.updateCart($rootScope.data.userID, $rootScope.cartList[index].goodsID, 0);
        $rootScope.cartList.splice(index, 1);
        $rootScope.num = $rootScope.getTotal().totalNum;
        $rootScope.strNum = $rootScope.num < 99 ? $rootScope.num : (99 + "+");
    }
    //更改--数量
    $scope.changeNum = function(index){
        var num = $rootScope.cartList[index].number;
        if(num <1){
            num = 1;
        }else if(num>999){
            num = 999;
        }
        Inform.updateCart($rootScope.data.userID,$scope.cartList[index].goodsID,num);
        $rootScope.num = $rootScope.getTotal().totalNum;
        $rootScope.strNum = $rootScope.num < 99 ? $rootScope.num : (99 + "+");
    }
    $scope.gogoBack = function(){
        $ionicHistory.goBack();
    }
}])

.controller("personalCtrl",function($scope){
	
})

.controller("moreCtrl",["$scope","$rootScope","$state",function($scope,$rootScope,$state){
    $scope.logOut = function(){
        $rootScope.data = {};
        $state.go("tab.login");
    }
}])

.controller("loginCtrl",function($scope,userData,$rootScope,$ionicHistory,$state){
	$scope.users = {};
	$scope.loginBtn = function(){
//		var haha = new userData.loginData($scope.users.userName,$scope.users.pwd);
		userData.loginData($scope.users.userName,$scope.users.pwd);		
		$scope.$on("userlist",function(event,data){
		$rootScope.data={
			"userimg_url":data.userimg_url,
			"userID":data.userID
		}
		$state.go("tab.home")
	})
	}
	$scope.back = function(){
        $state.go("tab.personal");

    }
})

.controller("registerCtrl",function($scope,userData,$state){
	$scope.user = {};
	$scope.registerBtn = function(){
		if(!!$scope.user.uname && !!$scope.user.upwd){
            console.log($scope.user.uname+","+$scope.user.upwd);
			if($scope.user.upwd==$scope.user.repwd){
				userData.registerData($scope.user.uname,$scope.user.upwd);
			}
			else{
				alert("两次输入的密码不一致");
			}
		}else{
			alert("用户名或密码不能为空")
		}
			
	}
	
	$scope.back = function(){
       $state.go("tab.personal");

    }
})

.controller("introduceController",function($scope,Intro,$stateParams,$state,$interval){

		$scope.back = function(){
            $state.go('tab.home');

        }
		
		
	})
	.controller("particularController",function($scope,Intro,$ionicHistory){

		 $scope.back = function(){
            $ionicHistory.goBack();

        }
		
	})
	.controller("realsController",function($scope,Intro,$ionicHistory){
//		Intro.DL($stateParams.id);	
		
		 $scope.back = function(){
            $ionicHistory.goBack();

        }
		//轮播图页码点击事件
//		$scope.pageClick = function(i){
////			console.log(i);
//			$ionicSlideBoxDelegate.slide(i);
//		}
		
	})