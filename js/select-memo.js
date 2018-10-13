define(function(require) {
    
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var SelectMemo = ComponentView.extend({

    events: {
      'click .selectMemoItem':  'saveSelectMemo',
      'click .resetSelectMemo': 'resetSelectMemo',
      'click .clearSelectMemo': 'clearSelectMemo',
      'change .select-memo-checkbox': 'toggleSelect',
    },

    preRender: function() {
      // this.checkIfResetOnRevisit();
      console.log('calling initData.');
      this.initData();
    },

    postRender: function() {
      console.log('calling importData.');
      var data = this.importData();
      this.updateView(data);
      //if (! this.model.get('modus')){
      //  this.updateView(data);
      //}
      //else{
      //console.log('calling displayData.');
      //this.displayData();
      //}
      this.setReadyStatus();
    },

    initData: function(){
      // Datensatz herrichten 
      // var _topic = this.model.get('topic');
      //var _sel_text = this.model.get('selection_text');
      var _inputId = this.model.get('inputId');
      var _items = this.model.get('_items'); // this.structureData(_sel_text);
      for (var n = 0; n < _items.length; n++){
        _items[n].inputId = _inputId+String(n);
        _items[n].steps = [];
        _items[n].time = 0;
      }
      this.model.set('_items', _items);

      //console.log('structured: ',_items);
      // var _dbName = this.model.get('storageName');
      // var _data = this.readDB();
      // console.log('importing ..., raw: '+_data);
      // aus selection_text auslesen? zeile fuer zeile
      // _data = this.checkData(_topic, _items, _data);
      //console.log('compared: '+_data);
      // this.model.set(_dbName,_data);
      console.log('init: ');
      console.log(_items);
    },

    importData: function(){
      // Daten in die View laden
      // var dbName = this.model.get('storageName');
      // console.log(dbName);
      // var selectMemoDB = this.model.get(dbName);
      // console.log('postrender', selectMemoDB);
      // var _topic = this.model.get('topic');
      // var _inputId = this.model.get('inputId');
      // var _data = selectMemoDB[_topic];
      var _data = this.readDB() || {};
      console.log('imported:');
      console.log(_data);
      // this.initView(_topic, _inputId, _data);
      return _data;
    },

    updateView: function(data){

      console.log('marking up options');
      for (var item in data){
        console.log(item);
        // graphische Darstellung: schon gewählt wurde...  
        var _classes = item.steps.join(' ');
        this.markup(item, _classes);
      }
    },
    
    markup: function(obj, class_str){
      // class_str und _visit sind für einen Aufruf dasselbe, z.B. "fst"
      var _inputCont = $('#item_'+obj.inputId);
      _inputCont.setAttribute('class', 'component-item select-memo-item'+class_str);
      // Korrektur: aktuell gewählt?
      var _visit = this.model.get('step');
      if (class_str.indexOf(_visit) > -1){  // d.h. z.B. beim ersten Besuch ist "fst" in "fst, trd" schon enthalten.
        var _inputElem = $('#'+obj.inputId);
        _inputElem.checked = true;
      }
    },

    toggleSelect: function(ev){
      var _visit = this.model.get('step');
      console.log(_visit);
      console.log('Changed Elem, inputId: '+ev.currentTarget.id, 'container_'+ev.currentTarget.id);
      //input, label add class: 'highlighted selected a11y-selected' -> gewählt
      // if obj is selected: unselect + un-markup

      // prüfen!
      // -> Klassen je nach Schritt hinzufügen oder wegnehmen.
      // jQuery-Context!
      var obj = $("#"+ev.currentTarget.id);
      var inputId = obj.prop("id");
      var _inputCont = $('#item_'+inputId);
      var _classes = _inputCont.prop('class');  
      if (obj.prop("checked")){
        if(_classes.substr(-1) != " "){ _visit = " "+_visit; }
        _classes = _classes + _visit;  
      }
      else{// else: select + markup
        _classes = _classes.replace(_visit, '');
      }
      _inputCont.prop('class', _classes);
      //var _visit = this.model.get('step');
      console.log("_classes, str: ", _classes, ", obj: ", _inputCont.prop('class'));
      // -> update model
      // -> write db.
    },

    saveData: function(tp, inp){
      var _dataObj = this.model.get(this.model.get('storageName'));
      // _dataObj[tp][inp] = this.model.get('message');
      // this.model.set(this.model.get('storageName'), _dataObj);
      this.writeDB(_dataObj);
      console.log('saved Data');
    },
    
    resetData: function(tp, inp){
      // var _dataObj = this.model.get(this.model.get('storageName'));
      // _dataObj[tp][inp] = this.model.get('message');
      // this.model.set(this.model.get('storageName'), _dataObj);
      // this.writeDB(_dataObj);
      console.log('reset Data');
    },

    clearData: function(tp){
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
      console.log('reading DB ...', _data);
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