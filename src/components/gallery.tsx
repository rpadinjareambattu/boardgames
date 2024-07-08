"use client";
import { Box, CircularProgress, IconButton, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import useApiService from "@/service/useApiService";
import { useRouter } from "next/router";
import Head from "next/head";
import { TournamentData } from "@/types/tournament";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

interface BannerProps {
  name: string;
}
const Gallery: React.FC<BannerProps> = ({ name }) => {
  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("image-enter");

  const images: string[] = [
    "https://via.placeholder.com/600", // Replace with your image URLs
    "https://via.placeholder.com/600",
    "https://via.placeholder.com/600",
  ];

  const handleOpen = (index: number) => {
    setSelectedImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleNext = () => {
    setAnimationClass("image-exit");
    setTimeout(() => {
      setSelectedImageIndex(
        (prevIndex) =>
          (prevIndex + 1) % (tournamentData?.data.gallery?.length || 0)
      );
      setAnimationClass("image-enter");
    }, 300);
  };

  const handlePrev = () => {
    setAnimationClass("image-exit");
    setTimeout(() => {
      setSelectedImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + (tournamentData?.data.gallery.length || 0)) %
          (tournamentData?.data.gallery.length || 0)
      );
      setAnimationClass("image-enter");
    }, 300);
  };

  useEffect(() => {
    if (open) {
      setAnimationClass("image-enter-active");
    }
  }, [open]);
  const router = useRouter();
  const { game, tournament, tab } = router.query;
  const {
    data: tournamentData,
    loading,
    error,
  } = useApiService<TournamentData>(
    `tournaments/${tournament}?populate=gallery`,
    !!tournament
  );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Head>
        <title>Gallery | {name} </title>
      </Head>
      <main className="flex min-h-screen flex-col items-center max-md:text-sm">
        <div className="container flex flex-wrap max-w-6xl px-6 pb-14">
          {loading ? (
            <div className="mt-20 w-full justify-center items-center flex">
              <CircularProgress color="secondary" />
            </div>
          ) : tournamentData?.data.gallery?.length ? (
            <div className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {tournamentData?.data.gallery.map((item, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    onClick={() => handleOpen(index)}
                    src={process.env.NEXT_PUBLIC_UPLOADS + item.url}
                    alt={`Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
          ) : (
            "No media found"
          )}
        </div>
      </main>
      <ImageGalleryModal
        open={open}
        handleClose={handleClose}
        imageSrc={tournamentData?.data?.gallery[selectedImageIndex]?.url || ""}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
    </>
  );
};

export default Gallery;

interface ImageGalleryModalProps {
  open: boolean;
  handleClose: () => void;
  imageSrc: string;
  handleNext: () => void;
  handlePrev: () => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  open,
  handleClose,
  imageSrc,
  handleNext,
  handlePrev,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [imageSrc]);

  const handleImageLoad = () => {
    setLoading(false);
  };
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="image-gallery-modal"
      aria-describedby="image-gallery-description"
    >
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className="absolute z-10 w-full top-1/2"
        >
          <IconButton onClick={handlePrev}>
            <FaAngleLeft color="#fff" />
          </IconButton>
          <IconButton onClick={handleNext}>
            <FaAngleRight color="#fff" />
          </IconButton>
        </Box>
        <IconButton
          onClick={handleClose}
          className="absolute right-5 top-5 z-20"
        >
          <IoMdCloseCircle color="#fff" className="text-4xl" />
        </IconButton>
        {loading && <CircularProgress />}
        <Image
          src={process.env.NEXT_PUBLIC_UPLOADS + imageSrc}
          alt={`Image gallery`}
          layout="fill"
          objectFit="contain"
          className="rounded-lg shadow-md"
          onLoad={handleImageLoad}
        />
      </>
    </Modal>
  );
};
