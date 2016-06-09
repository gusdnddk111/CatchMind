$(document).ready(function(){
    $('#btn-submit').click(function(){

        var input_data={};

        if($(".inputs input[name='id']").val()==""){
            alert("아이디를 입력하세요.");
            return;
        }
        else if($(".inputs input[name='password']").val()==""){
            alert("비밀번호를 입력해주세요.");
            return;
        }
        else{
            
            $('.signup_input').each(function(){
                if($(this).val()!=""){
                    input_data[$(this).attr('name')] = $(this).val();
                }
            });

            $.ajax({
                type:'post',
                dataType:'json',
                url:'/title/signup',
                data:input_data,
                success: function(data){
                    if(data.result == true){
                        console.log(data);
                        location.href='/title';
                    }
                    else if(data.result == "overlap"){
                        alert('중복된 아이디입니다.');
                    }
                    else{alert("error");}
                },
                error:function (data,status,err) {
                }
            });
        }
    });
    
    
    $('.login_form').submit(function(){
       
        
        var input_data={};
        if($("#container-login input[name='id']").val()==""){
            alert("아이디를 입력하세요.");
            return;
        }
        else if($("#container-login input[name='password']").val()==""){
            alert("비밀번호를 입력해주세요.");
            return;
        }
        else {
            
            $('.login').each(function(){
                if($(this).val()!=""){
                    input_data[$(this).attr('name')] = $(this).val();
                }
            });

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/title/login',
                data: input_data,
                success: function (data) {
                    if (data.result == 'success') {
                        window.location.href = '/waitingRoom';
                    } else if (data.result == 'login_fail') {
                        alert('로그인 실패');
                        window.location.href = '/title';
                    }
                }
            });
        }        
    });
    
});