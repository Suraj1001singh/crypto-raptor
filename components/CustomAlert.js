import React from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";


const CustomAlert = ({ status, title, description }) => {
  return (
    <Alert status={status}>
      <AlertIcon />
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};

export default CustomAlert;
