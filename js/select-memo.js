define(function(require) {
    
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var SelectMemo = ComponentView.extend({

      events: {
        "click .selectMemoItem":  "saveSelectMemo",
        "click .resetSelectMemo": "resetSelectMemo",
        "click .clearSelectMemo": "clearSelectMemo",
        "change .select-memo-checkbox": "toggleSelect",
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
        var _topic = this.model.get("topic");
        //var _sel_text = this.model.get("selection_text");
        var _inputId = this.model.get("inputId");
        var _items = this.model.get("_items"); // this.structureData(_sel_text);
        for (var n = 0; n < _items.length; n++){
          _items[n].inputId = _inputId+String(n);
          _items[n].steps = [0,0,0];
          _items[n].time = 0;
        }
        this.model.set("_items", _items);

        //console.log('structured: ',_items);
        // var _dbName = this.model.get("storageName");
        // var _data = this.readDB();
        // console.log("importing ..., raw: "+_data);
        // aus selection_text auslesen? zeile fuer zeile
        // _data = this.checkData(_topic, _items, _data);
        //console.log("compared: "+_data);
        // this.model.set(_dbName,_data);
        console.log("init: ");
        console.log(_items);
      },

      // structureData: function(_text){
      //   var _data = []; 
      //   var _lines = $(_text); //_text.split('\n');
      //   //console.log(_lines);
      //   _inputId = this.model.get('inputId');
      //   for (var n = 0; n <_lines.length; n++){
      //     _data.push({id: _inputId+String(n),
      //                 text:_lines[n].innerText, 
      //                 selected: {fst:0, snd:0, trd:0}});
      //   }
      //   console.log("structured ...");
      //   return _data;
      // },

      // checkData: function(tp, items, data){

      //   if (!data){
      //       data = {};
      //   }

      //   // prefer dataBase 
      //   if(!data.hasOwnProperty(tp) ){
      //     data[tp] = items;
      //   }

      //   return data;
      // },

      importData: function(){
          // Daten in die View laden
        var dbName = this.model.get('storageName');
        // console.log(dbName);
        // var selectMemoDB = this.model.get(dbName);
        // console.log("postrender", selectMemoDB);
        var _topic = this.model.get("topic");
        var _inputId = this.model.get("inputId");
        // var _data = selectMemoDB[_topic];
        var _data = this.readDB() || {};
        console.log("imported:");
        console.log(_data);
        // this.initView(_topic, _inputId, _data);
        return _data;
      },

      updateView: function(data){
        // Daten in die View laden
        // var dbName = this.model.get('storageName');
        // console.log(dbName);
        // var selectMemoDB = this.model.get(dbName);
        console.log("postrender");
        for (item in data){
            console.log(item);
        }
        // var _topic = this.model.get("topic");
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
      // initView: function(tp, inp, data){
      //   var _target = $('#select-memo-'+tp);
      //   for (var n = 0; n < data.length; n++){
      //     // var item_id = inp+String(n);
      //     // überlege inputId... Teil des Objekts? Wäre praktisch.
      //     var item = $('<div class="component-item select-memo-item" id="container_'+data[n].id+'"><input type="checkbox" class="select-memo-checkbox" id="'+data[n].id+'" ><label class="select-memo-item-label" for="'+data[n].id+'"><div class="select-memo-item-label-inner">'+data[n].text+'</div></label></div>');
      //     _target.append(item);
      //     console.log("appending to memo-out....?"+data[n].id);
      //   }
      // },

      toggleSelect: function(obj){
        console.log(obj);
        console.log("Changed Elem, inputId: "+obj.currentTarget.id, "container_"+obj.currentTarget.id);
        //input, label add class: "highlighted selected a11y-selected" -> gewählt
        // 
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
