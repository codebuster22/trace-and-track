// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract ProductManagement is Ownable{
    
    using Strings for *;
    
    enum Product_Type{CAR,WHEEL,ENGINE,CHASIS,GEARS}
    enum Grade{A,B,C,D}
    
    struct Product{
        string serial;
        address brand;
        address manufacturer;
        Product_Type product_type;
        uint manufacture_date; 
        uint location;
        Grade grade;
        uint price;
        mapping(uint=>bytes32) parts;
        uint part_counter;
        mapping(uint=>address) owners;
        uint owner_counter;
        }
        
    address transitManager;
        
    mapping(bytes32=>Product) public products;
    mapping(bytes32=>address) public product_owners;
    
    mapping(Product_Type=>uint) public product_to_stock;
    mapping(Product_Type=>mapping(bytes32=>bool)) public product_to_product_id_to_is_used;
    mapping(Product_Type=>uint[]) public product_already_used;
    
    mapping(uint=>bytes32) public id_to_hash;
    mapping(bytes32=>uint) public hash_to_id;
    uint public hash_counter;
    
    event ProductCreated(bytes32 uuid, uint _location, uint _price, string _serial, address _brand, uint _grade, uint _product_type, uint total_parts);
    event ProductOwnershipTransfered(address prev_owner, address new_owner);
    
    // Functional Declarations
    
    function createProduct(
            uint _location,
            uint _price ,
            uint[] memory _parts,
            string memory _serial,
            address _brand,
            uint8 _grade,
            uint8 _product_type
            ) public {
        bytes32 uuid = hash(_serial, _brand, _product_type.toString());
        
        require(products[uuid].manufacturer == address(0),"Product Already Exists");
        
        uint i;
        if(_parts.length!=0){
            for(i; i<_parts.length;i++){
                bytes32 h = id_to_hash[_parts[i]];
                require(products[h].manufacturer != address(0), "Part do not exist");
                require(!product_to_product_id_to_is_used[products[h].product_type][h], "Parts already in use");
                product_to_product_id_to_is_used[ products[h].product_type ][ h ] = true;
                product_already_used[products[ h ].product_type].push( hash_to_id[h] );
                product_to_stock[ products[ h ].product_type ] -= 1;
                products[uuid].parts[ i ] = h;
                product_owners[ h ] = _brand;
            }
        }
        
        products[uuid].serial = _serial;
        products[uuid].brand = _brand;
        products[uuid].manufacturer = msg.sender;
        products[uuid].manufacture_date = block.timestamp;
        products[uuid].product_type = Product_Type(_product_type);
        products[uuid].location = _location;
        products[uuid].grade = Grade(_grade);
        products[uuid].price = _price;
        products[uuid].owners[1] = _brand;
        products[uuid].owner_counter = 1;
        products[uuid].part_counter = i;
        
        
        hash_counter++;
        id_to_hash[hash_counter] = uuid;
        hash_to_id[uuid] = hash_counter;
        product_to_stock[Product_Type(_product_type)] += 1;
        product_to_product_id_to_is_used[Product_Type(_product_type)][uuid] = false;
        
        product_owners[uuid] = _brand;
        
        emit ProductCreated(uuid, _location, _price, _serial, _brand, _grade, _product_type, _parts.length);
    }
    
    function transferOwnership(address _new_owner,string memory _serial,address _brand, uint8 _product_type) public {
        bytes32 uuid = hash(_serial, _brand, _product_type.toString());
        require(product_owners[uuid] == msg.sender, "You are not the Owner");
        require(product_owners[uuid] != _new_owner, "New owner is already current owner");
        product_owners[uuid] = _new_owner;
        products[ uuid ].owners[ products[uuid].owner_counter++ ] = _new_owner;
        for(uint i=0; i < products[uuid].part_counter; i++ ){
            _transferOwnershipByHash(_new_owner, msg.sender, products[uuid].parts[i]);
        }
        emit ProductOwnershipTransfered( products[uuid].owners[products[uuid].owner_counter-1] , _new_owner );
    }
    
    function _transferOwnershipByHash(address _new_owner, address _owner, bytes32 _uuid) private {
        require(product_owners[_uuid] == _owner, "You are not the Owner of the part");
        require(product_owners[_uuid] != _new_owner, "New owner is already current owner");
        product_owners[_uuid] = _new_owner;
        products[ _uuid ].owners[ products[_uuid].owner_counter++ ] = _new_owner;
        emit ProductOwnershipTransfered( products[_uuid].owners[products[_uuid].owner_counter-1] , _new_owner );
    }
    
    function setTransitManager(address _transit_manager) public onlyOwner{
        transitManager=_transit_manager;
    }
    
    function getProductLocation(uint _id) public view returns(uint location_){
        return products[id_to_hash[_id]].location;
    }
    
    function setProductLocation(bytes32 _hash, uint _newLocation) public {
        require(msg.sender==transitManager,"Only Transit Manager can change the location of a product");
        products[_hash].location=_newLocation;
    }
    
    function getProductHash(uint _id) public view returns(bytes32 hash_){
        require(products[id_to_hash[_id]].brand!=address(0), "Product Does not exists");
        return id_to_hash[_id];
    }
    
    function getPartsHash(bytes32 _uuid, uint _part_id) public view returns(bytes32 part_uuid_){
        return products[_uuid].parts[_part_id];
    }
    
    function getTotalPartsCount(bytes32 _uuid) public view returns(uint total_parts_){
        return products[_uuid].part_counter;
    }
    
    function getProductOwnerAtIndex(bytes32 _uuid, uint _owner_id) public view returns(address owner_){
        return products[_uuid].owners[_owner_id];
    }
    
    function getTotalOwnerCount(bytes32 _uuid) public view returns(uint total_owners_){
        return products[_uuid].owner_counter;
    }
    
    function getProductHash(string memory _serial,address _brand, uint8 _product_type) public pure returns(bytes32 hash_){
        return hash( _serial, _brand, _product_type.toString());
    }
    
    function hash(string memory s1, address s2, string memory s3) private pure returns (bytes32){
        //First, get all values as bytes
        bytes memory b_s1 = bytes(s1);
        bytes20 b_s2 = bytes20(s2);
        bytes memory b_s3 = bytes(s3);

        //Then calculate and reserve a space for the full string
        string memory s_full = new string(b_s1.length + b_s2.length + b_s3.length);
        bytes memory b_full = bytes(s_full);
        uint j = 0;
        uint i;
        for(i = 0; i < b_s1.length; i++){
            b_full[j++] = b_s1[i];
        }
        for(i = 0; i < b_s2.length; i++){
            b_full[j++] = b_s2[i];
        }
        for(i = 0; i < b_s3.length; i++){
            b_full[j++] = b_s3[i];
        }

        //Hash the result and return
        return keccak256(b_full);
    }
    
}