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
      console.log('calling initData.');
      this.initData();
      console.log('calling importData.');
      //var data = this.importData();
      //this.updateModel(data);
    },

    postRender: function() {

      // this.updateView(data);
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
      console.log('init: ');
      console.log(_items);
    },

    importData: function(){
      // Daten in die View laden
      var _data = this.readDB();
      _data = this.checkData(_data);
      console.log('imported:');
      console.log(_data);
      // this.initView(_topic, _inputId, _data);
      return _data;
    },

    checkData: function(data){
      var _topic = this.model.get('topic');
      if (!data){
        data = {};
        data[_topic] = [];
        this.writeDB(data);
      }
      else if (!data.hasProperty(_topic)){
        data[_topic] = [];
        this.writeDB(data);
      }
      console.log('checked:');
      console.log(data);
      return data;
    },

    updateModel: function(data){
      console.log('updating model data');
      var _topic = this.model.get('topic');
      if(data[_topic]['items'] != []){
        this.model.set('items', data[_topic]['items']);
      }
    },

    updateView: function(data){

      var _topic = this.model.get('topic');
      var _visit = this.model.get('step');

      for (var item in data[_topic]){
        console.log('updating item');
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

      var _visit = this.model.get('step');
      var _inputId = ev.currentTarget.id;
      var _inputCont = $('#item_'+_inputId);

      var changedItem = this.toggleItem(_inputId, _visit);
      _inputCont.toggleClass(_visit);
      this.saveData();
    },

    toggleItem: function(id, cls){
      var _items = this.model.get('items');

      for (var n = 0; n <_items.length; n++){
        var item = _items[n];
        if (item.inputId == id) {
          if (item.steps.indexOf(cls) < 0){
            if (item.steps.substr(-1) != " "){cls = " "+ cls;}
            item.steps = item.steps + cls;
          }
          else{
            item.steps = item.steps.replace(new RegExp(cls, 'g'), "");
          }
          _items[n] = item;
          this.model.set('items', _items);
          return item;   
        }
      }
    },

    saveData: function(){
      var _topic = this.model.get('topic');
      var _dataObj = { _topic : this.model.get('items')};
      this.writeDB(_dataObj);
      console.log('saved Data');
    },
    
    resetData: function(tp){
      // var _dataObj = this.model.get(this.model.get('storageName'));
      // _dataObj[tp][inp] = this.model.get('message');
      // this.model.set(this.model.get('storageName'), _dataObj);
      // this.writeDB(_dataObj);
      console.log('reset Data');
    },

    clearData: function(){
      // var _dataObj = this.model.get(this.model.get('storageName'));
      // delete _dataObj[tp];
      // this.model.set(this.model.get('storageName'), _dataObj);
      // this.writeDB(_dataObj);
      console.log('cleared Data');
    },

    // Function to be called by user-interaction
    saveSelectMemo: function(){
      //var _topic = this.model.get('topic');
      //var _inputId = this.model.get('inputId');
      //var memoText = this.$('#memo-in-'+_inputId).val();
      //this.updateData(_topic, _inputId, memoText);
      console.log('saved: ');
    },

    resetSelectMemo: function(){
      console.log('reset');
      // var _topic = this.model.get('topic');
      // var _inputId = this.model.get('inputId');
      // this.updateInput(_inputId, this.model.get('message'));
      // this.resetData(_topic, _inputId);
    },

    clearSelectMemo: function(){
      console.log('clear');
      // this.updateInput(this.model.get('inputId'), this.model.get('message')); // -> Das muss für alle inputs eines topic geschehen
      // var _topic = this.model.get('topic');
      // this.clearData(_topic);
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