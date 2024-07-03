"use client";

import useApiService from "@/service/useApiService";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/router";
import { useState, useEffect, FormEvent, useRef } from "react";
import { FaFilter } from "react-icons/fa";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  maxWidth: "80%",
  bgcolor: "background.paper",
  boxShadow: 4,
  p: 3,
};
interface Team {
  data: [
    {
      id: number;
      attributes: {
        name: string;
      };
    }
  ];
}

export default function Filter() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const { date, team } = router.query;
  const handleFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          date: (
            event.currentTarget.elements.namedItem("date") as HTMLInputElement
          ).value,
          team: (
            event.currentTarget.elements.namedItem("team") as HTMLInputElement
          ).value,
        },
      },
      undefined,
      { shallow: true }
    );
    handleClose();
  };
  const textInput = useRef<HTMLInputElement>(null);
  const selectInput = useRef<HTMLSelectElement>(null);
  const clearFilter = () => {
    if (textInput.current) {
      textInput.current.value = "";
    }
    if (selectInput.current) {
      selectInput.current.value = "";
    }
  };
  const { data, loading, error } = useApiService<Team>("teams");

  return (
    <div>
      <Button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-small rounded-lg text-sm px-1 py-1.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={handleOpen}
      >
        <FaFilter />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="max-w-full"
      >
        <Box sx={style}>
          <div>
            <h1 className="font-bold dark:text-white">Filter</h1>{" "}
            <hr className="mb-5" />
            <form onSubmit={handleFilter}>
              <label className="text-sm font-medium">By Date:</label>
              <input
                ref={textInput}
                type="date"
                name="date"
                defaultValue={date as string | undefined}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <label className="text-sm font-medium mt-3 block">By Team:</label>
              <select
                ref={selectInput}
                name="team"
                defaultValue={team}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">All</option>
                {data?.data.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.attributes.name}
                  </option>
                ))}
              </select>

              <br />
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Filter
              </button>
              <div
                onClick={clearFilter}
                className="inline-block cursor-pointer py-1 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Clear
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
