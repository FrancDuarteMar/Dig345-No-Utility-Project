"use strict";
function uploadImage(blobFile, text) {
    //  Uploading image, this does all the magic!, the file variable can also be a blob file
    let form = new FormData(),
        // file = document.getElementById("fileInput").files[0],
        file = blobFile,
        
        request = new XMLHttpRequest();
    form.append("file", file, "file");
    form.append("textToEncode",text)
    request.open("POST", "/upload");
    request.send(form);
}

var imageBlob; 

function dragNdrop(event) {
    var fileName = URL.createObjectURL(event.target.files[0]);
    var preview = document.getElementById("preview");
    var previewImg = document.createElement("img");
    previewImg.setAttribute("src", fileName);
    previewImg.setAttribute("width", "100%");
    previewImg.id = "image"
    preview.innerHTML = "";
    preview.appendChild(previewImg);
    $("#uploadSubmit").hide()
    console.log(fileName)
    imageBlob = event.target.files[0]
    

}
function drag() {
    document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
}
function drop() {
    document.getElementById('uploadFile').parentNode.className = 'dragBox';
}

$('input:radio[name="encDec"]').change(
    function(){
        if ($(this).val() == 'decrypt'){
            $(".inputArea").prop("disabled",true);
            $("#submitButton").attr('formaction', "/decode")
        } 
        else{
            $(".inputArea").prop("disabled",false);
            $("#submitButton").attr('formaction', "/upload")

        }
        console.log(imageBlob)
        // console.log($(".inputArea").val())
    });

    
$('#submitButton').click(function (e) { 
    e.preventDefault();
    uploadImage(imageBlob, $(".inputArea").val())
});
// $('#radioForm input').on("change",function(){
//     console.log("Change in radio form ")
//     // var radioValue = $("input[name='gender']:checked").val();
//     // if(radioValue){
//     //     alert("Your are a - " + radioValue);
//     // }
    
// })
// $('input[name=radioName]:checked', '#myForm').on("change",function(){
//     var radioValue = $("input[name='gender']:checked").val();
//     if(radioValue){
//         alert("Your are a - " + radioValue);
//     }
// })

// $("#radio_1").prop("checked", true);
