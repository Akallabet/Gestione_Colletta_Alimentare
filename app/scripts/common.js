var comuni= [];

/*START COMMON FUNCTIONS*/
function getComuneById(id_comune)
{
    var ret= null;
    for(var i in comuni)
    {
        if(comuni[i].id==id_comune)
        {
            ret= angular.extend({}, comuni[i]);
            break;
        }
    }
    return ret;
}

/*END COMMON FUNCTIONS*/