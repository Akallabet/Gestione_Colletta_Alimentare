collettaApp.service('FeedbackService', ["$q", "$timeout", function($q, $timeout)
{
    function getFeedback()
    {
        return {
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
                //  var t= $timeout(function(){
                //      $this.status= 0;
                //  },2000);
                // }
            }
        }
    }
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
    	feedback: function()
        {
            return getFeedback();
        }
    }
}]);