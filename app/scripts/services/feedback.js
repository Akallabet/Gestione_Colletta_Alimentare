collettaApp.service('FeedbackService', ["$q", "$timeout", function($q, $timeout)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
    	feedback: {
    		status: 0,
    		message: [
    			"Ops... Qualcosa non è andata bene..."
    		],
    		changeStatus: function(s)
    		{
    			var $this= this;
    			$this.status=s;
    			// if(s!==1)
    			// {
	    		// 	var t= $timeout(function(){
	    		// 		$this.status= 0;
	    		// 	},2000);
	    		// }
    		}
    	}
    }
}]);