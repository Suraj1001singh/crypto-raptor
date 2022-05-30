import React, { useState, useContext } from "react";
import Image from "next/image";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { AppContext } from "../context/AppContext";
import { IoMdCloudUpload } from "react-icons/io";
import ConnectToWallet from "./ConnectToWallet";
import { FormControl, FormLabel, FormHelperText, Input, Button, useToast, Textarea, InputLeftAddon, InputGroup } from "@chakra-ui/react";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const style = {
  container: "flex flex-col w-full h-full mt-3 bg-white rounded-lg",
  containerHeading: "font-bold text-[20px] text-gray-800 p-3",
  form: "flex flex-row flex-wrap w-full h-[600px] p-4 items-center justify-center",
  card: `h-[200px] w-[190px] rounded-3xl flex cursor-pointer transition-all duration-300  hover:scale-105 hover:shadow-xl overflow-hidden  shadow-xl border-4 `,
};

const CreateNft = () => {
  const { mintNft, currentAccount } = useContext(AppContext);
  const toast = useToast();
  const [files, setFiles] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const uploadToIpfs = async () => {
    const file = files[0];
    if (typeof file != "undefined") {
      try {
        setIsLoading(true);
        const result = await client.add(file);
        setImage("https://ipfs.infura.io/ipfs/" + result.path);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid file type",
        status: "error",
        isClosable: true,
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image | !price || !name || !description) {
      toast({
        title: "Invalid data",
        description: "Please fill all the fields",
        status: "error",
        isClosable: true,
      });
      return;
    }
    try {
      const result = await client.add(JSON.stringify({ image, price, name, description }));
      mintNft(result, price);
    } catch (err) {
      console.log(err);
    }
  };

  if (!currentAccount) return <ConnectToWallet title={"Please connect your wallet !"} />;
  else
    return (
      <div className={style.container}>
        <h1 className={style.containerHeading}>Create NFT</h1>
        <form className={style.form} onSubmit={onSubmit}>
          {!image ? (
            <FormControl>
              <FormLabel htmlFor="file">NFT file</FormLabel>
              <Input id="file" type="file" onChange={(e) => setFiles(e.target.files)} />
              <Button isLoading={isLoading} marginTop={"1rem"} leftIcon={<IoMdCloudUpload className={"mt-1"} />} onClick={uploadToIpfs} colorScheme={"blue"}>
                Upload to IPFS
              </Button>
              <FormHelperText>Upload your NFT file.</FormHelperText>
            </FormControl>
          ) : (
            <div className={style.card}>
              <Image src={image} className="object-cover object-center" width={190} height={250}></Image>
            </div>
          )}
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input id="name" type="text" placeholder="Name of NFT" value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea id="description" type="text" placeholder="Write about your NFT" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="price">Price</FormLabel>
            <InputGroup>
              {/* <InputLeftAddon children={"ETH"} /> */}
              <Input id="price" type="number" placeholder="Price at you want to sell." value={price} onChange={(e) => setPrice(e.target.value)} />
            </InputGroup>
          </FormControl>
          <Button type="submit" colorScheme={"green"}>
            Create and List NFT
          </Button>
        </form>
      </div>
    );
};

export default CreateNft;
