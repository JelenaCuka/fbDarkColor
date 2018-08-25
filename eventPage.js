var shotsPerUserSessionOn;
var shotsPerUserSessionOff;
var timer;


chrome.runtime.onInstalled.addListener(function() {
    shotsPerUserSessionOn = 0;
    shotsPerUserSessionOff = 0;
    $.ajax({
        url: 'https://www.jelenacuka.com/coloranalysis/getID.php',
        type: 'POST',
        data: {generiraj: "generateIdCode" },
        success: function (data) {
            //console.log( data);
            chrome.storage.sync.set({'userId': data });
        },
        error: function (data) {
            //console.log("Error: " + data);
        }
    });
});


chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.todo == "showPageAction"){
        chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
        });
    }
    if(request.todo == "checkLastStateDarkOnOff"){
        chrome.storage.sync.get('fbDarkColorStatus',function(userInfo){
            var codeEdit ='document.querySelector("#facebook").classList.remove("activePG");';
            if(userInfo.fbDarkColorStatus){
              if(userInfo.fbDarkColorStatus=="on"){
                codeEdit ='if(!document.querySelector("#facebook").classList.contains("activePG")){document.querySelector("#facebook").classList.add("activePG");}';
              }
            }
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.executeScript(
                    tabs[0].id,
                    {code: codeEdit});
            });
        });    
    }
    if(request.todo == "resetSessionCounters"){
        shotsPerUserSessionOn = 0;
        shotsPerUserSessionOff = 0;
        timer=setInterval(collectColorDataStart, 1000);
    }
});
function collectColorDataStart() {
    try{
      getScreenshot();
      if(shotsPerUserSessionOn>=120&&shotsPerUserSessionOff>=120){
      //if(shotsPerUserSessionOn>=10&&shotsPerUserSessionOff>=10){
        //clearInterval(timer);
        for (var i = 1; i <= timer ; i++) {
            clearInterval(i);
        }
        chrome.notifications.create('progressFinishNotification',{
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Gotovo 100/100',
            message: "Hvala na sudjelovanju!"},
            function(id) {}    
        );
        //alert("Hvala na sudjelovanju.");

        //console.log(shotsPerUserSessionOn+"--"+shotsPerUserSessionOff+"--"+(shotsPerUserSessionOn>=480&&shotsPerUserSessionOff>=480));
        //chrome.notifications.create('progressFinishNotification', newNotificationA, function(id) {});
        //console.log("Session finish");
        //console.log("on="+shotsPerUserSessionOn+"-Off="+shotsPerUserSessionOff);
        
      }else{
        if(shotsPerUserSessionOn===120){
            //if(shotsPerUserSessionOn===10){
                /*var newNotificationB = {
                    type: 'progress',
                    iconUrl: 'icon48.png',
                    title: '50/100',
                    message: "Ugasite tamnu temu",
                    progress: 50
                };*/
                //console.log("POLABL_on="+shotsPerUserSessionOn+"-Off="+shotsPerUserSessionOff);
                //chrome.notifications.create('progressFinishNotificationB', newNotificationB, function(id) {});
                chrome.notifications.create('progressNotification',{
                    type: 'basic',
                    iconUrl: 'icon48.png',
                    title: '50/100',
                    message: "promijenite temu"},
                    function(id) {}    
                );
          }
          //if(shotsPerUserSessionOff===1200){
          //if(shotsPerUserSessionOff===10){
            if(shotsPerUserSessionOff===120){
                /*var newNotificationB = {
                    type: 'progress',
                    iconUrl: 'icon48.png',
                    title: '50/100',
                    message: "Upalite tamnu temu ",
                    progress: 50
                };*/
                //console.log("POLAWH_on="+shotsPerUserSessionOn+"-Off="+shotsPerUserSessionOff);
                //chrome.notifications.create('progressNotificationB',newNotificationB);
                //chrome.notifications.create('progressFinishNotificationB', newNotificationB, function(id) {});
                chrome.notifications.create('progressNotification',{
                    type: 'basic',
                    iconUrl: 'icon48.png',
                    title: '50/100',
                    message: "promijenite temu"},
                    function(id) {}    
                );
            }
      }

        //console.log(timer);
    }catch(e){}
}
    

function getScreenshot(){
    chrome.tabs.captureVisibleTab(function(screenshotDataUrl) {
      if(screenshotDataUrl!=undefined){
        var canvas = document.createElement('canvas');
        var image = new Image();
        image.onload = function() {
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);
            var imgData = ctx.getImageData(0, 0, this.width,this.height);
            var i;
            var dataToCollect={
                width: imgData.width,
                height: imgData.height,
                pixelcount:imgData.width*imgData.height,
                inactivepixelscount: 0
            }
            for (i = 0; i < imgData.data.length; i += 4) {
              if(imgData.data[i+3]==0 || (imgData.data[i]+imgData.data[i+1]+imgData.data[i+2]) ==0 ){
                dataToCollect.inactivepixelscount++;
              }
            }
            chrome.storage.sync.get('fbDarkColorStatus',function(userInfo){
                if(userInfo.fbDarkColorStatus=="on"){
                    shotsPerUserSessionOn++;
                    dataToCollect.darkthemestatus="on";
                }else{
                    shotsPerUserSessionOff++;
                    dataToCollect.darkthemestatus="off";
                }
            });
            chrome.storage.sync.get('userId',function(userInfo){
                if(userInfo.userId){
                    dataToCollect.userid=userInfo.userId;
                    dataToCollect.blackpercentage=dataToCollect.inactivepixelscount/dataToCollect.pixelcount*100;
                    $.ajax({
                        url: 'https://www.jelenacuka.com/coloranalysis/insertDataG.php',
                        type: 'GET',
                        data: dataToCollect,
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
        };
        image.src = screenshotDataUrl;
      }
    });
}