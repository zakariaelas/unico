const textarea = document.getElementsByName("text")[0];

document.getElementsByClassName("submitbutton")[0].addEventListener('click',function(ev){
    let text = textarea.value;
    let num = 190 - text.length;
    if(text.length < 190){
        alert("Your text should have at least 190 characters. "+num+" characters remaining");
    }
    else if(document.getElementById('category').selectedIndex == 0){
        alert('Please choose a category');
    }
    else{
        document.getElementsByTagName("form")[0].submit();
    }
});