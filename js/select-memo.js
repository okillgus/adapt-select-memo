define(function(require) {
    
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var SelectMemo = ComponentView.extend({

      events: {
        "click .selectMemoItem":  "saveSelectMemo",
        "click .resetSelectMemo": "resetSelectMemo",
        "click .clearSelectMemo": "clearSelectMemo",
        "change .select-memo-checkbox": "toggleSelect"
      },

      preRender: function() {
          // this.checkIfResetOnRevisit();
          console.log('calling initData.');
          this.initData();
      },

      postRender: function() {
        if (! this.model.get('modus')){
          console.log('calling importData.');
          this.importData();
        }
        else{
          console.log('calling displayData.');
          this.displayData();
        }
          this.setReadyStatus();
      },

      initData: function(){
        // Datensatz herrichten 
        var _topic = this.model.get("topic");
        var _sel_text = this.model.get("selection_text");
        var _items = this.structureData(_sel_text);
        //console.log('structured: ',_items);
        var _dbName = this.model.get("storageName");
        var _data = this.readDB();
        // console.log("importing ..., raw: "+_data);
        // aus selection_text auslesen? zeile fuer zeile
        _data = this.checkData(_topic, _items, _data);
        //console.log("compared: "+_data);
        this.model.set(_dbName,_data);
        console.log("init: ");
        console.log(_data);
      },

      structureData: function(_text){
        var _data = []; 
        var _lines = $(_text); //_text.split('\n');
        //console.log(_lines);
        for (var n = 0; n <_lines.length; n++){
          _data.push({text:_lines[n].innerText, selected: {fst:0, snd:0, trd:0}});
        }
        console.log("structured ...");
        return _data;
      },

      checkData: function(tp, items, data){

        if (!data){
            data = {};
        }

        // prefer dataBase 
        if(!data.hasOwnProperty(tp) ){
          data[tp] = items;
        }

        return data;
      },

      importData: function(){
          // Daten in die View laden
        var dbName = this.model.get('storageName');
        //console.log(dbName);
        var selectMemoDB = this.model.get(dbName);
        //console.log("postrender", selectMemoDB);
        var _topic = this.model.get("topic");
        var _inputId = this.model.get("inpuId");
        var _data = selectMemoDB[_topic];
        console.log("imported:");
        console.log(_data);
        this.initView(_topic, _inputId, _data);
      },

      initView: function(tp, inp, data){
        var _target = $('#select-memo-'+tp);
        for (var n = 0; n < data.length; n++){
          var item_id = inp+String(n);
          // überlege inputId... Teil des Objekts? Wäre praktisch.
          var item = $('<input type="checkbox" class="select-memo-checkbox" id="'+item_id+'" ><label for="'+item_id+'">'+data[n].text+'</label>');
          _target.append(item);
          console.log("appending to memo-out....?"+item_id);
        }
      },

      toggleSelect: function(arg){
        console.log(arg);
      },

      saveData: function(tp, inp){
        var _dataObj = this.model.get(this.model.get('storageName'));
        // _dataObj[tp][inp] = this.model.get("message");
        // this.model.set(this.model.get('storageName'), _dataObj);
        this.writeDB(_dataObj);
        console.log('saved Data');
      },
    
      resetData: function(tp, inp){
        // var _dataObj = this.model.get(this.model.get('storageName'));
        // _dataObj[tp][inp] = this.model.get("message");
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

      displayData: function(){
        // Daten in die View laden
        var dbName = this.model.get('storageName');
        console.log(dbName);
        var selectMemoDB = this.model.get(dbName);
        console.log("postrender", selectMemoDB);

        var _topic = this.model.get("topic");
/*
        if (this.model.get('display') == 'one'){         // display one ?
          this.$('#memo-out-'+_topic).append('<li>'+memoDB[_topic][_inputId]+'</li>');
          }
        else{ // display all ?
          for (item in memoDB[_topic]){
              var mess = memoDB[_topic][item];
              if (mess != this.model.get('message')){
                this.$('#memo-out-'+_topic).append('<li>'+memoDB[_topic][item]+'</li>');
                }
            }
          }
        // view !
  */      
    },

    // Function to be called by user-interaction
      saveSelectMemo: function(){
          //var _topic = this.model.get("topic");
          //var _inputId = this.model.get("inputId");
          //var memoText = this.$('#memo-in-'+_inputId).val();
          //this.updateData(_topic, _inputId, memoText);
          console.log("saved: ");
      },

      resetSelectMemo: function(){
        console.log("reset");
        // var _topic = this.model.get("topic");
        // var _inputId = this.model.get("inputId");
        // this.updateInput(_inputId, this.model.get("message"));
        // this.resetData(_topic, _inputId);
      },

      clearSelectMemo: function(){
        console.log("clear");
        // this.updateInput(this.model.get("inputId"), this.model.get("message")); // -> Das muss für alle inputs eines topic geschehen
        // var _topic = this.model.get("topic");
        // this.clearData(_topic);
        },

      // DBMS: read-write localStorage
      readDB: function(){
          // Daten aus localStorage holen
        var _data = localStorage.getItem(this.model.get('storageName'));
        console.log("reading DB ...", _data);
        if (!_data) { return false; }
        return JSON.parse(_data); 
      },

      writeDB: function(data){
          // Daten in localStorage schreiben
        console.log("writing...", data);
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
