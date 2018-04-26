$.getJSON("/mybackpack/notes/notes")
    .done(function(notes){
        let cntr = 0;
        notes.forEach((note)=>{
            var newNote = $("<li>"+note.subject+"<i class='ion-trash-b'></li>");
            newNote.data('id',note._id);
            newNote.data('text',note.text);
            newNote.data('selected',false);
            if(cntr==0){
                newNote.addClass('selected');
                newNote.data('selected',true);
                $("textarea").val(newNote.data('text'));
                cntr++;
            }
            $(".sub-list").append(newNote);
        })
})


$(".ion-plus").on('click',function(ev){
    $("#input-subject").toggle();
    $(this).toggleClass("ion-minus");
    $(this).toggleClass("ion-plus");
});

$(".sub-list").on('click','i',function(ev){
    $.ajax({
        url:"/mybackpack/notes/"+$(this).parent().data('id'),
        method:"DELETE",
    }).done(()=>{
        $(this).parent().fadeOut(500,function(){
            $(this).remove();
            $('textarea').val("");
        }).fail(function(err){
            console.log(err);
            alert("Note cannot be deleted");
        })
    })
})

$("#input-subject").on("keypress",function(ev){
    if(ev.keyCode === 13){
        var subject = $(this).val();
        $.post("/mybackpack/notes/",{
            subject: subject
        }).done(function(note){
            var newNote = $("<li>"+note.subject+"<i class='ion-trash-b'></li>");
            newNote.data('id',note._id);
            newNote.data('text',note.text);
            newNote.data('selected',false);
            $(".sub-list").append(newNote);
            $("#input-subject").val("");   
        }).fail(function(err){
            alert("Subject cannot be added");
        })
    }
});

$(".sub-list").on("click","li",function(ev){
    console.log($(this));
    console.log($(this).data('text'));
    $("textarea").val($(this).data('text'));
    $(this).addClass('selected').siblings().removeClass('selected');
    $(this).siblings().each(function(){
        $(this).data('selected',false);
    })
    $(this).data('selected',true);
})


$(".saveBtn").on("click",(ev)=>{
    $(".sub-list").children().each(function(){
        console.log($(this));
        if($(this).data('selected') === true){
            $.ajax({
                type:"PUT",
                url:"/mybackpack/notes/"+$(this).data('id'),
                data: {text:$('textarea').val()}
            }).done((data)=>{
                $(this).data('text',$('textarea').val());
                console.log($(this).data('text'));
                console.log($(this));
            }).fail(function(err){
                alert("problem with put request");
            })
        }
    })
});

