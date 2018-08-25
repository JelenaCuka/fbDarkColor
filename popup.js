$(function(){
    chrome.storage.sync.get('inputUserAge',function(userInfo){
        if(userInfo.inputUserAge){
            $( '#userAge' ).val(userInfo.inputUserAge);
        }
    });
    chrome.storage.sync.get('inputUserGender',function(userInfo){
        if(userInfo.inputUserGender){
            $("input[name=userGender][value='"+userInfo.inputUserGender+"']").prop("checked",true);
        }
    });
    chrome.storage.sync.get('fbDarkColorStatus',function(userInfo){
        if(userInfo.fbDarkColorStatus){
            if(userInfo.fbDarkColorStatus=="off"){
                $( '#fbDarkOnOff' ).val("on");
            }else{
                $( '#fbDarkOnOff' ).val("off");
            }
        }else{            
            $( '#fbDarkOnOff' ).val("on");
            chrome.storage.sync.set({'fbDarkColorStatus': 'off' });
        }
        
    });
    $( '#fbDarkOnOff' ).click(function() {
        if($( '#fbDarkOnOff' ).val()=="on"){
            chrome.storage.sync.set({'fbDarkColorStatus': 'on' });
            $( '#fbDarkOnOff' ).val('off');
            var codeEdit ='if(!document.querySelector("#facebook").classList.contains("activePG")){document.querySelector("#facebook").classList.add("activePG");}';
            
        }else{//"off"
            chrome.storage.sync.set({'fbDarkColorStatus': 'off' });
            $( '#fbDarkOnOff' ).val("on");
            var codeEdit ='document.querySelector("#facebook").classList.remove("activePG");';
        }
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: codeEdit});
        });
    });
    $('input[name=userGender]').click(function() {
        chrome.storage.sync.set({'inputUserGender': $( 'input[name=userGender]:checked' ).val() });
            chrome.storage.sync.get('userId',function(userInfo){
                if(userInfo.userId){
                    $.ajax({
                        url: 'https://www.jelenacuka.com/coloranalysis/updateUser.php',
                        type: 'POST',
                        data: {idUser: userInfo.userId,inputUserGender: $( 'input[name=userGender]:checked' ).val() },
                        success: function (data) {
                            //console.log(data);
                            //console.log( data);
                        },
                        error: function (data) {
                            //console.log("Error: " + data);
                        }
                    });
                }
            });
            
    });
    $('#userAge').change(function () {
        var userAgeInput=$('#userAge').val();
        if(userAgeInput!=""&&userAgeInput>3&&userAgeInput<110&&Number.isInteger(parseInt(userAgeInput))&&!isNaN(userAgeInput)){
            chrome.storage.sync.set({'inputUserAge': parseInt(userAgeInput) });
            chrome.storage.sync.get('userId',function(userInfo){
                if(userInfo.userId){
                    $.ajax({
                        url: 'https://www.jelenacuka.com/coloranalysis/updateUser.php',
                        type: 'POST',
                        data: {idUser: userInfo.userId,inputUserAge: userAgeInput },
                        success: function (data) {
                            //console.log( data);
                        },
                        error: function (data) {
                            //console.log("Error: " + data);
                        }
                    });
                }
            });            
        }
    });
});