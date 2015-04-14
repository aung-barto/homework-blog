var request = require("request");
var express = require("express");
var app = express();
var ejs = require("ejs");
app.set("view_engine", "ejs");
var override = require("method-override");
app.use(override("_method"));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./db/posts.db");
app.use(express.static("public"));

//idiot proof
app.get("/", function(req,res){
	res.redirect("/blogs")
});
app.get("/blog", function(req,res){
	res.redirect("/blogs")
});

//show all blog posts
app.get("/blogs", function(req,res){
	db.all("SELECT * FROM blogs;", function(err,data){
		if(err){
			console.log(err);
		} else{
			var all_blogs = data.reverse();
		}
		res.render("index.ejs", {blogs: all_blogs});
	});
});

//show individual blog post
app.get("/blog/:id", function(req,res){
	var postID = parseInt(req.params.id);
	db.get("SELECT * FROM blogs WHERE id = "+postID, function(err,data){
		if(err){
			console.log(err);
		} else{
			var thisBlog = data;
			//add comments and send them to individual blog post
			// db.run("SELECT comments.comment FROM blogs INNER JOIN comments ON blogs.title = comments.title WHERE id = "+postID, function(err,data){
			// 	if(err){
			// 		console.log(err);
			// 	} else{
			// 		var thisComment = data;
			// 		console.log(thisComment);
				}
				res.render("show.ejs", {blogs: thisBlog});
			// });
		// }
	});
});

//showing comments on individual blog post
// app.post("/blog/:id", function(req,res){
// 	var comment = parseInt(req.params.id)
// })

//go to create new post page
app.get("/blogs/new", function(req,res){
	res.render("new.ejs");
});

//create a new blog post
app.post("/blogs", function(req,res){
	db.run("INSERT INTO blogs (title,image,body,text_link,link) VALUES(?,?,?,?,?);", req.body.title, req.body.image, req.body.body, req.body.text_link, req.body.link, function(err,data){
		if(err){
			throw err;
		} else{
			res.redirect("/blogs"); //go back to blogs to see all post including the new one
		}
	});
});

//go to recipe results
app.post("/recipes", function(req,res){
	var recipeSearch = req.body.search;
	var sources = req.body.source;
	var timeTake = req.body.cookTime;
	if(recipeSearch != "search"){
		request.get("https://api.edamam.com/search?q=" + recipeSearch, function(err,response,body){
			var parsed = JSON.parse(body).hits;
			res.render("recipes.ejs",{recipes: parsed});
		});
	} 
	else if(sources != "site"){
		request.get("https://api.edamam.com/search?q=" + sources, function(err,response,body){
			var parsed = JSON.parse(body).hits;
			res.render("recipes.ejs",{recipes: parsed});
		});
	}
	else if(recipeSearch != "search" && sources != "site"){
		request.get("https://api.edamam.com/search?q=" + recipeSearch + "+" + sources, function(err,response,body){
			var parsed = JSON.parse(body).hits;
			res.render("recipes.ejs",{recipes: parsed});
		});
	}
	else if(recipeSearch != "search" && timeTake != "time"){
		request.get("https://api.edamam.com/search?q=" + recipeSearch + "+" + timeTake, function(err,response,body){
			var parsed = JSON.parse(body).hits;
			res.render("recipes.ejs",{recipes: parsed});
		});
	}
	else if(sources != "site" && timeTake != "time"){
		request.get("https://api.edamam.com/search?q=" + sources + "+" + timeTake, function(err,response,body){
			var parsed = JSON.parse(body).hits;
			res.render("recipes.ejs",{recipes: parsed});
		});
	}
	else {
		request.get("https://api.edamam.com/search?q=" + recipeSearch + "+" + sources + "+" + timeTake, function(err,response,body){
			var parsed = JSON.parse(body).hits;
			res.render("recipes.ejs",{recipes: parsed});
		});
	}
});

//go to edit blog post page
app.get("/blog/:id/edit", function(req,res){
	var blogID = parseInt(req.params.id);
	db.get("SELECT * FROM blogs WHERE id = "+ blogID, function(err,data){
		if(err){
			throw err;
		} else{
			res.render("edit.ejs", {thisPost: data});
		}

	});
});

//update blog post
app.put("/blog/:id", function(req,res){
	db.run("UPDATE blogs SET title = ?, image = ?, body = ?, text_link = ?, link = ? WHERE id = ?", req.body.title, req.body.image, req.body.body, req.body.text_link, req.body.link, parseInt(req.params.id), function(err,data){
			if(err){
				console.log(err);
			} else {
				res.redirect("/blog/" + parseInt(req.params.id));
			}
	});
});

//delete a blog post
app.delete("/blog/:id", function(req,res){
	db.run("DELETE FROM blogs WHERE id = "+ parseInt(req.params.id), function(err,data){
		if(err){
			console.log(err);
		} else {
			res.redirect("/blogs"); //redirect back to blog page after deleting
		}
	});
});

app.listen("3000");
console.log("Server listening to port 3000");