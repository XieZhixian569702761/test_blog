var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

// 储存用户信息
User.prototype.save = function(callback){
	// 要存入数据库的用户文档
	var user = {
		name:this.name,
		password:this.password,
		email:this.email
	};

	//打开数据库
	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		}
		db.collection('users',function(err,collection) {
			if (err) {
				mongodb.close();
				return callback(err); // 错误，返回 err 信息
			}
			// 将用户数据插入users集合
			collection.insert(user,{
				safe:true
			},function(err,data){
				mongodb.close();
				if (err) {
					return callback(err); // 错误，返回err信息
				}
				console.info("[User::save] -------------------------------data ");
				console.dir(data);
				callback(null,data.ops[0]);// 成功！ err 为 null，并且返回存储后的用户文档
			});
		});
	});

};



//读取用户信息
User.get = function(name,callback) {
	//打开数据库
	mongodb.open(function (err,db) {
		if (err) {
			return callback(err); // 错误，返回 err 信息 
		}
		//读取users集合
		db.collection('users',function(err,collection) {
			if (err) {
				mongodb.close();
				return callback(err); // 错误，返回 err 信息 
			}
			// 查找用户名(name键)值为name 一个文档
			collection.findOne({
				name:name
			},function(err,user) {
				mongodb.close();
				if (err) {
					return callback(err); // 错误，返回 err 信息
				}
				return callback(null , user); //成功！ 返回查询的用户信息
			});	
		});
		
	});
};