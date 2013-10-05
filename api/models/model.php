<?php
require_once("connection.php");

class Table
{
	public function __construct($par)
	{
		
	}
}

class Model
{
	protected $connector;
	protected $table_model;
	protected $statements;
	protected $table;
	
	public function __construct()
	{
		$this->connector= new Connector();
		$this->statements= array("GET_ALL"=>"SELECT * FROM {$this->table}",
								"GET_BY_ID"=>"SELECT * FROM {$this->table} WHERE id=?");
	}
	
	/*
	INSERT INTO  `colletta_alimentare`.`prodotti` (
	`id` ,
	`id_supermercato` ,
	`prodotto` ,
	`kg` ,
	`scatole` ,
	`carico` ,
	`id_user` ,
	`ultima_modifica`
	)
	VALUES (
	NULL ,  '1',  'OLIO',  '0',  '0',  '1',  '1', 
	CURRENT_TIMESTAMP
	), (
	NULL ,  '1',  'OMOGENIZZATI',  '10',  '10',  '1',  '1', 
	CURRENT_TIMESTAMP
	);
	*/


	function insert($parameters)
	{
		$parameters->values= $this->sanitize($parameters->values);
		$values= array();
		foreach ($parameters->values as $key => $value) {
			$parameters->values[$key]= get_object_vars($value);
			$values[]= "(".implode(", ", $parameters->values[$key]).")";
		}
		$query="INSERT INTO {$this->table} (".implode(', ',array_keys($parameters->values[0])).") VALUES ".implode(",", $values);

		$res= $this->connector->connection->query($query);
		if($res) return array('result'=>true);
		else return array('result'=>false, 'error'=>mysqli_error());
	}
	
	function update($parameters)
	{
		foreach ($parameters->values as $key => $value) {
			$setValues= array();
			foreach ($value as $column => $val) {
				$setValues[]= " {$column} = '{$val}' ";
			}
			$str= "UPDATE  {$this->table} SET ";
			$str.= implode(", ", $setValues);
			$str.= " WHERE  ";
			$parameters->set[$key]= get_object_vars($parameters->set[$key]);
			//print_r(array_keys($parameters->set[$key]));

			//$res= $this->executeStandardQuery($str);
		}
		if($res) return array('result'=>true);
		else return array('result'=>false, 'error'=>mysql_error());

		//$values= $this->sanitize(get_object_vars($parameters->values));
		//$set= $this->sanitize(get_object_vars($parameters->set));

		/*
		$str= "SELECT * FROM {$this->table}";
		if(count($values)>0)
		{
			$par= Array();
			foreach ($values as $key => $value) {
				if(is_object($value))
				{
					$value= get_object_vars($value);
					$keys= array_keys($value);
					if($keys[0]=='IN')
					{
						$par[]= "{$key} IN (".implode(', ', $value[$keys[0]]).")";
					}
				}
				else
					$par[]= "{$key} = {$value}";
			}
			$str= "SELECT * FROM {$this->table} WHERE ".implode(" AND ", $par);
		}
		$res= $this->executeStandardQuery($str);
		return $res;*/
	}
	
	function delete($id)
	{
		$id= $this->sanitize($id);
		$query= "DELETE FROM {$this->table} WHERE id='{$id}'";
		$res= $this->connector->connection->query($query);
		if($res) return array('result'=>true);
		else return array('result'=>false, 'error'=>mysqli_error());
	}
	
	public function get($values, $limit_from=null, $limit_to=null)
	{
		$values= $this->sanitize(get_object_vars($values));
		$str= "SELECT * FROM {$this->table}";
		if(count($values)>0)
		{
			$par= Array();
			foreach ($values as $key => $value) {
				if(is_object($value))
				{
					$value= get_object_vars($value);
					$keys= array_keys($value);
					if($keys[0]=='IN')
					{
						$par[]= "{$key} IN (".implode(', ', $value[$keys[0]]).")";
					}
				}
				else
					$par[]= "{$key} = {$value}";
			}
			$str= "SELECT * FROM {$this->table} WHERE ".implode(" AND ", $par);
		}
		$res= $this->executeStandardQuery($str);
		return $res;
	}

	function getAll($limit_from=null, $limit_to=null)
	{
		$sql= "SELECT * FROM {$this->table}";
		if($limit_from!=null)
			$sql.=" LIMIT {$limit_from}";
		if($limit_to!=null)
			$sql.=", {$limit_to}";
		$res= $this->executeStandardQuery($sql);
		return $res;
	}
	
	function getById($id)
	{
		$id= $this->sanitize($id);
		$statement= $this->connector->connection->prepare("SELECT * FROM {$this->table} WHERE id=?");
		$statement->bind_param("s",$id);
		$res= $this->executePreparedQuery($statement);
		return $res;
	}
	
	public function executePreparedQuery($stmt)
	{
		$ret= array();
		$stmt->execute();
		
        $result = $stmt->get_result();
		$stmt->fetch();
        
		return  $this->getQueryObject($result);
	}
	
	public function executeStandardQuery($query)
	{
		$ret= array();
		return $this->getQueryObject($this->connector->connection->query($query));
	}
	
	public function getQueryObject($resource)
	{
		$ret=array();
		if($resource)
		{
		    if(is_bool($resource))
            {
                $ret= $resource;
            }
            else {
                while ($row = $resource->fetch_object($this->table_model))
                {
                    $ret[]= $row;
                }
            }
		}
		return  $ret;
	}
	
	public function sanitize($p)
	{
		if(is_object($p)) $p= get_object_vars($p);
		if(is_array($p))
		{
			foreach ($p as $key => $value) {
				if(!is_object($value) && !is_array($value))
					$p[$key]= mysql_real_escape_string($value);
			}
		}
		else $p= mysql_real_escape_string($p);
		return $p;
	}
}

?>