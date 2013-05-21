String.prototype.trimEnd=function(c)
{
    c = c?c:' ';
    var i=this.length-1;
    for(;i>=0 && this.charAt(i)==c;i--);
    return this.substring(0,i+1);
}

var Utils = {
    getValues : function(dataSet)
    {
        var res = [];
        for(var key in dataSet) {
            res.push(dataSet[key]);
        }
        return res;
    }
};