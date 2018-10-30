define(function(require) {

  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var SelectMemo = ComponentView.extend({

    events: {
      'click .resetSelectMemo': 'resetSelectMemo',
      'change .select-memo-checkbox': 'toggleSelect',
    },

    preRender: function() {
      this.initData();
      // Notifying other Instances on the same page
      this.listenTo(Adapt, {
                "select-memo:changed": this.notify
                });
    },

    postRender: function() {
      this.update();
      this.setReadyStatus();
    },

    notify: function(param){
      // @param := model.id
      var topic = this.model.get('topic');
      var id = this.model.get('id');

      if (topic == param.topic &&  id != param.id){ // Changes here or elsewhere?
        console.log('Update! ', id);
        this.update();
      }
    },

    update: function(){
      var data = this.importData();
      var topic = this.model.get('topic');
      var importedItems = data[topic];
      this.updateModel(importedItems);
      this.updateView();
    },

    initData: function(){
      var topic = this.model.get('topic');
      var inputId = this.model.get('inputId');
      var id = inputId+String(Math.random()).substr(2);
      this.model.set('id', id);
      var items = this.model.get('items');
      for (var n = 0; n < items.length; n++){
        items[n].id = "smc_"+String(Math.random()).substr(2);
        items[n].inputId = inputId+String(n);
        items[n].steps = "";
        items[n].time = 0;
      }
      this.model.set('items', items);
      this.model.set('selected', []);
    },

    importData: function(){
      var _topic = this.model.get('topic');
      var _data = this.readDB();
      _data = this.checkData(_data, _topic);
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
      return data;
    },

    updateModel: function(items){
      if(items){
        var m_items = this.model.get('items');
        for (var n = 0; n < m_items.length; n++){
          m_items[n].steps = items[n].steps;
        }
        this.model.set('items', m_items);
      }
    },

    updateView: function(){
      var topic = this.model.get('topic');
      var _visit = this.model.get('step');
      items = this.model.get('items');
      for (var idx in items){
        var item = items[idx];
        var _inputCont = $('#item_'+item.id);
        _inputCont.addClass(item.steps);
        if (item.steps.indexOf(_visit) > -1){
          var _inputElem = $('#'+item.id);
          _inputElem.prop('checked', true);
          this.appendSelected(item.id);
        }        
      }
    },

    toggleSelect: function(ev){
      var visit = this.model.get('step');
      var elemId = ev.currentTarget.id;
      var changedItem = this.toggleItem(elemId, visit);
      var removeSelection = this.appendSelected(elemId);
      if (removeSelection) {
        this.toggleItem(removeSelection, visit, true);
      }
      this.saveData();

      Adapt.trigger("select-memo:changed", {
                  "topic": this.model.get('topic'), 
                  "id": this.model.get('id')
                  });
      this.setCompletionStatus();
    },

    toggleItem: function(id, cls, ev){
      var topic = this.model.get('topic');
      var inputElem = $('#'+id);

      var inputCont = $('#item_'+id);
      inputCont.toggleClass(cls);

      var items = this.model.get('items');

      for (var n = 0; n < items.length; n++){
        var item = items[n];
        if (item.id == id) {
          item = this.toggleStep(item, cls);
          items[n] = item;
          if (ev) {
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
    },
    
    resetSelectMemo: function(){
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

    readDB: function(){
      var _data = localStorage.getItem(this.model.get('storageName'));
      if (!_data) { return false; }
      return JSON.parse(_data); 
    },

    writeDB: function(data){
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
