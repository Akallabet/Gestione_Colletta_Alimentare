<?php

class Connector
{
	private $DB_NAME = 'colletta_alimentare';
	private $DB_HOST = 'localhost';
	private $DB_USER = 'root';
	private $DB_PASS = '171882109';
	
	public $connection;
	
	function Connector()
	{
		 $this->connect();
	}
	
	function connect()
	{
		$mysqli= new mysqli($this->DB_HOST, $this->DB_USER, $this->DB_PASS, $this->DB_NAME);
		if (mysqli_connect_errno())
			return mysqli_connect_errno();
		else return $this->connection= $mysqli;
	}
	
	function disconnect()
	{
		mysqli_close($this->connection);
	}
	
	function getConnection() {return $this->connection;}
}

?>