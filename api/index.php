<?php
require_once("Slim/Slim.php");
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

session_start();

$app->post('/login', function() use($app){
    $req= json_decode($app->request()->getBody());
    $username= $req->username;
    $password= $req->password;
	require_once("./models/users.php");
	$obj= new Users();
	$ret= $obj->login($username, sha1($password));
	if(count($ret)==1)
	{
	    $_SESSION['timestamp']= time();
        $_SESSION['id_user']= $ret[0]->id;
	    $_SESSION['user']= array(
           'username'=>$ret[0]->username,
           'api_key'=>$ret[0]->api_key,
           'privilegi'=>$ret[0]->privilegi,
           'ruolo'=>$ret[0]->ruolo,
           'nome'=>$ret[0]->nome,
           'cognome'=>$ret[0]->cognome,
           'email'=>$ret[0]->email,
           'id_area'=>$ret[0]->id_area,
           'telefono'=>$ret[0]->telefono
        );
        $token=sha1($ret[0]->api_key.$_SESSION['timestamp']."-");
		echo json_encode(array('error'=>false,'token'=>$token));
	}
	else echo json_encode(array('error'=>true));
});

$app->get('/logout', function(){
	session_unset();
	session_destroy();
	echo json_encode(array('error'=>false));
});

$app->get('/:token/get/user', function ($token) {
    $ret= array();
    $error= false;
    $actions= array();
    if(checkPermissions($token))
        $ret= $_SESSION['user'];
    else $error= true;
    echo json_encode(array('user'=>$ret,'error'=>$error));
});

function doAction($token, $method, $property, $l_start, $l_end, $values)
{
    $ret= array();
    
    $obj= null;
    switch ($property) {
        case 'carichi':
            require_once("./models/carichi.php");
            if(checkPermissions($token,4))
                $obj= new Carichi();
            break;
        case 'prodotti':
            require_once("./models/prodotti.php");
            if($method=='insert')
            {
                foreach ($values->values as $key => $value) {
                    $values->values[$key]->id_user= $_SESSION['id_user'];
                }
            }
            if(checkPermissions($token,4))
                $obj= new Prodotti();
            break;
        case 'supermercati':
            require_once("./models/supermercati_colletta.php");

            if($method=='get')
            {
                if($_SESSION['user']['privilegi']>1)
                {
                    $values->id_area= $_SESSION['user']['id_area'];
                }
            }
            else if($method=='set')
            {
                if($_SESSION['user']['privilegi']==1)
                {
                    deleteCache();
                }
            }
            if(checkPermissions($token,4))
                $obj= new SupermercatiColletta();
            break;
        case 'comuni':
            require_once("./models/comuni.php");
            if(checkPermissions($token,4))
                $obj= new Comuni();
            break;
        case 'catene':
            require_once("./models/catene.php");
            if(checkPermissions($token,4))
                $obj= new Catene();
            break;
        case 'capi_equipe':
            require_once("./models/capi_equipe.php");
            if(checkPermissions($token,4))
                $obj= new CapiEquipe();
            break;
        case 'colletta':
            require_once("./models/colletta.php");
            if(checkPermissions($token,4))
                $obj= new Colletta();
            if($method=='set')
            {
                if($_SESSION['user']['privilegi']==1)
                {
                    deleteCache();
                }
            }
            break;
        default:
            
            break;
    }
    $mtime= ((3600)*1)*1000;

    if($obj instanceof Model)
    {
        //Cache control
        if($method=='get' && 
            ($property=='supermercati' ||
             $property=='comuni' ||
             $property=='provincie' || 
             $property=='catene' ||
             $property=='regioni')
        )
        {
            $strin=stringify($values);

            $filename= 'resources/'.md5("{$token}{$property}{{$strin}}{$l_start}{$l_end}".".js");

            if (file_exists($filename) && (filemtime($filename)-time())<$mtime) {
                $ret= json_decode(file_get_contents($filename));
            } else {
                $ret= call_user_func_array(array($obj, $method), array($values, $l_start, $l_end));
            }
            $fp = fopen($filename, 'w');
            fwrite($fp, json_encode($ret, true));
            fclose($fp);
        }
        else
            $ret= call_user_func_array(array($obj, $method), array($values, $l_start, $l_end));
    }
    else $ret= array('error'=>'Non hai i permessi disponibili per questa azione!');
    
    echo json_encode(array($property=>$ret));
}

//Get with limits
$app->post('/:token/get/:property/:limit_start/:limit_end', function($token, $property, $l_start, $l_end) use($app){
    $req= json_decode($app->request()->getBody());
    doAction($token, 'get', $property, $l_start, $l_end, $$req);
});

$app->post('/:token/get/:property', function($token, $property) use($app){
    $req= json_decode($app->request()->getBody());
    doAction($token, 'get', $property, null, null, $req);
});

$app->post('/:token/set/:property', function($token, $property) use($app){
    $req= json_decode($app->request()->getBody());
    doAction($token, 'update', $property, null, null, $req);
});

$app->post('/:token/save/:property', function($token, $property) use($app){
    $req= json_decode($app->request()->getBody());
    doAction($token, 'insert', $property, null, null, $req);
});

$app->post('/:token/upload/supermercati/:id_colletta', function($token, $id_colletta) use($app){
    $req= json_decode($app->request()->getBody());
    //doAction($token, 'insert', $property, null, null, $req);
});

$app->get('/:token/files/:year', function($token, $year){
    
});

$app->run();

function checkPermissions($token,$level=100)
{
	$ret= true;
	if(isset($_SESSION['user']) && sha1($_SESSION['user']['api_key'].$_SESSION['timestamp']."-")==$token)
    {
        if($level && $_SESSION['user']['privilegi']>$level) echo $ret= false;
        else $ret=true;
	}
	else $ret=false;
	return $ret;
}

function stringify($inJSON)
{
    $ret='';
    foreach ($inJSON as $key => $value) {
        $ret.= $key."=>".$value;
    }
    
    return $ret;
}

function deleteCache()
{
    $files = glob('resources/*'); // get all file names
    foreach($files as $file){ // iterate files
      if(is_file($file))
        unlink($file); // delete file
    }
}
?>