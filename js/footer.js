$(document).ready(function(){

    initial();

    $(document).on("click",".detailLink,.detailCover",function(){
            loadImage();
    })
    
});

function initial(){
    
}


function loadImage(){

    var iHTML = '<div style="width:100%;height:100%;display:table;position:fixed;left:0;top:0;background:rgba(0,0,0,0); z-index:9999">';

	iHTML += '<div style="width:100%;height:100%;display:table-cell;text-align:center;vertical-align:middle;background-color:rgba(0,0,0,0.0);">';

	iHTML += '<div class="book"><div class="book__page"></div><div class="book__page"></div><div class="book__page"></div>';

	iHTML += '</div>';

	iHTML += '</div>';


	var loadingObj = $(iHTML).appendTo(document.body);

    var tFrame = $("#content-detail");
    console.log(tFrame);

	$(tFrame).load(function(){

		loadingObj.hide();

	});

	tFrame.src = './test.html';
}