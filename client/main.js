import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.body.onCreated(function(){
	Meteor.subscribe('entries');
});

Template.body.onRendered(function () {
  setTimeout(function(){
    $('#filterSelect').multiselect();
    $('#dateSelect').multiselect();
  }, 500);
})

Template.body.helpers({
	getEntries: function () {
		return entries.find();
	}
});

  Template.body.events({
  	'click #reset': function () {
  		Meteor.call('resetDB');
  	},
  	'click #fill': function () {
  		Meteor.call('fillDB');
  	},
  	'click #reset': function () {
      _refreshFilters('#filterSelect, #dateSelect');
  		_resetFilters();
  	},
  'change #filterSelect':function (e) {
    Session.set('filterSelect',$('#filterSelect').val());
    EntriesFilter.filter.set('name', {value:Session.get('filterSelect'), operator: ['$in']});
  },
  'change #dateSelect':function (e) {
    Session.set('dateSelect', $('#dateSelect').val());
    EntriesFilter.filter.set('createdAt', {value:Session.get('dateSelect'), operator: ['$in']});
  },
  'click .clearFilter': function(e){
    _clearFilterSession(e,['filterSelect' ,'dateSelect']);
    _updatefilters(e, EntriesFilter, ['name','createdAt'],['filterSelect','dateSelect']);
    //EntriesFilter.filter.set('createdAt', {value:Session.get('dateSelect'), operator: ['$in']});
    _refreshFilterBox(e,'#filterSelect, #dateSelect');
    if(Session.get('filterSelect').length === 0 && Session.get('dateSelect').length === 0 ){
      _resetFilters();
    }
  },
  });

  EntriesFilter = new FilterCollections(entries, {
  template: 'body',
  pager: {
  	itemsPerPage: 50000
  },
  filters: {
  	name: {
	  	title: 'Entry name',
      condition: '$or'
	  },
	createdAt: {
		title: 'Entry date',
    condition: '$or'
	  }
	}
});

var _refreshFilters = function(selector){
  $(selector).each(function( index ) {
    $(selector).multiselect('deselectAll',false);
    $(selector).multiselect('updateButtonText');
  });
}

var _refreshFilterBox = function(e,selector){
  $(selector).each(function( index ) {
    $(selector).multiselect('deselect', e.target.value);
  });
}

var _updatefilters = function(e, filterCategory, filterNames, sessionNames){
  for(var i= 0; i<arguments[2].length; i++){
    filterCategory.filter.set(filterNames[i], {value:Session.get(sessionNames[i]), operator: ['$in']});
  }
}

var _resetFilters = function () {
  var filters = EntriesFilter.filter.get();
  var filterNames = Object.getOwnPropertyNames(filters);
   for(var i =0; i<=filterNames.length; i++){
        EntriesFilter.filter.clear(filterNames[i]);
      }
}

var _getKeyByValue = function(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

var _clearFilterSession = function(e, sessionName){
  for(var i=0; i< arguments[1].length; i++){
    Session.set(sessionName[i],_.without(Session.get(sessionName[i]), e.target.value));
  } 
}
