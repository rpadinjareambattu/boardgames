import { DialogContent, DialogTitle, Typography, Dialog } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface Props {}

export interface CustomModalHandles {
  openModal: (title: string, description: string) => void;
  closeModal: () => void;
}

// eslint-disable-next-line react/display-name
const CustomModal = forwardRef<CustomModalHandles, Props>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const openModal = (newTitle: string, newDescription: string) => {
    setTitle(newTitle);
    setDescription(newDescription);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  return (
    <BootstrapDialog
      onClose={closeModal}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={closeModal}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers className="min-w-96">
        <Typography gutterBottom>
          {description?.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
          {!description && "No information found"}
        </Typography>
      </DialogContent>
    </BootstrapDialog>
  );
});

export default CustomModal;
