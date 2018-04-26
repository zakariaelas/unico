$.getJSON("/mybackpack/todos/todos")
	.done(function(data){
		data.forEach(function(todo){
			var newTodo = $("<li>"+todo.todo+
			"<i class='fa fa-times' aria-hidden='true'></i></li>");
			newTodo.data('id',todo._id);
			newTodo.data('done',todo.isDone);
			console.log(newTodo);
			$('ul').append(newTodo);
			if(todo.isDone){
				newTodo.addClass("done");
			}
		});
	});

$("input").keypress(function(e){
	if (e.which === 13){
		var value = $(this).val();
		$.post("/mybackpack/todos/todo",{todo: value})
			.done(function(todo){
				var newTodo = $("<li>"+todo.todo+
				"<i class='fa fa-times' aria-hidden='true'></i></li>");
				newTodo.data('id',todo._id);
				newTodo.data('done',todo.isDone);
				$("input").val("");
				$('ul').append(newTodo);
			})
			.fail(function(err){
				console.log(err);
				alert("Todo cannot be added");
			});
	}
});

$("ul").on("click","li",function(){;
	var li = $(this);
	var completed = li.data('done');
	$.ajax({
		type:"PUT",
		url:"/mybackpack/todos/todo/"+$(this).data('id'),
		data: {isDone: !completed}
	})
	.done(function(data){
		li.toggleClass("done");
		li.data('done',!completed);
	})
	.fail(function(err){
		console.log(err);
		alert("Todo cannot be checked!");
	})
});

$("ul").on("click","i",function(e){
	e.stopPropagation();
	var parent = $(this).parent();
	$.ajax({
		type:"DELETE",
		url:"/mybackpack/todos/todo/" + $(this).parent().data('id')
	})
	.done(function(){
		parent.fadeOut(500,function(){
			$(this).remove();
		});	
	})
	.fail(function(err){
		console.log(err);
		alert("Todo cannot be deleted !");
	})
});