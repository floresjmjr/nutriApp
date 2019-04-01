module.exports = {

  createItemObj: function(rawObj) {
    var obj = {};
    obj["name"] = rawObj.name
    obj['unit'] = '100' + rawObj.ru
    obj['vitamins'] = this.groupItemBy(rawObj.nutrients, 'vitamins')
    obj['minerals'] = this.groupItemBy(rawObj.nutrients, 'minerals')
    obj['proximates'] = this.groupItemBy(rawObj.nutrients, 'proximates')
    obj['lipids'] = this.groupItemBy(rawObj.nutrients, 'lipids')
    obj['others'] = this.groupItemBy(rawObj.nutrients, 'others')
    return obj;        
  },

  groupItemBy: function(objArr, group) {
    var arr = [];
    objArr.filter((obj)=>{
      if(obj.group.toLowerCase() === group) {
        var obj = this.parseNutritentData(obj, group)
        if (obj) {
          arr.push(obj);
        }
      }
    })
    return arr;
  },

  parseNutritentData: function(nObj, group) {
    if (group === 'minerals' || group === 'vitamins') {
      nObj.name = nObj.name.split(',')[0];
    }
    if (group === 'lipids') {
      var length = nObj.name.split(':').length;
      if (length > 1){
        return false;
      }
    }
    if (!Number(nObj.value)) {
      return false;
    }
    return nObj;
  },

}