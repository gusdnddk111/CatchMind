
function room_enter(roomnum,current){
    alert(roomnum+"번방 입장, 현재유저수: "+current);

    $.ajax({
        type:'post',
        dataType:'json',
        url:'/waitingRoom/enterRoom',
        data:{roomnum:roomnum, currentusercount:current},
        success: function(data){
            if(data.result == true) {
                window.location.href = '/gameRoom' + roomnum;
            }
            else if(data.result=="full"){
                alert("방이 꽉찼습니다.");
            }
            else{alert("방에 입장할 수 없습니다.");}
        },
        error:function (data,status,err) {
        }
    });

}

$(document).ready(function(){
    $('body').css("width",$(window).width()-30);
    $('body').css("height",$(window).height()-30);
    $(window).resize(function(){
        $('body').css("width",$(window).width()-30);
        $('body').css("height",$(window).height()-30);
    });


    $.ajax({
        type:'get',
        dataType:'json',
        url:'/waitingRoom/getRoom',
        success: function(data){
            if(data.result == true){
                for(var i=0;i<data.room.length;i++){
                    createRoom(data.room[i].roomnum, data.room[i].roomname, data.room[i].currentusercount, data.room[i].maxusercount);
                }
            }
            else{alert("방을 읽는데 실패하였습니다.");}
        },
        error:function (data,status,err) {
            alert("방을 읽는데 실패하였습니다.");
        }
    });

    /*  $.ajax({
     type:'post',
     dataType:'json',
     url:'/waitingRoom',
     data:input_data,
     success: function(data){
     if(data.result == true){
     
     location.href='/gameRoom';
     }
     else{alert("error");}
     },
     error:function (data,status,err) {
     }
     });*/


    $('#btn-room-create2').click(function(){
        if($('#roomnameInput').val()==""){
            alert("방제목을 입력해주세요.");
        }
        else if($('#maxUserCount').val()=="" || $('#maxUserCount').val()>8 || $('#maxUserCount').val()<2){
            alert("게임인원을 제대로 입력해주세요.");
        }
        else {
            var input_data={};

            $('.inputs').each(function(){
                if($(this).val()!=""){
                    input_data[$(this).attr('id')] = $(this).val();
                }
            });
            input_data['current_user_count']=1;

            $.ajax({
                type:'post',
                dataType:'json',
                url:'/waitingRoom/editRoom',
                data:input_data,
                success: function(data){
                    if(data.result == true){
                        window.location.href = '/gameRoom'+data.room[0].roomnum;
                    }
                    else{alert("error");}
                },
                error:function (data,status,err) {
                }
            });
        }
    });

    function createRoom(roomnum, roomname, currentUser, maxCount){

        var div1 = $('<div class = "room"></div>');
        var div2 = $('<div class = "room-info1"></div>');
        var div3 = $('<div class = "room-info2"></div>');
        var div4 = $('<div class = "room-number"></div>');
        var div5 = $('<div class = "room-count"></div>');
        var div6 = $('<div class = "room-name"></div>');
        var button1 = $('<button onclick="room_enter('+ roomnum+',' + currentUser + ')" class="btn" id="'+roomnum+'" href="/gameRoom" style="float:right; margin-right:10px;margin-top:5px;width:90px;height:30px;">Enter</button>');
        var label1 = $("<label>" + roomnum + "</label>");
        var label2 = $("<label>" + currentUser + "/" + maxCount + "</label>");
        var label3 = $("<label>" + roomname + "</label>");

        div4 = div4.append(label1);
        div5 = div5.append(label2);
        div6 = div6.append(label3);
        div2 = div2.append(div4).append(div5).append(div6);
        div3 = div3.append(button1);
        div1 = div1.append(div2).append(div3);

        $("#rooms").append(div1);
    }

});

