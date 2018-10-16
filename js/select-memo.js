define(function(require) {

  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var SelectMemo = ComponentView.extend({

    events: {
      'click .resetSelectMemo': 'resetSelectMemo',
      'change .select-memo-checkbox': 'toggleSelect',
    },

    preRender: function() {
      // this.checkIfResetOnRevisit();
      // console.log('calling initData.');
      this.initData();

    },

    postRender: function() {
      // console.log('calling importData.');
      var data = this.importData();

      // console.log('imported from DB:');
      // console.log(data);
      var topic = this.model.get('topic');
      var importedItems = data[topic];
      this.updateModel(importedItems);
      this.updateView();

      this.setReadyStatus();
    },

    initData: function(){
      // Datensatz herrichten 

      var topic = this.model.get('topic');
      var inputId = this.model.get('inputId');
      var items = this.model.get('items');
      for (var n = 0; n < items.length; n++){
        items[n].id = "smc_"+String(Math.random()).substr(2);
        items[n].inputId = inputId+String(n);
        items[n].steps = "";
        items[n].time = 0;
      }
      this.model.set('items', items);
      this.model.set('selected', []);
      // console.log('init: ');
      // console.log(_items);
    },

    importData: function(){
      // Daten nachladen;
      var _topic = this.model.get('topic');
      var _data = this.readDB();
      _data = this.checkData(_data, _topic);
      // console.log('imported:');
      // console.log(_data);
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

      // console.log('checked:');
      // console.log(data);
      return data;
    },

    updateModel: function(items){
      // console.log('! updating model data');
      if(items){
        // console.log('data:', items);
        // this.model.set('items', items);
        var m_items = this.model.get('items');
        // console.log('page');
        // console.log(m_items);
        // console.log('db');
        // console.log(items);
        for (var n = 0; n < m_items.length; n++){
          // console.log('page', m_items[n].steps);
          // console.log('db', items[n].steps);
          m_items[n].steps = items[n].steps;
        }
        this.model.set('items', m_items);
      }
      // else{
      //   console.log('no data');
      // }
    },

    updateView: function(){
      var topic = this.model.get('topic');
      var _visit = this.model.get('step');
      items = this.model.get('items');
      // console.log(items);
      for (var idx in items){
        // console.log('updating item');
        var item = items[idx];
        // console.log(item);
        // graphische Darstellung: schon gewählt wurde...  
        // var _classes = item.steps.join(' ');
        var _inputCont = $('#item_'+item.id);
        // console.log(_inputCont);
        // class_str hinzufügen
        _inputCont.addClass(item.steps);

        if (item.steps.indexOf(_visit) > -1){
          var _inputElem = $('#'+item.id);
          // console.log(_inputElem);
          _inputElem.prop('checked', true);
          this.appendSelected(item.id);
        }        
      }
    },

    toggleSelect: function(ev){
      // Nach Klick auf Input
      var visit = this.model.get('step');

      // view verändern
      // visit( fst, snd, trd) abziehen oder ergänzen
      var elemId = ev.currentTarget.id;

      // model  verändern
      var changedItem = this.toggleItem(elemId, visit);
      var removeSelection = this.appendSelected(elemId);
      if (removeSelection) {
        // console.log(inputId, removeSelection);
        this.toggleItem(removeSelection, visit, true);
      }
      // rücksichern in DB 
      this.saveData();
    },

    toggleItem: function(id, cls, ev){
      var topic = this.model.get('topic');
      var inputElem = $('#'+id);

      // console.log('toggleContainer: ', id);
      var inputCont = $('#item_'+id);
      inputCont.toggleClass(cls);

      var items = this.model.get('items');
      // console.log('Items?');
      // console.log(items);

      for (var n = 0; n < items.length; n++){
        var item = items[n];
        if (item.id == id) {
          item = this.toggleStep(item, cls);
          items[n] = item;
          if (ev) {
            // console.log('unselecting?');
            // console.log(item.steps.indexOf(cls))
            inputElem.prop('checked', false);
          }
          this.model.set('items', items);
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

    appendSelected: function(id){
      var selectedList = this.model.get('selected');
      var giveBack = false;
      if ( selectedList.indexOf(id) < 0 ){
        selectedList.push(id);
        var maximum = this.model.get('maxSelect');
        if (selectedList.length > maximum && maximum != 0 ){
          giveBack = selectedList.shift();
        }
      }
      this.model.set('selected', selectedList);
      return giveBack; 
    },

    saveData: function(){
      var _topic = this.model.get('topic');
      var _dataObj = {};
      _dataObj[_topic] = this.model.get('items');
      this.writeDB(_dataObj);
      // console.log('saved Data');
    },
    
    resetSelectMemo: function(){
      // console.log('reset');
      var topic = this.model.get('topic');
      var items = this.model.get('items');

      for (var n = 0; n < items.length; n++){
        items[n].steps = "";
        var inputCont = $('#item_'+items[n].id);
        inputCont.prop('class', 'component-item select-memo-item');
        var inputElem = $('#'+items[n].id);
        inputElem.prop('checked', false);
      }
      this.updateModel(items);
      this.updateDB(items, topic);
      
    },

    // DBMS: read-write localStorage
    readDB: function(){
      // Daten aus localStorage holen
      var _data = localStorage.getItem(this.model.get('storageName'));
      // console.log('reading DB:');
      // console.log(_data);
      if (!_data) { return false; }
      return JSON.parse(_data); 
    },

    writeDB: function(data){
      // Daten in localStorage schreiben
      // console.log('writing...', data);
      var _data = JSON.stringify(data);
      localStorage.setItem(this.model.get('storageName'), _data);
    },

    updateDB: function(data, topic){
      var dbdata = this.readDB() || {};
      dbdata[topic] = data;
      this.writeDB(dbdata);
    }
  },

  {
    template: 'select-memo'
  });
 
  Adapt.register('select-memo', SelectMemo);

  return SelectMemo;
});