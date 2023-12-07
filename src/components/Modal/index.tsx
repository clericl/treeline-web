import { ModalType, useModal } from "@/zustand";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

function LoadingDataModal() {
  return <CircularProgress sx={{ color: "white" }} />;
}

function GeocontrolModal() {
  return (
    <>
      <CircularProgress sx={{ color: "white" }} />
      <span className="text-white text-xl">Waiting for location</span>
    </>
  );
}

function OutOfRangeModal() {
  const setOutOfRange = useModal.use.setOutOfRange();
  const theme = useTheme();

  return (
    <>
      <Typography variant="h4">
        <span className="text-white">Wait, you&apos;re not in NYC!</span>
      </Typography>
      <Typography variant="body1">
        <span className="text-white">
          This map doesn&apos;t cover your present location.
        </span>
      </Typography>
      <Box>
        <Button
          className="continue"
          onClick={() => setOutOfRange(false)}
          sx={{
            "&.continue": {
              backgroundColor: blueGrey[700],
              color: theme.palette.getContrastText(blueGrey[700]),
              my: "1rem",
              "&:hover": {
                backgroundColor: blueGrey[800],
              },
            },
          }}
          variant="contained"
        >
          Continue in NYC
        </Button>
      </Box>
    </>
  );
}

function Modal() {
  const [open, setOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<ModalType | null>(null);
  const geocontrol = useModal.use.geocontrol();
  const outOfRange = useModal.use.outOfRange();
  const loadingData = useModal.use.loadingData();

  const modalContent = useMemo(() => {
    switch (currentModal) {
      case "geocontrol":
        return <GeocontrolModal />;
      case "outOfRange":
        return <OutOfRangeModal />;
      case "loadingData":
        return <LoadingDataModal />;
      default:
        return null;
    }
  }, [currentModal]);

  useEffect(() => {
    setOpen(!!currentModal);
  }, [currentModal]);

  useEffect(() => {
    setTimeout(
      () => {
        if (geocontrol) {
          setCurrentModal("geocontrol");
        } else if (outOfRange) {
          setCurrentModal("outOfRange");
        } else if (loadingData) {
          setCurrentModal("loadingData");
        } else {
          setCurrentModal(null);
        }
      },
      !currentModal ? 0 : 700,
    );
  }, [currentModal, geocontrol, outOfRange, loadingData]);

  return (
    <div
      className={classNames(
        "absolute top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center transition-opacity duration-700 ease-in-out font-mui z-50",
        {
          "opacity-1": !!currentModal,
          "opacity-0": !currentModal,
          "pointer-events-none": !currentModal,
        },
      )}
    >
      <div
        className={classNames(
          "flex flex-col items-center space-y-2 transition-opacity duration-700 ease-in-out",
          {
            "opacity-1": open,
            "opacity-0": !open,
          },
        )}
      >
        {modalContent}
      </div>
    </div>
  );
}

export default Modal;
