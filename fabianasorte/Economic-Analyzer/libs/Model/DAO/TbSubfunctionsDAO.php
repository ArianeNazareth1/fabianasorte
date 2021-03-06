<?php
/** @package DbEca::Model::DAO */

/** import supporting libraries */
require_once("verysimple/Phreeze/Phreezable.php");
require_once("TbSubfunctionsMap.php");

/**
 * TbSubfunctionsDAO provides object-oriented access to the tb_subfunctions table.  This
 * class is automatically generated by ClassBuilder.
 *
 * WARNING: THIS IS AN AUTO-GENERATED FILE
 *
 * This file should generally not be edited by hand except in special circumstances.
 * Add any custom business logic to the Model class which is extended from this DAO class.
 * Leaving this file alone will allow easy re-generation of all DAOs in the event of schema changes
 *
 * @package DbEca::Model::DAO
 * @author ClassBuilder
 * @version 1.0
 */
class TbSubfunctionsDAO extends Phreezable
{
	/** @var int */
	public $IdSubfunction;

	/** @var string */
	public $StrCodSubfunction;

	/** @var string */
	public $StrNameSubfunction;


	/**
	 * Returns a dataset of TbPayments objects with matching TbSubfunctionsIdSubfunction
	 * @param Criteria
	 * @return DataSet
	 */
	public function GetSubfunctionTbPaymentss($criteria = null)
	{
		return $this->_phreezer->GetOneToMany($this, "fk_tb_payments_tb_subfunctions1", $criteria);
	}


}
?>