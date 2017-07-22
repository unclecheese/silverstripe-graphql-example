<?php

use SilverStripe\ORM\DataObject;

class Item extends DataObject
{
    private static $db = [
        'Title' => 'Varchar',
    ];

    public function requireDefaultRecords()
    {
        parent::requireDefaultRecords();
        $count = self::get()->count();
        while($count < 100) {
            $record = new Item(['Title' => "Item #{$count}"]);
            $record->write();
            $count++;
        }
    }
}