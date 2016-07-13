import { Meteor } from 'meteor/meteor';

Meteor.methods({
	resetDB: function () {
		entries.remove({_id:{$ne:1}});
	},
	fillDB: function () {
		for(var i=0; i<=30; i++){
			entries.insert({'name':'entry-'+i,'createdAt':i+1+'/5/2016'});
		}
	}
});

/*publish */

  Meteor.publish('entries', function(){
    return entries.find();
  });

  FilterCollections.publish(entries);


