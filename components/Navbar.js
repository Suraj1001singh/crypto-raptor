import React from "react";
import { BsSearch } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import { Input, Stack, InputGroup, InputLeftElement } from "@chakra-ui/react";


const style = {
  container: "flex flex-row w-full h-full",
  searchIcon: "text-gray-800 text-2xl mr-2 ",
  searchBar: "basis-2/3 h-full mr-3 bg-white rounded-lg",
  balance: " flex items-center text-gray-800 text-1xl font-bold text-center bg-white rounded h-full px-2 py-2",
  ethereumIcon: "text-[20px] ",
};

const Navbar = () => {
  return (
    <div className={style.container}>
      <Stack className={style.searchBar}>
        <InputGroup>
          <InputLeftElement children={<BsSearch className={style.searchIcon} />} />
          <Input placeholder="Search here..." />
        </InputGroup>
      </Stack>
      <div className={style.balance}>
        <FaEthereum className={style.ethereumIcon} /> 1.67 &nbsp;<span> ETH</span>
      </div>
    </div>
  );
};

export default Navbar;
