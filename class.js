//author:wanghongxin
//concat:wanghongxin@outlook.com and QQ2262118088
+function(root,factory){//iife
    if (typeof module !== 'undefined' && module.exports) {//CMD,SeaJs
        module.exports = factory();
    }else if(typeof define === 'function' && define.amd) {//AMD,RequireJS
        define(factory);
    }else{
        root.Class=factory.call(root);
    }
}(this,function(){
    'use strict'
    var Object=window.Object,
        has=Object.prototype.hasOwnProperty,//避免原型链解析
        clone=function(target){//克隆数组和对象，不克隆函数
            if(typeof target!=='object'){//原始值
                return target;
            }else if(typeof target==='object'&&target.constructor===Function){//函数
                return target;
            }
            var str,copy=(target.constructor===Array?[]:{});//数组和对象
            if(has.call(window,'JSON')){
                var JSON=window.JSON;//避免作用域链解析
                str=JSON.stringify(target);//序列化对象
                copy=JSON.parse(str); //反序列化
            }else{
                for(var i in target){
                    if(has.call(target,i)){//过滤目标的继承属性，即原型链上的属性
                        copy[i]=typeof target[i]==='object'? 
                        clone(target[i]):target[i];//递归克隆
                    } 
                }
            }
            return copy;
        },
        extend=function(obj){//全局公用同一个深度扩展函数，给自己添加属性
            if(typeof obj!=='object'){
                throw('feifa');
            }else if(typeof obj==='object'&&obj.constructor===Object){
                for(var i in obj){
                    if(has.call(obj,i)){
                        this[i]=typeof obj==='object'?clone(obj[i]):obj[i];//递归克隆
                    }
                }
            }
        },
        implement=function(obj){//全局公用同一个深度扩展函数，给自己的原型添加属性
            if(typeof obj!=='object'){
                throw('feifa');
            }else if(typeof obj==='object'&&obj.constructor===Object){
                var prototype=this.prototype;
                for(var i in obj){
                    if(has.call(obj,i)){
                        prototype[i]=typeof obj==='object'?clone(obj[i]):obj[i];
                    }
                }
            }
        },
        Class=function(opts){//基类Class
            var opts=opts||{},
                type=opts.type||'Untitled',
                parent=opts.parent||Object,
                Class=function(){//新的类
                    this.initialize.apply(this,arguments);//实例化时将从配置对象里深度克隆属性到实例身上
                };
            if(typeof parent==='function'){
                Class.prototype=Object.create(parent.prototype);
                Class.prototype.constructor=Class;
            }
            Class.extend=extend;//给类添加静态属性的快捷方法
            Class.implement=implement;//给类添加实例属性的快捷方法
            Class.implement({//每一个实例都将继承原型上的initialize方法和mixin方法
                initialize:function(obj){//实例的初始化
                    if(typeof obj!=='object'){
                        return;
                    }
                    extend.call(this,obj);
                },//初始化
                mixin:function(obj){//实例扩展自身的快捷方法
                    extend.call(this,obj);
                },//掺和
                parent:Class,//父类
                type:type,//类名
                uber:parent//超类
            });
            return Class;
        };
    return Class;
});