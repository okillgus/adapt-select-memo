define(function(require) {
    //PROBLEM: cannot rfeda items of infdefined
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var SelectMemo = ComponentView.extend({

    events: {
      'click .resetSelectMemo': 'resetSelectMemo',
      'click .clearSelectMemo': 'clearSelectMemo',
      'change .select-memo-checkbox': 'toggleSelect',
    },

    preRender: function() {
      // this.checkIfResetOnRevisit();
      // console.log('calling initData.');
      this.initData();

    },

    postRender: function() {
      console.log('calling importData.');
      var data = this.importData();

      console.log('imported from DB:');
      console.log(data);
      var topic = this.model.get('topic');
      var importedItems = data[topic];
      this.updateModel(importedItems);
      this.updateView(importedItems);

      this.setReadyStatus();
    },

    initData: function(){
      // Datensatz herrichten 

      var _inputId = this.model.get('inputId');
      var _items = this.model.get('items');
      for (var n = 0; n < _items.length; n++){
        _items[n].inputId = _inputId+String(n);
        _items[n].steps = "";
        _items[n].time = 0;
      }
      this.model.set('items', _items);
      // console.log('init: ');
      // console.log(_items);
    },

    importData: function(){
      // Daten nachladen;
      var _topic = this.model.get('topic');
      var _data = this.readDB();
      _data = this.checkData(_data, _topic);
      console.log('imported:');
      console.log(_data);
      // this.initView(_topic, _inputId, _data);
      return _data;
    },

    checkData: function(data, tp){

      if (!data){
        data = {};
      }

      if (data[tp] == undefined){
        data[tp] = [];
        this.writeDB(data);
      }

      if (data[tp].length == 0){
        return false;
      }

      console.log('checked:');
      console.log(data);
      return data;
    },

    updateModel: function(items){
      console.log('! updating model data');
      if(items){
        console.log('data:', items);
        this.model.set('items', items);
      }
      else{
        console.log('no data');
      }
    },

    updateView: function(items){

      var _visit = this.model.get('step');
      for (var idx in items){
        console.log('updating item');
        var item = items[idx];
        console.log(item);
        // graphische Darstellung: schon gewählt wurde...  
        // var _classes = item.steps.join(' ');
        var _inputCont = $('#item_'+item.inputId);
        // class_str hinzufügen
        _inputCont.addClass(item.steps);

        if (item.steps.indexOf(_visit) > -1){
          var _inputElem = $('#'+item.inputId);
          _inputElem.prop('checked', true);
        }        
      }
    },

    toggleSelect: function(ev){
      // Nach Klick auf Input
      var _visit = this.model.get('step');

      // view verändern
      // visit( fst, snd, trd) abziehen oder ergänzen
      var _inputId = ev.currentTarget.id;
      console.log('toggleSelect: ', _inputId);
      var _inputCont = $('#item_'+_inputId);
      _inputCont.toggleClass(_visit);

      // model  verändern
      var changedItem = this.toggleItem(_inputId, _visit);

      // rücksichern in DB 
      this.saveData();
    },

    toggleItem: function(id, cls){
      var _items = this.model.get('items');
      console.log('Items?');
      console.log(_items);

      for (var n = 0; n <_items.length; n++){
        item = _items[n];
        if (item.inputId == id) {
          item = this.toggleStep(item, cls);
          _items[n] = item;
          this.model.set('items', _items);
          return item;    
        }
      }
    },

    toggleStep: function(item, cls){
      if (item.steps.indexOf(cls) < 0){
        if (item.steps.substr(-1) != " "){cls = " "+ cls;}
        item.steps = item.steps + cls;
      }
      else{
        item.steps = item.steps.replace(new RegExp(cls, 'g'), "");
      }
      return item;   
    },

    saveData: function(){
      var _topic = this.model.get('topic');
      var _dataObj = {};
      _dataObj[_topic] = this.model.get('items');
      this.writeDB(_dataObj);
      console.log('saved Data');
    },
    
    resetSelectMemo: function(){
      console.log('reset');

      var _items = this.model.get('items');
      for (var n = 0; n < _items.length; n++){
        _items[n].steps = "";
      }
      this.synchronize(_items);
    },

    synchronize: function(data){
      var topic = this.model.get('topic');
      console.log('synchronize data');
      console.log(data);
      // sync DB
      var dbdata = this.checkData(this.readDB()) || {};
      console.log('imported data');
      console.log(dbdata);

      dbdata[topic] = data;
      this.writeDB(dbdata);

      // syncModel
      this.updateModel(data);

      // syncView
      this.updateView(data);
    },

    clearSelectMemo: function(){
      console.log('clear?');
      // var dbdata = this.checkdata(this.readDB()) || {};
      // dbdata[_topic] = _items;
      // this.writeDB(dbdata);
      // this.importData();
    },

    // DBMS: read-write localStorage
    readDB: function(){
      // Daten aus localStorage holen
      var _data = localStorage.getItem(this.model.get('storageName'));
      console.log('reading DB:');
      console.log(_data);
      if (!_data) { return false; }
      return JSON.parse(_data); 
    },

    writeDB: function(data){
      // Daten in localStorage schreiben
      console.log('writing...', data);
      var _data = JSON.stringify(data);
      localStorage.setItem(this.model.get('storageName'), _data);
    }
  },

  {
    template: 'select-memo'
  });
 
  Adapt.register('select-memo', SelectMemo);

  return SelectMemo;
});