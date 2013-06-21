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

//All with limits
$app->get('/:token/get/:property/all/:limit_start/:limit_end', function ($token, $property, $l_start, $l_end) {
	$obj= null;
	switch ($property) {
		case 'carichi':
            require_once("./models/carichi.php");
            if(checkPermissions($token,4))
                $obj= new Carichi();
            break;
		case 'prodotti':
			require_once("./models/prodotti.php");
			if(checkPermissions($token,4))
				$obj= new Prodotti();
			break;
		case 'supermercati':
			require_once("./models/supermercati_colletta.php");
			if(checkPermissions($token,4))
				$obj= new SupermercatiColletta();
			break;
		case 'comuni':
			require_once("./models/comuni.php");
			if(checkPermissions($token,1))
				$obj= new Comuni();
			break;
		default:
			
			break;
		}
		$ret= array();
		if($obj instanceof Model)
			$ret= call_user_func_array(array($obj, 'getAll'), array($l_start, $l_end, true));
		else $ret= array('error'=>'Non hai i permessi disponibili per questa azione!');
		echo json_encode(array($property=>$ret));
});

//All without limits
$app->get('/:token/get/:property/all', function ($token, $property) {
    $obj= null;
    switch ($property) {
        case 'carichi':
            require_once("./models/carichi.php");
            if(checkPermissions($token,4))
                $obj= new Carichi();
            break;
        case 'prodotti':
            require_once("./models/prodotti.php");
            if(checkPermissions($token,4))
                $obj= new Prodotti();
            break;
        case 'supermercati':
            require_once("./models/supermercati_colletta.php");
            if(checkPermissions($token,4))
                $obj= new SupermercatiColletta();
            break;
        case 'comuni':
            require_once("./models/comuni.php");
            if(checkPermissions($token,1))
                $obj= new Comuni();
            break;
        default:
            
            break;
        }
        $ret= array();
        if($obj instanceof Model)
            $ret= call_user_func_array(array($obj, 'getAll'), array(null, null, true));
        else $ret= array('error'=>'Non hai i permessi disponibili per questa azione!');
        echo json_encode(array($property=>$ret));
});

//Get by property with limits
$app->get('/:token/get/:property/:method/:par/:limit_start/:limit_end', function ($token, $property, $method, $par, $l_start, $l_end) {
	$obj= null;
    if($method=='IdArea') $par= $_SESSION['user']['id_area'];
	switch ($property) {
		case 'prodotti':
			require_once("./models/prodotti.php");
			if(checkPermissions($token,4))
				$obj= new Prodotti();
			break;
		case 'supermercati':
			require_once("./models/supermercati_colletta.php");
			if(checkPermissions($token,4))
				$obj= new SupermercatiColletta();
			break;
		case 'comuni':
			require_once("./models/comuni.php");
			if(checkPermissions($token,1))
				$obj= new Comuni();
			break;
		default:
			
			break;
	}
	$ret= array();
	if($obj instanceof Model)
		$ret= call_user_func_array(array($obj, 'getBy'.$method), array($par, $l_start, $l_end));
	else $ret= array('error'=>'Non hai i permessi disponibili per questa azione!');
	echo json_encode(array($property=>$ret));
});

//Get by property without limits
$app->get('/:token/get/:property/:method/:par', function ($token, $property, $method, $par) {
    $obj= null;
    if($method=='IdArea') $par= $_SESSION['user']['id_area'];
    switch ($property) {
        case 'prodotti':
            require_once("./models/prodotti.php");
            if(checkPermissions($token,4))
                $obj= new Prodotti();
            break;
        case 'supermercati':
            require_once("./models/supermercati_colletta.php");
            if(checkPermissions($token,4))
                $obj= new SupermercatiColletta();
            break;
        case 'comuni':
            require_once("./models/comuni.php");
            if(checkPermissions($token,1))
                $obj= new Comuni();
            break;
        default:
            
            break;
    }
    $ret= array();
    if($obj instanceof Model)
        $ret= call_user_func_array(array($obj, 'getBy'.$method), array($par, null, null));
    else $ret= array('error'=>'Non hai i permessi disponibili per questa azione!');
    echo json_encode(array($property=>$ret));
});

$app->post('/save/prodotti', function() use($app){
    
    $req= json_decode($app->request()->getBody());
    require_once("./models/prodotti.php");
    $prodottiManager= new Prodotti();
    echo json_encode(array('result'=>$prodottiManager->addNewCarico($req->id_supermercato, $req->carico, $_SESSION['id_user'])));
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
?>