angular.module("services",[])

.service("userData",function($http,$rootScope,$state){
	var _this = this;
	this.loginData = function(uName,pwd){
		$http.get("http://datainfo.duapp.com/shopdata/userinfo.php",{params:{
				status:"login",
				userID:uName,
				password:pwd	
		}}).success(function(response){
			if(response==0){
				alert("用户名不存在")
			}else if(response==2){
				alert("用户名与密码不符")
			}else{
//				_this.userdata = response;
//				console.log(response);
				alert("登录成功");
				$rootScope.$broadcast("userlist",response);
			}
		})
//		return this;
	};
	
	this.registerData = function(uName,pwd){
		$http.get("http://datainfo.duapp.com/shopdata/userinfo.php",{params:{
				status:"register",
				userID:uName,
				password:pwd	
		}}).success(function(response){
			if(response==0){
				alert("用户名已存在")
			}else if(response==1){
				alert("注册成功");
				$state.go("tab.login")				
			}else{
				alert("数据库报错")
			}
		})
	};
	
})

.service('goods',['$http','$rootScope',"$ionicSlideBoxDelegate",function($http,$rootScope,$ionicSlideBoxDelegate){

	//主页
        return {
            "banner":function(){
                $http.jsonp('http://datainfo.duapp.com/shopdata/getBanner.php',{
                    "params":{
                        "callback":"JSON_CALLBACK"
                    }
                }).then(function(data){
                    var list = [];
                    for(var i = 0;i<data.data.length;i++){
                        var arr = JSON.parse(data.data[i].goodsBenUrl);
                        list.push(arr[0]);
                    }
                    //console.log(list);
                    $rootScope.$broadcast('ban',list);
                    $ionicSlideBoxDelegate._instances[0].update();
                    $ionicSlideBoxDelegate.loop(true);
                    
                },function(err){
                    console.log(err);
                })
            },

            "goodList":function(){
                $http.jsonp(
                    'http://datainfo.duapp.com/shopdata/getGoods.php',{
                        "params":{
                            "callback":"JSON_CALLBACK"
                        }
                    }
                ).then(function(data){
                    //console.log(data);
                    $rootScope.$broadcast('goods',data.data)
                },function(err){
                    console.log(err);
                })
            }

        }

    }])

.service('cls',['$http','$rootScope',function($http,$rootScope){
	
	//分类
        return {
            "clsList":function(){
                $http.get('http://datainfo.duapp.com/shopdata/getclass.php',{})
                    .then(function(data){
                    //console.log(data);
                        $rootScope.$broadcast('clsLis',data.data)
                },function(err){
                    console.log("请求出错了！");
                })
            }
        }

    }])
/*购物车*/
.service("Inform",["$http","$rootScope",function($http,$rootScope){
    return {
        updateCart:function(userID,goodsID,number){ //更新购物车
            $http.get("http://datainfo.duapp.com/shopdata/updatecar.php",{
                params:{
                    userID:userID,
                    goodsID:goodsID,
                    number:number
                }
            }).then(function(data){
                if(data){
                    console.log("更新成功");
                }else{
                    console.log("更新失败");
                }
            },function(error){
                console.log(error);
            })
        },
        getCart:function(id){   //查看购物车
            $http.jsonp("http://datainfo.duapp.com/shopdata/getCar.php",{
                params:{
                    userID:id,
                    callback:"JSON_CALLBACK"
                }
            }).then(function(data){
                //console.log(data.data);
                $rootScope.$broadcast("getCartData",data.data);
            },function(error){
                console.log(error);
            })
        }
    }
}])

.service("Intro",["$http","$rootScope","$ionicSlideBoxDelegate",function($http,$rootScope,$ionicSlideBoxDelegate){
		return{		
			"DL":function(id){
				$http.jsonp("http://datainfo.duapp.com/shopdata/getGoods.php",{
					"params":{
						"goodsID":id,
						"callback":"JSON_CALLBACK"
					}					
				}).then(function(data){
						console.log(data.data);
						$rootScope.$broadcast("dL",data.data);
					},
					function(error){
						console.log(error);
					})
			}
			
		}
	}])