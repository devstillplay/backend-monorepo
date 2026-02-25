"use client";

import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import BlockIcon from "@mui/icons-material/Block";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Button, IconButton, Stack } from "@mui/material";

type RowActionsProps = {
  isVisible: boolean;
  suspended?: boolean;
  onChatClick?: () => void;
  onEditClick?: () => void;
  onLoansClick?: () => void;
  onDeleteClick?: () => void;
  onSuspendClick?: () => void;
};

export default function RowActions({
  isVisible,
  suspended,
  onChatClick,
  onEditClick,
  onLoansClick,
  onDeleteClick,
  onSuspendClick,
}: RowActionsProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
      sx={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.2s ease",
      }}
    >
      <IconButton size="small" onClick={onChatClick} aria-label="Open chat">
        <ChatBubbleOutlineIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onLoansClick} aria-label="View loans & wallet">
        <AccountBalanceOutlinedIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onEditClick} aria-label="Edit user">
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
      {onSuspendClick && (
        <Button
          size="small"
          variant="outlined"
          color={suspended ? "success" : "warning"}
          startIcon={suspended ? <LockOpenIcon /> : <BlockIcon />}
          onClick={onSuspendClick}
          sx={{ minWidth: 0, px: 1 }}
        >
          {suspended ? "Unsuspend" : "Suspend"}
        </Button>
      )}
      <IconButton size="small" onClick={onDeleteClick} aria-label="Delete user">
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
