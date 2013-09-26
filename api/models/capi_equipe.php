<?php
require_once("model.php");

class TableCapiEquipe
{
	public $id;
	public $nome;
	public $cognome;
	public $id_supermercato;
	
	public function __construct()
	{
		
	}
}

class CapiEquipe extends Model
{	
	public function __construct()
	{
		parent::__construct();
		$this->table= 'capi_equipe';
		$this->table_model= "TableCapiEquipe";
		$this->statements= array("GET_BY_NOME"=>"SELECT * FROM {$this->table} WHERE nome LIKE ? LIMIT ?,?",
								"GET_BY_ID"=>"SELECT * FROM {$this->table} WHERE id_catena= ? LIMIT ?,?",
								"GET_BY_ID_SUPERMERCATO"=>"SELECT * FROM {$this->table} WHERE id_supermercato = ?",
								"GET_BY_SUPERMERCATI"=>"SELECT * FROM {$this->table} WHERE id_supermercato IN ?");
	}
	
	function getByNome($nome, $limit_from='',$limit_to='')
	{
		$nome= $this->sanitize($nome)."%";
		$statement= $this->connector->connection->prepare($this->statements['GET_BY_NOME']);
		
		$statement->bind_param("sii",$nome,$limit_from, $limit_to);
		$res= $this->executePreparedQuery($statement);
		return $res;
	}

	function getByIdSupermercato($id)
	{
		$statement= $this->connector->connection->prepare($this->statements['GET_BY_ID_SUPERMERCATO']);
		
		$statement->bind_param("i",$id);
		$res= $this->executePreparedQuery($statement);
		return $res;
	}

	function getBySupermercati($ids)
	{
		$ids= explode(",", $ids);
		$idsref= array();
		for ($i=0; $i <count($ids) ; $i++) { 
			$idsref[]= &$ids[$i];
		}
		$str= "SELECT * FROM {$this->table} WHERE id_supermercato IN (".implode(', ', array_fill(0, count($ids), '?')).")";
		
		$statement= $this->connector->connection->prepare($str);
		
		$values= array_merge(array(str_repeat('s', count($ids))), $idsref);
		
		call_user_func_array(array($statement, 'bind_param'), $values);
		$res= $this->executePreparedQuery($statement);
		return $res;
	}
}
?>