const moment = require('moment');
module.exports ={
    randCode:() =>{
        var unixTime= parseInt(moment().format('X')).toString(16);
        var groupCode ="";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ ) // 5자리 그룹코드 생성
            groupCode += possible.charAt(Math.floor(Math.random() * possible.length));
        return groupCode+unixTime; // 5자리 그룹코드와 현재 시간 합
    }
}